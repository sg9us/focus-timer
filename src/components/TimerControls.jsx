const MIN_SECONDS = 60;
const MAX_SECONDS = 3600;

export default function TimerControls({
  isRunning,
  onStart,
  onPause,
  onReset,
  totalSeconds,
  onTimeChange,
}) {
  const adjustTime = (delta) => {
    const next = Math.min(MAX_SECONDS, Math.max(MIN_SECONDS, totalSeconds + delta));
    onTimeChange(next);
  };

  return (
    <div>
      <button onClick={() => adjustTime(-60)} disabled={isRunning || totalSeconds <= MIN_SECONDS}>
        -1m
      </button>
      <button onClick={() => adjustTime(60)} disabled={isRunning || totalSeconds >= MAX_SECONDS}>
        +1m
      </button>
      <button onClick={isRunning ? onPause : onStart}>
        {isRunning ? 'Pause' : 'Start'}
      </button>
      <button onClick={onReset}>Reset</button>
    </div>
  );
}
