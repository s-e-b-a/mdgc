# Implementation Plan: Videogame Rating

Cada task es pequeña y verificable. Al terminar cada una se construye la imagen Docker de la capa afectada (`docker-compose build backend` o `docker-compose build frontend`), que compila con Maven dentro del contenedor multi-stage. No se avanza a la siguiente task hasta que ese build pase.

Orden general: esquema de BD → modelos (backend+frontend) → contrato SOAP (backend+frontend) → implementación backend → UI Swing. Así cada capa compila sobre la anterior ya estable.

- [ ] 1. Actualizar el esquema y los seeds en `db/init.sql`
  - Agregar `DROP TABLE IF EXISTS videogame_ratings;` en el bloque de limpieza idempotente (antes de `videogames`).
  - En la tabla `videogames`: agregar `genre VARCHAR(100) NULL` y eliminar la columna `play_state`.
  - Crear la tabla `videogame_ratings` según el diseño (PK, `UNIQUE(videogame_id)`, FK `ON DELETE CASCADE`, `CHECK` de rango en `rating` y `progress_percent`, índices).
  - Actualizar los `INSERT` de `videogames`: quitar `play_state`, agregar valores de `genre`.
  - Agregar seeds de ejemplo en `videogame_ratings`.
  - _Verificación:_ revisar coherencia del SQL (no rompe FKs, orden de drops correcto). No compila; se valida al construir el backend en tasks posteriores.
  - _Requisitos:_ 4.2, 5.2, 1.1, 2.1, 8.4

- [ ] 2. Crear el modelo `VideoGameRating` en el backend
  - Nuevo archivo `backend/src/main/java/cl/inventory/model/VideoGameRating.java`.
  - Campos: `id`, `videoGameId`, `Integer rating`, `comment`, `completed`, `progressPercent`, `timesCompleted`, `lastPlayed`, más `gameTitle` y `platformName` (solo lectura para CSV/dashboard).
  - Anotar con `@XmlRootElement` + `@XmlAccessorType(XmlAccessType.FIELD)`, `implements Serializable`, getters/setters al estilo de `Console`.
  - _Verificación:_ `docker-compose build backend`.
  - _Requisitos:_ 1.1, 2.1, 3.1

- [ ] 3. Modificar el modelo `VideoGame` en el backend
  - En `backend/src/main/java/cl/inventory/model/VideoGame.java`: agregar `String genre` (getter/setter) y eliminar `String playState` (getter/setter).
  - _Verificación:_ `docker-compose build backend` (la impl aún referencia `playState`/`genre`; si no compila, se ajusta la impl en la task 6; para aislar, esta task puede combinarse con la 6 si el build lo exige — ver nota abajo).
  - _Requisitos:_ 4.1, 5.1

- [ ] 4. Sincronizar los modelos en el frontend
  - Crear `frontend/src/main/java/cl/inventory/model/VideoGameRating.java` idéntico al del backend.
  - Modificar `frontend/src/main/java/cl/inventory/model/VideoGame.java`: agregar `genre`, quitar `playState`.
  - _Verificación:_ `docker-compose build frontend` (puede fallar hasta ajustar UI en tasks 8–11; combinar con esas si el build lo exige — ver nota).
  - _Requisitos:_ 4.1, 5.1, 8.2

- [ ] 5. Agregar las operaciones al contrato SOAP `InventoryService` (backend y frontend)
  - En `backend/.../service/InventoryService.java` y `frontend/.../service/InventoryService.java` (ambas copias, idénticas):
    - `@WebMethod VideoGameRating getRatingForGame(int videoGameId);`
    - `@WebMethod List<VideoGameRating> getAllRatings();`
    - `@WebMethod void saveRating(VideoGameRating rating);`
  - _Verificación:_ el backend requiere implementar la interfaz (task 6) para compilar; construir backend tras la task 6. El frontend puede construirse antes: `docker-compose build frontend`.
  - _Requisitos:_ 3.1, 3.2, 3.3

- [ ] 6. Implementar los métodos y ajustar los existentes en `InventoryServiceImpl`
  - Implementar `getRatingForGame`, `getAllRatings` (con JOIN a `videogames`/`platforms` para poblar `gameTitle`/`platformName`) y `saveRating` (upsert por `videogame_id`: SELECT + INSERT/UPDATE con `PreparedStatement`).
  - Ajustar `getAllVideoGames`, `addVideoGame`, `updateVideoGame`: incluir `genre`, dejar de leer/escribir `play_state`.
  - Confirmar que `deleteVideoGame` no deja huérfanos (la FK `ON DELETE CASCADE` borra el rating).
  - Mantener el estilo `try-with-resources` + `PreparedStatement`, valores ausentes como SQL NULL.
  - _Verificación:_ `docker-compose build backend`.
  - _Requisitos:_ 3.2, 3.3, 3.4, 3.5, 4.4, 5.3

