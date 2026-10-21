---
name: fleet-qa
description: Use when configuring npm scripts, database schemas, automated QA routes, test authentication endpoints, or preparing for automated fleet runner inspection.
---

# Fleet QA Runner Contract

## Overview
Technical requirements and repository contracts necessary for the automated fleet QA runner to execute tests, take phone-sized screenshots, and validate PRs.

## Core Contract Requirements

### 1. Mandatory `package.json` Scripts
* `npm run build`: Compiles production assets.
* `npm test`: Runs local unit tests.
* `npm start`: Starts the application server (must respect the `PORT` environment variable).
* **Optional Scripts**:
  * `npm run qa:seed`: Seeds database with realistic demo trips, drivers, and riders.
  * `npm run qa:e2e`: Executes browser tests reading the target URL from `BASE_URL`.

### 2. Database Migrations
* Use Prisma schema migrations (`prisma migrate deploy`).
* The QA runner provides a fresh PostgreSQL database instance via the `DATABASE_URL` environment variable.

### 3. Screenshot Routes (`qa/routes.txt`)
* Define screens for the runner to photograph, formatted as one line per view:
  ```text
  <guest|driver|rider> <path> <short-name>
  ```
* Example:
  ```text
  guest / landing-page
  driver /offer create-trip-screen
  rider /trips available-trips-list
  ```

### 4. QA Auth Endpoint (`GET /api/qa-login`)
* Accepts query parameter `?role=driver|rider` to instantly sign in a demo user.
* **Security & Isolation Gate**:
  * Exists **only** when `QA_MODE=1`.
  * When `QA_MODE` is unset or false, the endpoint must return a strict `404 Not Found`.
  * Production environments must never enable `QA_MODE`.
  * A dedicated unit test must assert that `GET /api/qa-login` returns 404 when `QA_MODE` is not set.
  * The application must launch successfully in QA mode without requiring any Google OAuth credentials.

## Detailed Reference
See [runner-contract-reference.md](file:///Users/abood/Downloads/mMshwar/.claude/skills/fleet-qa/runner-contract-reference.md) for endpoint patterns and unit test examples.
