package com.example.room_service.service;

import org.springframework.web.multipart.MultipartFile;
import java.io.IOException;
import java.nio.file.*;
import java.util.UUID;
import java.nio.file.StandardCopyOption;
import java.util.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.PageRequest;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Service;
import org.springframework.data.domain.Page;

import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;

import com.example.room_service.dto.RoomRequestDTO; // Nhớ import DTO
import com.example.room_service.entity.*;
import com.example.room_service.repository.*;

import jakarta.transaction.Transactional;

@Service
public class RoomService {
    @Autowired private PhongRepository phongRepository;
    @Autowired private LoaiPhongRepository loaiPhongRepository;
    @Autowired private DichVuRepository dichVuRepository;
    @Autowired private JdbcTemplate jdbcTemplate;
    private final String UPLOAD_DIR = "uploads/";

    // --- LOGIC PHÒNG ---

// SỬA: Thay vì trả List, trả về Page
    public Page<Phong> getAllRooms(int page, int size) {
        // Tạo PageRequest: trang (bắt đầu từ 0), kích thước, sắp xếp theo số phòng
        Pageable pageable = PageRequest.of(page, size, Sort.by("soPhong").ascending());
        return phongRepository.findAll(pageable);
    }

    public Phong getRoomById(String id) {   
        // Trim() để xóa khoảng trắng, findByMaPhongIgnoreCase để tìm bất chấp hoa thường
        return phongRepository.findByMaPhongIgnoreCase(id.trim())
                .orElseThrow(() -> new RuntimeException("Không tìm thấy phòng có mã: " + id));
    }

    public Map<String, Long> getRoomStats() {
        Map<String, Long> stats = new HashMap<>();
        stats.put("Available", phongRepository.countByTrangThai("Trống"));
        stats.put("Occupied", phongRepository.countByTrangThai("Đang sử dụng"));
        stats.put("Maintenance", phongRepository.countByTrangThai("Bảo trì"));
        stats.put("Total", phongRepository.count());
        return stats;
    }

@   Transactional
    public Phong createRoom(RoomRequestDTO dto, MultipartFile file) throws IOException {
        // 1. Kiểm tra trùng Số phòng (VD: 501)
        if (phongRepository.existsBySoPhong(dto.getSoPhong())) {
            throw new RuntimeException("Số phòng '" + dto.getSoPhong() + "' đã tồn tại trong hệ thống!");
        }
        // 1. Tìm Loại Phòng từ ID (Bắt buộc phải có loại phòng mới tạo được phòng)
        LoaiPhong lp = loaiPhongRepository.findById(dto.getLoaiPhongId())
                .orElseThrow(() -> new RuntimeException("Loại phòng không tồn tại với ID: " + dto.getLoaiPhongId()));

        // 2. Sinh mã Phong (P001...)
        Long nextVal = jdbcTemplate.queryForObject("SELECT nextval('seq_phong_ma')", Long.class);
        String generatedId = "p" + String.format("%03d", nextVal);

        // 1. Lưu file ảnh (nếu có)
        String imageUrl = null;
        if (file != null && !file.isEmpty()) {
            // Tạo tên file unique để tránh trùng
            String fileName = UUID.randomUUID().toString() + "_" + file.getOriginalFilename();
            Path filePath = Paths.get(UPLOAD_DIR + fileName);
            
            // Tạo thư mục nếu chưa có
            if (!Files.exists(Paths.get(UPLOAD_DIR))) {
                Files.createDirectories(Paths.get(UPLOAD_DIR));
            }
            
            // Lưu file
            Files.copy(file.getInputStream(), filePath, StandardCopyOption.REPLACE_EXISTING);
            
            // Giả sử server chạy localhost:8080, đường dẫn sẽ là /images/ten_file
            // Bạn cần cấu hình ResourceHandler để map /images/** vào thư mục uploads/
            imageUrl = "/images/" + fileName; 
        }

        // 3. Map dữ liệu từ DTO sang Entity
        Phong room = new Phong();
        room.setMaPhong(generatedId);
        room.setSoPhong(dto.getSoPhong());
        room.setTrangThai(dto.getTrangThai());
        room.setMoTa(dto.getMoTa());
        room.setLoaiPhong(lp); // Gán object LoaiPhong vào
        room.setImage(imageUrl); // Lưu URL ảnh vào cột Image

        return phongRepository.save(room);
    }

    public void deleteRoom(String id) {
        phongRepository.deleteById(id);
    }

    // --- LOGIC LOẠI PHÒNG & DỊCH VỤ (Giữ nguyên) ---

    public Page<LoaiPhong> getAllLoaiPhong(int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        return loaiPhongRepository.findAll(pageable);
    }

    public LoaiPhong createLoaiPhong(LoaiPhong loaiPhong) {
        Long nextVal = jdbcTemplate.queryForObject("SELECT nextval('seq_loaiphong_ma')", Long.class);
        String generatedId = "lp" + String.format("%03d", nextVal);
        loaiPhong.setMaLoaiPhong(generatedId);
        return loaiPhongRepository.save(loaiPhong);
    }

    public Page<DichVu> getAllDichVu(int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        return dichVuRepository.findAll(pageable);
    }

    public DichVu createDichVu(DichVu dichVu) {
        Long nextVal = jdbcTemplate.queryForObject("SELECT nextval('seq_dichvu_ma')", Long.class);
        String generatedId = "dv" + String.format("%03d", nextVal);
        dichVu.setMaDichVu(generatedId);
        return dichVuRepository.save(dichVu);
    }
}