# mdgc
my digital games collection


--

# build backend

docker run --rm -v "$(pwd)/backend:/app" -w /app maven:3.9-eclipse-temurin-21 mvn clean package
