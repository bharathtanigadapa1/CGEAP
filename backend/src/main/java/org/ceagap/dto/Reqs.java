package org.ceagap.dto;

import java.util.List;
import java.util.Map;

/** Request bodies sent by the React app. */
public final class Reqs {
    private Reqs() {}

    public record Register(String name, String email, String mobile, String village, String password) {}
    public record Login(String mobile, String password) {}
    public record AdminLogin(String username, String password) {}
    public record ActionReq(String activity, String name, String village, String date, String time, String description, String photoData) {}
    public record PledgeReq(List<Integer> pledges, Boolean confirmed) {}
    /** answers: questionId -> index of the chosen option (the {@code idx} that was sent with the question). */
    public record QuizSubmit(Map<Integer, Integer> answers) {}
    public record IssueReq(String category, String location, String description, String photoData) {}
    public record FeedbackReq(String activity, Integer rating, String text) {}
    public record MessageReq(String name, String email, String mobile, String village, String type, String message) {}
    public record StatusReq(String status) {}
}
