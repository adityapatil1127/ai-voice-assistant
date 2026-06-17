# 🎤 AI Voice Assistant

A full-stack AI-powered voice assistant application built with Spring Boot, React, and Google Gemini API. Users can interact through voice and text commands with real-time responses.

## 🚀 Features

- **Voice Input** (Speech-to-Text): Convert spoken words to text using Web Speech API
- **Voice Output** (Text-to-Speech): Hear AI responses read aloud
- **Real-time Chat**: Interactive conversation interface with message history
- **Gemini AI Integration**: Powered by Google's Gemini 2.0 Flash model
- **Conversation Persistence**: Store chat history in MySQL database
- **Responsive Design**: Works seamlessly on desktop and mobile
- **RESTful API**: Well-structured backend APIs for extensibility

## 📋 Tech Stack

### Backend
- **Spring Boot 3.2** - Web framework
- **Spring Data JPA** - Data persistence layer
- **Spring AI** - AI/ML integration with Gemini
- **MySQL 8.0** - Database
- **Maven** - Build tool

### Frontend
- **React 18** - UI library
- **Axios** - HTTP client
- **Web Speech API** - Voice I/O
- **CSS3** - Styling & animations

## 📦 Prerequisites

### Required
- **Java 17+** - For Spring Boot backend
- **Node.js 16+** - For React frontend
- **MySQL 8.0+** - For data persistence
- **Google Gemini API Key** - Get from [Google AI Studio](https://aistudio.google.com)

### Recommended
- **Git** - For version control
- **VS Code** or **IntelliJ IDEA** - Code editor
- **Postman** - API testing

## 🛠️ Installation & Setup

### 1. Database Setup

Create a MySQL database:

```sql
CREATE DATABASE voice_assistant;
CREATE USER 'root'@'localhost' IDENTIFIED BY 'root';
GRANT ALL PRIVILEGES ON voice_assistant.* TO 'root'@'localhost';
FLUSH PRIVILEGES;
```

### 2. Backend Setup

```bash
# Navigate to backend directory
cd backend

# Install dependencies (Maven will download automatically)
mvn clean install

# Set Gemini API key (choose one method)
# Option A: Environment variable
export GEMINI_API_KEY=your-api-key-here

# Option B: Edit src/main/resources/application.yml
# Find the line: api-key: ${GEMINI_API_KEY:your-api-key-here}
# Replace with your actual API key

# Run the Spring Boot application
mvn spring-boot:run
```

The backend will start on `http://localhost:8080`

### 3. Frontend Setup

```bash
# Navigate to frontend directory
cd frontend

# Install dependencies
npm install

# Start the React development server
npm start
```

The frontend will automatically open at `http://localhost:3000`

## 🎯 Usage

1. **Start the Backend**: Ensure Spring Boot is running on port 8080
2. **Start the Frontend**: React dev server on port 3000
3. **Send Messages**:
   - Type a message and click "Send"
   - Or use "🎤 Voice Input" button to speak your message
4. **Hear Responses**: AI responses are automatically read aloud (if enabled)
5. **View History**: All conversations are saved and displayed
6. **Clear Chat**: Click "🗑️ Clear" to clear chat history

## 📁 Project Structure

```
voice-assistant/
├── backend/
│   ├── pom.xml
│   └── src/main/java/com/voiceassistant/
│       ├── VoiceAssistantApplication.java
│       ├── controller/
│       │   └── ChatController.java
│       ├── service/
│       │   └── ChatService.java
│       ├── entity/
│       │   ├── Message.java
│       │   └── User.java
│       ├── repository/
│       │   ├── MessageRepository.java
│       │   └── UserRepository.java
│       └── dto/
│           ├── ChatRequest.java
│           └── ChatResponse.java
│   └── src/main/resources/
│       └── application.yml
│
├── frontend/
│   ├── package.json
│   ├── public/
│   │   └── index.html
│   └── src/
│       ├── App.js
│       ├── App.css
│       ├── index.js
│       ├── index.css
│       ├── components/
│       │   ├── ChatInterface.js
│       │   ├── VoiceInput.js
│       │   └── VoiceOutput.js
│       └── styles/
│           ├── ChatInterface.css
│           └── VoiceInput.css
│
└── README.md
```

## 🔌 API Endpoints

### Chat Endpoints

**POST** `/api/chat/send`
- Send a message and get AI response
- Request:
  ```json
  {
    "message": "Hello, how are you?",
    "userId": 1
  }
  ```
- Response:
  ```json
  {
    "response": "I'm doing great! How can I help you today?",
    "messageId": 123,
    "timestamp": "1718520000000"
  }
  ```

**GET** `/api/chat/history/{userId}`
- Retrieve user's chat history
- Response: Array of Message objects

**DELETE** `/api/chat/clear/{userId}`
- Clear all messages for a user
- Response: `{"message": "History cleared successfully"}`

**GET** `/api/chat/health`
- Health check endpoint
- Response: `{"status": "AI Voice Assistant Backend is running"}`

## 🔑 Environment Configuration

Create a `.env` file in the backend root:

```bash
GEMINI_API_KEY=your-gemini-api-key-here
MYSQL_USER=root
MYSQL_PASSWORD=root
MYSQL_DATABASE=voice_assistant
```

Or set in `application.yml`:

```yaml
spring:
  ai:
    google:
      gemini:
        api-key: your-api-key-here
  datasource:
    url: jdbc:mysql://localhost:3306/voice_assistant
    username: root
    password: root
```

## 🔄 Data Flow

1. **User Input**: User types or speaks a message
2. **Frontend**: React sends request to backend via Axios
3. **Backend**: ChatService receives request and calls Gemini API
4. **Gemini**: Returns AI-generated response
5. **Database**: Message saved to MySQL via Spring Data JPA
6. **Response**: Backend returns response to frontend
7. **Output**: Frontend displays and speaks the response

## 🎨 Customization

### Change AI Model
Edit `application.yml`:
```yaml
spring:
  ai:
    google:
      gemini:
        chat:
          options:
            model: gemini-pro  # or gemini-2.0-flash
```

### Adjust Voice Settings
In `VoiceOutput.js`:
```javascript
utterance.rate = 1.0;    // Speed (0.5-2.0)
utterance.pitch = 1.0;   // Pitch (0.5-2.0)
utterance.volume = 1.0;  // Volume (0-1)
```

### Customize UI Colors
Edit CSS variables in `App.css`:
```css
/* Change the gradient colors */
background: linear-gradient(135deg, #your-color1 0%, #your-color2 100%);
```

## 🚀 Deployment

### Deploy Backend (Spring Boot)

**AWS EC2:**
```bash
# Build JAR
mvn clean package

# Copy to EC2 instance
scp -i your-key.pem target/voice-assistant-1.0.0.jar ec2-user@your-instance:/home/ec2-user/

# Run on EC2
java -Dspring.datasource.url=jdbc:mysql://RDS_ENDPOINT:3306/voice_assistant \
     -DGEMINI_API_KEY=your-key \
     -jar voice-assistant-1.0.0.jar
```

**Docker:**
```dockerfile
FROM maven:3.8-openjdk-17 as builder
WORKDIR /app
COPY . .
RUN mvn clean package

FROM openjdk:17-slim
COPY --from=builder /app/target/voice-assistant-1.0.0.jar app.jar
EXPOSE 8080
ENTRYPOINT ["java", "-jar", "app.jar"]
```

### Deploy Frontend (React)

**Vercel:**
```bash
npm install -g vercel
vercel
```

**Netlify:**
```bash
npm run build
# Deploy the `build` folder to Netlify
```

**AWS S3 + CloudFront:**
```bash
npm run build
aws s3 sync build/ s3://your-bucket-name/
```

## 🐛 Troubleshooting

### Backend won't start
- Check MySQL is running: `systemctl status mysql`
- Verify API key is set: `echo $GEMINI_API_KEY`
- Check Java version: `java -version` (should be 17+)

### Frontend can't connect to backend
- Ensure backend is running on port 8080
- Check CORS is enabled in `VoiceAssistantApplication.java`
- Verify firewall allows port 8080

### Voice input not working
- Check browser supports Web Speech API (Chrome, Edge, Safari)
- Verify microphone permissions are granted
- Check browser console for errors

### Database connection failed
- Verify MySQL is running
- Check credentials in `application.yml`
- Confirm database `voice_assistant` exists

## 📚 Learning Resources

- [Spring Boot Documentation](https://spring.io/projects/spring-boot)
- [Spring AI Documentation](https://spring.io/projects/spring-ai)
- [React Documentation](https://react.dev)
- [Google Gemini API](https://ai.google.dev)
- [Web Speech API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Speech_API)

## 📝 License

MIT License - Feel free to use this project for personal or commercial purposes.

## 💡 Future Enhancements

- [ ] User authentication & authorization
- [ ] Multi-language support
- [ ] Conversation context management
- [ ] File upload for context
- [ ] Custom voice profiles
- [ ] Rate limiting & usage analytics
- [ ] Mobile app (React Native)
- [ ] WebSocket for real-time streaming

## 👨‍💻 Author

Built by Aditya for portfolio and interview purposes.

## 🤝 Contributing

Feel free to fork and submit pull requests for improvements!

## ❓ Questions & Support

For issues or questions, check the troubleshooting section or open an issue in the repository.

---

**Happy coding! 🚀**
