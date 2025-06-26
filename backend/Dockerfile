# Stage 1: compilación con Maven
FROM maven:3.9.2-eclipse-temurin-17 AS builder
WORKDIR /app
# Copiamos pom y fuentes
COPY pom.xml .
COPY src ./src
# Construimos el JAR (sin tests)
RUN mvn clean package -DskipTests

# Stage 2: imagen de ejecución
FROM openjdk:17-jdk-slim
WORKDIR /app
# Traemos el JAR ya compilado del builder
COPY --from=builder /app/target/ecommerce-0.0.1.jar app_ecommerce.jar
# Exponemos puerto
EXPOSE 8080
# Arrancamos la app
ENTRYPOINT ["java", "-jar", "app_ecommerce.jar"]