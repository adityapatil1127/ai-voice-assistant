# 🏗️ Architecture & Design

## System Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                        Web Browser (Client)                      │
├─────────────────────────────────────────────────────────────────┤
│  React Frontend (Port 3000)                                      │
│  ├── ChatInterface Component                                     │
│  ├── VoiceInput Component (Speech-to-Text)                       │
│  └── VoiceOutput Component (Text-to-Speech)                      │
├─────────────────────────────────────────────────────────────────┤
│              HTTP/REST API (Port 8080)                           │
├─────────────────────────────────────────────────────────────────┤
│  Spring Boot Backend                                             │
│  ├── ChatController (REST Endpoints)                             │
│  ├── ChatService (Business Logic)                                │
│  ├── Spring AI (Gemini Integration)                              │
│  ├── Message & User Entities                                     │
│  └── Repository Layer (Data Access)                              │
├─────────────────────────────────────────────────────────────────┤
│              JDBC/MySQL Protocol (Port 3306)                     │
├─────────────────────────────────────────────────────────────────┤
│  MySQL Database                                                  │
│  ├── users table                                                 │
│  └── messages table                                              │
└─────────────────────────────────────────────────────────────────┘
```

## Request Flow

### 1. User Sends Text Message

```
User Input
    ↓
React Form Submit
    ↓
Axios POST to /api/chat/send
    ↓
ChatController.sendMessage()
    ↓
ChatService.chat()
    ↓
Spring AI Client.chat()
    ↓
Google Gemini API
    ↓
AI Response Received
    ↓
Message Entity Saved to MySQL
    ↓
Response Returned to Frontend
    ↓
React Displays Response
    ↓
Text-to-Speech Plays Audio
```

### 2. User Sends Voice Message

```
User Clicks "🎤 Voice Input"
    ↓
Web Speech API Initializes
    ↓
User Speaks
    ↓
Speech Recognition converts to Text
    ↓
User Confirms Transcript
    ↓
Text Input Field Populated
    ↓
[Same as Text Message Flow]
```

## Component Hierarchy

```
App
├── Header
│   ├── Title
│   └── Status Indicator
└── ChatInterface
    ├── Chat Messages Section
    │   ├── User Message Bubble
    │   └── AI Response Bubble
    ├── Input Section
    │   ├── Text Input Field
    │   ├── Send Button
    │   ├── Voice Input Button
    │   ├── Clear Chat Button
    │   └── VoiceInput Component
    │       ├── Start/Stop Button
    │       └── Transcript Display
    └── Footer
