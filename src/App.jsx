import { useState, useCallback, useEffect } from 'react';
import { createPortal } from 'react-dom';
import useTimer from './hooks/useTimer';
import usePictureInPicture from './hooks/usePictureInPicture';
import TimerRing from './components/TimerRing';
import TimerControls from './components/TimerControls';
import MuteToggle from './components/MuteToggle';
import PipButton from './components/PipButton';
import './App.css';

function formatTime(seconds) {
  const m = Math.floor(Math.max(0, seconds) / 60);
  const s = Math.max(0, seconds) % 60;
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
}

export default function App() {
  const [totalSeconds, setTotalSeconds] = useState(300);
  const [isMuted, setIsMuted] = useState(false);
  const { pipWindow, isSupported: pipSupported, open: openPip, close: closePip } = usePictureInPicture();

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

  // 키보드 단축키 — PiP 창이 열려있으면 그 창에도 동일하게 등록 (포커스가 PiP에 있을 때도 동작)
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
    const targets = [window, pipWindow].filter(Boolean);
    targets.forEach((t) => t.addEventListener('keydown', handleKeyDown));
    return () => targets.forEach((t) => t.removeEventListener('keydown', handleKeyDown));
  }, [isRunning, start, pause, reset, pipWindow]);

  const timerView = (
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
        <div className="bottom-row">
          <MuteToggle isMuted={isMuted} onToggle={() => setIsMuted(m => !m)} />
          {pipSupported && (
            <PipButton isActive={!!pipWindow} onClick={pipWindow ? closePip : openPip} />
          )}
        </div>
      </div>
    </div>
  );

  if (pipWindow) {
    return (
      <>
        {createPortal(timerView, pipWindow.document.body)}
        <div className="pip-placeholder">타이머가 별도 창에서 실행 중입니다</div>
      </>
    );
  }

  return timerView;
}
