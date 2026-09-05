import React, { useState, useEffect, useRef } from 'react';

// Import Komponen
import Cover from './components/Cover';
import MusicPlayer from './components/MusicPlayer';
import CoupleSection from './components/CoupleSection';
import EventSection from './components/EventSection';
import GallerySection from './components/GallerySection';
import BankSection from './components/BankSection';
import WishSection from './components/WishSection';

// Import Assets
import mainCoupleImg from './assets/wedding.jpg';
import bgMusic from './assets/music.mp3';

const weddingImagesModules = import.meta.glob('./assets/wedding/*.{png,jpg,jpeg,webp,svg}', { eager: true });
const galleryPhotos = Object.values(weddingImagesModules).map((module) => module.default);

export default function App() {
  const [isOpen, setIsOpen] = useState(false);
  const [guestName, setGuestName] = useState('Tamu Undangan');
  const [isPlaying, setIsPlaying] = useState(false);
  
  const audioRef = useRef(null);
  const containerRef = useRef(null); // Ref untuk scroll-container

  useEffect(() => {
    const queryParams = new URLSearchParams(window.location.search);
    const toParam = queryParams.get('to');
    if (toParam) setGuestName(toParam);
  }, []);

  const handleOpenInvitation = () => {
    setIsOpen(true);
    if (audioRef.current) {
      audioRef.current.play()
        .then(() => setIsPlaying(true))
        .catch((err) => console.log('Autoplay ditolak:', err));
    }
  };

  const toggleMusic = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
        setIsPlaying(false);
      } else {
        audioRef.current.play();
        setIsPlaying(true);
      }
    }
  };

  // Fungsi untuk scroll kembali ke section paling atas secara smooth
  const scrollToTop = () => {
    if (containerRef.current) {
      containerRef.current.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  // Fungsi untuk menutup undangan & kembali ke Cover Utama
  const handleBackToCover = () => {
    setIsOpen(false);
    if (audioRef.current) {
      audioRef.current.pause();
      setIsPlaying(false);
    }
  };

  return (
    <div style={{ position: 'relative', width: '100%', height: '100dvh', overflow: 'hidden' }}>
      <audio ref={audioRef} src={bgMusic} loop />

      {!isOpen ? (
        <Cover 
          guestName={guestName} 
          onOpen={handleOpenInvitation} 
          bgImage={mainCoupleImg} 
        />
      ) : (
        <div style={{ position: 'relative', width: '100%', height: '100dvh' }}>
          <MusicPlayer isPlaying={isPlaying} onToggle={toggleMusic} />

          {/* Pasang ref containerRef di sini */}
          <div ref={containerRef} className="snap-container">
            <div className="snap-section">
              <CoupleSection mainImg={mainCoupleImg} />
            </div>

            <div className="snap-section">
              <EventSection />
            </div>

            <div className="snap-section">
              <GallerySection photos={galleryPhotos} />
            </div>

            <div className="snap-section">
              <BankSection />
            </div>

            <div className="snap-section">
              <WishSection defaultGuestName={guestName} />
            </div>

            {/* Section Penutup untuk Loop Kembali */}
            <div className="snap-section content-section" style={{ textAlign: 'center' }}>
              <h3 className="title" style={{ fontSize: '1.5rem' }}>Sampai Jumpa di Hari Bahagia Kami!</h3>
              <p style={{ margin: '1rem 0 2rem 0', fontSize: '0.9rem', color: '#666' }}>
                Terima kasih atas doa dan restu yang telah Anda berikan.
              </p>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', alignItems: 'center' }}>
                <button className="btn-open" onClick={scrollToTop} style={{ marginTop: 0 }}>
                  ↑ Kembali ke Awal Undangan
                </button>
                <button 
                  onClick={handleBackToCover} 
                  style={{ 
                    background: 'none', 
                    border: 'none', 
                    color: '#888', 
                    fontSize: '0.85rem', 
                    textDecoration: 'underline', 
                    cursor: 'pointer',
                    marginTop: '0.5rem'
                  }}
                >
                  Tutup Undangan (Halaman Sampul)
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}