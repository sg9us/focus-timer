export default function MuteToggle({ isMuted, onToggle }) {
  const isOn = !isMuted;
  return (
    <div
      className="mute-toggle"
      role="switch"
      aria-checked={isOn}
      tabIndex={0}
      onClick={onToggle}
      onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && onToggle()}
    >
      <span className="mute-toggle-label">소리</span>
      <div className={`mute-toggle-track${isOn ? ' on' : ''}`}>
        <div className="mute-toggle-thumb" />
      </div>
    </div>
  );
}
