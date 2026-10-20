package org.ceagap.repo;

import org.ceagap.model.*;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.domain.Pageable;
import java.util.List;
import java.util.Optional;

/** All Spring Data repositories live here to keep the project compact. */
public final class Repos {
    private Repos() {}

    public interface Users extends JpaRepository<User, Long> {
        Optional<User> findByMobile(String mobile);
        Optional<User> findByUsername(String username);
        boolean existsByMobile(String mobile);
        long countByRole(String role);
        List<User> findByRoleOrderByCreatedAtDesc(String role);
        @Query("select count(distinct u.village) from User u where u.role = 'user'")
        long countDistinctVillages();
    }

    public interface Actions extends JpaRepository<Action, Long> {
        List<Action> findAllByOrderByCreatedAtDesc();
        List<Action> findByUserIdOrderByCreatedAtDesc(Long userId);
        @Query("select a from Action a join fetch a.user order by a.createdAt desc")
        List<Action> recent(Pageable p);
        long countByActivity(String activity);
        @Query("select count(distinct a.activity) from Action a")
        long countDistinctActivities();
    }

    public interface Issues extends JpaRepository<Issue, Long> {
        List<Issue> findAllByOrderByCreatedAtDesc();
        List<Issue> findByUserIdOrderByCreatedAtDesc(Long userId);
        long countByStatus(String status);
    }

    public interface Pledges extends JpaRepository<Pledge, Long> {
        List<Pledge> findAllByOrderByCreatedAtDesc();
        Optional<Pledge> findFirstByUserIdOrderByCreatedAtDesc(Long userId);
        void deleteByUserId(Long userId);
    }

    public interface FeedbackRepo extends JpaRepository<Feedback, Long> {
        List<Feedback> findAllByOrderByCreatedAtDesc();
        long countByRatingGreaterThanEqual(int rating);
        @Query("select coalesce(avg(f.rating), 0) from Feedback f")
        double averageRating();
    }

    public interface Messages extends JpaRepository<Message, Long> {
        List<Message> findAllByOrderByCreatedAtDesc();
    }

    public interface QuizResults extends JpaRepository<QuizResult, Long> {
        List<QuizResult> findAllByOrderByCreatedAtDesc();
        List<QuizResult> findByUserIdOrderByCreatedAtDesc(Long userId);
        Optional<QuizResult> findFirstByUserIdAndQuizTypeOrderByCreatedAtDesc(Long userId, String quizType);
        @Query("select coalesce(avg(r.score), 0) from QuizResult r")
        double averageScore();
    }

    public interface QuizQuestions extends JpaRepository<QuizQuestion, Long> {
        List<QuizQuestion> findByQuizType(String quizType);
        long countByQuizType(String quizType);
        List<QuizQuestion> findByQuizTypeAndQuestionNoIn(String quizType, java.util.Collection<Integer> questionNos);
    }

    public interface Photos extends JpaRepository<Photo, Long> {}
}
