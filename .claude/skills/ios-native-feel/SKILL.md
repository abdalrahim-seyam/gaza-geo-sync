---
name: ios-native-feel
description: Use when developing user interfaces, styling components, handling touch interactions, configuring viewports, or setting design tokens for mobile Safari.
---

# iOS Native Feel Standard

## Overview
Front-end requirements to ensure the web application behaves indistinguishably from an App Store native app, specifically optimized for iPhone Safari.

## Core Rules

### 1. Viewport & Standalone Display
* Full PWA manifest setup: standalone display mode, Apple touch icons, theme colors, and splash screens.
* Respect hardware notches and home indicators using `env(safe-area-inset-top)` and `env(safe-area-inset-bottom)`.
* Use dynamic viewport height (`100dvh`) to avoid layout jumps when the Safari URL bar collapses or expands.

### 2. Accidental Zoom Prevention
* All input text fields must have a `font-size` of at least `16px` (smaller sizes trigger Safari's auto-zoom on focus).
* Ensure all elements stay strictly within the screen boundary (`max-w-full`, `overflow-x-hidden`).
* Apply `touch-action: manipulation` across touchable targets to disable the double-tap zoom delay.

### 3. Native App UI Controls & Touch Ergonomics
* Main navigation resides in a fixed bottom tab bar.
* Use draggable bottom sheets instead of centered desktop modal pop-ups.
* All interactive touch targets must be at least `44px x 44px`.
* Eliminate hover-dependent states. Provide immediate active feedback on tap.
* Use skeleton screens instead of blocking spinners. Prevent layout shifts when dynamic data arrives.

### 4. Right-to-Left (RTL) & Arabic Typography
* Global RTL layout powered by CSS logical properties (`start`, `end`, `margin-inline`, `padding-inline`).
* Native system font stack with high-quality Arabic rendering (Cairo / System UI Arabic).

### 5. Design Tokens
* Maintain one unified, restricted token system for colors, spacing, and border radii across both light and dark themes.

## Detailed Reference
See [styling-reference.md](file:///Users/abood/Downloads/mMshwar/.claude/skills/ios-native-feel/styling-reference.md) for token definitions, safe-area layout snippets, and bottom-sheet specifications.
