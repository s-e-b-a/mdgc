FROM maven:3.9-eclipse-temurin-21 as builder
WORKDIR /app
COPY pom.xml .
COPY src ./src
RUN mvn clean package -DskipTests

FROM eclipse-temurin:21-jre

RUN apt-get update && apt-get install -y \
    libxext6 \
    libxrender1 \
    libxtst6 \
    libxi6 \
    libx11-6 \
    fontconfig \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app
COPY --from=builder /app/target/inventory-frontend-1.0-SNAPSHOT.jar /app/app.jar

CMD ["java", "-Djava.awt.headless=false", "-jar", "app.jar"]

