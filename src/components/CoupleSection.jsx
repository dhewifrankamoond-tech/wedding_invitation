import React from 'react';
import { config } from '../loadConfig';

export default function CoupleSection({ mainImg }) {
  return (
    <section className="content-section">
      <p className="subtitle">Mempelai</p>
      <h2 className="couple-name" style={{ marginTop: '0.5rem' }}>
        {config.wedding.couple_short}
      </h2>
      
      <div style={{ margin: '1.5rem 0' }}>
        <img 
          src={mainImg} 
          alt="Foto Mempelai Utama" 
          style={{ 
            width: '180px', 
            height: '180px', 
            objectFit: 'cover', 
            borderRadius: '50%',
            border: '4px solid var(--accent-color)'
          }} 
        />
      </div>

      <p style={{ margin: '1rem 0', fontSize: '0.85rem', color: '#666' }}>
        {config.wedding.quote}
      </p>
      
      <div className="card">
        <h3>{config.wedding.groom_name}</h3>
        <p style={{ fontSize: '0.8rem', color: '#777' }}>{config.wedding.groom_parents}</p>
        <h2 style={{ color: 'var(--accent-color)', margin: '0.5rem 0' }}>&</h2>
        <h3>{config.wedding.bride_name}</h3>
        <p style={{ fontSize: '0.8rem', color: '#777' }}>{config.wedding.bride_parents}</p>
      </div>
    </section>
  );
}