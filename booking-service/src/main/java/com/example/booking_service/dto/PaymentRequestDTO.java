package com.example.booking_service.dto;
import lombok.Data;
import java.math.BigDecimal;

@Data
public class PaymentRequestDTO {
    private String maDatPhong;
    private String hinhThucTT; // Khớp với hinhthuctt
    private BigDecimal phuThu; // Cộng thêm vào sotientt
    private String maNV;       // Mã nhân viên (nếu có)
    private String ghiChu;     // (Database chưa có cột này, có thể bỏ qua hoặc thêm vào DB sau)
}