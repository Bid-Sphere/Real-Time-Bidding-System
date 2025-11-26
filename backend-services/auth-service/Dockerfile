# =============================================
# Build Stage
# =============================================
FROM maven:3.9.6-eclipse-temurin-17 AS build

WORKDIR /build

# Copy parent pom
COPY pom.xml ../pom.xml

# Copy service pom and download dependencies
COPY pom.xml .
RUN mvn dependency:go-offline -B

# Copy source code and build
COPY src ./src
RUN mvn clean package -DskipTests -B

# =============================================
# Runtime Stage
# =============================================
FROM eclipse-temurin:17-jre

WORKDIR /app

COPY --from=build /build/target/*.jar app.jar

EXPOSE 8081

ENTRYPOINT ["java", "-jar", "/app/app.jar"]
