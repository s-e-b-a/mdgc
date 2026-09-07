# Requirements: Videogame Rating

## Introducción

La funcionalidad "Videogame-rating" añade seguimiento de progreso y valoración a cada videojuego de la colección. Introduce una nueva entidad de rating asociada 1:1 a un `VideoGame`, agrega un campo `genre` a la ficha del videojuego, elimina el campo `play_state` (el progreso ahora lo maneja el rating), permite exportar el listado de ratings a CSV y añade métricas al dashboard (top de juegos terminados y género más jugado).

El cambio atraviesa todas las capas de la app de tres niveles existente (MySQL en `db/init.sql`, persistencia JDBC en `InventoryServiceImpl`, contrato SOAP JAX-WS en `InventoryService`, modelos de dominio duplicados backend/frontend y la UI Swing/SwingX). Debe respetar las convenciones de `.kiro/steering/conventions.md`: Java 21, JDBC directo (sin ORM ni Spring), SOAP con JAX-WS, SQL a mano con `PreparedStatement`, y modelos sincronizados entre backend y frontend.

## Requerimientos

### Requerimiento 1: Progreso por juego

**Historia de usuario:** Como coleccionista, quiero registrar el progreso de cada juego, para saber si lo terminé, cuánto llevo avanzado y cuándo lo jugué por última vez.

#### Criterios de aceptación
1. THE sistema SHALL asociar a cada videojuego un rating con los campos de progreso: `completed` (booleano), `progressPercent` (entero 0..100), `lastPlayed` (fecha) y `timesCompleted` (entero).
2. WHEN un juego está marcado como `completed = true` THEN el sistema SHALL ignorar/no requerir `progressPercent` (el avance parcial solo aplica cuando NO está terminado).
3. WHEN un juego NO está terminado (`completed = false`) THEN el sistema SHALL aceptar `progressPercent` solo en el rango 0 a 100 inclusive.
4. IF se suministra un `progressPercent` fuera de 0..100 THEN el sistema SHALL rechazar el valor y no persistirlo.
5. THE campo `timesCompleted` SHALL ser un entero mayor o igual a 0.
6. THE campo `lastPlayed` SHALL ser opcional (puede estar vacío si nunca se ha jugado).

### Requerimiento 2: Valoración y comentario

**Historia de usuario:** Como coleccionista, quiero puntuar cada juego de 1 a 5 y dejar un comentario, para recordar mi opinión.

#### Criterios de aceptación
1. THE rating SHALL incluir una valoración `rating` entera de 1 a 5 y un `comment` de texto libre.
2. IF se suministra un `rating` fuera de 1..5 THEN el sistema SHALL rechazar el valor y no persistirlo.
3. THE campo `comment` SHALL ser opcional (puede quedar vacío).
4. THE campo `rating` SHALL poder quedar sin asignar (sin valoración) cuando el juego aún no ha sido valorado.

### Requerimiento 3: Gestión del rating vía servicio

**Historia de usuario:** Como usuario del frontend, quiero crear, consultar y actualizar el rating de un juego, para mantener el progreso y la valoración al día.

#### Criterios de aceptación
1. THE contrato SOAP `InventoryService` SHALL exponer operaciones para obtener el rating de un juego, obtener todos los ratings, y guardar (crear o actualizar) el rating de un juego.
2. WHEN se guarda el rating de un juego que aún no tiene rating THEN el sistema SHALL crear el registro asociado a ese `videogame_id`.
3. WHEN se guarda el rating de un juego que ya tiene rating THEN el sistema SHALL actualizar el registro existente (relación 1:1 por juego).
4. WHEN se elimina un videojuego THEN el sistema SHALL eliminar también su rating asociado, sin dejar registros huérfanos.
5. THE implementación SHALL usar `PreparedStatement` parametrizado siguiendo el estilo de `InventoryServiceImpl`, tratando los valores ausentes como SQL NULL.

### Requerimiento 4: Campo de género en el videojuego

**Historia de usuario:** Como coleccionista, quiero clasificar cada juego por género, para analizar qué tipo de juego juego más.

