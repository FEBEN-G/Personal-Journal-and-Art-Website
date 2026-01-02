'use client';

import { useState, useEffect, use } from 'react';
import DateTime from '@/components/DateTime';
import { fetchJournalEntry } from '@/services/api';
import { notFound } from 'next/navigation';

export default function JournalEntryPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [entry, setEntry] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadData() {
      try {
        const data = await fetchJournalEntry(id);
        if (!data) {
          setError('Entry not found.');
        } else {
          setEntry(data);
        }
      } catch (err) {
        console.error(err);
        setError('Unable to load this entry. The server might be waking up—please try refreshing.');
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [id]);

  if (loading) {
    return (
      <div className="fade-up" style={{ padding: '6rem 0' }}>
        <div className="art-card" style={{ maxWidth: '800px', margin: '0 auto', textAlign: 'center', padding: '6rem' }}>
          <div className="loading-spinner"></div>
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

  if (error || !entry) {
    return (
      <div className="fade-up" style={{ padding: '6rem 0' }}>
        <div className="art-card" style={{ maxWidth: '800px', margin: '0 auto', textAlign: 'center', padding: '4rem', border: '1px dashed var(--accent-vibrant)' }}>
          <p className="serif" style={{ fontSize: '1.2rem', color: 'var(--accent-vibrant)' }}>{error || 'Entry not found'}</p>
          <div style={{ marginTop: '2rem' }}>
            <a href="/journal" className="btn btn-primary">Back to Archive</a>
          </div>
        </div>
      </div>
    );
  }

  // Simple cleaner to remove Markdown symbols (#, *, etc) for a cleaner UI
  const cleanContent = entry.contentText
    .replace(/#+\s?/g, '') // Remove headers
    .replace(/\*+\s?/g, '') // Remove bold/italic markers
    .replace(/---\s?/g, ''); // Remove horizontal rules

  return (
    <div className="fade-up" style={{ padding: '6rem 0' }}>
      <div style={{ maxWidth: '800px', margin: '0 auto' }}>
        <header style={{ marginBottom: '4rem', textAlign: 'center' }}>
          <DateTime date={entry.date} time={entry.time} />
          <h1 className="serif" style={{ fontSize: '3.5rem', color: 'var(--text-primary)', lineHeight: 1.1, marginTop: '1rem', letterSpacing: '-1.5px' }}>
            {entry.title}
          </h1>
        </header>

        <div className="art-card" style={{ padding: '4rem', border: 'none', background: 'var(--bg-secondary)' }}>
          <div className="journal-content" style={{ 
            fontSize: '1.15rem', 
            lineHeight: '1.8', 
            whiteSpace: 'pre-wrap', 
            color: 'var(--text-primary)', 
            opacity: 0.9,
            fontFamily: 'var(--font-sans)' // Using the nav font style
          }}>
            {cleanContent}
          </div>

          {entry.images && entry.images.length > 0 && (
            <div style={{ marginTop: '4rem', display: 'grid', gridTemplateColumns: '1fr', gap: '2rem' }}>
              {entry.images.map((img: string, idx: number) => (
                <div key={idx} style={{ borderRadius: '20px', overflow: 'hidden', boxShadow: 'var(--shadow)' }}>
                  <img src={img} alt={`Journal entry image ${idx + 1}`} style={{ width: '100%', display: 'block' }} />
                </div>
              ))}
            </div>
          )}
        </div>

        <div style={{ marginTop: '4rem', textAlign: 'center' }}>
          <a href="/journal" className="btn" style={{ border: '1px solid var(--border-color)', background: 'var(--bg-secondary)', padding: '1rem 2rem' }}>
            ← Back to Archive
          </a>
        </div>
      </div>
    </div>
  );
}
