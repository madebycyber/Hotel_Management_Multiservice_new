@RestController
@RequestMapping("/api")
public class RoomController {
    @Autowired private PhongRepository phongRepo;
    @Autowired private DichVuRepository dichVuRepo;

    @GetMapping("/rooms/{id}")
    public Phong getRoomById(@PathVariable String id) {
        return phongRepo.findById(id).orElse(null);
    }

    @GetMapping("/services/{id}")
    public DichVu getServiceById(@PathVariable String id) {
        return dichVuRepo.findById(id).orElse(null);
    }
    
    // API list cho frontend
    @GetMapping("/rooms")
    public List<Phong> getAllRooms() { return phongRepo.findAll(); }
    
    @GetMapping("/services")
    public List<DichVu> getAllServices() { return dichVuRepo.findAll(); }
}