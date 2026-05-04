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

export default function App() {
  const [totalSeconds, setTotalSeconds] = useState(300);
  const [isMuted, setIsMuted] = useState(false);

  const playSound = useCallback(() => {
    if (isMuted) return;
    const audio = new Audio('/focus-timer/alrm.MP3');
    audio.volume = 0.24;
    audio.play();
  }, [isMuted]);

  const { remainingSeconds, isRunning, start, pause, reset } = useTimer(
    totalSeconds,
    playSound,
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
