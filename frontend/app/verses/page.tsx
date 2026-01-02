'use client';

import { useState, useEffect } from 'react';
import { fetchVerses } from '@/services/api';

export default function VersePage() {
  const [verses, setVerses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadData() {
      try {
        const data = await fetchVerses();
        setVerses(data);
      } catch (err) {
        console.error(err);
        setError('Unable to load verses. The server might be waking up—please try refreshing in a moment.');
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  return (
    <div className="fade-up">
      <section style={{ textAlign: 'center', padding: '6rem 0 4rem 0' }}>
        <h1 className="section-title">Faith.</h1>
        <p className="serif" style={{ fontSize: '1.4rem', color: 'var(--text-secondary)', fontStyle: 'italic', marginBottom: '2rem' }}>
          "His word is a lamp to my feet and a light to my path."
        </p>
        <div className="art-separator"></div>
      </section>

      <div style={{ maxWidth: '800px', margin: '0 auto', paddingBottom: '6rem', minHeight: '300px' }}>
        {loading ? (
          <div className="art-card" style={{ textAlign: 'center', padding: '6rem' }}>
            <div className="loading-spinner"></div>
          </div>
        ) : error ? (
          <div className="art-card" style={{ textAlign: 'center', padding: '4rem', border: '1px dashed var(--accent-vibrant)' }}>
            <p className="serif" style={{ fontSize: '1.1rem', color: 'var(--accent-vibrant)' }}>{error}</p>
          </div>
        ) : verses.length === 0 ? (
          <div className="art-card" style={{ textAlign: 'center' }}>
            <p className="serif" style={{ fontSize: '1.2rem' }}>No verses shared yet. ✝︎</p>
          </div>
        ) : (
          verses.map((verse: any) => (
            <div key={verse._id} className="art-card fade-up" style={{ marginBottom: '4rem', padding: '4rem', textAlign: 'center', border: 'none', background: 'var(--bg-secondary)' }}>
              <div style={{ color: 'var(--accent-vibrant)', fontSize: '2rem', marginBottom: '1.5rem' }}>✝︎</div>
              <p style={{ 
                fontSize: '1.4rem', 
                color: 'var(--text-primary)', 
                lineHeight: 1.5, 
                marginBottom: '1.5rem',
                fontFamily: 'var(--font-sans)',
                fontWeight: 600
              }}>
                "{verse.verseText}"
              </p>
              <p style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--accent-secondary)', textTransform: 'uppercase', letterSpacing: '3px', marginBottom: '2rem' }}>
                — {verse.reference}
              </p>
              
              {verse.reflection && (
                <>
                  <div className="art-separator" style={{ width: '40px', margin: '2rem auto' }}></div>
                  <p style={{ 
                    fontSize: '1.15rem', 
                    color: 'var(--text-secondary)', 
                    lineHeight: 1.8,
                    fontFamily: 'var(--font-sans)'
                  }}>
                    {verse.reflection}
                  </p>
                </>
              )}
              
              <div style={{ marginTop: '3rem', fontSize: '0.8rem', color: 'var(--text-secondary)', opacity: 0.5, fontWeight: 600 }}>
                {verse.date}
              </div>
            </div>
          ))
        )}
      </div>

      <style jsx>{`
        .loading-spinner {
          width: 40px;
          height: 40px;
          border: 3px solid var(--bg-secondary);
          border-top: 3px solid var(--accent-vibrant);
          border-radius: 50%;
          margin: 0 auto;
          animation: spin 1s linear infinite;
        }
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
