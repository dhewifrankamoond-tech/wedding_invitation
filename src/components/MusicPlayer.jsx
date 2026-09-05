import React from 'react';

export default function MusicPlayer({ isPlaying, onToggle }) {
  return (
    <button 
      onClick={onToggle}
      className="music-btn-floating"
      style={{
        width: '50px',
        height: '50px',
        borderRadius: '50%',
        backgroundColor: 'var(--accent-color, #c5a059)',
        color: '#fff',
        border: '2px solid #fff',
        cursor: 'pointer',
        boxShadow: '0 4px 15px rgba(0,0,0,0.3)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '1.3rem',
        WebkitTapHighlightColor: 'transparent'
      }}
      title={isPlaying ? 'Hentikan Musik' : 'Putar Musik'}
      aria-label="Toggle Music"
    >
      {isPlaying ? '🎵' : '🔇'}
    </button>
  );
}