package org.ceagap.dto;

import org.ceagap.model.*;
import java.time.Instant;
import java.util.List;

/** JSON shapes sent to the React app. */
public final class Dtos {
    private Dtos() {}

    public record UserDto(Long id, String name, String username, String email, String mobile, String village, String role, Instant createdAt) {
        public static UserDto of(User u) {
            return new UserDto(u.getId(), u.getName(), u.getUsername(), u.getEmail(), u.getMobile(), u.getVillage(), u.getRole(), u.getCreatedAt());
        }
    }

    /** Small reference to the user that owns a record (used in admin tables and recent activity). */
    public record UserRef(Long id, String name, String username, String mobile, String village) {
        public static UserRef of(User u) {
            return u == null ? null : new UserRef(u.getId(), u.getName(), u.getUsername(), u.getMobile(), u.getVillage());
        }
    }

    public record AuthResponse(String token, UserDto user) {}

    public record ActionDto(Long id, UserRef userId, String activity, String name, String village, String date, String time,
                            String description, boolean hasPhoto, String status, Instant createdAt) {
        public static ActionDto of(Action a) {
            return new ActionDto(a.getId(), UserRef.of(a.getUser()), a.getActivity(), a.getName(), a.getVillage(), a.getDate(),
                    a.getTime(), a.getDescription(), a.getPhotoId() != null, a.getStatus(), a.getCreatedAt());
        }
    }

    public record IssueDto(Long id, String trackingId, UserRef userId, String category, String location, String description,
                           boolean hasPhoto, String status, Instant createdAt) {
        public static IssueDto of(Issue i) {
            return new IssueDto(i.getId(), i.getTrackingId(), UserRef.of(i.getUser()), i.getCategory(), i.getLocation(),
                    i.getDescription(), i.getPhotoId() != null, i.getStatus(), i.getCreatedAt());
        }
    }

    public record PledgeItemDto(int id, String en, String te, String text) {}

    public record PledgeDto(Long id, UserRef userId, List<PledgeItemDto> pledges, boolean confirmed, Instant createdAt) {
        public static PledgeDto of(Pledge p) {
            return new PledgeDto(p.getId(), UserRef.of(p.getUser()),
                    p.getItems().stream().map(i -> new PledgeItemDto(i.getPledgeNo(), i.getEn(), i.getTe(), i.getEn())).toList(),
                    p.isConfirmed(), p.getCreatedAt());
        }
    }

    public record FeedbackDto(Long id, UserRef userId, String activity, int rating, String text, Instant createdAt) {
        public static FeedbackDto of(Feedback f) {
            return new FeedbackDto(f.getId(), UserRef.of(f.getUser()), f.getActivity(), f.getRating(), f.getText(), f.getCreatedAt());
        }
    }

    public record MessageDto(Long id, UserRef userId, String name, String email, String mobile, String village, String type,
                             String message, Instant createdAt) {
        public static MessageDto of(Message m) {
            return new MessageDto(m.getId(), UserRef.of(m.getUser()), m.getName(), m.getEmail(), m.getMobile(), m.getVillage(),
                    m.getType(), m.getMessage(), m.getCreatedAt());
        }
    }

    public record QuizResultDto(Long id, UserRef userId, String quizType, int score, int total, String badge, Instant createdAt) {
        public static QuizResultDto of(QuizResult r) {
            return new QuizResultDto(r.getId(), UserRef.of(r.getUser()), r.getQuizType(), r.getScore(), r.getTotal(), r.getBadge(), r.getCreatedAt());
        }
    }

    // ---- Quiz ----
    public record QuizTypeDto(String id, String title, String titleTe, String description, long questionCount) {}
    /** An option as shown to the player. {@code idx} is the option's original index, used when submitting the answer. */
    public record QuizOptionDto(int idx, String en, String te) {}
    public record QuizQuestionDto(int id, String en, String te, List<QuizOptionDto> options) {}
    public record QuizDto(String type, String title, String titleTe, List<QuizQuestionDto> questions) {}
    public record QuizSubmitResponse(int score, int total, int percentage, String badge, Long resultId) {}
}
