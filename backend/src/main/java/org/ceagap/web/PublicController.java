package org.ceagap.web;

import org.ceagap.dto.Dtos.*;
import org.ceagap.repo.Repos;
import org.ceagap.service.Catalog;
import org.springframework.data.domain.PageRequest;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

/** Endpoints anyone can read, also without logging in. */
@RestController
@RequestMapping("/api")
public class PublicController {
    private final Repos.Users users;
    private final Repos.Actions actions;
    private final Repos.FeedbackRepo feedback;
    private final Repos.Pledges pledges;
    private final Repos.QuizResults quizResults;
    private final Repos.Issues issues;

    public PublicController(Repos.Users users, Repos.Actions actions, Repos.FeedbackRepo feedback,
                            Repos.Pledges pledges, Repos.QuizResults quizResults, Repos.Issues issues) {
        this.users = users;
        this.actions = actions;
        this.feedback = feedback;
        this.pledges = pledges;
        this.quizResults = quizResults;
        this.issues = issues;
    }

    @GetMapping("/health")
    public Map<String, Object> health() { return Map.of("ok", true, "service", "CEAGAP"); }

    @GetMapping("/activities")
    public List<Catalog.Activity> activities() { return Catalog.ACTIVITIES; }

    @GetMapping("/pledges")
    public List<Catalog.Pledge> pledgeCatalog() { return Catalog.PLEDGES; }

    @GetMapping("/activities/recent")
    public List<ActionDto> recent() {
        // public endpoint: expose only the name and village of the participant
        return actions.recent(PageRequest.of(0, 15)).stream().map(a -> {
            ActionDto d = ActionDto.of(a);
            UserRef u = d.userId();
            return new ActionDto(d.id(), u == null ? null : new UserRef(null, u.name(), null, null, u.village()),
                    d.activity(), d.name(), d.village(), d.date(), d.time(), d.description(), d.hasPhoto(), d.status(), d.createdAt());
        }).toList();
    }

    @GetMapping("/stats")
    public Map<String, Object> stats() {
        long feedbackCount = feedback.count();
        long positive = feedback.countByRatingGreaterThanEqual(4);
        Map<String, Object> m = new LinkedHashMap<>();
        m.put("registeredCitizens", users.countByRole("user"));
        m.put("greenActions", actions.count());
        m.put("treesPlanted", actions.countByActivity("Tree Plantation"));
        m.put("wasteReduced", actions.countByActivity("Waste Segregation"));
        m.put("plasticAvoided", actions.countByActivity("Plastic Reduction"));
        m.put("communityActivities", Math.max(actions.countDistinctActivities(), Catalog.ACTIVITIES.size()));
        m.put("villagesReached", users.countDistinctVillages());
        m.put("feedbacks", feedbackCount);
        m.put("pledges", pledges.count());
        m.put("quizAttempts", quizResults.count());
        m.put("issues", issues.count());
        m.put("positiveFeedback", feedbackCount == 0 ? 0 : Math.round(positive * 100.0 / feedbackCount));
        return m;
    }
}
