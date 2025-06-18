// Sound management utility
class SoundManager {
  constructor() {
    this.sounds = {};
    this.isMuted = false;
    this.volume = 0.5;
  }

  // Initialize sound effects
  initSounds() {
    // Create audio contexts for different sound effects
    this.sounds = {
      correct: this.createBeep(800, 0.3, 'sine'),
      wrong: this.createBeep(300, 0.5, 'sawtooth'),
      tick: this.createBeep(600, 0.1, 'square'),
      hint: this.createBeep(1000, 0.2, 'triangle'),
      complete: this.createMelody([523, 659, 784, 1047], 0.3)
    };
  }

  // Create a beep sound using Web Audio API
  createBeep(frequency, duration, type = 'sine') {
    return () => {
      if (this.isMuted) return;
      
      try {
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();

        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);

        oscillator.frequency.value = frequency;
        oscillator.type = type;

        gainNode.gain.setValueAtTime(0, audioContext.currentTime);
        gainNode.gain.linearRampToValueAtTime(this.volume, audioContext.currentTime + 0.01);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + duration);

        oscillator.start(audioContext.currentTime);
        oscillator.stop(audioContext.currentTime + duration);
      } catch (error) {
        console.warn('Audio not supported:', error);
      }
    };
  }

  // Create a melody for completion sound
  createMelody(frequencies, noteDuration) {
    return () => {
      if (this.isMuted) return;
      
      frequencies.forEach((freq, index) => {
        setTimeout(() => {
          this.createBeep(freq, noteDuration)();
        }, index * noteDuration * 1000);
      });
    };
  }

  // Play specific sound
  play(soundName) {
    if (this.sounds[soundName] && !this.isMuted) {
      this.sounds[soundName]();
    }
  }

  // Toggle mute
  toggleMute() {
    this.isMuted = !this.isMuted;
    return this.isMuted;
  }

  // Set volume
  setVolume(volume) {
    this.volume = Math.max(0, Math.min(1, volume));
  }

  // Get mute status
  getMuteStatus() {
    return this.isMuted;
  }
}

export default new SoundManager();