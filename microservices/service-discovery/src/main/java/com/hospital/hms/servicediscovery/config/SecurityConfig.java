package com.hospital.hms.servicediscovery.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.SavedRequestAwareAuthenticationSuccessHandler;

/**
 * Security Configuration for Eureka Server
 * 
 * Provides authentication and authorization for the service registry.
 * Protects sensitive service information while allowing legitimate services to register.
 * 
 * @author HMS Enterprise Team
 * @version 1.0.0
 */
@Configuration
@EnableWebSecurity
public class SecurityConfig {

    /**
     * Configure security filter chain for Eureka Server
     */
    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
            .csrf(csrf -> csrf
                .ignoringRequestMatchers("/eureka/**"))
            .authorizeHttpRequests(authz -> authz
                // Allow health checks and metrics without authentication
                .requestMatchers("/actuator/health", "/actuator/info").permitAll()
                // Allow Eureka endpoints for service registration/discovery with basic auth
                .requestMatchers("/eureka/**").authenticated()
                // Require authentication for Eureka dashboard
                .requestMatchers("/").authenticated()
                .requestMatchers("/eureka").authenticated()
                // Require authentication for management endpoints
                .requestMatchers("/actuator/**").authenticated()
                // All other requests require authentication
                .anyRequest().authenticated()
            )
            .httpBasic(httpBasic -> httpBasic
                .authenticationEntryPoint((request, response, authException) -> {
                    response.addHeader("WWW-Authenticate", "Basic realm=\"Eureka Server\"");
                    response.sendError(401, "Unauthorized");
                })
            )
            .formLogin(form -> form
                .loginPage("/login").permitAll()
                .defaultSuccessUrl("/", true)
                .successHandler(savedRequestAwareAuthenticationSuccessHandler())
            )
            .logout(logout -> logout
                .logoutUrl("/logout")
                .logoutSuccessUrl("/login?logout")
                .invalidateHttpSession(true)
                .deleteCookies("JSESSIONID")
            )
            .sessionManagement(session -> session
                .maximumSessions(10)
                .maxSessionsPreventsLogin(false)
            );

        return http.build();
    }

    /**
     * Configure authentication success handler
     */
    @Bean
    public SavedRequestAwareAuthenticationSuccessHandler savedRequestAwareAuthenticationSuccessHandler() {
        SavedRequestAwareAuthenticationSuccessHandler successHandler = new SavedRequestAwareAuthenticationSuccessHandler();
        successHandler.setTargetUrlParameter("redirectTo");
        successHandler.setDefaultTargetUrl("/");
        return successHandler;
    }
}
