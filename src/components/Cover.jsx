import React from 'react';
import { config } from '../loadConfig';

export default function Cover({ guestName, onOpen, bgImage }) {
  return (
    <div 
      className="hero-cover"
      style={{
        backgroundImage: `linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.5)), url(${bgImage})`,
        backgroundPosition: 'center',
        backgroundSize: 'cover'
      }}
    >
      <p className="subtitle">{config.wedding.title}</p>
      <h1 className="title">{config.wedding.couple_short}</h1>
      <p style={{ marginTop: '1.5rem', fontSize: '0.9rem' }}>Kepada Yth. Bapak/Ibu/Saudara/i:</p>
      <h3 style={{ margin: '0.5rem 0', color: '#f0e6d2' }}>{guestName}</h3>
      <button className="btn-open" onClick={onOpen}>
        Buka Undangan
      </button>
    </div>
  );
}