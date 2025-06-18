// Sound effects for the quiz app

// Audio objects for different sound effects
let correctSound = null;
let incorrectSound = null;
let clickSound = null;
let timerSound = null;
let completeSound = null;

// Initialize sound effects
export const initSounds = () => {
  try {
    correctSound = new Audio('/sounds/correct.mp3');
    incorrectSound = new Audio('/sounds/incorrect.mp3');
    clickSound = new Audio('/sounds/click.mp3');
    timerSound = new Audio('/sounds/timer.mp3');
    completeSound = new Audio('/sounds/complete.mp3');
    
    // Preload sounds
    correctSound.load();
    incorrectSound.load();
    clickSound.load();
    timerSound.load();
    completeSound.load();
  } catch (error) {
    console.error('Error initializing sounds:', error);
  }
};

// Check if sound is enabled in settings
const isSoundEnabled = () => {
  const settings = JSON.parse(localStorage.getItem('quizUserSettings') || '{}');
  return settings.sound !== false; // Default to true if not set
};

// Play correct answer sound
export const playCorrectSound = () => {
  if (isSoundEnabled() && correctSound) {
    correctSound.currentTime = 0;
    correctSound.play().catch(e => console.error('Error playing sound:', e));
  }
};

// Play incorrect answer sound
export const playIncorrectSound = () => {
  if (isSoundEnabled() && incorrectSound) {
    incorrectSound.currentTime = 0;
    incorrectSound.play().catch(e => console.error('Error playing sound:', e));
  }
};

// Play button click sound
export const playClickSound = () => {
  if (isSoundEnabled() && clickSound) {
    clickSound.currentTime = 0;
    clickSound.play().catch(e => console.error('Error playing sound:', e));
  }
};

// Play timer warning sound
export const playTimerSound = () => {
  if (isSoundEnabled() && timerSound) {
    timerSound.currentTime = 0;
    timerSound.play().catch(e => console.error('Error playing sound:', e));
  }
};

// Play quiz complete sound
export const playCompleteSound = () => {
  if (isSoundEnabled() && completeSound) {
    completeSound.currentTime = 0;
    completeSound.play().catch(e => console.error('Error playing sound:', e));
  }
};

// Stop all sounds
export const stopAllSounds = () => {
  if (correctSound) correctSound.pause();
  if (incorrectSound) incorrectSound.pause();
  if (clickSound) clickSound.pause();
  if (timerSound) timerSound.pause();
  if (completeSound) completeSound.pause();
};