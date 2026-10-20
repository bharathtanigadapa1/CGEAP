package org.ceagap.model;

import jakarta.persistence.*;

@Entity
@Table(name = "messages")
public class Message extends BaseEntity {
    @Column(nullable = false) private String name;
    private String email;
    private String mobile;
    private String village;
    @Column(name = "msg_type", nullable = false) private String type;
    @Column(name = "msg_body", nullable = false, length = 3000) private String message;
    @ManyToOne private User user;

    public String getName() { return name; }
    public void setName(String v) { name = v; }
    public String getEmail() { return email; }
    public void setEmail(String v) { email = v; }
    public String getMobile() { return mobile; }
    public void setMobile(String v) { mobile = v; }
    public String getVillage() { return village; }
    public void setVillage(String v) { village = v; }
    public String getType() { return type; }
    public void setType(String v) { type = v; }
    public String getMessage() { return message; }
    public void setMessage(String v) { message = v; }
    public User getUser() { return user; }
    public void setUser(User v) { user = v; }
}
