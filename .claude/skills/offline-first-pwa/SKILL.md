---
name: offline-first-pwa
description: Use when implementing data storage, network synchronization, caching strategies, photo handling, service workers, or offline UI states.
---

# Offline-First PWA

## Overview
Standards and behaviors for operating reliably under severe, intermittent, or absent network connectivity in the Gaza Strip.

## Core Rules

### 1. Zero-Network Boot
* The application shell, static assets, and last-known data must load completely when disconnected.
* Initial render must never block on a network request.

### 2. Local Outbox (IndexedDB)
* Every mutation (creating a trip, booking a seat, sending an offer) writes to an IndexedDB outbox table first.
* The UI immediately provides optimistic feedback with clear Arabic status copy:  
  `"محفوظ على هذا الهاتف، سيتم الإرسال فور الاتصال"` (Saved on this phone, will send when online).

### 3. Lightweight Delta Sync & Data Age
* Sync payloads must strictly transfer changes since the last sync timestamp (`updatedAfter`), keeping payloads minimal.
* Enforce a hard byte budget per sync request (tested in CI).
* Always visibly state data freshness to the user (e.g. `"آخر تحديث: منذ ١٥ دقيقة"`).

### 4. Photo Sync Constraints
* Photos are completely excluded from the normal delta sync.
* Downloaded photos are cached locally in CacheStorage for offline viewing.
* Uploading and downloading vehicle photos occurs **only** on Wi-Fi or unmetered connections.
* Since iOS Safari does not report network metered status reliably, default photo sync to **OFF** on Safari, providing a manual `"تنزيل الصور الآن"` button and an `"على شبكة Wi-Fi فقط"` setting.

### 5. Conflict Resolution
* Seat reservation conflicts are resolved server-side: first confirmed booking wins.
* If a conflict occurs during outbox reconciliation, rollback local state cleanly and present a native banner explaining the outcome.

## Detailed Reference
See [sync-reference.md](file:///Users/abood/Downloads/mMshwar/.claude/skills/offline-first-pwa/sync-reference.md) for IndexedDB outbox structures, byte budget assertions, and sync protocols.
