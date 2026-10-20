package org.ceagap.model;

import jakarta.persistence.*;

@Entity
@Table(name = "issues")
public class Issue extends BaseEntity {
    @Column(unique = true) private String trackingId;
    @ManyToOne(optional = false) private User user;
    private String category;
    private String location;
    @Column(length = 2000) private String description;
    private Long photoId;
    private String status = "Pending"; // Pending | Ongoing | Completed | Rejected

    public String getTrackingId() { return trackingId; }
    public void setTrackingId(String v) { trackingId = v; }
    public User getUser() { return user; }
    public void setUser(User v) { user = v; }
    public String getCategory() { return category; }
    public void setCategory(String v) { category = v; }
    public String getLocation() { return location; }
    public void setLocation(String v) { location = v; }
    public String getDescription() { return description; }
    public void setDescription(String v) { description = v; }
    public Long getPhotoId() { return photoId; }
    public void setPhotoId(Long v) { photoId = v; }
    public String getStatus() { return status; }
    public void setStatus(String v) { status = v; }
}
