const SpeakerOn = () => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" aria-label="Sound on">
    {/* Speaker body */}
    <path d="M2 8v4h3l5 4V4L5 8H2z" fill="#151D2A" />
    {/* Wave 1 – small */}
    <path d="M12 8a3 3 0 0 1 0 4" stroke="#151D2A" strokeWidth="1.5" strokeLinecap="round" fill="none" />
    {/* Wave 2 – large */}
    <path d="M14 6a6 6 0 0 1 0 8" stroke="#151D2A" strokeWidth="1.5" strokeLinecap="round" fill="none" />
  </svg>
);

const SpeakerOff = () => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" aria-label="Sound off">
    {/* Speaker body */}
    <path d="M2 8v4h3l5 4V4L5 8H2z" fill="#151D2A" />
    {/* X mark */}
    <path d="M13 7l5 6M18 7l-5 6" stroke="#151D2A" strokeWidth="1.5" strokeLinecap="round" />
  </svg>
);

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
      {isOn ? <SpeakerOn /> : <SpeakerOff />}
      <div className={`mute-toggle-track${isOn ? ' on' : ''}`}>
        <div className="mute-toggle-thumb" />
      </div>
    </div>
  );
}
