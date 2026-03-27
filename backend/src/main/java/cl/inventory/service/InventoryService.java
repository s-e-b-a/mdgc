package cl.inventory.service;

import jakarta.jws.WebMethod;
import jakarta.jws.WebService;
import java.util.List;
import cl.inventory.model.VideoGame;
import cl.inventory.model.Console;
import cl.inventory.model.Accessory;
import cl.inventory.model.Platform;

@WebService
public interface InventoryService {
    @WebMethod
    String ping();
    
    @WebMethod
    List<VideoGame> getAllVideoGames();
    
    @WebMethod
    void addVideoGame(VideoGame game);

    @WebMethod
    void updateVideoGame(VideoGame game);

    @WebMethod
    void deleteVideoGame(int id);

    @WebMethod
    List<Platform> getAllPlatforms();

    @WebMethod
    void addPlatform(Platform platform);

    @WebMethod
    void updatePlatform(Platform platform);

    @WebMethod
    void deletePlatform(int id);

    @WebMethod
    List<Console> getAllConsoles();

    @WebMethod
    void addConsole(Console console);

    @WebMethod
    void updateConsole(Console console);
    
    @WebMethod
    void deleteConsole(int id);

    @WebMethod
    List<Accessory> getAllAccessories();

    @WebMethod
    void addAccessory(Accessory accessory);

    @WebMethod
    void updateAccessory(Accessory accessory);

    @WebMethod
    void deleteAccessory(int id);
    
    @WebMethod
    double getTotalCollectionValue();
    
    @WebMethod
    String getStatisticsReport();
}
