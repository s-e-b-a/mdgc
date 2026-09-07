Resumen del proyecto: mdgc (My Digital Games Collection)
Es una aplicación de inventario de videojuegos con arquitectura cliente-servidor de tres capas, toda en Java 21, empaquetada con Docker Compose.

1. Arquitectura general y comunicación entre módulos
Tres contenedores independientes orquestados por docker-compose.yml:

frontend (cliente Swing de escritorio) → backend (servicio web) → db (MySQL).
La comunicación frontend↔backend es vía SOAP / JAX-WS sobre HTTP. El frontend actúa como cliente SOAP: genera el proxy en tiempo de ejecución desde el WSDL del backend.
La comunicación backend↔db es JDBC directo (sin ORM).
El flujo concreto:

En MainFrame.initService() el frontend construye la URL del WSDL: http://<BACKEND_HOST>:8080/inventory/ws/inventory?wsdl, crea un Service con el QName {http://service.inventory.cl/}InventoryServiceImplService, obtiene el puerto tipado como InventoryService y fija el endpoint address. El host viene de la variable de entorno BACKEND_HOST (en Docker es backend, si no localhost).
Hay lógica de reintentos: si el backend no responde al inicio, reintenta hasta 5 veces con esperas de 3s (para dar tiempo a que Tomcat arranque). Si nunca conecta, entra en "modo offline" (las acciones simplemente no hacen nada porque service == null).
Toda la carga/escritura de datos pasa por un SwingWorker para no bloquear el hilo de UI.
2. Tecnología por capa
Protocolo del backend: SOAP con JAX-WS (jaxws-rt de com.sun.xml.ws). El servicio se publica como servlet en Tomcat 10.1 mediante WSServlet + WSServletContextListener, empaquetado como WAR. El endpoint se mapea en web.xml y sun-jaxws.xml a /ws/inventory.
Acceso a datos: JDBC puro con mysql-connector-j 9.1.0. Conexión creada a mano en getConnection(), con PreparedStatement y try-with-resources. No hay pool de conexiones ni ORM.
UI del frontend: Swing con la librería SwingX (org.swinglabs:swingx 1.6.1) — usa JXFrame, JXTable, JXTaskPane. El cliente SOAP se genera con CXF (cxf-rt-frontend-jaxws) más las APIs Jakarta XML WS/JAXB.
Base de datos: MySQL 8.0, base inventory, motor InnoDB, charset utf8mb4.
Build: Maven en ambos módulos, ambos apuntando a Java 21.
Backend: empaqueta un WAR (inventory-backend.war) desplegado en Tomcat.
Frontend: empaqueta un fat JAR ejecutable con maven-shade-plugin (main class cl.inventory.Main), con transformers para fusionar servicios y extensiones CXF.
3. Dónde vive la lógica y el contrato de servicios
Contrato: la interfaz cl.inventory.service.InventoryService, anotada con @WebService. Existe duplicada en ambos módulos:
Backend: @WebService (define el servicio).
Frontend: @WebService(targetNamespace = "http://service.inventory.cl/", name = "InventoryService") (para el proxy cliente).
Ambas declaran las mismas operaciones: CRUD de VideoGame, Platform, Console, Accessory, más ping(), getTotalCollectionValue() y getStatisticsReport().
Lógica principal: cl.inventory.service.InventoryServiceImpl (solo en el backend). Ahí están todas las consultas SQL, los INSERT/UPDATE/DELETE y la generación del reporte de estadísticas (getStatisticsReport compone un texto con conteos, valor total y desgloses por plataforma y por estado de juego).
Lógica de UI: MainFrame concentra toda la interacción (pestañas Dashboard, Video Games, Platforms, Hardware, Accessories) y los diálogos de formulario (GameFormDialog, ConsoleFormDialog, AccessoryFormDialog).
Una observación: aunque existe la entidad Loan y la tabla loans con datos, no hay operaciones de préstamos expuestas en el servicio ni en la UI. Es funcionalidad presente en el modelo/BD pero no cableada al resto.

4. Entidades del dominio y campos
Los modelos están duplicados en backend/.../model y frontend/.../model, anotados con @XmlRootElement (JAXB) e implementando Serializable.

