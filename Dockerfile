# ---- 1) build the React app (Vite writes it into backend/src/main/resources/static) ----
FROM node:22-alpine AS web
WORKDIR /app
COPY frontend/package*.json frontend/
RUN cd frontend && npm ci
COPY frontend frontend
RUN mkdir -p backend/src/main/resources && cd frontend && npm run build

# ---- 2) build the Spring Boot jar (includes the React app as static files) ----
FROM maven:3.9-eclipse-temurin-21 AS api
WORKDIR /app
COPY backend/pom.xml backend/pom.xml
RUN cd backend && mvn -q -B dependency:go-offline
COPY backend backend
COPY --from=web /app/backend/src/main/resources/static backend/src/main/resources/static
RUN cd backend && mvn -q -B -DskipTests package

# ---- 3) small runtime image ----
FROM eclipse-temurin:21-jre
WORKDIR /app
COPY --from=api /app/backend/target/ceagap.jar app.jar
ENV JAVA_TOOL_OPTIONS="-XX:MaxRAMPercentage=75"
EXPOSE 8080
CMD ["java", "-jar", "app.jar"]
