# Convenciones del proyecto (mdgc)

Estas reglas reflejan las convenciones ya presentes en el código. Respétalas al implementar cambios y no introduzcas tecnologías nuevas sin que el usuario lo pida explícitamente.

## Stack y build
- Java 21 en ambos módulos (`backend` y `frontend`). Mantener `maven.compiler.source/target` (o `release`) en 21.
- Maven es la herramienta de build. No introducir Gradle ni otros sistemas.
- El backend se empaqueta como WAR (desplegado en Tomcat 10.1). El frontend se empaqueta como fat JAR ejecutable vía `maven-shade-plugin` (main class `cl.inventory.Main`).
- No agregar frameworks nuevos: nada de Spring, Spring Boot, Jakarta EE CDI, etc.
- No agregar ORM (nada de JPA, Hibernate, MyBatis). El acceso a datos es JDBC directo.

## Backend: servicio SOAP (JAX-WS)
- El backend expone su API como servicio SOAP con JAX-WS (`com.sun.xml.ws:jaxws-rt`), publicado como servlet en Tomcat (`WSServlet` + `WSServletContextListener`).
- El contrato es la interfaz `cl.inventory.service.InventoryService`, anotada con `@WebService`. La implementación es `InventoryServiceImpl`.
- El endpoint se mapea en `web.xml` y `sun-jaxws.xml` a `/ws/inventory`. Mantener namespace `http://service.inventory.cl/` en el lado cliente.
- Al agregar operaciones, anotarlas con `@WebMethod` en la interfaz y mantener firmas simples (tipos primitivos, `String`, y modelos del dominio).

## Modelos del dominio
- Los modelos van anotados con `@XmlRootElement` (JAXB) e implementan `Serializable`. Usar `@XmlAccessorType(XmlAccessType.FIELD)` cuando el modelo lo requiera (ver `Console`).
- **El modelo del dominio está duplicado entre backend y frontend.** Cualquier cambio a un modelo (nuevo campo, nueva entidad, cambio de firma) debe replicarse en:
  - `backend/src/main/java/cl/inventory/model/`
  - `frontend/src/main/java/cl/inventory/model/`
- La interfaz de servicio `InventoryService` también está duplicada (backend y frontend). Si cambias una firma, actualiza ambas copias para que el contrato SOAP siga cuadrando.
- No editar `frontend/dependency-reduced-pom.xml`: es un artefacto generado por el shade plugin.

## Acceso a datos
- SQL escrito a mano usando `PreparedStatement` con parámetros (`?`), nunca concatenación de strings. Preserva este patrón para evitar inyección SQL.
- Usar `try-with-resources` para `Connection`, `PreparedStatement` y `ResultSet`, siguiendo el estilo de `InventoryServiceImpl`.
- La conexión se obtiene en `getConnection()` leyendo `DB_URL` / `DB_USER` / `DB_PASS` de variables de entorno, con defaults apuntando a `jdbc:mysql://db:3306/inventory`. No introducir pool de conexiones salvo petición explícita.

## Base de datos
- El esquema y los datos de ejemplo viven en `db/init.sql` (MySQL 8.0, InnoDB, `utf8mb4`). Se ejecuta automáticamente al inicializar el contenedor de la base.
- Mantener el script idempotente (los `DROP TABLE IF EXISTS` con `FOREIGN_KEY_CHECKS` al inicio) y respetar las FKs existentes.
- Cualquier cambio de esquema (columnas, tablas, relaciones) se hace en `db/init.sql` y debe reflejarse en los modelos y en el SQL del servicio.

## Frontend (Swing)
- La UI es Swing con la librería SwingX (`org.swinglabs:swingx`): usa `JXFrame`, `JXTable`, `JXTaskPane`, `JXTaskPaneContainer`. Mantener estos componentes al extender la UI.
- El frontend actúa como cliente SOAP: genera el proxy en runtime desde el WSDL (`Service.create` + `getPort(InventoryService.class)`). El host del backend viene de la variable de entorno `BACKEND_HOST` (default `localhost`).
- Toda llamada al servicio y carga de datos debe ejecutarse fuera del hilo de UI usando `SwingWorker` (ver `MainFrame.loadData()`), y actualizar los `DefaultTableModel` en `done()`.
- La lógica de UI se concentra en `MainFrame` y los diálogos de formulario (`GameFormDialog`, `ConsoleFormDialog`, `AccessoryFormDialog`).

## Despliegue
- El proyecto se levanta con Docker Compose (`docker compose up --build`): servicios `db`, `backend`, `frontend`. Mantener la coherencia con las variables de entorno y puertos ya definidos en `docker-compose.yml`.
