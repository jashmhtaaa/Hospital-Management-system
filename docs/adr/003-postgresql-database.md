# ADR-003: PostgreSQL as Primary Database

**Status:** Accepted

**Context:** The Hospital Management System requires a reliable, scalable, and feature-rich database to store its data. We considered several options, including MySQL, MongoDB, and PostgreSQL.

**Decision:** We have decided to use PostgreSQL as the primary database for the HMS. PostgreSQL is a powerful, open-source object-relational database system with a strong reputation for reliability, feature robustness, and performance.

**Consequences:**

*   **Pros:**
    *   **Reliability:** PostgreSQL is known for its reliability and data integrity.
    *   **Scalability:** PostgreSQL can be scaled to handle a large volume of data and users.
    *   **Feature-Rich:** PostgreSQL supports a wide range of features, including JSONB, full-text search, and a variety of indexing options.
    *   **Open Source:** PostgreSQL is an open-source project with a large and active community.
*   **Cons:**
    *   **Complexity:** PostgreSQL can be more complex to manage than some other databases.
    *   **Performance:** While PostgreSQL is generally performant, it may not be the best choice for all use cases. We will need to carefully monitor and optimize our database performance.
