# --- STAGE 1: Build ---
FROM maven:3.8.5-openjdk-17-slim AS build
WORKDIR /app

# 1. Copy pom.xml and download dependencies (cached layer)
COPY pom.xml .
RUN mvn dependency:go-offline -B

# 2. Copy source and build the jar
COPY src ./src
RUN mvn clean package -DskipTests

# --- STAGE 2: Run ---
FROM eclipse-temurin:17-jre-alpine
WORKDIR /app

# Copy only the built jar from the previous stage
COPY --from=build /app/target/*.jar app.jar

# No need to copy application.properties manually.
# We use Environment Variables for dynamic config.
EXPOSE 8080

ENTRYPOINT ["java", "-jar", "app.jar"]

