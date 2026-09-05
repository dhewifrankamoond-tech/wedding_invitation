import React, { useState, useEffect, useRef } from 'react';
import { turso } from './turso';

// Import Aset (Foto & Musik)
import mainCoupleImg from './assets/wedding.jpg';
import bgMusic from './assets/music.mp3';

// Import Galeri Foto Otomatis
const weddingImagesModules = import.meta.glob('./assets/wedding/*.{png,jpg,jpeg,webp,svg}', { 
  eager: true 
});
const galleryPhotos = Object.values(weddingImagesModules).map((module) => module.default);

export default function App() {
  const [isOpen, setIsOpen] = useState(false);
  const [guestName, setGuestName] = useState('Tamu Undangan');

  // State untuk Musik
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef(null);

  // State untuk Form RSVP & Ucapan
  const [nameInput, setNameInput] = useState('');
  const [attendance, setAttendance] = useState('Hadir');
  const [guestCount, setGuestCount] = useState(1);
  const [message, setMessage] = useState('');
  const [wishesList, setWishesList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  // Ambil Data Ucapan dari Turso
  const fetchWishes = async () => {
    try {
      const result = await turso.execute(
        'SELECT * FROM wishes ORDER BY created_at DESC'
      );
      setWishesList(result.rows);
    } catch (error) {
      console.error('Gagal mengambil data dari Turso:', error);
    }
  };

  useEffect(() => {
    const queryParams = new URLSearchParams(window.location.search);
    const toParam = queryParams.get('to');
    if (toParam) {
      setGuestName(toParam);
      setNameInput(toParam);
    }

    fetchWishes();
  }, []);

  // Handler Buka Undangan & Putar Musik
  const handleOpenInvitation = () => {
    setIsOpen(true);
    if (audioRef.current) {
      audioRef.current.play()
        .then(() => setIsPlaying(true))
        .catch((err) => console.log('Autoplay ditolak oleh browser:', err));
    }
  };

  // Handler Toggle Play/Pause Musik
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

  // Simpan Ucapan ke Turso
  const handleSubmitWish = async (e) => {
    e.preventDefault();
    if (!nameInput.trim() || !message.trim()) return;

    setLoading(true);
    try {
      await turso.execute({
        sql: `INSERT INTO wishes (name, attendance, guest_count, message) VALUES (?, ?, ?, ?)`,
        args: [
          nameInput,
          attendance,
          attendance === 'Hadir' ? guestCount : 0,
          message
        ]
      });

      setMessage('');
      alert('Terima kasih atas konfirmasi dan ucapan Anda!');
      await fetchWishes();
    } catch (error) {
      console.error('Gagal menyimpan ucapan:', error);
      alert('Terjadi kesalahan saat menyimpan ucapan.');
    } finally {
      setLoading(false);
    }
  };

  const handleCopyRekening = (rekening) => {
    navigator.clipboard.writeText(rekening);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div>
      {/* Audio Element Hidden */}
      <audio ref={audioRef} src={bgMusic} loop />

      {!isOpen ? (
        /* Cover Sampul */
        <div 
          className="hero-cover"
          style={{
            backgroundImage: `linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.5)), url(${mainCoupleImg})`,
            backgroundPosition: 'center',
            backgroundSize: 'cover'
          }}
        >
          <p className="subtitle">The Wedding Of</p>
          <h1 className="title">Romeo & Juliet</h1>
          <p style={{ marginTop: '1.5rem', fontSize: '0.9rem' }}>Kepada Yth. Bapak/Ibu/Saudara/i:</p>
          <h3 style={{ margin: '0.5rem 0', color: '#f0e6d2' }}>{guestName}</h3>
          <button className="btn-open" onClick={handleOpenInvitation}>
            Buka Undangan
          </button>
        </div>
      ) : (
        /* Isi Utama Undangan */
        <div>
          {/* Tombol Kontrol Musik Melayang (Floating Music Button) */}
          <button 
            onClick={toggleMusic}
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

          {/* Header Mempelai */}
          <section className="content-section">
            <p className="subtitle">Mempelai</p>
            <h2 className="couple-name" style={{ marginTop: '0.5rem' }}>Romeo & Juliet</h2>
            
            <div style={{ margin: '1.5rem 0' }}>
              <img 
                src={mainCoupleImg} 
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
              Maha Suci Allah yang telah menciptakan makhluk-Nya berpasang-pasangan.
            </p>
            
            <div className="card">
              <h3>Romeo Montague</h3>
              <p style={{ fontSize: '0.8rem', color: '#777' }}>Putra dari Bapak Montague & Ibu Montague</p>
              <h2 style={{ color: 'var(--accent-color)', margin: '0.5rem 0' }}>&</h2>
              <h3>Juliet Capulet</h3>
              <p style={{ fontSize: '0.8rem', color: '#777' }}>Putri dari Bapak Capulet & Ibu Capulet</p>
            </div>
          </section>

          {/* Galeri Momen */}
          <section className="content-section" style={{ background: 'var(--bg-primary)' }}>
            <h2 className="subtitle">Galeri Momen ({galleryPhotos.length} Foto)</h2>
            <div style={{ 
              display: 'grid', 
              gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))', 
              gap: '10px', 
              marginTop: '1.5rem' 
            }}>
              {galleryPhotos.map((imgSrc, index) => (
                <div key={index} style={{ overflow: 'hidden', borderRadius: '8px' }}>
                  <img 
                    src={imgSrc} 
                    alt={`Galeri ${index + 1}`} 
                    style={{ 
                      width: '100%', 
                      height: '140px', 
                      objectFit: 'cover',
                      display: 'block'
                    }} 
                  />
                </div>
              ))}
            </div>
          </section>

          {/* Acara Pernikahan */}
          <section className="content-section">
            <h2 className="subtitle">Acara Pernikahan</h2>
            <div className="card">
              <h3>Akad Nikah & Resepsi</h3>
              <p style={{ margin: '0.5rem 0', fontWeight: 'bold' }}>Sabtu, 24 Oktober 2026</p>
              <p style={{ fontSize: '0.9rem' }}>Pukul: 09.00 WIB - Selesai</p>
              <p style={{ fontSize: '0.85rem', marginTop: '0.5rem', color: '#555' }}>
                Gedung Pernikahan Indah, Jakarta
              </p>
              <a 
                href="https://maps.google.com" 
                target="_blank" 
                rel="noreferrer" 
                className="btn-map"
              >
                Petunjuk Lokasi (Google Maps)
              </a>
            </div>
          </section>

          {/* Amplop Digital */}
          <section className="content-section" style={{ background: 'var(--bg-primary)' }}>
            <h2 className="subtitle">Amplop Digital</h2>
            <p style={{ fontSize: '0.85rem', color: '#666', margin: '0.5rem 0 1.5rem 0' }}>
              Doa restu Anda merupakan hadiah terindah bagi kami. Bagi yang ingin memberikan tanda kasih:
            </p>

            <div className="card" style={{ background: '#fff' }}>
              <h4>Bank BCA</h4>
              <p style={{ fontSize: '1.2rem', fontWeight: 'bold', margin: '0.5rem 0', color: 'var(--accent-color)' }}>
                1234567890
              </p>
              <p style={{ fontSize: '0.85rem', color: '#777' }}>a.n. Romeo Montague</p>
              <button 
                className="btn-map" 
                onClick={() => handleCopyRekening('1234567890')}
                style={{ cursor: 'pointer', border: 'none' }}
              >
                {copied ? 'Tercopy!' : 'Salin No. Rekening'}
              </button>
            </div>
          </section>

          {/* Form RSVP & Ucapan */}
          <section className="content-section">
            <h2 className="subtitle">Konfirmasi Kehadiran & Ucapan</h2>
            
            <form onSubmit={handleSubmitWish} className="card" style={{ textAlign: 'left' }}>
              <div style={{ marginBottom: '1rem' }}>
                <label style={{ fontSize: '0.85rem', display: 'block', marginBottom: '0.3rem' }}>Nama Anda:</label>
                <input 
                  type="text" 
                  value={nameInput} 
                  onChange={(e) => setNameInput(e.target.value)}
                  required 
                  style={{ width: '100%', padding: '0.5rem', borderRadius: '4px', border: '1px solid #ccc' }}
                />
              </div>

              <div style={{ marginBottom: '1rem' }}>
                <label style={{ fontSize: '0.85rem', display: 'block', marginBottom: '0.3rem' }}>Konfirmasi Kehadiran:</label>
                <select 
                  value={attendance} 
                  onChange={(e) => setAttendance(e.target.value)}
                  style={{ width: '100%', padding: '0.5rem', borderRadius: '4px', border: '1px solid #ccc' }}
                >
                  <option value="Hadir">Hadir</option>
                  <option value="Tidak Hadir">Tidak Dapat Hadir</option>
                </select>
              </div>

              {attendance === 'Hadir' && (
                <div style={{ marginBottom: '1rem' }}>
                  <label style={{ fontSize: '0.85rem', display: 'block', marginBottom: '0.3rem' }}>Jumlah Tamu Hadir:</label>
                  <input 
                    type="number" 
                    min="1" 
                    max="5"
                    value={guestCount} 
                    onChange={(e) => setGuestCount(parseInt(e.target.value))}
                    style={{ width: '100%', padding: '0.5rem', borderRadius: '4px', border: '1px solid #ccc' }}
                  />
                </div>
              )}

              <div style={{ marginBottom: '1rem' }}>
                <label style={{ fontSize: '0.85rem', display: 'block', marginBottom: '0.3rem' }}>Pesan & Doa Ucapan:</label>
                <textarea 
                  rows="3" 
                  value={message} 
                  onChange={(e) => setMessage(e.target.value)}
                  required 
                  placeholder="Tuliskan ucapan untuk kedua mempelai..."
                  style={{ width: '100%', padding: '0.5rem', borderRadius: '4px', border: '1px solid #ccc' }}
                />
              </div>

              <button 
                type="submit" 
                className="btn-open" 
                disabled={loading}
                style={{ width: '100%', marginTop: '0.5rem', opacity: loading ? 0.7 : 1 }}
              >
                {loading ? 'Mengirim...' : 'Kirim Ucapan'}
              </button>
            </form>

            {/* List Ucapan dari Turso */}
            <div style={{ textAlign: 'left', marginTop: '2rem' }}>
              <h4 style={{ marginBottom: '1rem', textTransform: 'uppercase', fontSize: '0.85rem', letterSpacing: '1px' }}>
                Ucapan ({wishesList.length})
              </h4>
              
              <div style={{ maxHeight: '300px', overflowY: 'auto' }}>
                {wishesList.map((item) => (
                  <div key={item.id} className="card" style={{ marginBottom: '0.8rem', padding: '1rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <strong>{item.name}</strong>
                      <span style={{ 
                        fontSize: '0.7rem', 
                        padding: '0.2rem 0.5rem', 
                        borderRadius: '10px', 
                        background: item.attendance === 'Hadir' ? '#e6f4ea' : '#fce8e6',
                        color: item.attendance === 'Hadir' ? '#137333' : '#c5221f'
                      }}>
                        {item.attendance} {item.attendance === 'Hadir' && `(${item.guest_count} Orang)`}
                      </span>
                    </div>
                    <p style={{ fontSize: '0.85rem', margin: '0.5rem 0', color: '#444' }}>{item.message}</p>
                    <small style={{ fontSize: '0.7rem', color: '#999' }}>{item.created_at}</small>
                  </div>
                ))}
              </div>
            </div>
          </section>

          <footer className="content-section" style={{ fontSize: '0.8rem', color: '#888' }}>
            <p>Terima kasih atas doa dan restu Anda.</p>
          </footer>
        </div>
      )}
    </div>
  );
}