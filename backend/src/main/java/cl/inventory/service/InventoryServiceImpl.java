package cl.inventory.service;

import jakarta.jws.WebService;
import java.util.ArrayList;
import java.util.List;
import cl.inventory.model.VideoGame;
import cl.inventory.model.VideoGameRating;
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
                 vg.setGenre(rs.getString("genre"));
                 vg.setFormat(rs.getString("format"));
                 vg.setCompleteness(rs.getString("completeness"));
                 vg.setRegion(rs.getString("region"));
                 vg.setStoreOrigin(rs.getString("store_origin"));
                 vg.setPurchasePrice(rs.getDouble("purchase_price"));
                 java.sql.Date d = rs.getDate("acquisition_date");
                 if(d != null) {
                     vg.setAcquisitionDate(d.toString());
                 }
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
                "INSERT INTO videogames (title, platform_id, genre, format, completeness, region, store_origin, purchase_price, acquisition_date) VALUES (?,?,?,?,?,?,?,?,?)")) {
             stmt.setString(1, game.getTitle());
             stmt.setInt(2, game.getPlatformId());
             stmt.setString(3, game.getGenre());
             stmt.setString(4, game.getFormat());
             stmt.setString(5, game.getCompleteness());
             stmt.setString(6, game.getRegion());
             stmt.setString(7, game.getStoreOrigin());
             stmt.setDouble(8, game.getPurchasePrice());
             if (game.getAcquisitionDate() != null && !game.getAcquisitionDate().isEmpty()) {
                 stmt.setDate(9, java.sql.Date.valueOf(game.getAcquisitionDate()));
             } else {
                 stmt.setNull(9, java.sql.Types.DATE);
             }
             stmt.executeUpdate();
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    @Override
    public void updateVideoGame(VideoGame game) {
        try (Connection conn = getConnection();
             PreparedStatement stmt = conn.prepareStatement(
                "UPDATE videogames SET title=?, platform_id=?, genre=?, format=?, completeness=?, region=?, store_origin=?, purchase_price=?, acquisition_date=? WHERE id=?")) {
             stmt.setString(1, game.getTitle());
             stmt.setInt(2, game.getPlatformId());
             stmt.setString(3, game.getGenre());
             stmt.setString(4, game.getFormat());
             stmt.setString(5, game.getCompleteness());
             stmt.setString(6, game.getRegion());
             stmt.setString(7, game.getStoreOrigin());
             stmt.setDouble(8, game.getPurchasePrice());
             if (game.getAcquisitionDate() != null && !game.getAcquisitionDate().isEmpty()) {
                 stmt.setDate(9, java.sql.Date.valueOf(game.getAcquisitionDate()));
             } else {
                 stmt.setNull(9, java.sql.Types.DATE);
             }
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

    private VideoGameRating mapRating(ResultSet rs) throws Exception {
        VideoGameRating r = new VideoGameRating();
        r.setId(rs.getInt("id"));
        r.setVideoGameId(rs.getInt("videogame_id"));
        int ratingVal = rs.getInt("rating");
        if (rs.wasNull()) {
            r.setRating(null);
        } else {
            r.setRating(ratingVal);
        }
        r.setComment(rs.getString("comment"));
        r.setCompleted(rs.getBoolean("completed"));
        r.setProgressPercent(rs.getInt("progress_percent"));
        r.setTimesCompleted(rs.getInt("times_completed"));
        java.sql.Date lp = rs.getDate("last_played");
        if (lp != null) {
            r.setLastPlayed(lp.toString());
        }
        return r;
    }

    @Override
    public VideoGameRating getRatingForGame(int videoGameId) {
        try (Connection conn = getConnection();
             PreparedStatement stmt = conn.prepareStatement(
                "SELECT r.*, v.title AS game_title, p.name AS platform_name " +
                "FROM videogame_ratings r " +
                "JOIN videogames v ON r.videogame_id = v.id " +
                "LEFT JOIN platforms p ON v.platform_id = p.id " +
                "WHERE r.videogame_id = ?")) {
             stmt.setInt(1, videoGameId);
             try (ResultSet rs = stmt.executeQuery()) {
                 if (rs.next()) {
                     VideoGameRating r = mapRating(rs);
                     r.setGameTitle(rs.getString("game_title"));
                     r.setPlatformName(rs.getString("platform_name"));
                     return r;
                 }
             }
        } catch (Exception e) {
            e.printStackTrace();
        }
        return null;
    }

    @Override
    public List<VideoGameRating> getAllRatings() {
        List<VideoGameRating> list = new ArrayList<>();
        try (Connection conn = getConnection();
             PreparedStatement stmt = conn.prepareStatement(
                "SELECT r.*, v.title AS game_title, p.name AS platform_name " +
                "FROM videogame_ratings r " +
                "JOIN videogames v ON r.videogame_id = v.id " +
                "LEFT JOIN platforms p ON v.platform_id = p.id " +
                "ORDER BY v.title");
             ResultSet rs = stmt.executeQuery()) {
             while (rs.next()) {
                 VideoGameRating r = mapRating(rs);
                 r.setGameTitle(rs.getString("game_title"));
                 r.setPlatformName(rs.getString("platform_name"));
                 list.add(r);
             }
        } catch (Exception e) {
            e.printStackTrace();
        }
        return list;
    }

    @Override
    public void saveRating(VideoGameRating rating) {
        try (Connection conn = getConnection()) {
            boolean exists = false;
            try (PreparedStatement check = conn.prepareStatement(
                    "SELECT id FROM videogame_ratings WHERE videogame_id = ?")) {
                check.setInt(1, rating.getVideoGameId());
                try (ResultSet rs = check.executeQuery()) {
                    exists = rs.next();
                }
            }

            if (exists) {
                try (PreparedStatement stmt = conn.prepareStatement(
                        "UPDATE videogame_ratings SET rating=?, comment=?, completed=?, progress_percent=?, times_completed=?, last_played=? WHERE videogame_id=?")) {
                    bindRatingFields(stmt, rating);
                    stmt.setInt(7, rating.getVideoGameId());
                    stmt.executeUpdate();
                }
            } else {
                try (PreparedStatement stmt = conn.prepareStatement(
                        "INSERT INTO videogame_ratings (rating, comment, completed, progress_percent, times_completed, last_played, videogame_id) VALUES (?,?,?,?,?,?,?)")) {
                    bindRatingFields(stmt, rating);
                    stmt.setInt(7, rating.getVideoGameId());
                    stmt.executeUpdate();
                }
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    private void bindRatingFields(PreparedStatement stmt, VideoGameRating rating) throws Exception {
        if (rating.getRating() != null) {
            stmt.setInt(1, rating.getRating());
        } else {
            stmt.setNull(1, java.sql.Types.INTEGER);
        }
        stmt.setString(2, rating.getComment());
        stmt.setBoolean(3, rating.isCompleted());
        // Si está completado, el avance parcial no aplica: se fuerza a 100.
        stmt.setInt(4, rating.isCompleted() ? 100 : rating.getProgressPercent());
        stmt.setInt(5, rating.getTimesCompleted());
        if (rating.getLastPlayed() != null && !rating.getLastPlayed().isEmpty()) {
            stmt.setDate(6, java.sql.Date.valueOf(rating.getLastPlayed()));
        } else {
            stmt.setNull(6, java.sql.Types.DATE);
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
            sb.append("\n[Top Completed Games (by times completed)]\n");
            boolean anyCompleted = false;
            try(PreparedStatement stmt = conn.prepareStatement(
                    "SELECT v.title, r.times_completed FROM videogame_ratings r JOIN videogames v ON r.videogame_id = v.id WHERE r.times_completed > 0 ORDER BY r.times_completed DESC LIMIT 5");
                ResultSet rs = stmt.executeQuery()) {
                while(rs.next()) {
                    anyCompleted = true;
                    sb.append(String.format(" - %-30s : %d\n", rs.getString(1), rs.getInt(2)));
                }
            }
            if (!anyCompleted) sb.append(" - (Aún no hay juegos terminados)\n");

            sb.append("\n[Most Played Genre]\n");
            try(PreparedStatement stmt = conn.prepareStatement(
                    "SELECT v.genre, COUNT(*) AS c FROM videogames v WHERE v.genre IS NOT NULL AND v.genre <> '' GROUP BY v.genre ORDER BY c DESC LIMIT 1");
                ResultSet rs = stmt.executeQuery()) {
                if(rs.next()) {
                    sb.append(String.format(" - %-20s : %d juego(s)\n", rs.getString(1), rs.getInt(2)));
                } else {
                    sb.append(" - (Sin géneros registrados)\n");
                }
            }
        } catch (Exception e) {
            e.printStackTrace();
            return "Error generating stats.";
        }
        return sb.toString();
    }
}
