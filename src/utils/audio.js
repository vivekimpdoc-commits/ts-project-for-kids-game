const audioCtx = new (window.AudioContext || window.webkitAudioContext)();

export const playSound = (type) => {
  const oscillator = audioCtx.createOscillator();
  const gainNode = audioCtx.createGain();

  oscillator.connect(gainNode);
  gainNode.connect(audioCtx.destination);

  let frequency = 440;
  let duration = 0.1;
  let volume = 0.1;

  switch (type) {
    case 'click':
      frequency = 600;
      duration = 0.05;
      break;
    case 'success':
      frequency = 880;
      duration = 0.3;
      // Double beep for success
      playBeep(1200, 0.1, 0.1);
      setTimeout(() => playBeep(1500, 0.2, 0.1), 100);
      return;
    case 'error':
      frequency = 150;
      duration = 0.4;
      volume = 0.2;
      break;
    default:
      frequency = 440;
  }

  oscillator.type = 'sine';
  oscillator.frequency.setValueAtTime(frequency, audioCtx.currentTime);
  gainNode.gain.setValueAtTime(volume, audioCtx.currentTime);
  gainNode.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + duration);

  oscillator.start();
  oscillator.stop(audioCtx.currentTime + duration);
};

function playBeep(freq, dur, vol) {
  const osc = audioCtx.createOscillator();
  const g = audioCtx.createGain();
  osc.connect(g);
  g.connect(audioCtx.destination);
  osc.frequency.setValueAtTime(freq, audioCtx.currentTime);
  g.gain.setValueAtTime(vol, audioCtx.currentTime);
  g.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + dur);
  osc.start();
  osc.stop(audioCtx.currentTime + dur);
}
