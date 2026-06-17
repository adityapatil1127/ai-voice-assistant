import React, { useState, useEffect } from 'react';
import ChatInterface from './components/ChatInterface';
import './App.css';

function App() {
  const [userId] = useState(1); // Simple user ID for demo
  const [connected, setConnected] = useState(false);

  useEffect(() => {
    // Check backend connection
    fetch('http://localhost:8080/api/chat/health')
      .then(res => res.json())
      .then(data => {
        console.log('Backend connected:', data);
        setConnected(true);
      })
      .catch(err => {
        console.log('Backend not available:', err);
        setConnected(false);
      });
  }, []);

  return (
    <div className="app-container">
      <header className="app-header">
        <h1>🎤 AI Voice Assistant</h1>
        <span className={`status ${connected ? 'connected' : 'disconnected'}`}>
          {connected ? '🟢 Connected' : '🔴 Offline'}
        </span>
      </header>

      <main className="app-main">
        {connected ? (
          <ChatInterface userId={userId} />
        ) : (
          <div className="connection-error">
            <h2>⚠️ Connection Error</h2>
            <p>Unable to connect to the backend server.</p>
            <p>Make sure the Spring Boot backend is running on http://localhost:8080</p>
          </div>
        )}
      </main>

      <footer className="app-footer">
        <p>Built with Spring Boot, React, and Google Gemini API</p>
      </footer>
    </div>
  );
}

export default App;
