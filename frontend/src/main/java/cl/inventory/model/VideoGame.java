package cl.inventory.model;

import jakarta.xml.bind.annotation.XmlRootElement;
import java.io.Serializable;

@XmlRootElement
public class VideoGame implements Serializable {
    private int id;
    private String title;
    private int platformId;
    private String platform;
    private String format;
    private String completeness;
    private String region;
    private String storeOrigin;
    private double purchasePrice;
    private String acquisitionDate;
    private String playState;

    public int getId() { return id; }
    public void setId(int id) { this.id = id; }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public int getPlatformId() { return platformId; }
    public void setPlatformId(int platformId) { this.platformId = platformId; }

    public String getPlatform() { return platform; }
    public void setPlatform(String platform) { this.platform = platform; }

    public String getFormat() { return format; }
    public void setFormat(String format) { this.format = format; }

    public String getCompleteness() { return completeness; }
    public void setCompleteness(String completeness) { this.completeness = completeness; }

    public String getRegion() { return region; }
    public void setRegion(String region) { this.region = region; }

    public String getStoreOrigin() { return storeOrigin; }
    public void setStoreOrigin(String storeOrigin) { this.storeOrigin = storeOrigin; }

    public double getPurchasePrice() { return purchasePrice; }
    public void setPurchasePrice(double purchasePrice) { this.purchasePrice = purchasePrice; }

    public String getAcquisitionDate() { return acquisitionDate; }
    public void setAcquisitionDate(String acquisitionDate) { this.acquisitionDate = acquisitionDate; }

    public String getPlayState() { return playState; }
    public void setPlayState(String playState) { this.playState = playState; }
}
