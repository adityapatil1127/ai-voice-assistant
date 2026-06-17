# 🚀 Quick Start Guide

Get the AI Voice Assistant up and running in 5 minutes!

## Prerequisites Checklist
- [ ] Java 17+ installed
- [ ] Node.js 16+ installed
- [ ] MySQL 8.0+ installed
- [ ] Google Gemini API key (free from Google AI Studio)

## Step 1: Get Your Gemini API Key (2 min)
1. Visit https://aistudio.google.com
2. Click "Get API Key"
3. Create a new API key
4. Copy the key (you'll use this later)

## Step 2: Setup Database (1 min)
```bash
# Open MySQL client
mysql -u root -p

# Run these commands
CREATE DATABASE voice_assistant;
EXIT;
```

## Step 3: Start Backend (1 min)
```bash
cd backend

# Set your API key (Linux/Mac)
export GEMINI_API_KEY=your-api-key-here

# Or for Windows PowerShell
$env:GEMINI_API_KEY="your-api-key-here"

# Start the server
mvn spring-boot:run
```

Wait for: `Started VoiceAssistantApplication`

## Step 4: Start Frontend (1 min)
```bash
# Open new terminal
cd frontend

npm install

npm start
```

The browser will open automatically at `http://localhost:3000`

## Step 5: Test It Out! (0 min)
1. Type a message: "Hello, what's your name?"
2. Click "Send"
3. See the AI response appear
4. Click "🎤 Voice Input" and speak to try voice features

## ✅ You're Done!

### Next Steps
- Try voice input with different languages
- Check the full README.md for customization options
- Explore the codebase structure
- Deploy to cloud (AWS, Vercel, etc.)

## Common Issues?

**Backend won't start:**
- Is MySQL running? Check `mysql --version`
- Is the API key set? Check `echo $GEMINI_API_KEY`

**Frontend can't connect:**
- Is backend running on 8080? Check `http://localhost:8080/api/chat/health`

**Voice not working:**
- Use Chrome/Edge browser (better Web Speech API support)
- Check microphone permissions

## 📞 Need Help?
See the Troubleshooting section in README.md
