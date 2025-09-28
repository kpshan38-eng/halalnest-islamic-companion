// Audio utility functions for app sound effects
export const playDoorbell = () => {
  try {
    // Create a simple doorbell-like sound using Web Audio API
    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    
    // Create oscillators for the doorbell sound
    const oscillator1 = audioContext.createOscillator();
    const oscillator2 = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    // Connect nodes
    oscillator1.connect(gainNode);
    oscillator2.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    // Set frequencies for doorbell effect (major third interval)
    oscillator1.frequency.setValueAtTime(800, audioContext.currentTime);
    oscillator2.frequency.setValueAtTime(1000, audioContext.currentTime);
    
    // Set up envelope
    gainNode.gain.setValueAtTime(0, audioContext.currentTime);
    gainNode.gain.linearRampToValueAtTime(0.3, audioContext.currentTime + 0.1);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.8);
    
    // Start and stop oscillators
    oscillator1.start(audioContext.currentTime);
    oscillator2.start(audioContext.currentTime);
    oscillator1.stop(audioContext.currentTime + 0.8);
    oscillator2.stop(audioContext.currentTime + 0.8);
    
    // Add a second chime after a short delay
    setTimeout(() => {
      const osc3 = audioContext.createOscillator();
      const osc4 = audioContext.createOscillator();
      const gain2 = audioContext.createGain();
      
      osc3.connect(gain2);
      osc4.connect(gain2);
      gain2.connect(audioContext.destination);
      
      osc3.frequency.setValueAtTime(600, audioContext.currentTime);
      osc4.frequency.setValueAtTime(750, audioContext.currentTime);
      
      gain2.gain.setValueAtTime(0, audioContext.currentTime);
      gain2.gain.linearRampToValueAtTime(0.25, audioContext.currentTime + 0.1);
      gain2.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.6);
      
      osc3.start(audioContext.currentTime);
      osc4.start(audioContext.currentTime);
      osc3.stop(audioContext.currentTime + 0.6);
      osc4.stop(audioContext.currentTime + 0.6);
    }, 200);
    
  } catch (error) {
    console.log('Audio not supported or failed to play');
  }
};

export const playSuccessChime = () => {
  try {
    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    
    // Play ascending notes for success
    const notes = [523.25, 659.25, 783.99]; // C5, E5, G5
    
    notes.forEach((freq, index) => {
      setTimeout(() => {
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);
        
        oscillator.frequency.setValueAtTime(freq, audioContext.currentTime);
        oscillator.type = 'sine';
        
        gainNode.gain.setValueAtTime(0, audioContext.currentTime);
        gainNode.gain.linearRampToValueAtTime(0.2, audioContext.currentTime + 0.05);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3);
        
        oscillator.start(audioContext.currentTime);
        oscillator.stop(audioContext.currentTime + 0.3);
      }, index * 100);
    });
  } catch (error) {
    console.log('Audio not supported or failed to play');
  }
};