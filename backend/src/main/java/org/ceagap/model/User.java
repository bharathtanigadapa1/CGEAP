package org.ceagap.model;

import jakarta.persistence.*;

@Entity
@Table(name = "app_users")
public class User extends BaseEntity {
    @Column(nullable = false) private String name;
    @Column(unique = true) private String username;     // admins only
    private String email;
    @Column(nullable = false, unique = true) private String mobile;
    @Column(nullable = false) private String village;
    @Column(nullable = false) private String passwordHash;
    @Column(nullable = false) private String role = "user"; // "user" | "admin"

    public String getName() { return name; }
    public void setName(String v) { name = v; }
    public String getUsername() { return username; }
    public void setUsername(String v) { username = v; }
    public String getEmail() { return email; }
    public void setEmail(String v) { email = v; }
    public String getMobile() { return mobile; }
    public void setMobile(String v) { mobile = v; }
    public String getVillage() { return village; }
    public void setVillage(String v) { village = v; }
    public String getPasswordHash() { return passwordHash; }
    public void setPasswordHash(String v) { passwordHash = v; }
    public String getRole() { return role; }
    public void setRole(String v) { role = v; }
}
