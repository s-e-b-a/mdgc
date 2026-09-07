# Design: Videogame Rating

## Resumen

Esta funcionalidad añade una entidad de rating 1:1 por videojuego (progreso + valoración), agrega el campo `genre` a `VideoGame`, elimina `play_state`, expone nuevas operaciones en el contrato SOAP, exporta ratings a CSV desde el frontend y añade dos métricas al dashboard. Se respeta el stack existente: Java 21, JDBC directo con `PreparedStatement`, SOAP JAX-WS, y Swing/SwingX, según `.kiro/steering/conventions.md`.

Decisiones de diseño ya acordadas en requisitos:
- Rating **1:1** por juego (no historial).
- CSV: **una fila por juego**, celdas vacías si no tiene rating.
- `genre`: **columna de texto** en `videogames` (sin tabla de géneros).

---

## 1. Archivos a tocar por capa (y por qué)

### Capa de modelo — Backend
- **`backend/src/main/java/cl/inventory/model/VideoGameRating.java`** *(NUEVO)*
  Nueva entidad de dominio para el rating. Anotada con `@XmlRootElement` + `@XmlAccessorType(FIELD)` e `implements Serializable`, igual que `Console`. Necesaria porque el progreso y la valoración se modelan como entidad propia asociada al juego.
- **`backend/src/main/java/cl/inventory/model/VideoGame.java`** *(MODIFICAR)*
  Agregar campo `genre` (String) con su getter/setter. Eliminar el campo `playState` y sus getter/setter (Requerimiento 5). Es el modelo que viaja por SOAP y se muestra en la tabla.

### Capa de modelo — Frontend (debe quedar en sync con backend)
- **`frontend/src/main/java/cl/inventory/model/VideoGameRating.java`** *(NUEVO)*
  Copia idéntica de la entidad del backend (el modelo está duplicado por convención). Sin ella, el proxy SOAP del cliente no puede deserializar el tipo.
- **`frontend/src/main/java/cl/inventory/model/VideoGame.java`** *(MODIFICAR)*
  Mismos cambios que en backend: agregar `genre`, quitar `playState`. Mantener la sincronía es obligatorio (convención del proyecto).

### Contrato SOAP
- **`backend/src/main/java/cl/inventory/service/InventoryService.java`** *(MODIFICAR)*
  Agregar los nuevos `@WebMethod` al contrato: `getRatingForGame(int videoGameId)`, `getAllRatings()`, `saveRating(VideoGameRating rating)`, y las dos métricas del dashboard `getTopCompletedReport()` / `getMostPlayedGenre()` (o integrarlas en `getStatisticsReport`, ver §4). Es la interfaz que define el WSDL.
- **`frontend/src/main/java/cl/inventory/service/InventoryService.java`** *(MODIFICAR)*
  Copia del contrato en el cliente (también duplicado). Debe declarar exactamente las mismas firmas para que `getPort(InventoryService.class)` funcione.

### Implementación del servicio
- **`backend/src/main/java/cl/inventory/service/InventoryServiceImpl.java`** *(MODIFICAR)*
  - Implementar los métodos nuevos con `PreparedStatement` a mano (mismo estilo `try-with-resources`).
  - Ajustar `getAllVideoGames`, `addVideoGame`, `updateVideoGame` para incluir `genre` y **dejar de usar** `play_state`.
  - En `deleteVideoGame`, borrar primero el rating asociado (o confiar en la FK `ON DELETE CASCADE`, ver §2) para no dejar huérfanos.
  - Ajustar `getStatisticsReport` para quitar el desglose por `play_state` y añadir top de terminados + género más jugado.

### Base de datos
- **`db/init.sql`** *(MODIFICAR)*
  - Agregar `DROP TABLE IF EXISTS videogame_ratings;` en el bloque de limpieza idempotente (antes que `videogames` por la FK).
  - Añadir columna `genre VARCHAR(100) NULL` a `videogames` y **eliminar** `play_state`.
  - Crear la tabla `videogame_ratings` (ver §2).
  - Actualizar los INSERT de `videogames` (quitar `play_state`, agregar `genre`).
  - Añadir seeds de ejemplo en `videogame_ratings`.

### UI Swing (Frontend)
- **`frontend/src/main/java/cl/inventory/ui/GameFormDialog.java`** *(MODIFICAR)*
  Quitar el control de `play_state`; agregar campo `genre`. (El progreso/valoración se maneja en un diálogo aparte, ver siguiente).
- **`frontend/src/main/java/cl/inventory/ui/RatingFormDialog.java`** *(NUEVO)*
  Diálogo para capturar/editar el rating de un juego seleccionado: `completed` (checkbox), `progressPercent` (spinner 0..100, deshabilitado si completed), `rating` (1..5), `comment` (área de texto), `lastPlayed` (texto de fecha), `timesCompleted` (spinner ≥0). Sigue el patrón de los `*FormDialog` existentes (`isApproved()` + getter del resultado).
