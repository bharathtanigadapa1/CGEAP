package org.ceagap.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.annotation.PostConstruct;
import org.ceagap.dto.Dtos.*;
import org.ceagap.model.QuizQuestion;
import org.ceagap.model.QuizResult;
import org.ceagap.model.User;
import org.ceagap.repo.Repos;
import org.ceagap.web.ApiException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.core.io.ClassPathResource;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.io.InputStream;
import java.util.*;
import java.util.stream.Collectors;

/**
 * The whole question bank (4 quizzes x 50 questions) lives in the database.
 * Every attempt draws 5 NEW random questions and shuffles their options.
 * Questions used in the player's previous attempt of the same quiz are skipped while enough other questions exist.
 */
@Service
public class QuizService {
    public static final int PER_ATTEMPT = 5;
    private static final Logger log = LoggerFactory.getLogger(QuizService.class);

    private record Meta(String id, String title, String titleTe, String description) {}

    private final Repos.QuizQuestions questions;
    private final Repos.QuizResults results;
    private final ObjectMapper mapper;
    private final Map<String, Meta> meta = new LinkedHashMap<>();

    public QuizService(Repos.QuizQuestions questions, Repos.QuizResults results, ObjectMapper mapper) {
        this.questions = questions;
        this.results = results;
        this.mapper = mapper;
    }

    /** Loads quizzes.json: quiz titles go to memory, questions are inserted into the database the first time. */
    @PostConstruct
    @Transactional
    public void seed() throws Exception {
        try (InputStream in = new ClassPathResource("quizzes.json").getInputStream()) {
            JsonNode root = mapper.readTree(in);
            root.fields().forEachRemaining(e -> {
                String type = e.getKey();
                JsonNode q = e.getValue();
                meta.put(type, new Meta(type, q.get("title").asText(), q.get("titleTe").asText(), q.get("description").asText()));
                if (questions.countByQuizType(type) == 0) {
                    List<QuizQuestion> rows = new ArrayList<>();
                    for (JsonNode n : q.get("questions")) {
                        QuizQuestion row = new QuizQuestion();
                        row.setQuizType(type);
                        row.setQuestionNo(n.get("id").asInt());
                        row.setTextEn(n.get("en").asText());
                        row.setTextTe(n.get("te").asText());
                        row.setOptionsJson(n.get("options").toString());
                        row.setAnswer(n.get("answer").asInt());
                        rows.add(row);
                    }
                    questions.saveAll(rows);
                    log.info("Seeded {} questions for quiz '{}'", rows.size(), type);
                }
            });
        }
    }

    public List<QuizTypeDto> types() {
        return meta.values().stream()
                .map(m -> new QuizTypeDto(m.id(), m.title(), m.titleTe(), m.description(), questions.countByQuizType(m.id())))
                .toList();
    }

    /** Builds a fresh 5-question quiz. */
    @Transactional(readOnly = true)
    public QuizDto newAttempt(String type, Long userId) {
        Meta m = meta.get(type);
        if (m == null) throw new ApiException(HttpStatus.NOT_FOUND, "Quiz not found");

        List<QuizQuestion> bank = new ArrayList<>(questions.findByQuizType(type));
        Set<Integer> previous = results.findFirstByUserIdAndQuizTypeOrderByCreatedAtDesc(userId, type)
                .map(r -> parseIds(r.getQuestionIds())).orElse(Set.of());
        List<QuizQuestion> fresh = bank.stream().filter(q -> !previous.contains(q.getQuestionNo())).collect(Collectors.toCollection(ArrayList::new));
        List<QuizQuestion> pool = fresh.size() >= PER_ATTEMPT ? fresh : bank;
        Collections.shuffle(pool);

        List<QuizQuestionDto> out = new ArrayList<>();
        for (QuizQuestion q : pool.subList(0, Math.min(PER_ATTEMPT, pool.size()))) {
            List<QuizOptionDto> opts = new ArrayList<>();
            try {
                JsonNode arr = mapper.readTree(q.getOptionsJson());
                for (int i = 0; i < arr.size(); i++) {
                    opts.add(new QuizOptionDto(i, arr.get(i).get("en").asText(), arr.get(i).get("te").asText()));
                }
            } catch (Exception e) {
                throw new IllegalStateException("Bad question data for #" + q.getQuestionNo(), e);
            }
            Collections.shuffle(opts); // option order changes every time too
            out.add(new QuizQuestionDto(q.getQuestionNo(), q.getTextEn(), q.getTextTe(), opts));
        }
        return new QuizDto(type, m.title(), m.titleTe(), out);
    }

    @Transactional
    public QuizSubmitResponse submit(String type, User user, Map<Integer, Integer> answers) {
        if (!meta.containsKey(type)) throw new ApiException(HttpStatus.NOT_FOUND, "Quiz not found");
        if (answers == null || answers.size() != PER_ATTEMPT) {
            throw new ApiException(HttpStatus.BAD_REQUEST, "Please answer all " + PER_ATTEMPT + " questions");
        }
        List<QuizQuestion> asked = questions.findByQuizTypeAndQuestionNoIn(type, answers.keySet());
        if (asked.size() != PER_ATTEMPT) throw new ApiException(HttpStatus.BAD_REQUEST, "Invalid quiz answers");

        int score = 0;
        for (QuizQuestion q : asked) {
            Integer chosen = answers.get(q.getQuestionNo());
            if (chosen != null && chosen == q.getAnswer()) score++;
        }
        QuizResult r = new QuizResult();
        r.setUser(user);
        r.setQuizType(type);
        r.setScore(score);
        r.setTotal(PER_ATTEMPT);
        r.setBadge(Catalog.badge(score));
        r.setQuestionIds(asked.stream().map(q -> String.valueOf(q.getQuestionNo())).sorted().collect(Collectors.joining(",")));
        results.save(r);
        return new QuizSubmitResponse(score, PER_ATTEMPT, score * 100 / PER_ATTEMPT, r.getBadge(), r.getId());
    }

    private static Set<Integer> parseIds(String csv) {
        if (csv == null || csv.isBlank()) return Set.of();
        return Arrays.stream(csv.split(",")).map(String::trim).filter(s -> !s.isEmpty()).map(Integer::valueOf).collect(Collectors.toSet());
    }
}
