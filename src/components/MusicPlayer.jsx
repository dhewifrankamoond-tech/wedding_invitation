import React from 'react';

export default function MusicPlayer({ isPlaying, onToggle }) {
  return (
    <button 
      onClick={onToggle}
      style={{
        position: 'fixed',
        bottom: '20px',
        right: '20px',
        zIndex: 999,
        width: '45px',
        height: '45px',
        borderRadius: '50%',
        backgroundColor: 'var(--accent-color)',
        color: '#fff',
        border: 'none',
        cursor: 'pointer',
        boxShadow: '0 4px 10px rgba(0,0,0,0.3)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '1.2rem',
        transition: 'transform 0.2s'
      }}
      title={isPlaying ? 'Hentikan Musik' : 'Putar Musik'}
    >
      {isPlaying ? '🎵' : '🔇'}
    </button>
  );
}