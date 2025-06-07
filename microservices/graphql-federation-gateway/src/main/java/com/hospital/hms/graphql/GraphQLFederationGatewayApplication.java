package com.hospital.hms.graphql;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cache.annotation.EnableCaching;
import org.springframework.cloud.openfeign.EnableFeignClients;
import org.springframework.scheduling.annotation.EnableAsync;

/**
 * GraphQL Federation Gateway Application
 * 
 * Unified GraphQL API gateway providing:
 * - Schema federation across all microservices
 * - Unified query interface for HMS ecosystem
 * - Real-time subscriptions via WebSocket
 * - Query optimization and caching
 * - Authentication and authorization
 * - Performance monitoring and analytics
 * - Load balancing and circuit breakers
 * 
 * @author HMS Enterprise Team
 * @version 1.0.0
 */
@SpringBootApplication
@EnableFeignClients
@EnableCaching
@EnableAsync
public class GraphQLFederationGatewayApplication {

    public static void main(String[] args) {
        SpringApplication.run(GraphQLFederationGatewayApplication.class, args);
    }
}