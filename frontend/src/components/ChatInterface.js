import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import VoiceInput from './VoiceInput';
import VoiceOutput from './VoiceOutput';
import AudioVisualizer from './AudioVisualizer';
import '../styles/ChatInterface.css';

const PERSONAS = [
  { id: 'default', name: 'Friendly Assistant', icon: '🤖', description: 'Concise and helpful conversational assistant.' },
  { id: 'interviewer', name: 'Tech Interviewer', icon: '👨‍💻', description: 'Simulates a mock technical interviewer.' },
  { id: 'coach', name: 'Language Coach', icon: '🗣️', description: 'Gently corrects grammar and helps you practice.' },
  { id: 'motivator', name: 'Motivational Coach', icon: '🔥', description: 'Encouraging, high-energy advice.' }
];

function ChatInterface({ userId }) {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [showVoiceInput, setShowVoiceInput] = useState(false);
  const [persona, setPersona] = useState('default');
  const [visualizerState, setVisualizerState] = useState('idle');

  const [voices, setVoices] = useState([]);
  const [selectedVoice, setSelectedVoice] = useState('');
  const [speechRate, setSpeechRate] = useState(1.0);
  const [speechPitch, setSpeechPitch] = useState(1.0);

  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    loadChatHistory();
  }, [userId]);

  useEffect(() => {
    VoiceOutput.setListeners(
      () => setVisualizerState('speaking'),
      () => setVisualizerState('idle')
    );
    return () => {
      VoiceOutput.stop();
    };
  }, []);

  useEffect(() => {
    const loadVoices = () => {
      const availableVoices = VoiceOutput.getVoices();
      setVoices(availableVoices);
      if (availableVoices.length > 0 && !selectedVoice) {
        const defaultVoice = availableVoices.find(v => v.lang.startsWith('en') && v.name.includes('Google')) || 
                             availableVoices.find(v => v.lang.startsWith('en')) || 
                             availableVoices[0];
        setSelectedVoice(defaultVoice.name);
        VoiceOutput.setVoiceByName(defaultVoice.name);
      }
    };

    loadVoices();
    if (window.speechSynthesis) {
      window.speechSynthesis.onvoiceschanged = loadVoices;
    }
  }, [selectedVoice]);

  const loadChatHistory = async () => {
    try {
      const response = await axios.get(
        `http://localhost:8080/api/chat/history/${userId}`
      );
      const formattedHistory = [];
      response.data.forEach(msg => {
        formattedHistory.push({
          id: msg.id + '_user',
          text: msg.userMessage,
          type: 'user'
        });
        if (msg.aiResponse) {
          formattedHistory.push({
            id: msg.id + '_ai',
            text: msg.aiResponse,
            type: 'ai'
          });
        }
      });
      setMessages(formattedHistory);
    } catch (err) {
      console.log('No chat history found or error loading history');
    }
  };

  const sendMessage = async (messageText = input) => {
    if (!messageText.trim()) return;

    VoiceOutput.stop();

    const userMsg = {
      id: Date.now(),
      text: messageText,
      type: 'user'
    };

    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    try {
      const response = await axios.post(
        'http://localhost:8080/api/chat/send',
        {
          message: messageText,
          userId: userId,
          persona: persona
        }
      );

      const aiText = response.data.response;
      const aiMsg = {
        id: Date.now() + 1,
        text: aiText,
        type: 'ai'
      };

      setMessages(prev => [...prev, aiMsg]);
      VoiceOutput.speak(aiText);
    } catch (err) {
      console.error('Error sending message:', err);
      const errorMsg = {
        id: Date.now() + 1,
        text: 'Sorry, I encountered an error. Please check your backend connection and Gemini API key.',
        type: 'error'
      };
      setMessages(prev => [...prev, errorMsg]);
    } finally {
      setLoading(false);
    }
  };

  const handleVoiceInput = (transcript) => {
    setInput(transcript);
    setShowVoiceInput(false);
    sendMessage(transcript);
  };

  const clearChat = async () => {
    if (window.confirm('Are you sure you want to clear all chat history?')) {
      try {
        VoiceOutput.stop();
        await axios.delete(`http://localhost:8080/api/chat/clear/${userId}`);
        setMessages([]);
      } catch (err) {
        console.error('Error clearing chat:', err);
      }
    }
  };

  const handleVoiceChange = (e) => {
    const name = e.target.value;
    setSelectedVoice(name);
    VoiceOutput.setVoiceByName(name);
  };

  const handleRateChange = (e) => {
    const rate = parseFloat(e.target.value);
    setSpeechRate(rate);
    VoiceOutput.setRate(rate);
  };

  const handlePitchChange = (e) => {
    const pitch = parseFloat(e.target.value);
    setSpeechPitch(pitch);
    VoiceOutput.setPitch(pitch);
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    alert('Copied response to clipboard!');
  };

  return (
    <div className="chat-layout">
      {/* Settings Panel */}
      <div className="settings-panel">
        <h3>👤 Assistant Persona</h3>
        <div className="personas-list">
          {PERSONAS.map(p => (
            <div
              key={p.id}
              className={`persona-card ${persona === p.id ? 'active' : ''}`}
              onClick={() => setPersona(p.id)}
            >
              <span className="persona-icon">{p.icon}</span>
              <div className="persona-info">
                <h4>{p.name}</h4>
                <p>{p.description}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="divider" />

        <h3>⚙️ Voice Output Settings</h3>
        <div className="setting-group">
          <label htmlFor="voice-select">Voice Engine</label>
          <select
            id="voice-select"
            value={selectedVoice}
            onChange={handleVoiceChange}
            className="settings-select"
          >
            {voices.map(v => (
              <option key={v.name} value={v.name}>
                {v.name} ({v.lang})
              </option>
            ))}
          </select>
        </div>

        <div className="setting-group">
          <label htmlFor="speed-range">Speaking Speed: {speechRate}x</label>
          <input
            id="speed-range"
            type="range"
            min="0.5"
            max="2.0"
            step="0.1"
            value={speechRate}
            onChange={handleRateChange}
            className="settings-range"
          />
        </div>

        <div className="setting-group">
          <label htmlFor="pitch-range">Voice Pitch: {speechPitch}</label>
          <input
            id="pitch-range"
            type="range"
            min="0.5"
            max="1.5"
            step="0.1"
            value={speechPitch}
            onChange={handlePitchChange}
            className="settings-range"
          />
        </div>

        {visualizerState === 'speaking' && (
          <button onClick={() => VoiceOutput.stop()} className="stop-speech-button">
            Stop Speaking
          </button>
        )}
      </div>

      {/* Main Chat Assistant Panel */}
      <div className="chat-container">
        {/* Canvas Visualizer */}
        <AudioVisualizer state={visualizerState} />

        <div className="chat-messages">
          {messages.length === 0 ? (
            <div className="empty-state">
              <h2>👋 Welcome to AI Voice Assistant</h2>
              <p>Start speaking or typing to converse. Choose a persona in the sidebar for customized interactions!</p>
            </div>
          ) : (
            messages.map(msg => (
              <div key={msg.id} className={`message-group ${msg.type}`}>
                <div className="message-bubble">
                  <span className="message-label">
                    {msg.type === 'user' ? 'You' : msg.type === 'ai' ? 'Assistant' : 'Error'}
                  </span>
                  <p>{msg.text}</p>
                  
                  {msg.type === 'ai' && (
                    <div className="bubble-actions">
                      <button 
                        onClick={() => copyToClipboard(msg.text)} 
                        className="bubble-action-btn"
                        title="Copy to clipboard"
                      >
                        Copy Text
                      </button>
                      <button 
                        onClick={() => VoiceOutput.speak(msg.text)} 
                        className="bubble-action-btn"
                        title="Speak again"
                      >
                        Speak Aloud
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))
          )}
          {loading && (
            <div className="message-group ai loading">
              <div className="message-bubble">
                <span className="message-label">Assistant</span>
                <div className="typing-indicator">
                  <span></span>
                  <span></span>
                  <span></span>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        <div className="chat-input-area">
          <div className="input-group">
            <input
              type="text"
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyPress={e => e.key === 'Enter' && sendMessage()}
              placeholder="Type your message here or use voice input..."
              disabled={loading}
              className="text-input"
            />
            <button
              onClick={() => sendMessage()}
              disabled={loading || !input.trim()}
              className="send-button"
            >
              Send
            </button>
          </div>

          <div className="action-buttons">
            <button
              onClick={() => setShowVoiceInput(!showVoiceInput)}
              className={`voice-button ${showVoiceInput ? 'active' : ''}`}
              title="Voice Input"
            >
              🎤 {showVoiceInput ? 'Close Voice Panel' : 'Voice Input'}
            </button>
            <button
              onClick={clearChat}
              className="clear-button"
              title="Clear Database History"
            >
              🗑️ Clear History
            </button>
          </div>

          {showVoiceInput && (
            <VoiceInput
              onTranscript={handleVoiceInput}
              onStartListening={() => setVisualizerState('listening')}
              onStopListening={() => setVisualizerState('idle')}
            />
          )}
        </div>
      </div>
    </div>
  );
}

export default ChatInterface;
