# 📂 Project Structure Guide

Complete overview of all files in the AI Voice Assistant project.

## Directory Tree

```
voice-assistant/
│
├── README.md                           # Main documentation
├── QUICK_START.md                      # 5-minute setup guide
├── ARCHITECTURE.md                     # System design & architecture
├── DEPLOYMENT.md                       # Production deployment guide
├── docker-compose.yml                  # Docker Compose configuration
├── .gitignore                          # Git ignore rules
├── database-schema.sql                 # MySQL schema setup
│
├── backend/                            # Spring Boot Backend
│   ├── pom.xml                         # Maven dependencies & build config
│   ├── Dockerfile                      # Docker image for backend
│   │
│   └── src/main/
│       ├── java/com/voiceassistant/
│       │   ├── VoiceAssistantApplication.java     # Spring Boot entry point
│       │   │
│       │   ├── controller/
│       │   │   └── ChatController.java            # REST API endpoints
│       │   │
│       │   ├── service/
│       │   │   └── ChatService.java               # Business logic layer
│       │   │
│       │   ├── entity/
│       │   │   ├── Message.java                   # Message database entity
│       │   │   └── User.java                      # User database entity
│       │   │
│       │   ├── repository/
│       │   │   ├── MessageRepository.java         # Message data access
│       │   │   └── UserRepository.java            # User data access
│       │   │
│       │   └── dto/
│       │       ├── ChatRequest.java               # API request DTO
│       │       └── ChatResponse.java              # API response DTO
│       │
│       └── resources/
│           └── application.yml                    # Spring Boot config
│
└── frontend/                           # React Frontend
    ├── package.json                    # npm dependencies & scripts
    ├── Dockerfile                      # Docker image for frontend
    │
    ├── public/
    │   └── index.html                  # React HTML entry point
    │
    └── src/
        ├── index.js                    # React app initialization
        ├── index.css                   # Global styles
        ├── App.js                      # Root component
        ├── App.css                     # App component styles
        │
        ├── components/
        │   ├── ChatInterface.js        # Main chat UI component
        │   ├── VoiceInput.js           # Speech-to-text component
        │   └── VoiceOutput.js          # Text-to-speech utility
        │
        └── styles/
            ├── ChatInterface.css       # Chat interface styles
            └── VoiceInput.css          # Voice input styles
```

## File Descriptions

### Root Files

| File | Purpose | Size |
|------|---------|------|
| README.md | Comprehensive project documentation | 8KB |
| QUICK_START.md | 5-minute setup guide | 3KB |
| ARCHITECTURE.md | System design & scalability | 10KB |
| DEPLOYMENT.md | Production deployment guide | 12KB |
| docker-compose.yml | Multi-container orchestration | 1KB |
| .gitignore | Git exclusion rules | 2KB |
| database-schema.sql | MySQL initial setup | 1KB |

### Backend Files (Java/Spring Boot)

#### Main Application
- **VoiceAssistantApplication.java** (14 lines)
  - Spring Boot entry point
  - CORS configuration
  - Application initialization

#### Controllers (REST API)
- **ChatController.java** (49 lines)
  - POST /api/chat/send - Send message
  - GET /api/chat/history/{userId} - Get history
  - DELETE /api/chat/clear/{userId} - Clear history
  - GET /api/chat/health - Health check

#### Services (Business Logic)
- **ChatService.java** (50 lines)
  - chat() - Calls Gemini API
  - getUserMessages() - Retrieves history
  - clearUserMessages() - Clears history

#### Entities (Database Models)
- **User.java** (60 lines)
  - User database model
  - Properties: id, username, email, createdAt

- **Message.java** (70 lines)
  - Message database model
  - Properties: id, userMessage, aiResponse, userId, createdAt

#### Repositories (Data Access)
- **MessageRepository.java** (10 lines)
  - Spring Data JPA repository
  - Custom queries for messages

- **UserRepository.java** (10 lines)
  - Spring Data JPA repository
  - Find by username/email

#### DTOs (Data Transfer Objects)
- **ChatRequest.java** (30 lines)
  - Request payload model
  - Properties: message, userId

- **ChatResponse.java** (35 lines)
  - Response payload model
  - Properties: response, messageId, timestamp

#### Configuration
- **pom.xml** (80 lines)
  - Maven dependencies
  - Build configuration
  - Plugin management

- **application.yml** (30 lines)
  - Database configuration
  - Spring AI settings
  - Logging configuration

- **Dockerfile** (25 lines)
  - Multi-stage build
  - Optimized image size

### Frontend Files (React/JavaScript)

#### Main Components
- **App.js** (50 lines)
  - Root component
  - Backend health check
  - Header and footer

- **ChatInterface.js** (120 lines)
  - Main chat UI
  - Message management
  - Voice input integration
  - Message persistence

#### Sub-components
- **VoiceInput.js** (95 lines)
  - Speech-to-text
  - Web Speech API
  - Transcript display
  - Confirmation flow

