'use client';

import { useState, useEffect } from 'react';
import EntryCard from '@/components/EntryCard';
import { fetchJournalEntries } from '@/services/api';

export default function JournalList() {
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadData() {
      try {
        const data = await fetchJournalEntries();
        setEntries(data);
      } catch (err) {
        console.error(err);
        setError('Unable to load entries. The server might be waking up—please try refreshing in a moment.');
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  return (
    <div className="fade-up">
      <section style={{ textAlign: 'center', padding: '6rem 0 4rem 0' }}>
        <h1 className="section-title">The Journal.</h1>
        <p className="serif" style={{ fontSize: '1.4rem', color: 'var(--text-secondary)', fontStyle: 'italic', marginBottom: '2rem' }}>
          "Thoughts, plans, and prayers — documented with care."
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
        ) : entries.length === 0 ? (
          <div className="art-card" style={{ textAlign: 'center' }}>
            <p className="serif" style={{ fontSize: '1.2rem' }}>The journal is waiting for its first entry of 2026.</p>
          </div>
        ) : (
          entries.map((entry: any) => (
            <EntryCard 
              key={entry._id}
              id={entry._id}
              title={entry.title}
              date={entry.date}
              time={entry.time}
              excerpt={entry.contentText}
            />
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
