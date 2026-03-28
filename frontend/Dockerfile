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
CMD ["java", "-Djava.awt.headless=false", "-jar", "target/inventory-frontend-1.0-SNAPSHOT.jar"]
