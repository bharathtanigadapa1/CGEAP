package org.ceagap.model;

import jakarta.persistence.*;

@Entity
@Table(name = "quiz_results")
public class QuizResult extends BaseEntity {
    @ManyToOne(optional = false) private User user;
    private String quizType;
    private int score;
    private int total;
    private String badge;
    /** Comma separated question numbers that were asked in this attempt. */
    private String questionIds;

    public User getUser() { return user; }
    public void setUser(User v) { user = v; }
    public String getQuizType() { return quizType; }
    public void setQuizType(String v) { quizType = v; }
    public int getScore() { return score; }
    public void setScore(int v) { score = v; }
    public int getTotal() { return total; }
    public void setTotal(int v) { total = v; }
    public String getBadge() { return badge; }
    public void setBadge(String v) { badge = v; }
    public String getQuestionIds() { return questionIds; }
    public void setQuestionIds(String v) { questionIds = v; }
}