- **`frontend/src/main/java/cl/inventory/ui/MainFrame.java`** *(MODIFICAR)*
  - Quitar la columna "State" (play state) de la tabla de juegos; agregar columna "Genre" y "Rating".
  - Agregar acción "Edit Rating / Progress" en el `JXTaskPane` de Video Games que abre `RatingFormDialog` y llama a `saveRating`.
  - Agregar acción "Export Ratings CSV" (elige archivo con `JFileChooser`, arma el CSV en el cliente a partir de `getAllRatings()` + juegos).
  - Actualizar el dashboard para reflejar el nuevo `getStatisticsReport` (o las nuevas operaciones).

> Nota: `frontend/dependency-reduced-pom.xml` NO se edita (artefacto generado por el shade plugin).

---

## 2. Diseño de la nueva tabla `videogame_ratings`

Relación 1:1 con `videogames`. La unicidad se garantiza con un `UNIQUE` sobre `videogame_id`. El borrado del juego elimina su rating vía `ON DELETE CASCADE` (evita huérfanos sin lógica extra en la app; distinto del `RESTRICT`/`SET NULL` usados en otras FKs, pero apropiado para una relación de composición 1:1).

```sql
CREATE TABLE videogame_ratings (
    id INT NOT NULL AUTO_INCREMENT,
    videogame_id INT NOT NULL,
    rating INT NULL,                       -- 1..5, NULL si aún no valorado
    comment TEXT NULL,
    completed BOOLEAN NOT NULL DEFAULT FALSE,
    progress_percent INT NOT NULL DEFAULT 0, -- 0..100, aplica solo si NOT completed
    times_completed INT NOT NULL DEFAULT 0,
    last_played DATE NULL,

    PRIMARY KEY (id),

    CONSTRAINT uq_videogame_ratings_game UNIQUE (videogame_id),

    CONSTRAINT fk_videogame_ratings_game
        FOREIGN KEY (videogame_id)
        REFERENCES videogames(id)
        ON UPDATE CASCADE
        ON DELETE CASCADE,

    CONSTRAINT chk_rating_range
        CHECK (rating IS NULL OR (rating BETWEEN 1 AND 5)),

    CONSTRAINT chk_progress_range
        CHECK (progress_percent BETWEEN 0 AND 100)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE INDEX idx_ratings_videogame_id ON videogame_ratings(videogame_id);
CREATE INDEX idx_ratings_completed ON videogame_ratings(completed);
```

Notas:
- `rating` es nullable (Req 2.4). Los `CHECK` refuerzan los rangos en BD; la validación primaria vive en el backend/UI (MySQL 8.0 sí aplica CHECK).
- `last_played` se modela como `DATE` para ser coherente con el manejo actual de `acquisition_date` (el backend usa `java.sql.Date` y expone la fecha como String en el modelo).
- `completed` como `BOOLEAN` (TINYINT(1) en MySQL). El backend lo lee con `rs.getBoolean(...)`.

### Cambios en `videogames`
- Agregar: `genre VARCHAR(100) NULL`.
- Eliminar: `play_state VARCHAR(100) NULL`.

---

## 3. Modelo de dominio

### `VideoGameRating` (backend y frontend, idénticos)
Campos + getters/setters, `@XmlRootElement`, `@XmlAccessorType(FIELD)`, `Serializable`:
- `int id`
- `int videoGameId`
- `Integer rating` — objeto para permitir null (sin valoración)
- `String comment`
- `boolean completed`
- `int progressPercent`
- `int timesCompleted`
- `String lastPlayed` — fecha como String (coherente con `VideoGame.acquisitionDate`)

Además, para la exportación CSV y el dashboard es útil transportar el título del juego y la plataforma. Opción elegida: campos de solo lectura `gameTitle` y `platformName` poblados por JOIN en `getAllRatings()` (mismo patrón que `VideoGame.platform` / `Console.platformName`). Así el CSV se arma en el cliente sin llamadas adicionales.

### `VideoGame` (backend y frontend, en sync)
- Agregar: `String genre` + getter/setter.
- Quitar: `String playState` + getter/setter.

---

## 4. Contrato SOAP e implementación

### Nuevas operaciones en `InventoryService`
```java
@WebMethod VideoGameRating getRatingForGame(int videoGameId);
@WebMethod List<VideoGameRating> getAllRatings();
@WebMethod void saveRating(VideoGameRating rating);
```

`saveRating` hace **upsert** por `videogame_id`: si existe rating para ese juego, `UPDATE`; si no, `INSERT`. Se resuelve consultando primero por `videogame_id` (que es UNIQUE) o con `INSERT ... ON DUPLICATE KEY UPDATE`. Para mantener el estilo explícito de `InventoryServiceImpl`, se hará SELECT + INSERT/UPDATE con `PreparedStatement`.

