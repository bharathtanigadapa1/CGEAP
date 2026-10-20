package org.ceagap.config;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import org.ceagap.model.User;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import javax.crypto.SecretKey;
import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.time.Duration;
import java.util.Date;

@Service
public class JwtService {
    private final SecretKey key;
    private final long expiryMillis;

    public JwtService(@Value("${ceagap.jwt.secret}") String secret, @Value("${ceagap.jwt.expiry-days}") long days) throws Exception {
        // Hash the configured secret so any length is accepted and the HS256 key is always 256 bits.
        byte[] digest = MessageDigest.getInstance("SHA-256").digest(secret.getBytes(StandardCharsets.UTF_8));
        this.key = Keys.hmacShaKeyFor(digest);
        this.expiryMillis = Duration.ofDays(days).toMillis();
    }

    public String sign(User u) {
        Date now = new Date();
        return Jwts.builder()
                .subject(String.valueOf(u.getId()))
                .claim("role", u.getRole())
                .claim("username", u.getUsername() == null ? "" : u.getUsername())
                .issuedAt(now)
                .expiration(new Date(now.getTime() + expiryMillis))
                .signWith(key)
                .compact();
    }

    public Claims parse(String token) {
        return Jwts.parser().verifyWith(key).build().parseSignedClaims(token).getPayload();
    }
}
