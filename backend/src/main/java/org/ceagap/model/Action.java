package org.ceagap.model;

import jakarta.persistence.*;

@Entity
@Table(name = "actions")
public class Action extends BaseEntity {
    @ManyToOne(optional = false) private User user;
    private String activity;
    private String name;
    private String village;
    @Column(name = "action_date") private String date;
    @Column(name = "action_time") private String time;
    @Column(length = 2000) private String description;
    private Long photoId;
    private String status = "Submitted";

    public User getUser() { return user; }
    public void setUser(User v) { user = v; }
    public String getActivity() { return activity; }
    public void setActivity(String v) { activity = v; }
    public String getName() { return name; }
    public void setName(String v) { name = v; }
    public String getVillage() { return village; }
    public void setVillage(String v) { village = v; }
    public String getDate() { return date; }
    public void setDate(String v) { date = v; }
    public String getTime() { return time; }
    public void setTime(String v) { time = v; }
    public String getDescription() { return description; }
    public void setDescription(String v) { description = v; }
    public Long getPhotoId() { return photoId; }
    public void setPhotoId(Long v) { photoId = v; }
    public String getStatus() { return status; }
    public void setStatus(String v) { status = v; }
}
