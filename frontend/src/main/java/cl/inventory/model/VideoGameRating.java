package cl.inventory.model;

import jakarta.xml.bind.annotation.XmlAccessType;
import jakarta.xml.bind.annotation.XmlAccessorType;
import jakarta.xml.bind.annotation.XmlRootElement;
import java.io.Serializable;

@XmlRootElement
@XmlAccessorType(XmlAccessType.FIELD)
public class VideoGameRating implements Serializable {
    private int id;
    private int videoGameId;
    private Integer rating;            // 1..5, null si aún no valorado
    private String comment;
    private boolean completed;
    private int progressPercent;       // 0..100, aplica solo si NOT completed
    private int timesCompleted;
    private String lastPlayed;         // fecha como String (coherente con VideoGame.acquisitionDate)

    // Campos de solo lectura poblados por JOIN (para CSV y dashboard)
    private String gameTitle;
    private String platformName;

    public VideoGameRating() {}

    public int getId() { return id; }
    public void setId(int id) { this.id = id; }

    public int getVideoGameId() { return videoGameId; }
    public void setVideoGameId(int videoGameId) { this.videoGameId = videoGameId; }

    public Integer getRating() { return rating; }
    public void setRating(Integer rating) { this.rating = rating; }

    public String getComment() { return comment; }
    public void setComment(String comment) { this.comment = comment; }

    public boolean isCompleted() { return completed; }
    public void setCompleted(boolean completed) { this.completed = completed; }

    public int getProgressPercent() { return progressPercent; }
    public void setProgressPercent(int progressPercent) { this.progressPercent = progressPercent; }

    public int getTimesCompleted() { return timesCompleted; }
    public void setTimesCompleted(int timesCompleted) { this.timesCompleted = timesCompleted; }

    public String getLastPlayed() { return lastPlayed; }
    public void setLastPlayed(String lastPlayed) { this.lastPlayed = lastPlayed; }

    public String getGameTitle() { return gameTitle; }
    public void setGameTitle(String gameTitle) { this.gameTitle = gameTitle; }

    public String getPlatformName() { return platformName; }
    public void setPlatformName(String platformName) { this.platformName = platformName; }
}
