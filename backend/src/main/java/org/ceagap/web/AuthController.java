package org.ceagap.web;

import org.ceagap.config.JwtService;
import org.ceagap.dto.Dtos.*;
import org.ceagap.dto.Reqs;
import org.ceagap.model.User;
import org.ceagap.repo.Repos;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/auth")
public class AuthController {
    private final Repos.Users users;
    private final PasswordEncoder encoder;
    private final JwtService jwt;
    private final Current current;

    public AuthController(Repos.Users users, PasswordEncoder encoder, JwtService jwt, Current current) {
        this.users = users;
        this.encoder = encoder;
        this.jwt = jwt;
        this.current = current;
    }

    @PostMapping("/register")
    @ResponseStatus(HttpStatus.CREATED)
    public AuthResponse register(@RequestBody Reqs.Register r) {
        if (blank(r.name()) || blank(r.mobile()) || blank(r.village()) || blank(r.password()))
            throw new ApiException(HttpStatus.BAD_REQUEST, "Required fields are missing");
        if (r.password().length() < 6) throw new ApiException(HttpStatus.BAD_REQUEST, "Password must contain at least 6 characters");
        String mobile = r.mobile().trim();
        if (users.existsByMobile(mobile)) throw new ApiException(HttpStatus.CONFLICT, "Mobile number already registered");
        User u = new User();
        u.setName(r.name().trim());
        u.setEmail(blank(r.email()) ? null : r.email().trim().toLowerCase());
        u.setMobile(mobile);
        u.setVillage(r.village().trim());
        u.setPasswordHash(encoder.encode(r.password()));
        u.setRole("user");
        users.save(u);
        return new AuthResponse(jwt.sign(u), UserDto.of(u));
    }

    @PostMapping("/login")
    public AuthResponse login(@RequestBody Reqs.Login r) {
        User u = users.findByMobile(r.mobile() == null ? "" : r.mobile().trim()).orElse(null);
        if (u == null || r.password() == null || !encoder.matches(r.password(), u.getPasswordHash()))
            throw new ApiException(HttpStatus.UNAUTHORIZED, "Invalid mobile number or password");
        return new AuthResponse(jwt.sign(u), UserDto.of(u));
    }

    @PostMapping("/admin-login")
    public AuthResponse adminLogin(@RequestBody Reqs.AdminLogin r) {
        String name = r.username() == null ? "" : r.username().trim().toLowerCase();
        User u = users.findByUsername(name).filter(x -> "admin".equals(x.getRole())).orElse(null);
        if (u == null || r.password() == null || !encoder.matches(r.password(), u.getPasswordHash()))
            throw new ApiException(HttpStatus.UNAUTHORIZED, "Invalid admin username or password");
        return new AuthResponse(jwt.sign(u), UserDto.of(u));
    }

    @GetMapping("/me")
    public Map<String, UserDto> me() {
        return Map.of("user", UserDto.of(current.user()));
    }

    static boolean blank(String s) { return s == null || s.isBlank(); }
}
