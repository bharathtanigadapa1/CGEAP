package org.ceagap.web;

import org.ceagap.dto.Dtos.*;
import org.ceagap.dto.Reqs;
import org.ceagap.model.*;
import org.ceagap.repo.Repos;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.*;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

/** Admin only (enforced in SecurityConfig: /api/admin/** requires ROLE_ADMIN). */
@RestController
@RequestMapping("/api/admin")
public class AdminController {
    private static final Set<String> STATUSES = Set.of("Pending", "Ongoing", "Completed", "Rejected");
    private static final Pattern DATA_URL = Pattern.compile("^data:(.*?);base64,(.*)$", Pattern.DOTALL);

    private final Repos.Users users;
    private final Repos.Actions actions;
    private final Repos.Issues issues;
    private final Repos.Pledges pledges;
    private final Repos.FeedbackRepo feedback;
    private final Repos.Messages messages;
    private final Repos.QuizResults quizResults;
    private final Repos.Photos photos;

    public AdminController(Repos.Users users, Repos.Actions actions, Repos.Issues issues, Repos.Pledges pledges,
                           Repos.FeedbackRepo feedback, Repos.Messages messages, Repos.QuizResults quizResults, Repos.Photos photos) {
        this.users = users;
        this.actions = actions;
        this.issues = issues;
        this.pledges = pledges;
        this.feedback = feedback;
        this.messages = messages;
        this.quizResults = quizResults;
        this.photos = photos;
    }

    @GetMapping("/overview")
    public Map<String, Object> overview() {
        Map<String, Object> m = new LinkedHashMap<>();
        m.put("users", users.countByRole("user"));
        m.put("actions", actions.count());
        m.put("issues", issues.count());
        m.put("feedbacks", feedback.count());
        m.put("quizzes", quizResults.count());
        m.put("pledges", pledges.count());
        m.put("messages", messages.count());
        m.put("pending", issues.countByStatus("Pending"));
        m.put("ongoing", issues.countByStatus("Ongoing"));
        m.put("completed", issues.countByStatus("Completed"));
        m.put("rejected", issues.countByStatus("Rejected"));
        m.put("averageFeedback", round1(feedback.averageRating()));
        m.put("averageQuiz", round1(quizResults.averageScore()));
        return m;
    }

    @GetMapping("/issues")
    public List<IssueDto> issues() { return issues.findAllByOrderByCreatedAtDesc().stream().map(IssueDto::of).toList(); }

    @PatchMapping("/issues/{id}")
    public IssueDto setStatus(@PathVariable Long id, @RequestBody Reqs.StatusReq r) {
        if (r.status() == null || !STATUSES.contains(r.status())) throw new ApiException(HttpStatus.BAD_REQUEST, "Invalid status");
        Issue i = issues.findById(id).orElseThrow(() -> new ApiException(HttpStatus.NOT_FOUND, "Issue not found"));
        i.setStatus(r.status());
        return IssueDto.of(issues.save(i));
    }

    @GetMapping("/actions")
    public List<ActionDto> actions() { return actions.findAllByOrderByCreatedAtDesc().stream().map(ActionDto::of).toList(); }

    @GetMapping("/feedback")
    public List<FeedbackDto> feedback() { return feedback.findAllByOrderByCreatedAtDesc().stream().map(FeedbackDto::of).toList(); }

    @GetMapping("/quizzes")
    public List<QuizResultDto> quizzes() { return quizResults.findAllByOrderByCreatedAtDesc().stream().map(QuizResultDto::of).toList(); }

    @GetMapping("/users")
    public List<UserDto> users() { return users.findByRoleOrderByCreatedAtDesc("user").stream().map(UserDto::of).toList(); }

    @GetMapping("/pledges")
    public List<PledgeDto> pledges() { return pledges.findAllByOrderByCreatedAtDesc().stream().map(PledgeDto::of).toList(); }

    @GetMapping("/messages")
    public List<MessageDto> messages() { return messages.findAllByOrderByCreatedAtDesc().stream().map(MessageDto::of).toList(); }

    @GetMapping("/issues/{id}/photo")
    public ResponseEntity<byte[]> issuePhoto(@PathVariable Long id) {
        Issue i = issues.findById(id).orElseThrow(() -> new ApiException(HttpStatus.NOT_FOUND, "Not found"));
        return photo(i.getPhotoId());
    }

    @GetMapping("/actions/{id}/photo")
    public ResponseEntity<byte[]> actionPhoto(@PathVariable Long id) {
        Action a = actions.findById(id).orElseThrow(() -> new ApiException(HttpStatus.NOT_FOUND, "Not found"));
        return photo(a.getPhotoId());
    }

    private ResponseEntity<byte[]> photo(Long photoId) {
        if (photoId == null) throw new ApiException(HttpStatus.NOT_FOUND, "No photo");
        Photo p = photos.findById(photoId).orElseThrow(() -> new ApiException(HttpStatus.NOT_FOUND, "No photo"));
        Matcher m = DATA_URL.matcher(p.getData());
        if (!m.matches()) throw new ApiException(HttpStatus.NOT_FOUND, "No photo");
        return ResponseEntity.ok().contentType(MediaType.parseMediaType(m.group(1))).body(Base64.getDecoder().decode(m.group(2)));
    }

    private static double round1(double v) { return Math.round(v * 10.0) / 10.0; }
}
