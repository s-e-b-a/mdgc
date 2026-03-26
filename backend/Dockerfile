FROM maven:3.8.6-openjdk-8 as builder
WORKDIR /app
COPY pom.xml .
COPY src ./src
RUN mvn clean package

FROM tomcat:9.0-jre8
COPY --from=builder /app/target/inventory-backend.war /usr/local/tomcat/webapps/inventory.war
