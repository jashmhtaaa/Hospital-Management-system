package com.hospital.hms.servicediscovery;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.netflix.eureka.server.EnableEurekaServer;

/**
 * Service Discovery Application (Eureka Server)
 * 
 * Enterprise-grade service registry and discovery server for the Hospital Management System.
 * Provides centralized service registration, discovery, and health monitoring for all microservices.
 * 
 * Features:
 * - Service registration and deregistration
 * - Service discovery and location transparency
 * - Health check monitoring and failover
 * - Load balancing support
 * - Service metadata management
 * - REST API for service queries
 * - Web dashboard for service monitoring
 * - Cluster support and replication
 * - Security and access control
 * - Metrics and monitoring integration
 * 
 * Architecture Benefits:
 * - Eliminates hardcoded service URLs
 * - Enables dynamic scaling and deployment
 * - Provides service resilience and failover
 * - Supports blue-green deployments
 * - Facilitates service mesh architecture
 * - Enables circuit breaker patterns
 * - Supports canary releases
 * 
 * @author HMS Enterprise Team
 * @version 1.0.0
 */
@SpringBootApplication
@EnableEurekaServer
public class ServiceDiscoveryApplication {

    public static void main(String[] args) {
        SpringApplication.run(ServiceDiscoveryApplication.class, args);
    }
}
