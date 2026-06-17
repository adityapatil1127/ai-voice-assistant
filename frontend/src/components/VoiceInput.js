import React, { useState, useRef } from 'react';
import '../styles/VoiceInput.css';

function VoiceInput({ onTranscript, onStartListening, onStopListening }) {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const recognitionRef = useRef(null);

  // Initialize Speech Recognition
  React.useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    
    if (!SpeechRecognition) {
      alert('Speech Recognition not supported in this browser');
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = 'en-US';

    recognition.onstart = () => {
      setIsListening(true);
      setTranscript('');
      if (onStartListening) onStartListening();
    };

    recognition.onresult = (event) => {
      let interimTranscript = '';
      for (let i = event.resultIndex; i < event.results.length; i++) {
        const transcript = event.results[i][0].transcript;
        interimTranscript += transcript;
      }
      setTranscript(interimTranscript);
    };

    recognition.onerror = (event) => {
      console.error('Speech recognition error', event.error);
      alert('Error recognizing speech: ' + event.error);
    };

    recognition.onend = () => {
      setIsListening(false);
      if (onStopListening) onStopListening();
    };

    recognitionRef.current = recognition;
  }, [onStartListening, onStopListening]);

  const startListening = () => {
    if (recognitionRef.current && !isListening) {
      recognitionRef.current.start();
    }
  };

  const stopListening = () => {
    if (recognitionRef.current && isListening) {
      recognitionRef.current.stop();
    }
  };

  const handleSubmit = () => {
    if (transcript.trim()) {
      onTranscript(transcript);
      setTranscript('');
    }
  };

  const handleCancel = () => {
    stopListening();
    setTranscript('');
  };

  return (
    <div className="voice-input-container">
      <div className="voice-controls">
        {!isListening ? (
          <button
            onClick={startListening}
            className="voice-start-button"
          >
            🎤 Start Listening
          </button>
        ) : (
          <>
            <button
              onClick={stopListening}
              className="voice-stop-button"
            >
              ⏹️ Stop
            </button>
            <div className="listening-indicator">
              <span className="pulse"></span>
              Listening...
            </div>
          </>
        )}
      </div>

      {transcript && (
        <div className="transcript-display">
          <p className="transcript-label">Recognized:</p>
          <p className="transcript-text">{transcript}</p>
          <div className="transcript-buttons">
            <button
              onClick={handleSubmit}
              className="confirm-button"
            >
              ✓ Use This
            </button>
            <button
              onClick={handleCancel}
              className="cancel-button"
            >
              ✕ Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default VoiceInput;