- **VoiceOutput.js** (40 lines)
  - Text-to-speech utility
  - Speech Synthesis API
  - Voice control

#### Styling
- **App.css** (80 lines)
  - Main layout styles
  - Header/footer styling
  - Responsive design

- **ChatInterface.css** (200 lines)
  - Chat message styling
  - Input area layout
  - Animations
  - Scrollbar styling

- **VoiceInput.css** (180 lines)
  - Voice button styles
  - Listening indicator
  - Transcript display
  - Animations

#### Configuration
- **package.json** (35 lines)
  - React dependencies
  - Build scripts
  - Dev server config

- **index.html** (20 lines)
  - HTML entry point
  - Meta tags
  - Root div

- **Dockerfile** (25 lines)
  - Multi-stage build
  - Production serve

## File Statistics

### Code Lines
- Backend Java Code: ~350 lines
- Frontend JavaScript: ~300 lines
- Frontend CSS: ~500 lines
- Configuration: ~150 lines
- Documentation: ~1000 lines

### Total Project Size
- Uncompressed: ~2MB
- With node_modules: ~500MB (after npm install)
- With Maven cache: ~1GB (after mvn install)

## Key Technologies per File

### Backend
| File | Technology |
|------|-----------|
| VoiceAssistantApplication.java | Spring Boot 3.2 |
| ChatController.java | Spring Web |
| ChatService.java | Spring AI, Gemini API |
| Message.java | Spring Data JPA |
| MessageRepository.java | Spring Data |
| pom.xml | Maven 3.8 |

### Frontend
| File | Technology |
|------|-----------|
| App.js | React 18 |
| ChatInterface.js | React Hooks, Axios |
| VoiceInput.js | Web Speech API |
| VoiceOutput.js | Speech Synthesis API |
| package.json | npm 8+ |

## Configuration Files

### application.yml
```yaml
# Database (MySQL)
# Spring AI (Gemini)
# Logging levels
# Server port (8080)
```

### package.json
```json
{
  "dependencies": ["react", "axios", "react-scripts"],
  "scripts": ["start", "build", "test"]
}
```

### pom.xml
```xml
<dependencies>
  - Spring Boot Starter Web
  - Spring Boot Starter Data JPA
  - Spring AI Gemini
  - MySQL Connector
</dependencies>
```

## Environment Variables

### Backend (.env or system variables)
```
GEMINI_API_KEY=your-api-key-here
SPRING_DATASOURCE_URL=jdbc:mysql://localhost:3306/voice_assistant
SPRING_DATASOURCE_USERNAME=root
SPRING_DATASOURCE_PASSWORD=root
```

### Frontend (.env.local)
```
REACT_APP_API_URL=http://localhost:8080
```

## File Dependencies

### Backend
```
VoiceAssistantApplication.java
  ├── ChatController.java
  ├── ChatService.java
  │   ├── MessageRepository.java
  │   └── Spring AI Client
  ├── Message.java (Entity)
  ├── User.java (Entity)
  └── application.yml
```

### Frontend
```
App.js
  ├── ChatInterface.js
  │   ├── VoiceInput.js
  │   ├── VoiceOutput.js
  │   └── Axios (HTTP)
  └── App.css
```

## Building & Packaging

### Backend Build
```bash
mvn clean package
# Creates: target/voice-assistant-1.0.0.jar
```

### Frontend Build
```bash
npm run build
# Creates: build/ directory
```

### Docker Images
```bash
docker build -t voice-assistant-backend ./backend
docker build -t voice-assistant-frontend ./frontend
```

## Version Control

### .gitignore Excludes
- node_modules/
- target/ (Maven build)
- build/ (React build)
- .env files
- IDE configurations (.vscode, .idea)
- OS files (.DS_Store, Thumbs.db)

## Development Workflow

```
Source Code (GitHub)
    ↓
Development Server (npm start / mvn spring-boot:run)
    ↓
Local Testing (Postman, Browser)
    ↓
Build (npm run build / mvn package)
    ↓
Docker Images (docker build)
    ↓
Push to Registry
    ↓
Deploy to Production
```

## Maintenance Notes

### Regular Updates Needed
- **Dependencies**: npm packages (quarterly)
- **Java Libraries**: Maven dependencies (quarterly)
- **Security Patches**: OS and runtime updates (monthly)
- **Code Review**: Before each deployment
- **Database Backups**: Daily in production

### Log Files Location
- Backend: `logs/application.log`
- Frontend: Browser console
- Docker: `docker logs <container-id>`

## File Editing Guide

### To Add New Feature
1. Backend: Add entity → repository → service → controller
2. Frontend: Add component → integrate in App.js
3. Test locally
4. Commit to git
5. Deploy

### To Fix Bug
1. Write test case
2. Fix in code
3. Verify test passes
4. Commit with fix message
5. Deploy patch

---

This project is structured following:
- **Backend**: MVC pattern (Model-View-Controller)
- **Frontend**: Component-based architecture
- **Database**: Normalized relational model
- **APIs**: RESTful conventions

For more details, see the individual files or the main README.md.
