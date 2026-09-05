import React from 'react';

export default function MusicPlayer({ isPlaying, onToggle }) {
  return (
    <button 
      onClick={onToggle}
      style={{
        position: 'absolute', /* Mutlak terhadap bingkai #root */
        bottom: '20px',
        right: '20px',
        zIndex: 99999,
        width: '45px',
        height: '45px',
        borderRadius: '50%',
        backgroundColor: 'var(--accent-color, #c5a059)',
        color: '#fff',
        border: '2px solid #fff',
        cursor: 'pointer',
        boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '1.2rem',
        WebkitTapHighlightColor: 'transparent'
      }}
      title={isPlaying ? 'Hentikan Musik' : 'Putar Musik'}
      aria-label="Toggle Music"
    >
      {isPlaying ? '🎵' : '🔇'}
    </button>
  );
}