VideoGame: id, title, platformId, platform (nombre, solo lectura vía JOIN), format, completeness, region, storeOrigin, purchasePrice (double), acquisitionDate (String), playState.
Platform: id, name. (toString() devuelve el nombre para usarlo en combos.)
Console: id, platformId, platformName, model, serialNumber, colorEdition, status, storageCapacity, includedCables. Usa @XmlAccessorType(FIELD).
Accessory: id, type, brand, connectivity. (Nota: no tiene relación con plataforma ni consola.)
Loan (definida pero no usada): id, itemType, itemId, borrowerName, loanDate, returnDate, status.
5. Esquema de BD y datos de ejemplo
Todo está en 
init.sql
, montado en el contenedor MySQL como 
init.sql
, así que se ejecuta automáticamente al inicializar la base vacía.

Idempotencia: al inicio desactiva FOREIGN_KEY_CHECKS, hace DROP TABLE IF EXISTS de todas las tablas y los reactiva.
Tablas: platforms, videogames, consoles, accessories, loans, con índices sobre columnas de búsqueda.
Relaciones (FK):
videogames.platform_id → platforms.id, ON DELETE RESTRICT (no puedes borrar una plataforma con juegos asociados — de ahí el mensaje de error en la UI al borrar plataformas).
consoles.platform_id → platforms.id, ON DELETE SET NULL (plataforma opcional).
accessories y loans no tienen FKs; loans referencia items de forma polimórfica vía item_type + item_id.
Detalle a notar: en la tabla videogames.acquisition_date es DATETIME, pero el backend lo lee con rs.getDate(...) y lo escribe con java.sql.Date.valueOf(...), es decir, maneja solo la parte de fecha (se pierde la hora).
Seed data: 5 plataformas (PS5, Switch, PC, Xbox Series X, Nintendo 64), 4 videojuegos, 2 consolas, 3 accesorios y 2 préstamos.
6. Cómo se levanta todo (build y ejecución)
La vía principal es Docker Compose (según el README):

bash

docker compose up --build
Qué hace cada servicio:

db: MySQL 8.0 en el puerto 3306, con healthcheck (mysqladmin ping) y volumen persistente db_data. Crea la base inventory y usuario inventory_user / inventory_password.
backend: build multi-stage (Maven → mvn clean package -DskipTests → WAR) desplegado en tomcat:10.1-jre21 como inventory.war, expuesto en 8080. Arranca solo cuando la db está healthy. La conexión JDBC se resuelve por env vars DB_URL/DB_USER/DB_PASS, con defaults apuntando a jdbc:mysql://db:3306/inventory.
frontend: build multi-stage a fat JAR, corre sobre eclipse-temurin:21-jre. Como es una app Swing de escritorio, el contenedor monta el socket X11 del host (/tmp/.X11-unix) y usa DISPLAY/XAUTHORITY para pintar la ventana en tu escritorio Linux. Recibe BACKEND_HOST=backend para encontrar el servicio.
Alternativa manual (sin Docker), útil para desarrollo:

Backend: mvn clean package en backend/ y desplegar el WAR en un Tomcat 10.1 con Java 21, o levantar solo la db y Tomcat.
Frontend: mvn clean package en frontend/ y java -jar target/inventory-frontend-1.0-SNAPSHOT.jar (con BACKEND_HOST apuntando al backend; por defecto usa localhost). Existe además TestClient como cliente de prueba que llama a getAllVideoGames() contra http://localhost:8080/inventory/ws/inventory.
Un par de detalles que vale la pena tener presentes si más adelante tocas el proyecto:

config.json no es config de la app: es un plan de transformación (AWS java-version-upgrade de Java 8 → 21) y apunta a otra ruta (/home/if/Code/tf/j12/frontend), así que parece un artefacto de una migración previa.
El contrato y los modelos están duplicados manualmente entre frontend y backend; si cambias una firma o un campo, hay que actualizarlo en los dos lados para que el SOAP siga cuadrando.

dependency-reduced-pom.xml
 es un archivo generado por el shade plugin, no algo que edites a mano.
No modifiqué nada. ¿Quieres que profundice en alguna capa concreta o que diagrame el flujo de una operación (por ejemplo, "Add Game") de punta a punta?