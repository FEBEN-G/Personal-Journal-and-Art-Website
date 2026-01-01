'use client';

import { useState } from 'react';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

export default function AdminPage() {
  const [activeForm, setActiveForm] = useState('journal');
  const [status, setStatus] = useState('');

  const [journal, setJournal] = useState({ title: '', contentText: '', images: '', date: '', time: '' });
  const [verse, setVerse] = useState({ verseText: '', reference: '', reflection: '', date: '' });
  const [art, setArt] = useState({ title: '', imageUrl: '', description: '', date: '' });

  const handleSubmit = async (e: React.FormEvent, type: string) => {
    e.preventDefault();
    setStatus('Saving...');
    
    let body: any = {};
    if (type === 'journal') {
      body = { ...journal, images: journal.images ? journal.images.split(',').map(img => img.trim()) : [] };
    } else if (type === 'verse') {
      body = verse;
    } else if (type === 'art') {
      body = art;
    }

    try {
      const res = await fetch(`${API_URL}/${type === 'journal' ? 'journal' : type === 'verse' ? 'verses' : 'art'}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      if (res.ok) {
        setStatus('Success! Added new entry.');
        if (type === 'journal') setJournal({ title: '', contentText: '', images: '', date: '', time: '' });
        if (type === 'verse') setVerse({ verseText: '', reference: '', reflection: '', date: '' });
        if (type === 'art') setArt({ title: '', imageUrl: '', description: '', date: '' });
      } else {
        setStatus('Error saving entry.');
      }
    } catch (err) {
      console.error(err);
      setStatus('Failed to connect to API.');
    }
  };

  return (
    <div className="paper-card fade-in" style={{ marginTop: '2rem' }}>
      <h1 className="serif" style={{ textAlign: 'center', marginBottom: '2rem', color: 'var(--accent-blue)' }}>✧ Admin Console ✧</h1>
      
      <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', marginBottom: '2rem' }}>
        <button onClick={() => setActiveForm('journal')} style={{ padding: '0.5rem 1rem', background: activeForm === 'journal' ? 'var(--accent-blue)' : 'white', color: activeForm === 'journal' ? 'white' : 'black', border: '1px solid var(--accent-blue)', cursor: 'pointer' }}>Add Journal</button>
        <button onClick={() => setActiveForm('verse')} style={{ padding: '0.5rem 1rem', background: activeForm === 'verse' ? 'var(--accent-blue)' : 'white', color: activeForm === 'verse' ? 'white' : 'black', border: '1px solid var(--accent-blue)', cursor: 'pointer' }}>Add Verse</button>
        <button onClick={() => setActiveForm('art')} style={{ padding: '0.5rem 1rem', background: activeForm === 'art' ? 'var(--accent-blue)' : 'white', color: activeForm === 'art' ? 'white' : 'black', border: '1px solid var(--accent-blue)', cursor: 'pointer' }}>Add Art</button>
      </div>

      {status && <div style={{ textAlign: 'center', marginBottom: '1rem', fontWeight: 'bold', color: status.includes('Success') ? 'green' : 'red' }}>{status}</div>}

      {activeForm === 'journal' && (
        <form onSubmit={(e) => handleSubmit(e, 'journal')} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <input placeholder="Title" value={journal.title} onChange={e => setJournal({...journal, title: e.target.value})} required style={{ padding: '0.8rem', border: '1px solid var(--paper-border)' }} />
          <textarea placeholder="Content Text" value={journal.contentText} onChange={e => setJournal({...journal, contentText: e.target.value})} required style={{ padding: '0.8rem', border: '1px solid var(--paper-border)', minHeight: '200px' }} />
          <input placeholder="Images (comma separated URLs)" value={journal.images} onChange={e => setJournal({...journal, images: e.target.value})} style={{ padding: '0.8rem', border: '1px solid var(--paper-border)' }} />
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <input type="text" placeholder="Date (e.g., January 1, 2026)" value={journal.date} onChange={e => setJournal({...journal, date: e.target.value})} required style={{ padding: '0.8rem', border: '1px solid var(--paper-border)' }} />
            <input type="text" placeholder="Time (e.g., 10:30 PM)" value={journal.time} onChange={e => setJournal({...journal, time: e.target.value})} required style={{ padding: '0.8rem', border: '1px solid var(--paper-border)' }} />
          </div>
          <button type="submit" style={{ padding: '1rem', background: 'var(--accent-orange)', color: 'white', border: 'none', cursor: 'pointer', fontWeight: 'bold' }}>Post Journal Entry</button>
        </form>
      )}

      {activeForm === 'verse' && (
        <form onSubmit={(e) => handleSubmit(e, 'verse')} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <textarea placeholder="Verse Text" value={verse.verseText} onChange={e => setVerse({...verse, verseText: e.target.value})} required style={{ padding: '0.8rem', border: '1px solid var(--paper-border)', minHeight: '100px' }} />
          <input placeholder="Reference (e.g., Psalm 23:1)" value={verse.reference} onChange={e => setVerse({...verse, reference: e.target.value})} required style={{ padding: '0.8rem', border: '1px solid var(--paper-border)' }} />
          <textarea placeholder="Reflection (optional)" value={verse.reflection} onChange={e => setVerse({...verse, reflection: e.target.value})} style={{ padding: '0.8rem', border: '1px solid var(--paper-border)', minHeight: '100px' }} />
          <input type="text" placeholder="Date" value={verse.date} onChange={e => setVerse({...verse, date: e.target.value})} required style={{ padding: '0.8rem', border: '1px solid var(--paper-border)' }} />
          <button type="submit" style={{ padding: '1rem', background: 'var(--accent-orange)', color: 'white', border: 'none', cursor: 'pointer', fontWeight: 'bold' }}>Post Verse</button>
        </form>
      )}

      {activeForm === 'art' && (
        <form onSubmit={(e) => handleSubmit(e, 'art')} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <input placeholder="Art Title" value={art.title} onChange={e => setArt({...art, title: e.target.value})} required style={{ padding: '0.8rem', border: '1px solid var(--paper-border)' }} />
          <input placeholder="Image URL" value={art.imageUrl} onChange={e => setArt({...art, imageUrl: e.target.value})} required style={{ padding: '0.8rem', border: '1px solid var(--paper-border)' }} />
          <textarea placeholder="Description (optional)" value={art.description} onChange={e => setArt({...art, description: e.target.value})} style={{ padding: '0.8rem', border: '1px solid var(--paper-border)', minHeight: '100px' }} />
          <input type="text" placeholder="Date" value={art.date} onChange={e => setArt({...art, date: e.target.value})} required style={{ padding: '0.8rem', border: '1px solid var(--paper-border)' }} />
          <button type="submit" style={{ padding: '1rem', background: 'var(--accent-orange)', color: 'white', border: 'none', cursor: 'pointer', fontWeight: 'bold' }}>Post Art</button>
        </form>
      )}
    </div>
  );
}
