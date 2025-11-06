# Use an official OpenJDK runtime as a parent image
FROM eclipse-temurin:17-jdk-jammy
# Set the working directory
WORKDIR /app
# Copy the 'target' folder from the build stage
COPY target/*.jar app.jar
# Make port 8080 available to the world outside this container
EXPOSE 8080
# Run the jar file
ENTRYPOINT ["java","-jar","app.jar"]