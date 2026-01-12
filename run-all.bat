@echo off
echo ========================================================
echo DANG KHOI DONG HE THONG KHACH SAN (MICROSERVICES)...
echo ========================================================

:: 1. Chạy Discovery Server trước (Quan trọng nhất)
echo [1/4] Dang khoi dong Discovery Server...
start "Discovery Server" cmd /k "cd discovery-server && mvn spring-boot:run"

:: Đợi 15 giây cho Discovery khởi động xong
timeout /t 15

:: 2. Chạy Room Service
echo [2/4] Dang khoi dong Room Service...
start "Room Service" cmd /k "cd room-service && mvn spring-boot:run"

:: 3. Chạy Booking Service
echo [3/4] Dang khoi dong Booking Service...
start "Booking Service" cmd /k "cd booking-service && mvn spring-boot:run"

:: 4. Chạy API Gateway (Chạy cuối cùng để hứng request)
echo [4/4] Dang khoi dong API Gateway...
start "API Gateway" cmd /k "cd api-gateway && mvn spring-boot:run"

echo ========================================================
echo TAT CA SERVICE DA DUOC KICH HOAT!
echo Hay giu cac cua so nay mo.
echo ========================================================
pause