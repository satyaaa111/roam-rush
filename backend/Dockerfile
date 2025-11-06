# Stage 1: Build the application with Maven
# We use a specific Java 17-enabled image
FROM maven:3.9-eclipse-temurin-17 AS build

# Set the working directory inside the container
WORKDIR /app

# Copy the pom.xml file first to cache dependencies
COPY pom.xml .
RUN mvn dependency:go-offline

# Copy the rest of the source code
COPY src ./src

# Build the application, package it into a .jar file
RUN mvn package -DskipTests

# Stage 2: Create the final, lightweight image
# Use a slim Java 17 image which is smaller
FROM eclipse-temurin:17-jre-focal

WORKDIR /app

# Copy the .jar file from the 'build' stage
# This artifact name 'backend-0.0.1-SNAPSHOT.jar' is set in your pom.xml
COPY --from=build /app/target/backend-0.0.1-SNAPSHOT.jar app.jar

# Expose the port your application runs on
EXPOSE 8080

# The command to run your application
ENTRYPOINT ["java", "-jar", "app.jar"]