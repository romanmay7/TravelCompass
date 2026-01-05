# ✈️ TravelCompass

TravelCompass is a full-stack AI-powered travel planning application. It uses a microservices architecture to generate high-fidelity, day-by-day itineraries based on user preferences.

## 🏗️ Architecture
![Project Architecture](./assets/TravelCompass%20-%20ARCHITECTURE.jpg)

---
The system consists of three main components:
* **Core API (Spring Boot):** Handles user authentication (JWT & Google OAuth2), plan management, and Redis caching.
* **AI Worker (Spring Boot):** Processes travel requests asynchronously via Kafka and generates itineraries using AI.
* **Frontend (React):** A modern UI featuring real-time polling for plan updates.

## 🛠️ Tech Stack

| Component | Technology |
| :--- | :--- |
| **Backend** | Java 17, Spring Boot 3.4.1, Spring Security |
| **Database** | MongoDB |
| **Caching** | Redis (Jackson JSON Serialization) |
| **AI Integration** | Google Gemini Pro |
| **Maps** | Google Maps Platform |
| **Messaging** | Apache Kafka |

---


## 🚀 Getting Started

### 1. Prerequisites
* Docker & Docker Compose
* Java 17+
* Google Cloud Console Credentials (for OAuth2)

### 2. Backend Configuration
Create an `application.properties` in `travel-compass-core/src/main/resources`:

```properties
# MongoDB
spring.data.mongodb.uri=mongodb://localhost:27017/travel_compass

# Redis
spring.data.redis.host=localhost
spring.data.redis.port=6379

# Google OAuth2
spring.security.oauth2.client.registration.google.client-id=YOUR_CLIENT_ID
spring.security.oauth2.client.registration.google.client-secret=YOUR_CLIENT_SECRET

## 🔑 Environment Variables (`.env`)

For security, sensitive keys should be stored in a `.env` file in the root directory. **Never commit this file to version control.**

```bash
# AI & External APIs
GEMINI_API_KEY=your_gemini_pro_key_here
GOOGLE_MAPS_KEY=your_google_maps_api_key_here

# Security
JWT_SECRET=your_super_secret_random_string_here

# OAuth2 (Backend)
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret