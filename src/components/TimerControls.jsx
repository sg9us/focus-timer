const MIN_SECONDS = 60;
const MAX_SECONDS = 3600;

const ghostStyle = (disabled) => ({
  border: 'none',
  background: 'none',
  color: '#151D2A',
  opacity: disabled ? 0.3 : 1,
  padding: '6px 12px',
});

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

  const minDisabled = isRunning || totalSeconds <= MIN_SECONDS;
  const maxDisabled = isRunning || totalSeconds >= MAX_SECONDS;

  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', alignItems: 'center', gap: '4px' }}>
      <button
        onClick={() => adjustTime(-60)}
        disabled={minDisabled}
        style={ghostStyle(minDisabled)}
      >
        -1min
      </button>
      <button onClick={isRunning ? onPause : onStart}>
        {isRunning ? 'Pause' : 'Start'}
      </button>
      <button onClick={onReset}>Reset</button>
      <button
        onClick={() => adjustTime(60)}
        disabled={maxDisabled}
        style={ghostStyle(maxDisabled)}
      >
        +1min
      </button>
    </div>
  );
}
