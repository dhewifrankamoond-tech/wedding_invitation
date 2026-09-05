import React, { useState, useEffect } from 'react';
import { config } from '../loadConfig';

export default function EventSection() {
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  const targetDate = new Date(config.event.target_date_iso);

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date();
      const difference = targetDate.getTime() - now.getTime();

      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / 1000 / 60) % 60),
          seconds: Math.floor((difference / 1000) % 60)
        });
      } else {
        clearInterval(timer);
      }
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <section className="content-section" style={{ background: 'var(--bg-primary)' }}>
      <h2 className="subtitle">Acara Pernikahan</h2>
      
      <div className="card" style={{ background: '#fff' }}>
        <h3>{config.event.title}</h3>
        <p style={{ margin: '0.5rem 0', fontWeight: 'bold' }}>{config.event.date_string}</p>
        <p style={{ fontSize: '0.9rem' }}>{config.event.time_string}</p>
        <p style={{ fontSize: '0.85rem', marginTop: '0.5rem', color: '#555' }}>
          {config.event.location_name}
        </p>

        {/* Countdown Timer */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: '10px', margin: '1.5rem 0' }}>
          {[
            { label: 'Hari', value: timeLeft.days },
            { label: 'Jam', value: timeLeft.hours },
            { label: 'Menit', value: timeLeft.minutes },
            { label: 'Detik', value: timeLeft.seconds }
          ].map((item, idx) => (
            <div key={idx} style={{
              background: 'var(--bg-primary)',
              padding: '0.6rem',
              borderRadius: '8px',
              minWidth: '60px',
              border: '1px solid #f0e6d2'
            }}>
              <div style={{ fontSize: '1.2rem', fontWeight: 'bold', color: 'var(--accent-color)' }}>
                {String(item.value).padStart(2, '0')}
              </div>
              <div style={{ fontSize: '0.65rem', textTransform: 'uppercase', color: '#666', marginTop: '0.2rem' }}>
                {item.label}
              </div>
            </div>
          ))}
        </div>

        {/* Embedded Google Maps dari YAML */}
        <div style={{ overflow: 'hidden', borderRadius: '8px', marginTop: '1rem' }}>
          <iframe 
            src={config.maps.embed_url} 
            width="100%" 
            height="250" 
            style={{ border: 0 }} 
            allowFullScreen="" 
            loading="lazy" 
            referrerPolicy="strict-origin-when-cross-origin"
            title="Lokasi Acara Pernikahan"
          ></iframe>
        </div>

        <div style={{ marginTop: '1rem' }}>
          <a 
            href={config.maps.direct_url} 
            target="_blank" 
            rel="noreferrer" 
            className="btn-map"
          >
            Buka di Aplikasi Google Maps
          </a>
        </div>
      </div>
    </section>
  );
}