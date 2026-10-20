package org.ceagap.web;

import org.ceagap.config.AuthUser;
import org.ceagap.model.User;
import org.ceagap.repo.Repos;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;

/** Resolves the logged in user from the JWT. */
@Component
public class Current {
    private final Repos.Users users;

    public Current(Repos.Users users) { this.users = users; }

    public AuthUser principal() {
        Authentication a = SecurityContextHolder.getContext().getAuthentication();
        if (a == null || !(a.getPrincipal() instanceof AuthUser p)) throw new ApiException(HttpStatus.UNAUTHORIZED, "Login required");
        return p;
    }

    public User user() {
        return users.findById(principal().id()).orElseThrow(() -> new ApiException(HttpStatus.UNAUTHORIZED, "Invalid or expired login"));
    }

    /** Optional: the logged in user, or null for anonymous visitors. */
    public User userOrNull() {
        Authentication a = SecurityContextHolder.getContext().getAuthentication();
        if (a == null || !(a.getPrincipal() instanceof AuthUser p)) return null;
        return users.findById(p.id()).orElse(null);
    }
}
