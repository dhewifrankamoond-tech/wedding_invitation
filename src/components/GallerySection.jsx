import React, { useState } from 'react';

export default function GallerySection({ photos }) {
  const [selectedImg, setSelectedImg] = useState(null);

  return (
    <section className="content-section">
      <h2 className="subtitle">Galeri Momen ({photos.length} Foto)</h2>
      
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(110px, 1fr))', 
        gap: '10px', 
        marginTop: '1.5rem' 
      }}>
        {photos.map((imgSrc, index) => (
          <div 
            key={index} 
            onClick={() => setSelectedImg(imgSrc)}
            style={{ 
              overflow: 'hidden', 
              borderRadius: '12px', 
              cursor: 'pointer',
              backgroundColor: '#f5f5f5' 
            }}
          >
            <img 
              src={imgSrc} 
              alt={`Galeri ${index + 1}`} 
              style={{ 
                width: '100%', 
                aspectRatio: '3/4', // Mengunci rasio potret tanpa memotong gambar secara paksa
                objectFit: 'cover', 
                display: 'block',
                transition: 'transform 0.3s'
              }} 
            />
          </div>
        ))}
      </div>

      {/* Modal Lightbox / Pop-up Gambar Utuh */}
      {selectedImg && (
        <div 
          onClick={() => setSelectedImg(null)}
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100vw',
            height: '100vh',
            backgroundColor: 'rgba(0,0,0,0.85)',
            zIndex: 1000,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '1rem'
          }}
        >
          <img 
            src={selectedImg} 
            alt="Foto Utuh" 
            style={{ 
              maxWidth: '90%', 
              maxHeight: '85vh', 
              borderRadius: '8px', 
              objectFit: 'contain' // Menjamin gambar tampil 100% utuh tanpa terpotong di mode popup
            }} 
          />
        </div>
      )}
    </section>
  );
}