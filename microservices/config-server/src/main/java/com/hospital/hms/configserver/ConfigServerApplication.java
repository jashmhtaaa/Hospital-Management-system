package com.hospital.hms.configserver;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.config.server.EnableConfigServer;
import org.springframework.cloud.netflix.eureka.EnableEurekaClient;

/**
 * Config Server Application
 * 
 * Enterprise-grade centralized configuration management server for the Hospital Management System.
 * Provides externalized configuration for all microservices with version control and environment-specific settings.
 * 
 * Features:
 * - Centralized configuration management
 * - Git-based configuration storage
 * - Environment-specific configurations (dev/test/prod)
 * - Configuration versioning and rollback
 * - Real-time configuration updates
 * - Encrypted configuration properties
 * - Configuration validation and validation
 * - Multi-profile support
 * - Service-specific configuration isolation
 * - Configuration audit and change tracking
 * 
 * Architecture Benefits:
 * - Eliminates configuration duplication
 * - Enables configuration changes without deployment
 * - Provides configuration consistency across environments
 * - Supports configuration inheritance and overrides
 * - Enables compliance and audit requirements
 * - Facilitates DevOps and CI/CD practices
 * - Supports configuration encryption for sensitive data
 * 
 * Configuration Sources:
 * - Git repositories (primary)
 * - Local file system (development)
 * - Vault integration (secrets management)
 * - Database configurations (optional)
 * - Environment variables and system properties
 * 
 * @author HMS Enterprise Team
 * @version 1.0.0
 */
@SpringBootApplication
@EnableConfigServer
@EnableEurekaClient
public class ConfigServerApplication {

    public static void main(String[] args) {
        SpringApplication.run(ConfigServerApplication.class, args);
    }
}
