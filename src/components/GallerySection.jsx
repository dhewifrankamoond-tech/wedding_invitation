import React from 'react';

export default function GallerySection({ photos }) {
  return (
    <section className="content-section">
      <h2 className="subtitle">Galeri Momen ({photos.length} Foto)</h2>
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))', 
        gap: '10px', 
        marginTop: '1.5rem' 
      }}>
        {photos.map((imgSrc, index) => (
          <div key={index} style={{ overflow: 'hidden', borderRadius: '8px' }}>
            <img 
              src={imgSrc} 
              alt={`Galeri ${index + 1}`} 
              style={{ width: '100%', height: '140px', objectFit: 'cover', display: 'block' }} 
            />
          </div>
        ))}
      </div>
    </section>
  );
}