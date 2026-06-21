const PipIcon = () => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
    <rect x="2" y="3.5" width="16" height="11" rx="1.5" stroke="#151D2A" strokeWidth="1.5" />
    <rect x="10.5" y="9" width="6" height="4.2" rx="0.8" fill="#151D2A" />
  </svg>
);

export default function PipButton({ isActive, onClick }) {
  return (
    <div
      className="pip-button"
      role="button"
      tabIndex={0}
      aria-pressed={isActive}
      aria-label={isActive ? 'Exit Picture-in-Picture' : 'Enter Picture-in-Picture'}
      onClick={onClick}
      onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && onClick()}
    >
      <PipIcon />
    </div>
  );
}