### Métricas del dashboard
Se integran en `getStatisticsReport()` (ya existe y devuelve texto para el `JTextArea` del dashboard), reemplazando el bloque "Games by Play State":
- **Top de juegos terminados** (por `times_completed`):
  ```sql
  SELECT v.title, r.times_completed
  FROM videogame_ratings r JOIN videogames v ON r.videogame_id = v.id
  WHERE r.times_completed > 0
  ORDER BY r.times_completed DESC
  LIMIT 5;
  ```
- **Género más jugado** (más frecuente entre juegos con rating; se puede ponderar por `times_completed`):
  ```sql
  SELECT v.genre, COUNT(*) AS c
  FROM videogames v
  WHERE v.genre IS NOT NULL AND v.genre <> ''
  GROUP BY v.genre
  ORDER BY c DESC
  LIMIT 1;
  ```
  (Alternativa ponderada por veces jugado se decide en implementación; el requisito pide "más jugado").

### Ajustes a operaciones existentes
- `getAllVideoGames`: SELECT incluye `genre`, ya no `play_state`; setear `vg.setGenre(...)`, quitar `setPlayState(...)`.
- `addVideoGame` / `updateVideoGame`: incluir `genre` en el INSERT/UPDATE; quitar `play_state`.
- `deleteVideoGame`: con `ON DELETE CASCADE` en la FK, basta el DELETE del juego; el rating se borra solo. (Se documenta esta dependencia del esquema.)

---

## 5. UI Swing (frontend)

### Tabla de juegos (`MainFrame`)
- Columnas nuevas: `{"ID", "Title", "Platform", "Genre", "Format", "Rating"}` — se elimina "State".
- El "Rating" mostrado se obtiene cruzando `getAllVideoGames()` con `getAllRatings()` en `loadData()` (map por `videoGameId`), mostrando vacío si no hay rating.

### `GameFormDialog`
- Quitar el control de play state.
- Agregar campo de texto `genre`.
- `getResultGame()` deja de setear `playState` y setea `genre`.

### `RatingFormDialog` (nuevo)
- Controles: checkbox `completed`; spinner `progressPercent` (0..100, se deshabilita cuando `completed` está marcado); combo/spinner `rating` (1..5, con opción "sin valoración"); `JTextArea` `comment`; campo `lastPlayed` (yyyy-MM-dd); spinner `timesCompleted` (≥0).
- Validación en cliente antes de aprobar (rangos), coherente con los requisitos 1 y 2.
- Patrón `isApproved()` + `getResultRating()` como los demás diálogos.

### Acciones nuevas en el `JXTaskPane` de Video Games
- **"Edit Rating / Progress"**: toma el juego seleccionado, llama `getRatingForGame(id)` (o usa el cacheado), abre `RatingFormDialog`, y al aprobar llama `saveRating(...)` y refresca.
- **"Export Ratings CSV"**: `JFileChooser` para elegir destino; arma el CSV desde `getAllRatings()` (que ya trae título y plataforma) usando un helper de escape CSV; escribe el archivo con `try-with-resources`; informa éxito/fallo con `JOptionPane`.

### Exportación CSV (cliente)
- Encabezado: `Juego,Plataforma,Rating,Completed,AvancePct,VecesTerminado,UltimaVezJugado,Comentario`.
- Escape: envolver en comillas y duplicar comillas internas cuando el valor contenga `,`, `"` o salto de línea. Celdas vacías para valores null/ausentes.
- Se hace en el frontend (Swing tiene acceso al sistema de archivos del usuario); el backend solo provee los datos vía `getAllRatings()`.

---

## 6. Estrategia de verificación

El build lo hacen los Dockerfiles multi-stage (Maven dentro del contenedor). Tras tocar cada capa:
- Cambios en backend (modelo, contrato, impl): `docker-compose build backend`.
- Cambios en frontend (modelo, contrato, UI): `docker-compose build frontend`.
- `db/init.sql` no se "compila", pero cualquier cambio de esquema debe quedar reflejado en el SQL del backend antes de dar por buena la task correspondiente.

No se agregan tests automáticos (no existen en el proyecto y el usuario no los pidió); la verificación es que la imagen Docker compile.

---

## 7. Riesgos y consideraciones

- **Sincronía de modelos**: `VideoGame` y `VideoGameRating` deben quedar idénticos en backend y frontend; una divergencia rompe la (de)serialización SOAP. Es el riesgo principal.
- **Namespace SOAP**: el frontend usa `targetNamespace="http://service.inventory.cl/"`. Las nuevas operaciones y el nuevo tipo deben respetar el mismo namespace/estilo para que el WSDL cuadre.
- **Migración de `play_state`**: como el esquema se recrea desde `db/init.sql` en cada init de la BD (entorno Docker con volumen nuevo), la "migración" es reescribir el script. No hay migración incremental sobre datos productivos en este proyecto.
- **CHECK constraints**: MySQL 8.0 los aplica; la validación de negocio igualmente se hace en backend/UI para dar mensajes claros.
- **`Integer rating` (nullable)** en el modelo: JAXB serializa `Integer` null como elemento ausente; se maneja como "sin valoración" en UI y CSV.
```
