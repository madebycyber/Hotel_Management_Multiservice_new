package com.example.booking_service.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
// SỬA: Dùng Transactional của Spring
import org.springframework.transaction.annotation.Transactional;

import com.example.booking_service.client.RoomClient;
import com.example.booking_service.dto.BookingRequestDTO;
import com.example.booking_service.dto.ServiceDTO;
import com.example.booking_service.entity.ChiTietDatPhong;
import com.example.booking_service.entity.PhieuDatPhong;
import com.example.booking_service.repository.ChiTietDatPhongRepository;
import com.example.booking_service.repository.PhieuDatPhongRepository;

import jakarta.persistence.*;
import java.math.BigDecimal; // Thêm import BigDecimal nếu chưa có

@Service
public class BookingService {
    @Autowired private PhieuDatPhongRepository phieuRepo;
    @Autowired private ChiTietDatPhongRepository chitietRepo;
    @Autowired private RoomClient roomClient;
    @PersistenceContext private EntityManager entityManager;

    @Transactional
    public PhieuDatPhong createBooking(BookingRequestDTO req) {
        // 1. Validate Phòng
        if (roomClient.getRoomById(req.getMaPhong()) == null) {
            throw new RuntimeException("Phòng không tồn tại!");
        }

        // 2. Lưu Phiếu
        PhieuDatPhong phieu = new PhieuDatPhong();
        phieu.setMaPhong(req.getMaPhong());
        phieu.setMaKhachHang(req.getMaKhachHang());
        phieu.setNgayCheckIn(req.getNgayCheckIn());
        phieu.setNgayCheckOut(req.getNgayCheckOut());
        phieu.setTongGia(BigDecimal.ZERO); // Set giá trị mặc định để tránh null
        
        phieu = phieuRepo.saveAndFlush(phieu);
        entityManager.refresh(phieu); // Lấy mã DP00x vừa sinh

        // 3. Lưu Dịch vụ
        if (req.getServices() != null) {
            for (ServiceDTO s : req.getServices()) {
                // Kiểm tra null an toàn
                if (s.getMaDichVu() != null && roomClient.getServiceById(s.getMaDichVu()) != null) {
                    ChiTietDatPhong ct = new ChiTietDatPhong();
                    ct.setMaDatPhong(phieu.getMaDatPhong());
                    ct.setMaDichVu(s.getMaDichVu());
                    ct.setSoLuong(s.getSoLuong());
                    chitietRepo.save(ct);
                }
            }
        }
        return phieu;
    }
}