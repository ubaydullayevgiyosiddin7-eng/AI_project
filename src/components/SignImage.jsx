// Harf rasmi — fallback bilan (rasm bo'lmasa harf belgisi ko'rinadi)
import { useState, useEffect } from 'react';
import { letterImageCandidates } from '../data/letterImages';
import theme from '../theme';

export default function SignImage({ letterId, size = 120, rounded = 12, showLabel = false }) {
  const candidates = letterImageCandidates(letterId);
  const [idx, setIdx] = useState(0);
  const [failed, setFailed] = useState(false);

  // Yangi harf tanlanganda — qaytadan boshlash
  useEffect(() => {
    setIdx(0);
    setFailed(false);
  }, [letterId]);

  const onError = () => {
    if (idx + 1 < candidates.length) {
      setIdx(idx + 1);
    } else {
      setFailed(true);
    }
  };

  const containerStyle = {
    width: size,
    height: size,
    borderRadius: rounded,
    background: failed
      ? `linear-gradient(135deg, ${theme.primary}10, ${theme.primaryLight}10)`
      : '#fff',
    border: `1px solid ${theme.border}`,
    overflow: 'hidden',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    flexShrink: 0,
  };

  if (failed) {
    return (
      <div style={containerStyle}>
        <div style={{
          fontSize: size * 0.45,
          fontWeight: 800,
          color: theme.primary,
        }}>
          {letterId}
        </div>
      </div>
    );
  }

  return (
    <div style={containerStyle}>
      <img
        src={candidates[idx]}
        alt={`${letterId} harfi`}
        onError={onError}
        style={{
          width: '100%',
          height: '100%',
          objectFit: 'contain',
          display: 'block',
        }}
      />
      {showLabel && (
        <div style={{
          position: 'absolute',
          bottom: 4,
          right: 6,
          background: 'rgba(255,255,255,0.85)',
          color: '#1e1b4b',
          fontSize: 11,
          fontWeight: 700,
          padding: '1px 6px',
          borderRadius: 4,
          fontFamily: "'Space Grotesk', sans-serif",
        }}>
          {letterId}
        </div>
      )}
    </div>
  );
}
