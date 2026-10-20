package org.ceagap.config;

import org.ceagap.model.User;
import org.ceagap.repo.Repos;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.core.env.Environment;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

/**
 * Creates the four private administrator accounts from environment variables
 * ADMIN1_USERNAME / ADMIN1_PASSWORD / ADMIN1_NAME / ADMIN1_EMAIL ... ADMIN4_*.
 * Admins can never register through the website. Quiz questions are seeded by QuizService.
 */
@Component
public class DataSeeder implements ApplicationRunner {
    private static final Logger log = LoggerFactory.getLogger(DataSeeder.class);
    private final Environment env;
    private final Repos.Users users;
    private final PasswordEncoder encoder;

    public DataSeeder(Environment env, Repos.Users users, PasswordEncoder encoder) {
        this.env = env;
        this.users = users;
        this.encoder = encoder;
    }

    @Override
    public void run(ApplicationArguments args) {
        int created = 0, configured = 0;
        for (int i = 1; i <= 4; i++) {
            String username = norm(env.getProperty("ADMIN" + i + "_USERNAME"));
            String password = env.getProperty("ADMIN" + i + "_PASSWORD");
            if (username.isEmpty() || password == null || password.isBlank()) continue;
            configured++;
            var existing = users.findByUsername(username);
            if (existing.isPresent()) {
                User u = existing.get();
                if (!"admin".equals(u.getRole())) { u.setRole("admin"); users.save(u); }
                continue;
            }
            User u = new User();
            u.setUsername(username);
            u.setName(env.getProperty("ADMIN" + i + "_NAME", username));
            u.setEmail(env.getProperty("ADMIN" + i + "_EMAIL", username + "@ceagap.local"));
            u.setMobile("ADMIN-" + username);
            u.setVillage("Administration");
            u.setPasswordHash(encoder.encode(password));
            u.setRole("admin");
            users.save(u);
            created++;
        }
        if (configured == 0) {
            log.warn("No admin accounts configured. Set ADMIN1_USERNAME and ADMIN1_PASSWORD (up to ADMIN4_*) to enable admin login.");
        } else {
            log.info("Admin accounts configured: {} ({} newly created)", configured, created);
        }
    }

    private static String norm(String s) { return s == null ? "" : s.trim().toLowerCase(); }
}
