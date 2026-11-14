# Backend — Spring Boot 3.3 / Java 17
# Build: docker build -t wedding-backend ./backend
# Chạy: docker run -p 8080:8080 -e SPRING_DATASOURCE_URL=jdbc:mysql://... wedding-backend
FROM maven:3.9.9-eclipse-temurin-17 AS build
WORKDIR /app
COPY pom.xml .
# Tải dependency trước để tận dụng cache layer
RUN mvn -q dependency:go-offline -DskipTests || true
COPY src ./src
RUN mvn -q package -DskipTests

FROM eclipse-temurin:17-jre
WORKDIR /app
COPY --from=build /app/target/online-wedding-invitation-*.jar app.jar
EXPOSE 8080
ENTRYPOINT ["java", "-jar", "app.jar"]
