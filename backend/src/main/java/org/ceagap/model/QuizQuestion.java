package org.ceagap.model;

import jakarta.persistence.*;

/** One question of the question bank. The whole bank lives in the database, 5 are drawn at random per attempt. */
@Entity
@Table(name = "quiz_questions")
public class QuizQuestion extends BaseEntity {
    @Column(nullable = false) private String quizType;   // water | waste | plastic | trees
    @Column(nullable = false) private int questionNo;
    @Column(length = 500, nullable = false) private String textEn;
    @Column(length = 800, nullable = false) private String textTe;
    /** JSON array: [{"en":"...","te":"..."}, ...] */
    @Column(columnDefinition = "TEXT", nullable = false) private String optionsJson;
    /** Index of the correct option inside optionsJson. */
    private int answer;

    public String getQuizType() { return quizType; }
    public void setQuizType(String v) { quizType = v; }
    public int getQuestionNo() { return questionNo; }
    public void setQuestionNo(int v) { questionNo = v; }
    public String getTextEn() { return textEn; }
    public void setTextEn(String v) { textEn = v; }
    public String getTextTe() { return textTe; }
    public void setTextTe(String v) { textTe = v; }
    public String getOptionsJson() { return optionsJson; }
    public void setOptionsJson(String v) { optionsJson = v; }
    public int getAnswer() { return answer; }
    public void setAnswer(int v) { answer = v; }
}