- [ ] 7. Añadir las métricas del dashboard en `getStatisticsReport`
  - Quitar el bloque "Games by Play State".
  - Agregar top de juegos terminados por `times_completed` (LIMIT 5) y género más jugado, con `PreparedStatement`.
  - Manejar estado vacío (sin ratings/sin géneros) sin fallar.
  - _Verificación:_ `docker-compose build backend`.
  - _Requisitos:_ 5.5, 7.1, 7.2, 7.3, 7.4

- [ ] 8. Actualizar `GameFormDialog` (frontend): genre en vez de play state
  - Quitar el control de `play_state`; agregar campo de texto `genre`.
  - Ajustar `getResultGame()` para setear `genre` y no `playState`.
  - _Verificación:_ `docker-compose build frontend`.
  - _Requisitos:_ 4.3, 5.4

- [ ] 9. Actualizar la tabla de juegos y el dashboard en `MainFrame`
  - Columnas de la tabla de juegos: quitar "State", agregar "Genre" y "Rating" (cruzando `getAllVideoGames()` con `getAllRatings()` en `loadData()`; vacío si no hay rating).
  - Asegurar que el dashboard muestra el nuevo `getStatisticsReport`.
  - _Verificación:_ `docker-compose build frontend`.
  - _Requisitos:_ 5.4, 7.1, 7.2

- [ ] 10. Crear `RatingFormDialog` y la acción "Edit Rating / Progress"
  - Nuevo `frontend/.../ui/RatingFormDialog.java` con: checkbox `completed`, spinner `progressPercent` (0..100, deshabilitado si completed), selector `rating` (1..5 + "sin valoración"), `JTextArea` `comment`, campo `lastPlayed` (yyyy-MM-dd), spinner `timesCompleted` (≥0). Validación de rangos en cliente. Patrón `isApproved()` + `getResultRating()`.
  - En `MainFrame`, agregar la acción en el `JXTaskPane` de Video Games: toma el juego seleccionado, obtiene su rating, abre el diálogo y al aprobar llama `saveRating(...)` y refresca.
  - _Verificación:_ `docker-compose build frontend`.
  - _Requisitos:_ 1.1, 1.2, 1.3, 1.4, 1.5, 1.6, 2.1, 2.2, 2.3, 2.4, 3.1

- [ ] 11. Agregar la exportación a CSV en `MainFrame`
  - Acción "Export Ratings CSV" en el `JXTaskPane`: `JFileChooser` para el destino; armar el CSV desde `getAllRatings()` con encabezado (juego, plataforma, rating, completed, % avance, veces terminado, última vez jugado, comentario).
  - Helper de escape CSV (comillas/comas/saltos de línea); celdas vacías para nulos; escritura con `try-with-resources`; feedback con `JOptionPane`.
  - _Verificación:_ `docker-compose build frontend`.
  - _Requisitos:_ 6.1, 6.2, 6.3, 6.4, 6.5

- [ ] 12. Verificación final de integración
  - `docker-compose build backend` y `docker-compose build frontend` en limpio.
  - Repaso de sincronía: `VideoGame` y `VideoGameRating` idénticos en backend/frontend; contrato SOAP idéntico en ambas copias.
  - Confirmar que operaciones existentes (CRUD de plataformas/consolas/accesorios, borrado de juegos, valor total) siguen intactas.
  - _Requisitos:_ 8.1, 8.2, 8.3, 8.4

---

## Nota sobre orden de compilación

Las tasks 3, 4 y 5 modifican modelos/contratos que la implementación (task 6) y la UI (tasks 8–11) todavía no han actualizado, por lo que un `build` intermedio de esa capa podría fallar por referencias a `playState` o por métodos de interfaz sin implementar. Estrategia:
- **Backend**: tratar las tasks 3, 5 y 6 como un grupo cuyo punto de verificación (build verde) es al final de la task 6. La task 2 sí compila aislada.
- **Frontend**: la task 4 (modelos) puede dejar la UI referenciando `playState`; su build verde real se alcanza tras las tasks 8–10. Se puede construir el frontend al cerrar la task 5 (contrato) solo si la UI aún no rompe; si rompe, el primer build verde del frontend es tras la task 8.

Esto respeta "verificable con `docker-compose build`" a nivel de cada capa completada, aceptando que el punto de build verde de una capa es la última task que la deja consistente.
