package cl.inventory.model;

import javax.xml.bind.annotation.XmlAccessType;
import javax.xml.bind.annotation.XmlAccessorType;
import javax.xml.bind.annotation.XmlRootElement;
import java.io.Serializable;

@XmlRootElement
@XmlAccessorType(XmlAccessType.FIELD)
public class Console implements Serializable {
    private int id;
    private int platformId;
    private String platformName;
    private String model;
    private String serialNumber;
    private String colorEdition;
    private String status;
    private String storageCapacity;
    private String includedCables;

    public Console() {}

    public int getId() { return id; }
    public void setId(int id) { this.id = id; }

    public int getPlatformId() { return platformId; }
    public void setPlatformId(int platformId) { this.platformId = platformId; }

    public String getPlatformName() { return platformName; }
    public void setPlatformName(String platformName) { this.platformName = platformName; }

    public String getModel() { return model; }
    public void setModel(String model) { this.model = model; }

    public String getSerialNumber() { return serialNumber; }
    public void setSerialNumber(String serialNumber) { this.serialNumber = serialNumber; }

    public String getColorEdition() { return colorEdition; }
    public void setColorEdition(String colorEdition) { this.colorEdition = colorEdition; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public String getStorageCapacity() { return storageCapacity; }
    public void setStorageCapacity(String storageCapacity) { this.storageCapacity = storageCapacity; }

    public String getIncludedCables() { return includedCables; }
    public void setIncludedCables(String includedCables) { this.includedCables = includedCables; }
}
