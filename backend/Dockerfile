# STAGE 1: Builder
FROM maven:3.8.5-openjdk-17 AS builder
WORKDIR /build
COPY pom.xml .
RUN mvn dependency:go-offline
COPY src ./src
RUN mvn package -DskipTests

# STAGE 2: Runner
FROM eclipse-temurin:17-jdk-jammy
WORKDIR /app

# 🔹 Import AWS RDS/DocumentDB SSL certificates permanently
RUN apt-get update && apt-get install -y curl && \
    # Download the regional bundle for ap-south-1
    curl -o /tmp/ap-south-1-bundle.pem https://truststore.pki.rds.amazonaws.com/ap-south-1/ap-south-1-bundle.pem && \
    # Import into Java truststore
    keytool -importcert -trustcacerts -alias aws-rds-ap-south-1-bundle \
      -file /tmp/ap-south-1-bundle.pem \
      -keystore $JAVA_HOME/lib/security/cacerts \
      -storepass changeit -noprompt && \
    rm /tmp/ap-south-1-bundle.pem

COPY --from=builder /build/target/*.jar app.jar
EXPOSE 8080
ENTRYPOINT ["java","-jar","app.jar"]
