package cl.inventory;

import javax.xml.namespace.QName;
import jakarta.xml.ws.Service;
import cl.inventory.service.InventoryService;
import jakarta.xml.ws.BindingProvider;

public class TestClient {
    public static void main(String[] args) {
        try {
            System.out.println("Starting TestClient...");
            QName qname = new QName("http://service.inventory.cl/", "InventoryServiceImplService");
            Service wsService = Service.create(qname);
            System.out.println("Service created. Getting port...");
            InventoryService service = wsService.getPort(InventoryService.class);
            
            System.out.println("Port obtained. Setting endpoint address...");
            ((BindingProvider) service).getRequestContext()
                .put(BindingProvider.ENDPOINT_ADDRESS_PROPERTY, "http://localhost:8080/inventory/ws/inventory");
                
            System.out.println("Calling getAllVideoGames()...");
            System.out.println("Result: " + service.getAllVideoGames());
        } catch(Throwable e) {
            e.printStackTrace();
        }
    }
}
