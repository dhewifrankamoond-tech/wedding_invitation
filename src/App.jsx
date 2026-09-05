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
        .catch((err) => console.log('Autoplay ditolak browser:', err));
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

  return (
    <div style={{ position: 'relative', width: '100%', height: '100vh' }}>
        <audio ref={audioRef} src={bgMusic} loop />

        {!isOpen ? (
        <Cover 
            guestName={guestName} 
            onOpen={handleOpenInvitation} 
            bgImage={mainCoupleImg} 
        />
        ) : (
        <>
            {/* Tombol akan mengunci ke #root di dalam simulator HP */}
            <MusicPlayer isPlaying={isPlaying} onToggle={toggleMusic} />

            <div className="snap-container">
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
            </div>
        </>
        )}
    </div>
    );
}