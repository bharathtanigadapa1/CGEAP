package org.ceagap.model;

import jakarta.persistence.*;

/** Photo proof stored separately so list queries never load the heavy base64 data. */
@Entity
@Table(name = "photos")
public class Photo extends BaseEntity {
    @Column(columnDefinition = "TEXT", nullable = false)
    private String data; // data:image/jpeg;base64,....

    public Photo() {}
    public Photo(String data) { this.data = data; }
    public String getData() { return data; }
    public void setData(String d) { data = d; }
}
