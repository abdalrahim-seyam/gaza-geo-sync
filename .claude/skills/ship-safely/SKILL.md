---
name: ship-safely
description: Use when creating feature branches, preparing pull requests, verifying release milestones, or handling branch integrations.
---

# Ship Safely Workflow

## Overview
Protocol for integrating code safely into `main` using automated fleet QA validation. Direct pushes to `main` are strictly prohibited.

## Core Rules

### 1. Branching & Pull Requests
* Every milestone requires its own isolated branch and pull request. Never push directly to `main`.
* PR descriptions must explicitly state in plain language:
  1. **What a user can now do**.
  2. **What was cut or deferred**.
  3. **How to see and verify the feature**.

### 2. Fleet QA Verification
* The automated fleet QA runner evaluates every PR within 1–2 minutes without relying on GitHub Actions.
* The runner posts **one** structured "Fleet QA" comment containing check results, phone-sized screenshots, and sets the `fleet-qa` commit status check.
* **Strict Merge Gates**:
  * Wait for the fleet QA comment and inspect all results.
  * Never merge on red / failing checks.
  * Never merge until Ahmed explicitly gives the command to merge.

### 3. QA Runner Integration
* The repository must satisfy the automated testing contract at all times.
* See [fleet-qa](file:///Users/abood/Downloads/mMshwar/.claude/skills/fleet-qa/SKILL.md) for the exact technical contract (scripts, database migrations, routes, and QA endpoints).

## Detailed Reference
See [workflow-reference.md](file:///Users/abood/Downloads/mMshwar/.claude/skills/ship-safely/workflow-reference.md) for the standard PR template and merge checklist.
