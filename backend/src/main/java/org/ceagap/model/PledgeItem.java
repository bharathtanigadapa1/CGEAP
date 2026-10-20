package org.ceagap.model;

import jakarta.persistence.Column;
import jakarta.persistence.Embeddable;

@Embeddable
public class PledgeItem {
    private int pledgeNo;
    @Column(length = 500) private String en;
    @Column(length = 800) private String te;

    public PledgeItem() {}
    public PledgeItem(int no, String en, String te) { this.pledgeNo = no; this.en = en; this.te = te; }
    public int getPledgeNo() { return pledgeNo; }
    public String getEn() { return en; }
    public String getTe() { return te; }
}
