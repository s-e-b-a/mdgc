FROM maven:3.9-eclipse-temurin-21 as builder
WORKDIR /app
COPY pom.xml .
COPY src ./src
RUN mvn clean package

FROM tomcat:10.1-jre21
COPY --from=builder /app/target/inventory-backend.war /usr/local/tomcat/webapps/inventory.war
