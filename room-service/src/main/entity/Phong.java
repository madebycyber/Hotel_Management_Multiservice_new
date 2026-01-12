
// Entity Phong
@Entity
@Table(name = "\"PHONG\"")
@Data
public class Phong {
    @Id
    @Column(name = "\"MAPHONG\"", insertable = false, updatable = false)
    private String maPhong; // DB tự sinh P001

    @Column(name = "\"SOPHONG\"")
    private Integer soPhong;

    @Column(name = "\"TRANGTHAI\"")
    private String trangThai;

    @ManyToOne
    @JoinColumn(name = "\"MALOAIPHONG\"")
    private LoaiPhong loaiPhong;
}