package cl.inventory.service;

import jakarta.jws.WebService;
import java.util.ArrayList;
import java.util.List;
import cl.inventory.model.VideoGame;
import cl.inventory.model.Console;
import cl.inventory.model.Accessory;
import cl.inventory.model.Platform;
import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.PreparedStatement;
import java.sql.ResultSet;

@WebService(endpointInterface = "cl.inventory.service.InventoryService")
public class InventoryServiceImpl implements InventoryService {

    private Connection getConnection() throws Exception {
        Class.forName("com.mysql.cj.jdbc.Driver");
        String url = System.getenv("DB_URL");
        if (url == null) url = "jdbc:mysql://db:3306/inventory?useSSL=false&allowPublicKeyRetrieval=true";
        String user = System.getenv("DB_USER");
        if (user == null) user = "inventory_user";
        String pass = System.getenv("DB_PASS");
        if (pass == null) pass = "inventory_password";
        
        return DriverManager.getConnection(url, user, pass);
    }

    @Override
    public String ping() {
        return "Pong from Inventory Service!";
    }
    
    @Override
    public List<VideoGame> getAllVideoGames() {
        List<VideoGame> games = new ArrayList<>();
        try (Connection conn = getConnection();
             PreparedStatement stmt = conn.prepareStatement("SELECT v.*, p.name as platform_name FROM videogames v LEFT JOIN platforms p ON v.platform_id = p.id");
             ResultSet rs = stmt.executeQuery()) {
             
             while (rs.next()) {
                 VideoGame vg = new VideoGame();
                 vg.setId(rs.getInt("id"));
                 vg.setTitle(rs.getString("title"));
                 vg.setPlatformId(rs.getInt("platform_id"));
                 vg.setPlatform(rs.getString("platform_name"));
                 vg.setFormat(rs.getString("format"));
                 vg.setCompleteness(rs.getString("completeness"));
                 vg.setRegion(rs.getString("region"));
                 vg.setStoreOrigin(rs.getString("store_origin"));
                 vg.setPurchasePrice(rs.getDouble("purchase_price"));
                 java.sql.Date d = rs.getDate("acquisition_date");
                 if(d != null) {
                     vg.setAcquisitionDate(d.toString());
                 }
                 vg.setPlayState(rs.getString("play_state"));
                 games.add(vg);
             }
        } catch (Exception e) {
            e.printStackTrace();
        }
        return games;
    }

