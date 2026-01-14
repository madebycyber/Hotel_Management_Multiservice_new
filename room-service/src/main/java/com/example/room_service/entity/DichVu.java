package com.example.room_service.entity;

import jakarta.persistence.*;
import lombok.Data;
import java.math.BigDecimal;

// Entity DichVu
@Entity
@Table(name = "\"DICHVU\"")
@Data
public class DichVu {
    @Id
    @Column(name = "\"MADV\"", insertable = false, updatable = false)
    private String maDichVu;

    @Column(name = "\"TENDICHVU\"")
    private String tenDichVu;
    
    @Column(name = "\"DONGIA\"")
    private BigDecimal donGia;

    public int getGiaTien() {
        return donGia.intValue();
    }
}