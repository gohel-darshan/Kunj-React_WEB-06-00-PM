// Voice recognition utility for hands-free quiz interaction
export class VoiceRecognition {
  constructor() {
    this.recognition = null;
    this.isListening = false;
    this.isSupported = false;
    this.currentCallback = null;
    this.currentOptions = [];
    
    this.initializeRecognition();
  }

  initializeRecognition() {
    // Check for browser support
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    
    if (!SpeechRecognition) {
      console.warn('Speech recognition not supported in this browser');
      return;
    }

    this.isSupported = true;
    this.recognition = new SpeechRecognition();
    
    // Configure recognition settings
    this.recognition.continuous = false;
    this.recognition.interimResults = false;
    this.recognition.lang = 'en-US';
    this.recognition.maxAlternatives = 3;

    // Set up event handlers
    this.recognition.onstart = () => {
      this.isListening = true;
      console.log('Voice recognition started');
    };

    this.recognition.onend = () => {
      this.isListening = false;
      console.log('Voice recognition ended');
    };

    this.recognition.onresult = (event) => {
      this.handleResult(event);
    };

    this.recognition.onerror = (event) => {
      console.error('Voice recognition error:', event.error);
      this.isListening = false;
      if (this.currentCallback) {
        this.currentCallback({ success: false, error: event.error });
      }
    };
  }

  // Start listening for voice input
  startListening(options, callback) {
    if (!this.isSupported) {
      callback({ success: false, error: 'Voice recognition not supported' });
      return;
    }

    if (this.isListening) {
      this.stopListening();
    }

    this.currentOptions = options;
    this.currentCallback = callback;

    try {
      this.recognition.start();
    } catch (error) {
      console.error('Failed to start voice recognition:', error);
      callback({ success: false, error: error.message });
    }
  }

  // Stop listening
  stopListening() {
    if (this.recognition && this.isListening) {
      this.recognition.stop();
    }
  }

  // Handle recognition results
  handleResult(event) {
    const results = Array.from(event.results[0]);
    const transcript = results[0].transcript.toLowerCase().trim();
    
    console.log('Voice input received:', transcript);

    // Try to match the transcript with available options
    const matchedOption = this.matchTranscriptToOption(transcript);
    
    if (this.currentCallback) {
      this.currentCallback({
        success: true,
        transcript,
        matchedOption,
        confidence: results[0].confidence
      });
    }
  }

  // Match spoken text to quiz options
  matchTranscriptToOption(transcript) {
    if (!this.currentOptions || this.currentOptions.length === 0) {
      return null;
    }

    // Direct option matching (A, B, C, D)
    const letterMatch = transcript.match(/^([abcd])\b/i);
    if (letterMatch) {
      const letterIndex = letterMatch[1].toLowerCase().charCodeAt(0) - 97; // a=0, b=1, etc.
      if (letterIndex >= 0 && letterIndex < this.currentOptions.length) {
        return { index: letterIndex, method: 'letter' };
      }
    }

    // Number matching (1, 2, 3, 4)
    const numberMatch = transcript.match(/^(one|two|three|four|1|2|3|4)\b/i);
    if (numberMatch) {
      const numberMap = { 'one': 0, 'two': 1, 'three': 2, 'four': 3, '1': 0, '2': 1, '3': 2, '4': 3 };
      const numberIndex = numberMap[numberMatch[1].toLowerCase()];
      if (numberIndex !== undefined && numberIndex < this.currentOptions.length) {
        return { index: numberIndex, method: 'number' };
      }
    }

    // Fuzzy text matching with answer content
    let bestMatch = null;
    let bestScore = 0;

    this.currentOptions.forEach((option, index) => {
      const similarity = this.calculateSimilarity(transcript, option.toLowerCase());
      if (similarity > bestScore && similarity > 0.6) { // 60% similarity threshold
        bestScore = similarity;
        bestMatch = { index, method: 'content', similarity };
      }
    });

    // Command matching
    const commands = {
      'skip': { action: 'skip' },
      'hint': { action: 'hint' },
      'fifty fifty': { action: 'fiftyFifty' },
      '50 50': { action: 'fiftyFifty' },
      'help': { action: 'help' },
      'repeat': { action: 'repeat' },
      'pause': { action: 'pause' },
      'stop': { action: 'stop' }
    };

    for (const [command, action] of Object.entries(commands)) {
      if (transcript.includes(command)) {
        return { action: action.action, method: 'command' };
      }
    }

    return bestMatch;
  }

  // Calculate text similarity using Levenshtein distance
  calculateSimilarity(str1, str2) {
    const matrix = [];
    const len1 = str1.length;
    const len2 = str2.length;

    // Initialize matrix
    for (let i = 0; i <= len1; i++) {
      matrix[i] = [i];
    }
    for (let j = 0; j <= len2; j++) {
      matrix[0][j] = j;
    }

    // Fill matrix
    for (let i = 1; i <= len1; i++) {
      for (let j = 1; j <= len2; j++) {
        const cost = str1[i - 1] === str2[j - 1] ? 0 : 1;
        matrix[i][j] = Math.min(
          matrix[i - 1][j] + 1,      // deletion
          matrix[i][j - 1] + 1,      // insertion
          matrix[i - 1][j - 1] + cost // substitution
        );
      }
    }

    const maxLen = Math.max(len1, len2);
    return maxLen === 0 ? 1 : (maxLen - matrix[len1][len2]) / maxLen;
  }

  // Get supported commands for help
  getSupportedCommands() {
    return [
      'Say "A", "B", "C", or "D" to select an answer',
      'Say "One", "Two", "Three", or "Four" to select an answer',
      'Say part of the answer text to select it',
      'Say "Skip" to skip the current question',
      'Say "Hint" to use a hint',
      'Say "Fifty Fifty" to eliminate two wrong answers',
      'Say "Help" to hear these commands again',
      'Say "Stop" to stop voice recognition'
    ];
  }

  // Check if voice recognition is supported
  isVoiceSupported() {
    return this.isSupported;
  }

  // Get current listening status
  getListeningStatus() {
    return this.isListening;
  }
}

// Create singleton instance
const voiceRecognition = new VoiceRecognition();
export default voiceRecognition;