import { useState, useCallback, useEffect } from 'react';
import useTimer from './hooks/useTimer';
import TimerRing from './components/TimerRing';
import TimerControls from './components/TimerControls';
import MuteToggle from './components/MuteToggle';
import './App.css';

function formatTime(seconds) {
  const m = Math.floor(Math.max(0, seconds) / 60);
  const s = Math.max(0, seconds) % 60;
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
}

function playChime() {
  const ctx = new (window.AudioContext || window.webkitAudioContext)();
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();

  osc.connect(gain);
  gain.connect(ctx.destination);

  osc.type = 'sine';
  osc.frequency.setValueAtTime(440, ctx.currentTime);
  osc.frequency.exponentialRampToValueAtTime(880, ctx.currentTime + 0.3);

  gain.gain.setValueAtTime(0.4, ctx.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.8);

  osc.start(ctx.currentTime);
  osc.stop(ctx.currentTime + 0.8);
  osc.onended = () => ctx.close();
}

export default function App() {
  const [totalSeconds, setTotalSeconds] = useState(300);
  const [isMuted, setIsMuted] = useState(false);

  const handleComplete = useCallback(() => {
    if (!isMuted) playChime();
  }, [isMuted]);

  const { remainingSeconds, isRunning, start, pause, reset } = useTimer(
    totalSeconds,
    handleComplete,
  );

  // 탭 타이틀
  useEffect(() => {
    document.title = isRunning
      ? `${formatTime(remainingSeconds)} - Focus Timer`
      : 'Focus Timer';
  }, [isRunning, remainingSeconds]);

  // 키보드 단축키
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;
      if (e.code === 'Space') {
        e.preventDefault();
        isRunning ? pause() : start();
      } else if (e.key === 'r' || e.key === 'R') {
        reset();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isRunning, start, pause, reset]);

  return (
    <div className="app-container">
      <div className="ring-wrapper">
        <TimerRing
          totalSeconds={totalSeconds}
          remainingSeconds={remainingSeconds}
          isRunning={isRunning}
          onTimeClick={setTotalSeconds}
        />
      </div>
      <div className="controls-wrapper">
        <TimerControls
          isRunning={isRunning}
          onStart={start}
          onPause={pause}
          onReset={reset}
          totalSeconds={totalSeconds}
          onTimeChange={setTotalSeconds}
        />
        <MuteToggle isMuted={isMuted} onToggle={() => setIsMuted(m => !m)} />
      </div>
    </div>
  );
}
