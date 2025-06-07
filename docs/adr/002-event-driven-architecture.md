# ADR-002: Event-Driven Architecture

**Status:** Accepted

**Context:** In a microservices architecture, services need to communicate with each other. Synchronous communication can lead to tight coupling and reduced resilience. If one service is unavailable, it can cause a cascading failure throughout the system.

**Decision:** We have decided to adopt an event-driven architecture for asynchronous communication between microservices. Services will publish events to a message broker, and other services can subscribe to these events to receive updates. This will decouple the services and improve the overall resilience of the system.

**Consequences:**

*   **Pros:**
    *   **Loose Coupling:** Services are decoupled from each other, which makes them easier to develop, deploy, and maintain.
    *   **Improved Resilience:** The failure of a single service will not affect other services that do not depend on it.
    *   **Increased Scalability:** The message broker can be scaled to handle a large volume of events.
*   **Cons:**
    *   **Increased Complexity:** An event-driven architecture is more complex to design and implement than a synchronous architecture.
    *   **Eventual Consistency:** Data will be eventually consistent across services, which may not be acceptable for all use cases.
    *   **Message Broker Overhead:** We will need to manage and maintain a message broker.
