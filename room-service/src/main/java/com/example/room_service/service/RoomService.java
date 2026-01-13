package com.example.room_service.service;

import java.util.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Service;

import com.example.room_service.dto.RoomRequestDTO; // Nhớ import DTO
import com.example.room_service.entity.*;
import com.example.room_service.repository.*;

@Service
public class RoomService {
    @Autowired private PhongRepository phongRepository;
    @Autowired private LoaiPhongRepository loaiPhongRepository;
    @Autowired private DichVuRepository dichVuRepository;
    @Autowired private JdbcTemplate jdbcTemplate;

    // --- LOGIC PHÒNG ---

    public List<Phong> getAllRooms() {
        return phongRepository.findAll();
    }

    public Phong getRoomById(String id) {
        return phongRepository.findById(id).orElse(null);
    }

    public Map<String, Long> getRoomStats() {
        Map<String, Long> stats = new HashMap<>();
        stats.put("Available", phongRepository.countByTrangThai("Available"));
        stats.put("Occupied", phongRepository.countByTrangThai("Occupied"));
        stats.put("Maintenance", phongRepository.countByTrangThai("Maintenance"));
        stats.put("Total", phongRepository.count());
        return stats;
    }

    // SỬA ĐỔI QUAN TRỌNG: Nhận DTO thay vì Entity
    public Phong createRoom(RoomRequestDTO dto) {
        // 1. Tìm Loại Phòng từ ID (Bắt buộc phải có loại phòng mới tạo được phòng)
        LoaiPhong lp = loaiPhongRepository.findById(dto.getLoaiPhongId())
                .orElseThrow(() -> new RuntimeException("Loại phòng không tồn tại với ID: " + dto.getLoaiPhongId()));

        // 2. Sinh mã Phong (P001...)
        Long nextVal = jdbcTemplate.queryForObject("SELECT nextval('seq_phong_ma')", Long.class);
        String generatedId = "p" + String.format("%03d", nextVal);

        // 3. Map dữ liệu từ DTO sang Entity
        Phong room = new Phong();
        room.setMaPhong(generatedId);
        room.setSoPhong(dto.getSoPhong());
        room.setTrangThai(dto.getTrangThai());
        room.setMoTa(dto.getMoTa());
        room.setLoaiPhong(lp); // Gán object LoaiPhong vào

        return phongRepository.save(room);
    }

    public void deleteRoom(String id) {
        phongRepository.deleteById(id);
    }

    // --- LOGIC LOẠI PHÒNG & DỊCH VỤ (Giữ nguyên) ---

    public List<LoaiPhong> getAllLoaiPhong() {
        return loaiPhongRepository.findAll();
    }

    public LoaiPhong createLoaiPhong(LoaiPhong loaiPhong) {
        Long nextVal = jdbcTemplate.queryForObject("SELECT nextval('seq_loaiphong_ma')", Long.class);
        String generatedId = "lp" + String.format("%03d", nextVal);
        loaiPhong.setMaLoaiPhong(generatedId);
        return loaiPhongRepository.save(loaiPhong);
    }

    public List<DichVu> getAllDichVu() {
        return dichVuRepository.findAll();
    }

    public DichVu createDichVu(DichVu dichVu) {
        Long nextVal = jdbcTemplate.queryForObject("SELECT nextval('seq_dichvu_ma')", Long.class);
        String generatedId = "dv" + String.format("%03d", nextVal);
        dichVu.setMaDichVu(generatedId);
        return dichVuRepository.save(dichVu);
    }
}