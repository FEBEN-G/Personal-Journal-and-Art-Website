'use client';

import { useState } from 'react';

export default function GalleryGrid({ artPieces }: { artPieces: any[] }) {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  return (
    <div className="fade-up">
      <div className="gallery-grid" style={{ paddingBottom: '6rem' }}>
        {artPieces.map((art: any) => (
          <div 
            key={art._id} 
            className="art-card" 
            style={{ padding: '1rem', cursor: 'zoom-in' }}
            onClick={() => setSelectedImage(art.imageUrl)}
          >
            <div style={{ 
              borderRadius: '12px', 
              overflow: 'hidden', 
              marginBottom: '1.5rem', 
              aspectRatio: '4/5',
              position: 'relative'
            }}>
              <img 
                src={art.imageUrl} 
                alt={art.title} 
                style={{ 
                  width: '100%', 
                  height: '100%', 
                  objectFit: 'cover', 
                  display: 'block',
                  transition: 'transform 0.5s ease'
                }} 
                className="gallery-img"
              />
              <div className="overlay" style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                background: 'rgba(0,0,0,0.2)',
                opacity: 0,
                transition: 'opacity 0.3s ease',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'white',
                fontSize: '1.2rem',
                fontWeight: 600
              }}>
                View Full Size ✧
              </div>
            </div>
            <div style={{ padding: '0.5rem 1rem 1rem 1rem' }}>
               <div style={{ fontSize: '0.7rem', color: 'var(--accent-vibrant)', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '2px', marginBottom: '0.5rem' }}>
                {art.date}
              </div>
              <h3 className="serif" style={{ fontSize: '1.8rem', color: 'var(--text-primary)', marginBottom: '0.8rem' }}>{art.title}</h3>
              {art.description && (
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', lineHeight: 1.6 }}>
                  {art.description}
                </p>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Lightbox / Modal */}
      {selectedImage && (
        <div 
          onClick={() => setSelectedImage(null)}
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(0,0,0,0.92)',
            zIndex: 1000,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'zoom-out',
            padding: '2rem'
          }}
          className="fade-in"
        >
          <img 
            src={selectedImage} 
            alt="Full size art" 
            style={{ 
              maxWidth: '90%', 
              maxHeight: '90%', 
              objectFit: 'contain',
              boxShadow: '0 0 50px rgba(0,0,0,0.5)',
              borderRadius: '8px'
            }} 
          />
          <button 
            style={{
              position: 'absolute',
              top: '2rem',
              right: '2rem',
              background: 'none',
              border: 'none',
              color: 'white',
              fontSize: '2.5rem',
              cursor: 'pointer'
            }}
          >
            ×
          </button>
        </div>
      )}

      <style jsx>{`
        .art-card:hover .gallery-img {
          transform: scale(1.05);
        }
        .art-card:hover .overlay {
          opacity: 1;
        }
      `}</style>
    </div>
  );
}