    @Override
    public void addVideoGame(VideoGame game) {
        try (Connection conn = getConnection();
             PreparedStatement stmt = conn.prepareStatement(
                "INSERT INTO videogames (title, platform_id, format, completeness, region, store_origin, purchase_price, acquisition_date, play_state) VALUES (?,?,?,?,?,?,?,?,?)")) {
             stmt.setString(1, game.getTitle());
             stmt.setInt(2, game.getPlatformId());
             stmt.setString(3, game.getFormat());
             stmt.setString(4, game.getCompleteness());
             stmt.setString(5, game.getRegion());
             stmt.setString(6, game.getStoreOrigin());
             stmt.setDouble(7, game.getPurchasePrice());
             if (game.getAcquisitionDate() != null && !game.getAcquisitionDate().isEmpty()) {
                 stmt.setDate(8, java.sql.Date.valueOf(game.getAcquisitionDate()));
             } else {
                 stmt.setNull(8, java.sql.Types.DATE);
             }
             stmt.setString(9, game.getPlayState());
             stmt.executeUpdate();
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    @Override
    public void updateVideoGame(VideoGame game) {
        try (Connection conn = getConnection();
             PreparedStatement stmt = conn.prepareStatement(
                "UPDATE videogames SET title=?, platform_id=?, format=?, completeness=?, region=?, store_origin=?, purchase_price=?, acquisition_date=?, play_state=? WHERE id=?")) {
             stmt.setString(1, game.getTitle());
             stmt.setInt(2, game.getPlatformId());
             stmt.setString(3, game.getFormat());
             stmt.setString(4, game.getCompleteness());
             stmt.setString(5, game.getRegion());
             stmt.setString(6, game.getStoreOrigin());
             stmt.setDouble(7, game.getPurchasePrice());
             if (game.getAcquisitionDate() != null && !game.getAcquisitionDate().isEmpty()) {
                 stmt.setDate(8, java.sql.Date.valueOf(game.getAcquisitionDate()));
             } else {
                 stmt.setNull(8, java.sql.Types.DATE);
             }
             stmt.setString(9, game.getPlayState());
             stmt.setInt(10, game.getId());
             stmt.executeUpdate();
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    @Override
    public void deleteVideoGame(int id) {
        try (Connection conn = getConnection();
             PreparedStatement stmt = conn.prepareStatement("DELETE FROM videogames WHERE id=?")) {
             stmt.setInt(1, id);
             stmt.executeUpdate();
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    @Override
    public List<Platform> getAllPlatforms() {
        List<Platform> list = new ArrayList<>();
        try (Connection conn = getConnection();
             PreparedStatement stmt = conn.prepareStatement("SELECT * FROM platforms");
             ResultSet rs = stmt.executeQuery()) {
             while (rs.next()) {
                 Platform p = new Platform();
                 p.setId(rs.getInt("id"));
                 p.setName(rs.getString("name"));
                 list.add(p);
             }
        } catch (Exception e) {
            e.printStackTrace();
        }
        return list;
    }

    @Override
    public void addPlatform(Platform platform) {
        try (Connection conn = getConnection();
             PreparedStatement stmt = conn.prepareStatement(
                "INSERT INTO platforms (name) VALUES (?)")) {
             stmt.setString(1, platform.getName());
             stmt.executeUpdate();
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    @Override
    public void updatePlatform(Platform platform) {
        try (Connection conn = getConnection();
             PreparedStatement stmt = conn.prepareStatement("UPDATE platforms SET name=? WHERE id=?")) {
             stmt.setString(1, platform.getName());
             stmt.setInt(2, platform.getId());
             stmt.executeUpdate();
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    @Override
    public void deletePlatform(int id) {
        try (Connection conn = getConnection();
             PreparedStatement stmt = conn.prepareStatement("DELETE FROM platforms WHERE id=?")) {
             stmt.setInt(1, id);
             stmt.executeUpdate();
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    @Override
    public List<Console> getAllConsoles() {
        List<Console> list = new ArrayList<>();
        try (Connection conn = getConnection();
             PreparedStatement stmt = conn.prepareStatement("SELECT c.*, p.name as platform_name FROM consoles c LEFT JOIN platforms p ON c.platform_id = p.id");
             ResultSet rs = stmt.executeQuery()) {
             while (rs.next()) {
                 Console c = new Console();
                 c.setId(rs.getInt("id"));
                 c.setModel(rs.getString("model"));
                 c.setSerialNumber(rs.getString("serial_number"));
                 c.setColorEdition(rs.getString("color_edition"));
                 c.setStatus(rs.getString("status"));
                 c.setStorageCapacity(rs.getString("storage_capacity"));
                 c.setIncludedCables(rs.getString("included_cables"));
                 c.setPlatformId(rs.getInt("platform_id"));
                 c.setPlatformName(rs.getString("platform_name"));
                 list.add(c);
             }
        } catch (Exception e) {
            e.printStackTrace();
        }
        return list;
    }

    @Override
    public void addConsole(Console console) {
        try (Connection conn = getConnection();
             PreparedStatement stmt = conn.prepareStatement(
                "INSERT INTO consoles (model, serial_number, color_edition, status, storage_capacity, included_cables, platform_id) VALUES (?,?,?,?,?,?,?)")) {
             stmt.setString(1, console.getModel());
             stmt.setString(2, console.getSerialNumber());
             stmt.setString(3, console.getColorEdition());
             stmt.setString(4, console.getStatus());
             stmt.setString(5, console.getStorageCapacity());
             stmt.setString(6, console.getIncludedCables());
             if(console.getPlatformId() > 0) stmt.setInt(7, console.getPlatformId());
             else stmt.setNull(7, java.sql.Types.INTEGER);
             stmt.executeUpdate();
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    @Override
    public void updateConsole(Console console) {
        try (Connection conn = getConnection();
             PreparedStatement stmt = conn.prepareStatement(
                "UPDATE consoles SET model=?, serial_number=?, color_edition=?, status=?, storage_capacity=?, included_cables=?, platform_id=? WHERE id=?")) {
             stmt.setString(1, console.getModel());
             stmt.setString(2, console.getSerialNumber());
             stmt.setString(3, console.getColorEdition());
             stmt.setString(4, console.getStatus());
             stmt.setString(5, console.getStorageCapacity());
             stmt.setString(6, console.getIncludedCables());
             if(console.getPlatformId() > 0) stmt.setInt(7, console.getPlatformId());
             else stmt.setNull(7, java.sql.Types.INTEGER);
             stmt.setInt(8, console.getId());
             stmt.executeUpdate();
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    @Override
    public void deleteConsole(int id) {
        try (Connection conn = getConnection();
             PreparedStatement stmt = conn.prepareStatement(
                "DELETE FROM consoles WHERE id=?")) {
             stmt.setInt(1, id);
             stmt.executeUpdate();
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    @Override
    public List<Accessory> getAllAccessories() {
        List<Accessory> list = new ArrayList<>();
        try (Connection conn = getConnection();
             PreparedStatement stmt = conn.prepareStatement("SELECT * FROM accessories");
             ResultSet rs = stmt.executeQuery()) {
             while (rs.next()) {
                 Accessory a = new Accessory();
                 a.setId(rs.getInt("id"));
                 a.setType(rs.getString("type"));
                 a.setBrand(rs.getString("brand"));
                 a.setConnectivity(rs.getString("connectivity"));
                 list.add(a);
             }
        } catch (Exception e) {
            e.printStackTrace();
        }
        return list;
    }

    @Override
    public void addAccessory(Accessory accessory) {
        try (Connection conn = getConnection();
             PreparedStatement stmt = conn.prepareStatement(
                "INSERT INTO accessories (type, brand, connectivity) VALUES (?,?,?)")) {
             stmt.setString(1, accessory.getType());
             stmt.setString(2, accessory.getBrand());
             stmt.setString(3, accessory.getConnectivity());
             stmt.executeUpdate();
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    @Override
    public void updateAccessory(Accessory accessory) {
        try (Connection conn = getConnection();
             PreparedStatement stmt = conn.prepareStatement(
                "UPDATE accessories SET type=?, brand=?, connectivity=? WHERE id=?")) {
             stmt.setString(1, accessory.getType());
             stmt.setString(2, accessory.getBrand());
             stmt.setString(3, accessory.getConnectivity());
             stmt.setInt(4, accessory.getId());
             stmt.executeUpdate();
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    @Override
    public void deleteAccessory(int id) {
        try (Connection conn = getConnection();
             PreparedStatement stmt = conn.prepareStatement(
                "DELETE FROM accessories WHERE id=?")) {
             stmt.setInt(1, id);
             stmt.executeUpdate();
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    @Override
    public double getTotalCollectionValue() {
        double val = 0;
        try (Connection conn = getConnection();
             PreparedStatement stmt = conn.prepareStatement("SELECT SUM(purchase_price) FROM videogames");
             ResultSet rs = stmt.executeQuery()) {
             if (rs.next()) {
                 val = rs.getDouble(1);
             }
        } catch (Exception e) {
            e.printStackTrace();
        }
        return val;
    }

    @Override
    public String getStatisticsReport() {
        StringBuilder sb = new StringBuilder();
        try (Connection conn = getConnection()) {
            sb.append("=========================================\n");
            sb.append("      INVENTORY STATISTICS REPORT        \n");
            sb.append("=========================================\n\n");
            try(PreparedStatement stmt = conn.prepareStatement("SELECT COUNT(*) FROM videogames"); ResultSet rs = stmt.executeQuery()) {
                if(rs.next()) sb.append(String.format("%-30s %d\n", "Total Video Games:", rs.getInt(1)));
            }
            try(PreparedStatement stmt = conn.prepareStatement("SELECT COUNT(*) FROM consoles"); ResultSet rs = stmt.executeQuery()) {
                if(rs.next()) sb.append(String.format("%-30s %d\n", "Total Hardware Consoles:", rs.getInt(1)));
            }
            try(PreparedStatement stmt = conn.prepareStatement("SELECT COUNT(*) FROM accessories"); ResultSet rs = stmt.executeQuery()) {
                if(rs.next()) sb.append(String.format("%-30s %d\n", "Total Accessories:", rs.getInt(1)));
            }
            try(PreparedStatement stmt = conn.prepareStatement("SELECT SUM(purchase_price) FROM videogames"); ResultSet rs = stmt.executeQuery()) {
                if(rs.next()) sb.append(String.format("%-30s $%.2f\n", "Total Collection Value:", rs.getDouble(1)));
            }
            sb.append("\n=== Breakdowns ===\n");
            
            sb.append("\n[Games by Platform]\n");
            try(PreparedStatement stmt = conn.prepareStatement("SELECT p.name, COUNT(v.id) FROM videogames v JOIN platforms p ON v.platform_id=p.id GROUP BY p.name"); ResultSet rs = stmt.executeQuery()) {
                while(rs.next()) sb.append(String.format(" - %-20s : %d\n", rs.getString(1), rs.getInt(2)));
            }
            sb.append("\n[Games by Play State]\n");
            try(PreparedStatement stmt = conn.prepareStatement("SELECT play_state, COUNT(id) FROM videogames GROUP BY play_state"); ResultSet rs = stmt.executeQuery()) {
                while(rs.next()) sb.append(String.format(" - %-20s : %d\n", rs.getString(1), rs.getInt(2)));
            }
        } catch (Exception e) {
            e.printStackTrace();
            return "Error generating stats.";
        }
        return sb.toString();
    }
}
