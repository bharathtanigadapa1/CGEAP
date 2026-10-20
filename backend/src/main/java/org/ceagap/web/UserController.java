package org.ceagap.web;

import org.ceagap.dto.Dtos.*;
import org.ceagap.dto.Reqs;
import org.ceagap.model.*;
import org.ceagap.repo.Repos;
import org.ceagap.service.Catalog;
import org.ceagap.service.QuizService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import java.util.*;

/** Everything a logged-in citizen can do. */
@RestController
@RequestMapping("/api")
public class UserController {
    private final Current current;
    private final Repos.Actions actions;
    private final Repos.Issues issues;
    private final Repos.Pledges pledges;
    private final Repos.FeedbackRepo feedback;
    private final Repos.Messages messages;
    private final Repos.QuizResults quizResults;
    private final Repos.Photos photos;
    private final QuizService quiz;

    public UserController(Current current, Repos.Actions actions, Repos.Issues issues, Repos.Pledges pledges,
                          Repos.FeedbackRepo feedback, Repos.Messages messages, Repos.QuizResults quizResults,
                          Repos.Photos photos, QuizService quiz) {
        this.current = current;
        this.actions = actions;
        this.issues = issues;
        this.pledges = pledges;
        this.feedback = feedback;
        this.messages = messages;
        this.quizResults = quizResults;
        this.photos = photos;
        this.quiz = quiz;
    }

    // ---------- Green actions ----------
    @PostMapping("/actions")
    @ResponseStatus(HttpStatus.CREATED)
    public ActionDto createAction(@RequestBody Reqs.ActionReq r) {
        if (AuthController.blank(r.activity()) || AuthController.blank(r.name()) || AuthController.blank(r.village())
                || AuthController.blank(r.date()) || AuthController.blank(r.time()) || AuthController.blank(r.description())
                || AuthController.blank(r.photoData()))
            throw new ApiException(HttpStatus.BAD_REQUEST, "Complete all fields and upload photo proof");
        Action a = new Action();
        a.setUser(current.user());
        a.setActivity(r.activity());
        a.setName(r.name());
        a.setVillage(r.village());
        a.setDate(r.date());
        a.setTime(r.time());
        a.setDescription(r.description());
        a.setPhotoId(photos.save(new Photo(r.photoData())).getId());
        return ActionDto.of(actions.save(a));
    }

    @GetMapping("/actions/mine")
    public List<ActionDto> myActions() {
        return actions.findByUserIdOrderByCreatedAtDesc(current.principal().id()).stream().map(ActionDto::of).toList();
    }

    // ---------- Pledges ----------
    @PostMapping("/pledges")
    @ResponseStatus(HttpStatus.CREATED)
    @Transactional
    public PledgeDto savePledge(@RequestBody Reqs.PledgeReq r) {
        List<Integer> ids = r.pledges() == null ? List.of() : r.pledges().stream().distinct()
                .filter(id -> id != null && id >= 1 && id <= Catalog.PLEDGES.size()).sorted().toList();
        if (!Boolean.TRUE.equals(r.confirmed()) || ids.isEmpty())
            throw new ApiException(HttpStatus.BAD_REQUEST, "Confirm at least one selected pledge");
        User u = current.user();
        pledges.deleteByUserId(u.getId()); // a user keeps one current pledge set
        pledges.flush();
        Pledge p = new Pledge();
        p.setUser(u);
        p.setConfirmed(true);
        for (int id : ids) {
            Catalog.Pledge c = Catalog.PLEDGES.get(id - 1);
            p.getItems().add(new PledgeItem(c.id(), c.en(), c.te()));
        }
        return PledgeDto.of(pledges.save(p));
    }

    @GetMapping("/pledges/mine")
    public ResponseEntity<PledgeDto> myPledge() {
        return pledges.findFirstByUserIdOrderByCreatedAtDesc(current.principal().id())
                .map(p -> ResponseEntity.ok(PledgeDto.of(p)))
                .orElseGet(() -> ResponseEntity.ok().build());
    }

    // ---------- Quiz ----------
    @GetMapping("/quizzes/types")
    public List<QuizTypeDto> quizTypes() { return quiz.types(); }

    /** Returns 5 random questions (with shuffled options) - a different set on every call. */
    @GetMapping("/quizzes/{type}")
    public QuizDto startQuiz(@PathVariable String type) {
        return quiz.newAttempt(type, current.principal().id());
    }

    @PostMapping("/quizzes/{type}/submit")
    public QuizSubmitResponse submitQuiz(@PathVariable String type, @RequestBody Reqs.QuizSubmit r) {
        return quiz.submit(type, current.user(), r.answers());
    }

    @GetMapping("/quizzes/results/mine")
    public List<QuizResultDto> myQuizResults() {
        return quizResults.findByUserIdOrderByCreatedAtDesc(current.principal().id()).stream().map(QuizResultDto::of).toList();
    }

    // ---------- Issues ----------
    @PostMapping("/issues")
    @ResponseStatus(HttpStatus.CREATED)
    public IssueDto report(@RequestBody Reqs.IssueReq r) {
        if (AuthController.blank(r.category()) || AuthController.blank(r.location()) || AuthController.blank(r.description()))
            throw new ApiException(HttpStatus.BAD_REQUEST, "Complete issue details");
        Issue i = new Issue();
        i.setUser(current.user());
        i.setCategory(r.category());
        i.setLocation(r.location());
        i.setDescription(r.description());
        if (!AuthController.blank(r.photoData())) i.setPhotoId(photos.save(new Photo(r.photoData())).getId());
        i.setTrackingId("CEAGAP-" + String.valueOf(System.currentTimeMillis()).substring(5) + (10 + new Random().nextInt(90)));
        return IssueDto.of(issues.save(i));
    }

    @GetMapping("/issues/mine")
    public List<IssueDto> myIssues() {
        return issues.findByUserIdOrderByCreatedAtDesc(current.principal().id()).stream().map(IssueDto::of).toList();
    }

    // ---------- Feedback ----------
    @PostMapping("/feedback")
    @ResponseStatus(HttpStatus.CREATED)
    public FeedbackDto sendFeedback(@RequestBody Reqs.FeedbackReq r) {
        if (AuthController.blank(r.activity()) || r.rating() == null || AuthController.blank(r.text()))
            throw new ApiException(HttpStatus.BAD_REQUEST, "Complete all feedback fields");
        if (r.rating() < 1 || r.rating() > 5) throw new ApiException(HttpStatus.BAD_REQUEST, "Rating must be between 1 and 5");
        Feedback f = new Feedback();
        f.setUser(current.user());
        f.setActivity(r.activity());
        f.setRating(r.rating());
        f.setText(r.text());
        return FeedbackDto.of(feedback.save(f));
    }

    // ---------- Contact messages (open to guests too) ----------
    @PostMapping("/messages")
    @ResponseStatus(HttpStatus.CREATED)
    public MessageDto contact(@RequestBody Reqs.MessageReq r) {
        if (AuthController.blank(r.name()) || AuthController.blank(r.type()) || AuthController.blank(r.message()))
            throw new ApiException(HttpStatus.BAD_REQUEST, "Name, message type and message are required");
        Message m = new Message();
        m.setName(r.name().trim());
        m.setEmail(r.email());
        m.setMobile(r.mobile());
        m.setVillage(r.village());
        m.setType(r.type());
        m.setMessage(r.message().trim());
        m.setUser(current.userOrNull());
        return MessageDto.of(messages.save(m));
    }
}
