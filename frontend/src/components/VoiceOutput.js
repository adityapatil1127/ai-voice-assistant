class VoiceOutput {
  constructor() {
    const SpeechSynthesis = window.speechSynthesis;
    this.synthesis = SpeechSynthesis;
    this.isPlaying = false;
    this.rate = 1.0;
    this.pitch = 1.0;
    this.selectedVoiceName = null;
    this.onStartCallback = null;
    this.onEndCallback = null;
  }

  setListeners(onStart, onEnd) {
    this.onStartCallback = onStart;
    this.onEndCallback = onEnd;
  }

  speak(text) {
    if (!this.synthesis) {
      console.error('Speech Synthesis not supported');
      return;
    }

    // Cancel any ongoing speech
    this.synthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = this.rate;
    utterance.pitch = this.pitch;
    utterance.volume = 1;

    // Apply selected voice
    if (this.selectedVoiceName) {
      const voices = this.getVoices();
      const voice = voices.find(v => v.name === this.selectedVoiceName);
      if (voice) {
        utterance.voice = voice;
        utterance.lang = voice.lang;
      }
    } else {
      utterance.lang = 'en-US';
    }

    utterance.onstart = () => {
      this.isPlaying = true;
      if (this.onStartCallback) this.onStartCallback();
    };

    utterance.onend = () => {
      this.isPlaying = false;
      if (this.onEndCallback) this.onEndCallback();
    };

    utterance.onerror = (event) => {
      console.error('Speech synthesis error:', event.error);
      this.isPlaying = false;
      if (this.onEndCallback) this.onEndCallback();
    };

    this.synthesis.speak(utterance);
  }

  stop() {
    if (this.synthesis) {
      this.synthesis.cancel();
      this.isPlaying = false;
      if (this.onEndCallback) this.onEndCallback();
    }
  }

  getVoices() {
    return this.synthesis ? this.synthesis.getVoices() : [];
  }

  setVoiceByName(name) {
    this.selectedVoiceName = name;
  }

  setRate(rate) {
    this.rate = parseFloat(rate);
  }

  setPitch(pitch) {
    this.pitch = parseFloat(pitch);
  }
}

export default new VoiceOutput();
