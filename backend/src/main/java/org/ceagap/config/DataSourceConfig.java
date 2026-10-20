package org.ceagap.config;

import com.zaxxer.hikari.HikariConfig;
import com.zaxxer.hikari.HikariDataSource;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.env.Environment;

import javax.sql.DataSource;
import java.net.URI;

/**
 * Chooses the database from the environment:
 *  - DATABASE_URL = postgres://user:pass@host:5432/db   (Render, Neon, Supabase, Railway ... style)
 *  - DATABASE_URL = jdbc:postgresql://host:5432/db      (+ DB_USERNAME / DB_PASSWORD)
 *  - nothing set  = local H2 file database in ./data (zero setup for development)
 */
@Configuration
public class DataSourceConfig {

    @Bean
    DataSource dataSource(Environment env) throws Exception {
        HikariConfig cfg = new HikariConfig();
        String url = env.getProperty("DATABASE_URL", "").trim();

        if (url.isEmpty()) {
            cfg.setJdbcUrl("jdbc:h2:file:./data/ceagap;MODE=PostgreSQL;DB_CLOSE_ON_EXIT=FALSE");
            cfg.setUsername("sa");
            cfg.setPassword("");
        } else if (url.startsWith("jdbc:")) {
            cfg.setJdbcUrl(url);
            cfg.setUsername(env.getProperty("DB_USERNAME"));
            cfg.setPassword(env.getProperty("DB_PASSWORD"));
        } else {
            URI u = new URI(url.replaceFirst("^postgres(ql)?://", "http://"));
            String[] ui = u.getUserInfo() == null ? new String[]{"", ""} : u.getUserInfo().split(":", 2);
            int port = u.getPort() == -1 ? 5432 : u.getPort();
            String query = u.getQuery();
            // Hosted databases (Neon, Supabase ...) have a dotted hostname and require SSL; Render's internal host does not.
            if (query == null && u.getHost().contains(".")) query = "sslmode=require";
            cfg.setJdbcUrl("jdbc:postgresql://" + u.getHost() + ":" + port + u.getPath() + (query == null ? "" : "?" + query));
            cfg.setUsername(java.net.URLDecoder.decode(ui[0], "UTF-8"));
            cfg.setPassword(ui.length > 1 ? java.net.URLDecoder.decode(ui[1], "UTF-8") : "");
        }
        cfg.setMaximumPoolSize(Integer.parseInt(env.getProperty("DB_POOL_SIZE", "5")));
        cfg.setPoolName("ceagap-pool");
        return new HikariDataSource(cfg);
    }
}
