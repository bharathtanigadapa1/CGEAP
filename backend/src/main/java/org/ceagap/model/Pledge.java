package org.ceagap.model;

import jakarta.persistence.*;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "pledges")
public class Pledge extends BaseEntity {
    @ManyToOne(optional = false) private User user;
    @ElementCollection(fetch = FetchType.EAGER)
    @CollectionTable(name = "pledge_items", joinColumns = @JoinColumn(name = "pledge_id"))
    private List<PledgeItem> items = new ArrayList<>();
    private boolean confirmed;

    public User getUser() { return user; }
    public void setUser(User v) { user = v; }
    public List<PledgeItem> getItems() { return items; }
    public void setItems(List<PledgeItem> v) { items = v; }
    public boolean isConfirmed() { return confirmed; }
    public void setConfirmed(boolean v) { confirmed = v; }
}
