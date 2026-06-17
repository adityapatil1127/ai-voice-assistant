FROM maven:3.8-openjdk-17 as builder

WORKDIR /app

# Copy pom.xml and source code
COPY pom.xml .
COPY src ./src

# Build the application
RUN mvn clean package -DskipTests

# Runtime stage
FROM eclipse-temurin:17-jre

WORKDIR /app

# Copy the built JAR from builder stage
COPY --from=builder /app/target/voice-assistant-*.jar app.jar

# Expose port
EXPOSE 8080

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
  CMD java -cp app.jar org.springframework.boot.loader.JarLauncher -c "curl -f http://localhost:8080/api/chat/health || exit 1"

# Run the application
ENTRYPOINT ["sh", "-c", "java -Dserver.port=$PORT -jar app.jar"]