#### Criterios de aceptación
1. THE modelo `VideoGame` SHALL incluir un campo `genre` (texto), sincronizado entre las copias de backend y frontend.
2. THE esquema `videogames` en `db/init.sql` SHALL incluir una columna `genre` nullable.
3. WHEN se agrega o edita un videojuego en la UI THEN el formulario SHALL permitir capturar el `genre`.
4. THE operaciones `getAllVideoGames`, `addVideoGame` y `updateVideoGame` SHALL transportar el `genre` de extremo a extremo.

### Requerimiento 5: Eliminar el campo play state

**Historia de usuario:** Como coleccionista, ya no quiero el antiguo "play state" en la ficha del juego, porque el progreso ahora lo maneja el rating.

#### Criterios de aceptación
1. THE modelo `VideoGame` SHALL eliminar el campo `playState` en las copias de backend y frontend.
2. THE esquema `videogames` en `db/init.sql` SHALL eliminar la columna `play_state` (migración del esquema y de los seeds).
3. THE implementación en `InventoryServiceImpl` SHALL dejar de leer/escribir `play_state` en todas las consultas.
4. THE UI Swing (tabla de juegos y `GameFormDialog`) SHALL dejar de mostrar/capturar el play state.
5. THE reporte de estadísticas (`getStatisticsReport`) SHALL dejar de agrupar por `play_state`, reemplazándolo por las nuevas métricas donde corresponda (ver Requerimiento 7).

### Requerimiento 6: Exportar ratings a CSV

**Historia de usuario:** Como coleccionista, quiero exportar el listado de ratings a un archivo CSV, para analizarlo fuera de la aplicación.

#### Criterios de aceptación
1. WHEN el usuario solicita exportar THEN el sistema SHALL generar un CSV con una fila por juego que contenga: juego (título), plataforma, rating, completed, % avance, veces terminado, última vez jugado y comentario.
2. THE CSV SHALL incluir una fila de encabezado con los nombres de las columnas.
3. WHEN un campo está vacío o el juego no tiene rating THEN el sistema SHALL exportar una celda vacía en lugar de un valor engañoso.
4. THE contenido de las celdas SHALL escaparse correctamente (comillas, comas y saltos de línea) para producir un CSV válido.
5. WHEN la exportación finaliza THEN el sistema SHALL guardar el archivo en la ubicación elegida por el usuario e informar el resultado.

### Requerimiento 7: Dashboard con nuevas métricas

**Historia de usuario:** Como coleccionista, quiero ver un top de juegos terminados y el género más jugado, para entender mis hábitos de juego.

#### Criterios de aceptación
1. THE dashboard SHALL mostrar un top de juegos terminados ordenado por `timesCompleted` (descendente).
2. THE dashboard SHALL mostrar el género (`genre`) más jugado de la colección.
3. WHEN no hay datos suficientes (sin ratings o sin géneros) THEN el dashboard SHALL mostrar un estado vacío claro en lugar de fallar.
4. THE cálculo de estas métricas SHALL hacerse con SQL a mano (`PreparedStatement`) en el backend, coherente con `getStatisticsReport`.

### Requerimiento 8: No romper lo existente

**Historia de usuario:** Como usuario actual, quiero que mi colección y las operaciones actuales sigan funcionando tras el cambio.

#### Criterios de aceptación
1. THE stack existente SHALL preservarse: Java 21, JDBC directo (sin ORM ni Spring), SOAP JAX-WS, Swing/SwingX en el frontend.
2. THE modelo `VideoGame` SHALL mantenerse sincronizado entre backend y frontend tras todos los cambios.
3. WHEN se ejecutan las operaciones actuales (CRUD de plataformas, consolas y accesorios, borrado de juegos, valor total) THEN SHALL seguir funcionando sin cambios de comportamiento.
4. THE nueva tabla de ratings SHALL relacionarse con `videogames` respetando el estilo de claves foráneas ya usado en `db/init.sql`, sin dejar registros huérfanos al borrar un juego.