```

## Data Models

### User Entity
```
User {
  id: Long (Primary Key)
  username: String (Unique)
  email: String (Unique)
  createdAt: LocalDateTime
}
```

### Message Entity
```
Message {
  id: Long (Primary Key)
  userId: Long (Foreign Key)
  userMessage: String (LONGTEXT)
  aiResponse: String (LONGTEXT)
  createdAt: LocalDateTime
}
```

### ChatRequest DTO
```
ChatRequest {
  message: String
  userId: Long
}
```

### ChatResponse DTO
```
ChatResponse {
  response: String
  messageId: Long
  timestamp: String
}
```

## API Contract

### Endpoint: POST /api/chat/send
**Purpose:** Send message and receive AI response

**Request:**
```json
{
  "message": "Hello, how are you?",
  "userId": 1
}
```

**Response:** (200 OK)
```json
{
  "response": "I'm doing great! How can I help?",
  "messageId": 123456,
  "timestamp": "1718520000000"
}
```

**Error Response:** (500 Internal Server Error)
```json
{
  "response": "Sorry, I encountered an error: [error details]",
  "messageId": null,
  "timestamp": null
}
```

### Endpoint: GET /api/chat/history/{userId}
**Purpose:** Retrieve chat history for a user

**Response:** (200 OK)
```json
[
  {
    "id": 1,
    "userMessage": "Hello",
    "aiResponse": "Hi there!",
    "userId": 1,
    "createdAt": "2024-06-15T10:30:00"
  },
  {
    "id": 2,
    "userMessage": "How are you?",
    "aiResponse": "I'm doing great!",
    "userId": 1,
    "createdAt": "2024-06-15T10:31:00"
  }
]
```

### Endpoint: DELETE /api/chat/clear/{userId}
**Purpose:** Clear all messages for a user

**Response:** (200 OK)
```json
{
  "message": "History cleared successfully"
}
```

### Endpoint: GET /api/chat/health
**Purpose:** Health check endpoint

**Response:** (200 OK)
```json
{
  "status": "AI Voice Assistant Backend is running"
}
```

## Technology Decisions

### Spring Boot 3.2
- Latest LTS version with excellent Spring AI support
- Built-in error handling and validation
- Excellent performance and security features
- Wide community support

### Spring AI 1.0
- Native Gemini API integration
- Abstraction over multiple AI providers (easy to switch)
- Built-in prompt templating and parsing
- Support for streaming responses

### React 18
- Hooks for functional components
- Excellent performance with virtual DOM
- Rich ecosystem for UI components
- Strong developer experience

### MySQL 8.0
- ACID compliance for reliable transactions
- Full-text search capabilities (future enhancement)
- Strong JSON support
- Excellent performance with proper indexing

### Web Speech API
- No additional library needed
- Native browser support (Chrome, Edge, Safari)
- Good accuracy for most use cases
- Free to use

## Scalability Considerations

### Horizontal Scaling
- Backend can be deployed across multiple instances behind a load balancer
- Stateless REST API enables easy scaling
- MySQL replication for database scaling

### Caching
- Redis can be added for conversation caching
- Response caching for frequently asked questions
- Session caching for user data

### Database Optimization
- Proper indexes on userId and createdAt columns
- Partitioning messages table by date (future)
- Archive old messages to separate storage

### Frontend Optimization
- Lazy loading of chat messages
- Virtual scrolling for large chat histories
- Service Workers for offline capability
- Code splitting for faster initial load

## Security Measures

### Currently Implemented
- CORS configuration to restrict API access
- Input validation on both frontend and backend
- Environment variables for sensitive data (API keys)
- SQL injection prevention via ORM (Spring Data JPA)

### Recommended Future Enhancements
- JWT authentication for user sessions
- Rate limiting to prevent abuse
- HTTPS/TLS for data in transit
- API key rotation mechanism
- Audit logging for all API calls
- Data encryption at rest for sensitive messages

## Error Handling Strategy

### Frontend Error Handling
```javascript
try {
  const response = await axios.post(url, data);
  // Handle success
} catch (error) {
  // Display user-friendly error message
  // Log error for debugging
  // Retry mechanism for network errors
}
```

### Backend Error Handling
```java
try {
  String response = chatClient.chat(message);
  messageRepository.save(message);
  return response;
} catch (Exception e) {
  logger.error("Chat error:", e);
  return "Sorry, I encountered an error: " + e.getMessage();
}
```

## Performance Metrics

### Target Metrics
- API Response Time: < 2 seconds
- Chat Message Display: < 500ms
- Voice Recognition Time: < 3 seconds
- Database Query Time: < 100ms

### Monitoring Tools
- Spring Boot Actuator for metrics
- Application Performance Monitoring (APM)
- Error tracking with Sentry or similar
- Real User Monitoring (RUM) with analytics

## Deployment Pipeline

```
Code Commit
    ↓
GitHub Actions (or similar CI/CD)
    ↓
Run Tests
    ↓
Build Docker Images
    ↓
Push to Registry
    ↓
Deploy to Production
    ↓
Health Checks
    ↓
Monitor Performance
```

## Future Enhancements

### Phase 2
- User authentication with JWT
- Multi-language support
- Conversation context management
- User preferences and settings

### Phase 3
- Real-time chat with WebSocket
- Conversation search and filtering
- Analytics dashboard
- Admin panel

### Phase 4
- Mobile app (React Native)
- Offline functionality
- Advanced AI features (vision, document analysis)
- Enterprise features (SSO, compliance)
