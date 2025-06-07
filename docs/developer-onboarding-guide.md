# Developer Onboarding Guide

Welcome to the Hospital Management System (HMS) development team! This guide will walk you through the process of setting up your development environment and getting started with the project.

## 1. Prerequisites

Before you begin, ensure you have the following software installed on your system:

*   **Node.js:** v18.x or later
*   **pnpm:** v8.x or later
*   **Java:** OpenJDK 17 or later
*   **Maven:** v3.8.x or later
*   **Docker:** v20.x or later
*   **Docker Compose:** v2.x or later
*   **Git:** v2.x or later

## 2. Getting Started

### 2.1. Clone the Repository

Clone the project repository from GitHub:

```bash
git clone https://github.com/jashmhta/Hospital-Management-System.git
cd Hospital-Management-System
```

### 2.2. Install Dependencies

The project uses pnpm for package management. Install the dependencies using the following command:

```bash
pnpm install
```

This will install all the necessary Node.js packages for the frontend and backend services.

### 2.3. Environment Variables

The project uses environment variables for configuration. Create a `.env` file in the root of the project and add the following variables:

```bash
# PostgreSQL Database
DATABASE_URL="postgresql://user:password@localhost:5432/hms"

# Redis
REDIS_URL="redis://localhost:6379"

# NextAuth
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-secret-here"

# Cloudflare D1 (if used)
CLOUDFLARE_D1_DATABASE_ID="your-d1-database-id"
CLOUDFLARE_D1_API_TOKEN="your-d1-api-token"
```

Replace the placeholder values with your actual configuration.

## 3. Running the Application

### 3.1. Database Setup

The project uses PostgreSQL for its primary database. You can start a PostgreSQL instance using Docker Compose:

```bash
docker-compose up -d postgres
```

Once the database is running, you can apply the database migrations:

```bash
pnpm db:migrate
```

### 3.2. Start the Development Servers

To start the development servers for the frontend and backend, run the following command:

```bash
pnpm dev
```

This will start the Next.js frontend on `http://localhost:3000` and the backend services on their respective ports.

## 4. Running Tests

The project has a comprehensive test suite. To run all tests, use the following command:

```bash
pnpm test
```

To run specific types of tests, you can use the following commands:

*   `pnpm test:unit`: Run unit tests
*   `pnpm test:component`: Run component tests
*   `pnpm test:integration`: Run integration tests
*   `pnpm test:e2e`: Run end-to-end tests

## 5. Code Quality

The project uses ESLint and Prettier for code quality. To check for linting errors, run:

```bash
pnpm lint:check
```

To automatically fix linting errors, run:

```bash
pnpm lint
```

To format the code, run:

```bash
pnpm format
```
