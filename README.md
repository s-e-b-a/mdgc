# mdgc
my digital games collection
docker run --rm -v "$(pwd)/frontend:/app" -w /app maven:3.9-eclipse-temurin-21 mvn clean package
docker run --rm -v "$(pwd)/backend:/app" -w /app maven:3.9-eclipse-temurin-21 mvn clean package