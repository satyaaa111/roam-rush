# STAGE 1: The "Builder"
# This stage builds your code into a .jar file
FROM maven:3.8.5-openjdk-17 AS builder

# Set the working directory
WORKDIR /build

# Copy the pom.xml file first to cache dependencies
COPY pom.xml .
RUN mvn dependency:go-offline

# Copy the rest of your source code
COPY src ./src

# Build the application!
RUN mvn package -DskipTests


# STAGE 2: The "Runner"
# This stage takes the .jar from the "Builder" and runs it
FROM eclipse-temurin:17-jdk-jammy

# Set the working directory
WORKDIR /app

# Copy ONLY the built jar file from the "builder" stage
COPY --from=builder /build/target/*.jar app.jar

# Expose the port
EXPOSE 8080

# Run the jar file
ENTRYPOINT ["java","-jar","app.jar"]