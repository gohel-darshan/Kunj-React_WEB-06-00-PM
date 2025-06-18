/**
 * Checks if the app can be installed (PWA)
 * @returns {boolean} - Whether the app can be installed
 */
export const canInstallPWA = () => {
  return Boolean(
    window.deferredPrompt && 
    !window.matchMedia('(display-mode: standalone)').matches
  );
};

/**
 * Prompts the user to install the app
 * @returns {Promise<boolean>} - Whether the installation was successful
 */
export const promptInstallPWA = async () => {
  if (!canInstallPWA()) {
    return false;
  }

  try {
    // Show the install prompt
    const deferredPrompt = window.deferredPrompt;
    deferredPrompt.prompt();
    
    // Wait for the user to respond to the prompt
    const choiceResult = await deferredPrompt.userChoice;
    
    // Clear the deferred prompt variable
    window.deferredPrompt = null;
    
    return choiceResult.outcome === 'accepted';
  } catch (error) {
    console.error('Error installing PWA:', error);
    return false;
  }
};

/**
 * Registers the service worker for PWA functionality
 */
export const registerServiceWorker = () => {
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('/service-worker.js')
        .then(registration => {
          console.log('ServiceWorker registration successful with scope: ', registration.scope);
        })
        .catch(error => {
          console.error('ServiceWorker registration failed: ', error);
        });
    });
  }
};

/**
 * Listens for the beforeinstallprompt event
 */
export const listenForInstallPrompt = () => {
  window.addEventListener('beforeinstallprompt', (e) => {
    // Prevent Chrome 67 and earlier from automatically showing the prompt
    e.preventDefault();
    // Stash the event so it can be triggered later
    window.deferredPrompt = e;
  });
};

/**
 * Checks if the app is in standalone mode (installed)
 * @returns {boolean} - Whether the app is in standalone mode
 */
export const isAppInstalled = () => {
  return window.matchMedia('(display-mode: standalone)').matches || 
         window.navigator.standalone === true;
};

/**
 * Checks if the device is online
 * @returns {boolean} - Whether the device is online
 */
export const isOnline = () => {
  return navigator.onLine;
};

/**
 * Adds event listeners for online/offline events
 * @param {Function} onOnline - Callback for online event
 * @param {Function} onOffline - Callback for offline event
 * @returns {Function} - Function to remove the event listeners
 */
export const addConnectivityListeners = (onOnline, onOffline) => {
  window.addEventListener('online', onOnline);
  window.addEventListener('offline', onOffline);
  
  return () => {
    window.removeEventListener('online', onOnline);
    window.removeEventListener('offline', onOffline);
  };
};