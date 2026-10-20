package org.ceagap.config;

/** The authenticated principal placed in the security context by {@link JwtFilter}. */
public record AuthUser(Long id, String role, String username) {}
