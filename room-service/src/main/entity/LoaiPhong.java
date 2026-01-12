// Entity LoaiPhong
@Entity
@Table(name = "\"LOAIPHONG\"")
@Data
public class LoaiPhong {
    @Id
    @Column(name = "\"MALOAIPHONG\"", insertable = false, updatable = false)
    private String maLoaiPhong;

    @Column(name = "\"TENLOAIPHONG\"")
    private String tenLoaiPhong;

    @Column(name = "\"GIA\"")
    private BigDecimal gia;
}