import React, { useState, useEffect } from 'react';
import { turso } from '../turso';

export default function WishSection({ defaultGuestName }) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Form State
  const [nameInput, setNameInput] = useState(defaultGuestName || '');
  const [attendance, setAttendance] = useState('Hadir');
  const [guestCount, setGuestCount] = useState(1);
  const [message, setMessage] = useState('');
  
  // Data State
  const [wishesList, setWishesList] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (defaultGuestName) setNameInput(defaultGuestName);
  }, [defaultGuestName]);

  const fetchWishes = async () => {
    try {
      const result = await turso.execute('SELECT * FROM wishes ORDER BY created_at DESC');
      setWishesList(result.rows);
    } catch (error) {
      console.error('Gagal mengambil data dari Turso:', error);
    }
  };

  useEffect(() => {
    fetchWishes();
  }, []);

  const handleSubmitWish = async (e) => {
    e.preventDefault();
    if (!nameInput.trim() || !message.trim()) return;

    setLoading(true);
    try {
      await turso.execute({
        sql: `INSERT INTO wishes (name, attendance, guest_count, message) VALUES (?, ?, ?, ?)`,
        args: [nameInput, attendance, attendance === 'Hadir' ? guestCount : 0, message]
      });

      setMessage('');
      setIsModalOpen(false); // Tutup modal setelah berhasil mengirim
      alert('Terima kasih atas konfirmasi dan ucapan Anda!');
      await fetchWishes();
    } catch (error) {
      console.error('Gagal menyimpan ucapan:', error);
      alert('Terjadi kesalahan saat menyimpan ucapan.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="content-section">
      <h2 className="subtitle">Konfirmasi Kehadiran & Ucapan</h2>

      {/* Tombol Pemicu Modal */}
      <button 
        className="btn-open" 
        onClick={() => setIsModalOpen(true)}
        style={{ margin: '1rem 0 1.5rem 0', width: '100%', maxWidth: '300px' }}
      >
        Isi Kehadiran & Ucapan
      </button>

      {/* List Ucapan dari Database */}
      <div style={{ textAlign: 'left' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <h4 style={{ margin: 0, textTransform: 'uppercase', fontSize: '0.85rem', letterSpacing: '1px' }}>
                Ucapan ({wishesList.length})
            </h4>

            <div style={{ fontSize: '0.75rem', display: 'flex', gap: '8px' }}>
                <span style={{ padding: '0.2rem 0.5rem', borderRadius: '10px', background: '#e6f4ea', color: '#137333', fontWeight: 'bold' }}>
                Hadir: {wishesList.filter(item => item.attendance === 'Hadir').reduce((acc, curr) => acc + (curr.guest_count || 1), 0)}
                </span>
                <span style={{ padding: '0.2rem 0.5rem', borderRadius: '10px', background: '#fce8e6', color: '#c5221f', fontWeight: 'bold' }}>
                Absen: {wishesList.filter(item => item.attendance === 'Tidak Hadir').length}
                </span>
            </div>
        </div>
        
        <div style={{ maxHeight: '350px', overflowY: 'auto' }}>
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
              {/* <small style={{ fontSize: '0.7rem', color: '#999' }}>{item.created_at}</small> */}
            </div>
          ))}
        </div>
      </div>

      {/* Pop-up Modal Form */}
      {isModalOpen && (
        <div 
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100vw',
            height: '100vh',
            backgroundColor: 'rgba(0,0,0,0.6)',
            zIndex: 1000,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '1rem'
          }}
        >
          <div 
            className="card" 
            style={{ 
              background: '#fff', 
              width: '100%', 
              maxWidth: '400px', 
              maxHeight: '90vh',
              overflowY: 'auto',
              position: 'relative',
              textAlign: 'left'
            }}
          >
            {/* Tombol Close Modal (X) */}
            <button 
              onClick={() => setIsModalOpen(false)}
              style={{
                position: 'absolute',
                top: '12px',
                right: '15px',
                border: 'none',
                background: 'none',
                fontSize: '1.2rem',
                cursor: 'pointer',
                color: '#666'
              }}
            >
              ✕
            </button>

            <h3 style={{ marginBottom: '1rem', color: 'var(--accent-color)' }}>Kirim Ucapan</h3>

            <form onSubmit={handleSubmitWish}>
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
          </div>
        </div>
      )}
    </section>
  );
}