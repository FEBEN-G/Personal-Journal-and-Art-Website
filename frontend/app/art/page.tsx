'use client';

import { useState, useEffect } from 'react';
import { fetchArt } from '@/services/api';
import GalleryGrid from '@/components/GalleryGrid';

export default function ArtGallery() {
  const [artPieces, setArtPieces] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadData() {
      try {
        const data = await fetchArt();
        setArtPieces(data);
      } catch (err) {
        console.error(err);
        setError('Unable to load gallery. The server might be waking up—please try refreshing in a moment.');
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  return (
    <div className="fade-up">
      <section style={{ textAlign: 'center', padding: '6rem 0 4rem 0' }}>
        <h1 className="section-title">The Gallery.</h1>
        <p className="serif" style={{ fontSize: '1.4rem', color: 'var(--text-secondary)', fontStyle: 'italic', marginBottom: '2rem' }}>
          "Returning to my first love — colors, lines, and joy."
        </p>
        <div className="art-separator"></div>
      </section>

      <div style={{ minHeight: '400px' }}>
        {loading ? (
          <div className="art-card" style={{ textAlign: 'center', padding: '6rem', maxWidth: '800px', margin: '0 auto' }}>
            <div className="loading-spinner"></div>
          </div>
        ) : error ? (
          <div className="art-card" style={{ textAlign: 'center', padding: '4rem', maxWidth: '800px', margin: '0 auto', border: '1px dashed var(--accent-vibrant)' }}>
            <p className="serif" style={{ fontSize: '1.1rem', color: 'var(--accent-vibrant)' }}>{error}</p>
          </div>
        ) : artPieces.length === 0 ? (
          <div className="art-card" style={{ textAlign: 'center', maxWidth: '800px', margin: '0 auto' }}>
            <p className="serif" style={{ fontSize: '1.2rem' }}>The canvas is clean. New art coming soon.</p>
          </div>
        ) : (
          <GalleryGrid artPieces={artPieces} />
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
