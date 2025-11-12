# =========================
# STAGE 1: The "Builder"
# =========================
FROM maven:3.8.5-openjdk-17 AS builder

# Set the working directory
WORKDIR /build

# Copy the pom.xml file first to cache dependencies
COPY pom.xml .
RUN mvn dependency:go-offline

# Copy the rest of your source code
COPY src ./src

# Build the application
RUN mvn package -DskipTests


# =========================
# STAGE 2: The "Runner"
# =========================
FROM eclipse-temurin:17-jdk-jammy

# Set the working directory
WORKDIR /app

# --- 👇 ADD THESE LINES HERE (BEFORE COPYING THE JAR) ---
# Install curl and import AWS RDS/DocumentDB global CA certificate
RUN apt-get update && apt-get install -y curl && \
    curl -o /tmp/global-bundle.pem https://truststore.pki.rds.amazonaws.com/global/global-bundle.pem && \
    keytool -importcert -trustcacerts -alias aws-rds-ca -file /tmp/global-bundle.pem \
      -keystore $JAVA_HOME/lib/security/cacerts -storepass changeit -noprompt && \
    rm -rf /var/lib/apt/lists/*

# Copy ONLY the built jar file from the "builder" stage
COPY --from=builder /build/target/*.jar app.jar

# Expose the port
EXPOSE 8080

# Run the jar file
ENTRYPOINT ["java", "-jar", "app.jar"]
