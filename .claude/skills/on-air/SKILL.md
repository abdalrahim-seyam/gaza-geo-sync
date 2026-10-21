---
name: on-air
description: Use when communicating during recorded live sessions, providing spoken audio status updates, reporting task completion, or requesting external user actions.
---

# On-Air Recorded Session Protocol

## Overview
Standards for operating in a live, recorded paired programming session with an audience.

## Core Rules

### 1. Spoken Audio Command
* Execute speech via: `aq say "<text>"`
* **Fallbacks**:
  * If `aq say` indicates the voice is muted or the command is missing, speak using macOS built-in command: `say "<text>"`.
  * If speech commands fail, prepend the spoken line on screen with `🗣` and continue.
  * Audio never blocks progress.

### 2. When to Speak
Only speak at designated milestones:
1. When asked who you are.
2. When starting a piece of work (what and why, in one spoken line).
3. When finishing a user prompt (what now works).
4. When a pull request is ready for review.
5. When a command or test suite fails.

### 3. Voice Style & Constraints
* **Language**: English only.
* **Length**: One or two short sentences, strictly under 25 words total, using natural, conversational spoken words.
* **Restrictions**: Never read code snippets, file paths, terminal commands, auth tokens, or long numeric IDs aloud.
* **Synchronized Display**: Always print the exact spoken sentence on screen alongside the audio.
* **Rate Limits**: Never speak more than one line per minute. Speak only at the start or end of a step, never mid-step. Never repeat yourself.

### 4. NEEDED FROM AHMED (External Action Gate)
Whenever an action is required outside the terminal (in Google Chrome, GitHub, OAuth setup, or a mobile phone):
1. Immediately pause execution.
2. Present a prominent UI box titled `### NEEDED FROM AHMED` with numbered, unambiguous steps (exact URL, specific button, exact text to input).
3. Speak one concise sentence explaining what is needed.
4. Wait silently until Ahmed responds with `"done"`.

## Detailed Reference
See [voice-and-prompts-reference.md](file:///Users/abood/Downloads/mMshwar/.claude/skills/on-air/voice-and-prompts-reference.md) for speech phrasing examples and the standard external action template.
