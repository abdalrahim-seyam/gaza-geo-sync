---
name: gaza-transit-domain
description: Use when implementing data models, business logic, route matching, vehicle selection, pricing, privacy rules, or UI copy for the Gaza transit application.
---

# Gaza Transit Domain Knowledge

## Overview
Domain logic and operational context for public transportation and carpooling in the Gaza Strip.

## Core Rules

### 1. Vehicle Classifications
Drivers set their vehicle type and capacity, and provide identifying vehicle photos for street recognition:
* **Car (سيارة ملاكي / عمومي)**: 4 to 7 passenger seats.
* **Bus / Minibus (باص / ميكروباص)**: Variable passenger capacity.
* **Ajala (عجلة)**: A passenger car towing an open passenger cart—the predominant transit vehicle today. Capacity configured by the driver.

### 2. Routes & Stops
* Each driver operates **one main daily route** represented as an ordered sequence of stops.
* Routes run along key transit spines: **Salah al-Din Road (شارع صلاح الدين)**, **Al-Rashid Coastal Road (شارع الرشيد الساحلي)**, and cross-connecting connector streets.
* Every route defines a first-trip departure time and starting location.

### 3. Fares & Journeys
* Fares are calculated **per seat, per leg**, in Israeli New Shekels (**ILS / شيكل**), set directly by the driver.
* A rider's full journey may require transferring between multiple vehicles.

### 4. Special Requests (طلبات خاصة)
* Riders can post private trip requests specifying: origin, destination, departure date/time, and required seats.
* Private vehicle drivers reply with price offers.
* Riders see each offer with driver name, vehicle classification, photos, and contact phone number.

### 5. UI Language & Tone
* Natural **Palestinian Arabic (عربي فلسطيني)** in a right-to-left layout.
* Written for non-technical riders and drivers. Technical jargon belongs strictly in source code.

### 6. Privacy & Location Sensitivity
* Collect and store the absolute minimum location data.
* Driver phone numbers appear alongside offers. Rider phone numbers are revealed to drivers only after an accepted booking or offer.
* Live location is shared only after explicit per-trip confirmation. Never retain historical location traces once a trip concludes.

### 7. Geographic Places
* All place names, neighborhoods, and coordinates must strictly originate from **OpenStreetMap (OSM)** data for the Gaza Strip. Never invent synthetic locations or coordinates.

## Detailed Reference
See [domain-reference.md](file:///Users/abood/Downloads/mMshwar/.claude/skills/gaza-transit-domain/domain-reference.md) for artery lists, terminology glossaries, and privacy data flow diagrams.
