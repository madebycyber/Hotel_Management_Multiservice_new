# Giai đoạn 1: Build (Nếu bạn muốn Docker tự build - Khuyên dùng cho Prod)
# Hoặc Giai đoạn 2: Run (Nhanh hơn nếu bạn đã build .jar ở ngoài)

FROM eclipse-temurin:17-jdk-alpine

WORKDIR /app

# Copy file jar đã build vào container (Bạn cần chạy mvn clean package trước)
# Lưu ý: Tên file jar có thể khác, hãy đổi tên thành app.jar cho gọn hoặc dùng wildcard
COPY target/*.jar app.jar

ENTRYPOINT ["java", "-jar", "app.jar"]