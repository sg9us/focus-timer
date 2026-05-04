import { useState, useEffect, useRef } from 'react';

const CX = 100;
const CY = 100;
const R = 78;
const MINOR_TICK_LEN = 4;
const MAJOR_TICK_LEN = 8;
const LABEL_R = R + MAJOR_TICK_LEN + 7; // ~93

function formatTime(seconds) {
  const safe = Math.max(0, Math.floor(seconds));
  const m = Math.floor(safe / 60);
  const s = safe % 60;
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
}

function buildSectorPath(ratio) {
  if (ratio <= 0) return null;
  if (ratio >= 1) {
    return `M ${CX} ${CY - R} A ${R} ${R} 0 1 1 ${CX} ${CY + R} A ${R} ${R} 0 1 1 ${CX} ${CY - R} Z`;
  }
  const endAngle = -Math.PI / 2 + ratio * 2 * Math.PI;
  const ex = CX + R * Math.cos(endAngle);
  const ey = CY + R * Math.sin(endAngle);
  const largeArc = ratio > 0.5 ? 1 : 0;
  return `M ${CX} ${CY} L ${CX} ${CY - R} A ${R} ${R} 0 ${largeArc} 1 ${ex} ${ey} Z`;
}

const TICKS = Array.from({ length: 60 }, (_, i) => {
  const isMajor = i % 5 === 0;
  const angle = -Math.PI / 2 + (i / 60) * 2 * Math.PI;
  const cos = Math.cos(angle);
  const sin = Math.sin(angle);
  const outerR = R + (isMajor ? MAJOR_TICK_LEN : MINOR_TICK_LEN);
  return {
    x1: CX + R * cos, y1: CY + R * sin,
    x2: CX + outerR * cos, y2: CY + outerR * sin,
    isMajor,
    minute: i === 0 ? 60 : i,
    lx: CX + LABEL_R * cos,
    ly: CY + LABEL_R * sin,
  };
});

const TEXT_STYLE = {
  fontSize: '22px',
  fontWeight: 'bold',
  fontFamily: 'Pretendard, system-ui, sans-serif',
  color: '#151D2A',
};

export default function TimerRing({ totalSeconds, remainingSeconds, isRunning, onTimeClick }) {
  const ratio = Math.max(0, Math.min(1, remainingSeconds / 3600));
  const sectorPath = buildSectorPath(ratio);

  const [isEditing, setIsEditing] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const inputRef = useRef(null);

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [isEditing]);

  // 타이머 시작 시 편집 모드 강제 종료
  useEffect(() => {
    if (isRunning) setIsEditing(false);
  }, [isRunning]);

  const handleCenterClick = (e) => {
    e.stopPropagation();
    if (isRunning) return;
    setInputValue(formatTime(remainingSeconds));
    setIsEditing(true);
  };

  const handleInputChange = (e) => {
    const digits = e.target.value.replace(/\D/g, '').slice(0, 4);
    setInputValue(digits.length <= 2 ? digits : `${digits.slice(0, 2)}:${digits.slice(2)}`);
  };

  const commitInput = () => {
    const digits = inputValue.replace(/\D/g, '').padStart(4, '0');
    const mm = parseInt(digits.slice(0, 2), 10);
    const ss = parseInt(digits.slice(2, 4), 10);
    const total = Math.max(1, Math.min(3600, mm * 60 + ss));
    onTimeClick(total);
    setIsEditing(false);
  };

  const handleTickClick = (e) => {
    if (isRunning || !onTimeClick) return;

    const svg = e.currentTarget;
    const pt = svg.createSVGPoint();
    pt.x = e.clientX;
    pt.y = e.clientY;
    const { x, y } = pt.matrixTransform(svg.getScreenCTM().inverse());

    const dx = x - CX;
    const dy = y - CY;
    const dist = Math.sqrt(dx * dx + dy * dy);
    if (dist < R - 12 || dist > LABEL_R + 8) return;

    let angle = Math.atan2(dy, dx) + Math.PI / 2;
    if (angle < 0) angle += 2 * Math.PI;

    const raw = Math.round((angle / (2 * Math.PI)) * 60);
    const minutes = raw === 0 ? 60 : Math.max(1, Math.min(60, raw));
    onTimeClick(minutes * 60);
  };

  return (
    <svg
      viewBox="0 0 200 200"
      width="100%"
      height="100%"
      preserveAspectRatio="xMidYMid meet"
      style={{ cursor: isRunning ? 'default' : 'pointer' }}
      onClick={handleTickClick}
      xmlns="http://www.w3.org/2000/svg"
    >
      <circle cx={CX} cy={CY} r={R} fill="#ffffff" />
      {sectorPath && <path d={sectorPath} fill="#AA0D4C" />}
      <circle cx={CX} cy={CY} r={R} fill="none" stroke="#e5e5e5" strokeWidth="1.5" />

      {TICKS.map(({ x1, y1, x2, y2, isMajor, minute, lx, ly }) => (
        <g key={minute}>
          <line x1={x1} y1={y1} x2={x2} y2={y2} stroke="#c8c8c8" strokeWidth={isMajor ? 1.5 : 0.8} />
          {isMajor && (
            <text x={lx} y={ly} textAnchor="middle" dominantBaseline="central" fontSize="7.5" fill="#aaa">
              {minute}
            </text>
          )}
        </g>
      ))}

      {isEditing ? (
        <foreignObject x={CX - 52} y={CY - 22} width={104} height={44}>
          <div xmlns="http://www.w3.org/1999/xhtml" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
            <input
              ref={inputRef}
              type="text"
              value={inputValue}
              placeholder="MM:SS"
              onChange={handleInputChange}
              onBlur={commitInput}
              onKeyDown={(e) => {
                if (e.key === 'Enter') commitInput();
                if (e.key === 'Escape') setIsEditing(false);
              }}
              style={{
                ...TEXT_STYLE,
                width: '100%',
                textAlign: 'center',
                border: 'none',
                outline: 'none',
                background: 'transparent',
                padding: 0,
              }}
            />
          </div>
        </foreignObject>
      ) : (
        <text
          x={CX}
          y={CY}
          textAnchor="middle"
          dominantBaseline="central"
          fill="#151D2A"
          fontWeight="bold"
          fontSize="22"
          fontFamily="Pretendard, system-ui, sans-serif"
          style={{ cursor: isRunning ? 'default' : 'text' }}
          onClick={handleCenterClick}
        >
          {formatTime(remainingSeconds)}
        </text>
      )}
    </svg>
  );
}
