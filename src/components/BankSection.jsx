import React, { useState } from 'react';
import { config } from '../loadConfig';

export default function BankSection() {
  // State menyimpan ID/Nomor rekening yang baru saja disalin
  const [copiedAccount, setCopiedAccount] = useState(null);

  const handleCopyRekening = (rekening) => {
    navigator.clipboard.writeText(rekening);
    setCopiedAccount(rekening);
    setTimeout(() => setCopiedAccount(null), 2000);
  };

  // Jika tidak ada data bank di YAML, section tidak akan tampil
  if (!config.banks || config.banks.length === 0) return null;

  return (
    <section className="content-section" style={{ background: 'var(--bg-primary)' }}>
      <h2 className="subtitle">Amplop Digital</h2>
      <p style={{ fontSize: '0.85rem', color: '#666', margin: '0.5rem 0 1.5rem 0' }}>
        Doa restu Anda merupakan hadiah terindah bagi kami. Bagi yang ingin memberikan tanda kasih:
      </p>

      {config.banks.map((bank, index) => (
        <div key={index} className="card" style={{ background: '#fff', marginBottom: '1rem' }}>
          <h4>{bank.name}</h4>
          <p style={{ fontSize: '1.2rem', fontWeight: 'bold', margin: '0.5rem 0', color: 'var(--accent-color)' }}>
            {bank.account_number}
          </p>
          <p style={{ fontSize: '0.85rem', color: '#777' }}>{bank.account_holder}</p>
          <button 
            className="btn-map" 
            onClick={() => handleCopyRekening(bank.account_number)}
            style={{ cursor: 'pointer', border: 'none' }}
          >
            {copiedAccount === bank.account_number ? 'Tercopy!' : 'Salin No. Rekening'}
          </button>
        </div>
      ))}
    </section>
  );
}