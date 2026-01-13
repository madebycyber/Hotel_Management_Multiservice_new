package com.example.booking_service.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.example.booking_service.client.RoomClient;
import com.example.booking_service.dto.BookingRequestDTO;
import com.example.booking_service.dto.ServiceDTO;
import com.example.booking_service.entity.ChiTietDatPhong;
import com.example.booking_service.entity.KhachHang; // 1. Nhớ Import Entity KhachHang
import com.example.booking_service.entity.PhieuDatPhong;
import com.example.booking_service.repository.ChiTietDatPhongRepository;
import com.example.booking_service.repository.PhieuDatPhongRepository;

import jakarta.persistence.*;
import java.math.BigDecimal;

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

        // --- SỬA ĐOẠN LỖI TẠI ĐÂY ---
        // Thay vì: phieu.setKhachHang(req.getMaKhachHang());
        // Hãy làm như sau:
        KhachHang kh = new KhachHang();
        kh.setMaKh(req.getMaKhachHang()); // Gán ID String vào đối tượng
        phieu.setKhachHang(kh);           // Gán đối tượng vào Phiếu
        // -----------------------------

        phieu.setNgayCheckIn(req.getNgayCheckIn());
        phieu.setNgayCheckOut(req.getNgayCheckOut());
        phieu.setTongGia(BigDecimal.ZERO); 
        
        phieu = phieuRepo.saveAndFlush(phieu);
        entityManager.refresh(phieu); 

        // 3. Lưu Dịch vụ
        if (req.getServices() != null) {
            for (ServiceDTO s : req.getServices()) {
                if (s.getMaDichVu() != null) { // Bỏ check roomClient tạm thời để test luồng chính
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