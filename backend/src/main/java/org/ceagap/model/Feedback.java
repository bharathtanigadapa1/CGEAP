package org.ceagap.model;

import jakarta.persistence.*;

@Entity
@Table(name = "feedback")
public class Feedback extends BaseEntity {
    @ManyToOne(optional = false) private User user;
    private String activity;
    private int rating;
    @Column(name = "feedback_text", length = 2000) private String text;

    public User getUser() { return user; }
    public void setUser(User v) { user = v; }
    public String getActivity() { return activity; }
    public void setActivity(String v) { activity = v; }
    public int getRating() { return rating; }
    public void setRating(int v) { rating = v; }
    public String getText() { return text; }
    public void setText(String v) { text = v; }
}
