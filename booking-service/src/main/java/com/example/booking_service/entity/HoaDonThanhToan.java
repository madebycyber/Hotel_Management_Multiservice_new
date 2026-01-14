package com.example.booking_service.entity;

import jakarta.persistence.*;
import lombok.Data;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "hoadonthanhtoan")
@Data
public class HoaDonThanhToan {
    // Nếu 'stt' là khóa chính tự tăng trong DB:
    // @Id
    // @GeneratedValue(strategy = GenerationType.IDENTITY)
    // private Long stt;

    // Tuy nhiên, theo convention của bạn (dùng mã String làm ID), ta sẽ dùng 'mahd' làm ID chính
    @Id
    @Column(name = "mahd")
    private String maHd;

    @Column(name = "stt", insertable = false, updatable = false) // Chỉ để map dữ liệu nếu cần, không insert
    private Long stt;

    // Liên kết với PhieuDatPhong qua cột madatphong
    @OneToOne
    @JoinColumn(name = "madatphong", referencedColumnName = "madatphong")
    private PhieuDatPhong phieuDatPhong;

    @Column(name = "sotientt")
    private BigDecimal soTienTT;

    @Column(name = "hinhthuctt")
    private String hinhThucTT; // Tiền mặt, Chuyển khoản...

    @Column(name = "ngaytt")
    private LocalDateTime ngayTT;
    
    @Column(name = "trangthaitt")
    private String trangThaiTT; // Ví dụ: "Đã thanh toán"

    @Column(name = "manv")
    private String maNV; // Mã nhân viên thực hiện (có thể null nếu chưa có Auth)
}