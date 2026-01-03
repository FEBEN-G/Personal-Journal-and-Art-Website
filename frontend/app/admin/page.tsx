'use client';

import { useState, useEffect } from 'react';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

export default function AdminPage() {
  const [token, setToken] = useState<string | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loginForm, setLoginForm] = useState({ username: '', password: '' });
  const [activeForm, setActiveForm] = useState('journal');
  const [status, setStatus] = useState('');

  const [journal, setJournal] = useState({ title: '', contentText: '', images: '', date: '', time: '' });
  const [verse, setVerse] = useState({ verseText: '', reference: '', reflection: '', date: '' });
  const [art, setArt] = useState({ title: '', imageUrl: '', description: '', date: '' });

  // Load token from localStorage on mount
  useEffect(() => {
    const savedToken = localStorage.getItem('adminToken');
    if (savedToken) {
      setToken(savedToken);
      setIsLoggedIn(true);
    }
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('Verifying...');
    try {
      const res = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(loginForm),
      });

      if (res.ok) {
        const data = await res.json();
        localStorage.setItem('adminToken', data.token);
        setToken(data.token);
        setIsLoggedIn(true);
        setStatus('');
      } else {
        setStatus('Invalid credentials.');
      }
    } catch (err) {
      console.error(err);
      setStatus('Failed to connect to security server.');
    }
  };

  const logout = () => {
    localStorage.removeItem('adminToken');
    setToken(null);
    setIsLoggedIn(false);
  };

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
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(body),
      });

      if (res.ok) {
        setStatus('Success! Added new entry.');
        if (type === 'journal') setJournal({ title: '', contentText: '', images: '', date: '', time: '' });
        if (type === 'verse') setVerse({ verseText: '', reference: '', reflection: '', date: '' });
        if (type === 'art') setArt({ title: '', imageUrl: '', description: '', date: '' });
      } else if (res.status === 401) {
        setStatus('Session expired. Please log in again.');
        logout();
      } else {
        setStatus('Error saving entry.');
      }
    } catch (err) {
      console.error(err);
      setStatus('Failed to connect to API.');
    }
  };

  if (!isLoggedIn) {
    return (
      <div className="paper-card fade-in" style={{ marginTop: '8rem', maxWidth: '400px', margin: '8rem auto' }}>
        <h1 className="serif" style={{ textAlign: 'center', marginBottom: '2rem', color: 'var(--accent-vibrant)' }}>✧ Authentication Required ✧</h1>
        <p style={{ textAlign: 'center', color: 'var(--text-secondary)', marginBottom: '2rem' }}>Please identify yourself to access the sanctuary.</p>
        
        {status && <div style={{ textAlign: 'center', marginBottom: '1rem', fontWeight: 'bold', color: 'var(--accent-vibrant)' }}>{status}</div>}
        
        <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <input 
            type="text" 
            placeholder="Username" 
            value={loginForm.username} 
            onChange={e => setLoginForm({...loginForm, username: e.target.value})} 
            required 
            style={{ padding: '0.8rem', border: '1px solid var(--border-color)', background: 'var(--bg-secondary)', color: 'var(--text-primary)', borderRadius: '10px' }} 
          />
          <input 
            type="password" 
            placeholder="Password" 
            value={loginForm.password} 
            onChange={e => setLoginForm({...loginForm, password: e.target.value})} 
            required 
            style={{ padding: '0.8rem', border: '1px solid var(--border-color)', background: 'var(--bg-secondary)', color: 'var(--text-primary)', borderRadius: '10px' }} 
          />
          <button type="submit" style={{ padding: '1rem', background: 'var(--accent-vibrant)', color: 'white', border: 'none', cursor: 'pointer', fontWeight: 'bold', borderRadius: '10px', marginTop: '1rem' }}>Enter Admin Console</button>
        </form>
      </div>
    );
  }

  return (
    <div className="paper-card fade-in" style={{ marginTop: '2rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h1 className="serif" style={{ color: 'var(--accent-vibrant)', margin: 0 }}>✧ Admin Console ✧</h1>
        <button onClick={logout} style={{ background: 'none', border: '1px solid var(--accent-vibrant)', color: 'var(--accent-vibrant)', padding: '0.5rem 1rem', cursor: 'pointer', borderRadius: '8px', fontSize: '0.8rem' }}>Log Out</button>
      </div>
      
      <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', marginBottom: '2rem' }}>
        <button onClick={() => setActiveForm('journal')} style={{ 
          padding: '0.5rem 1rem', 
          background: activeForm === 'journal' ? 'var(--accent-vibrant)' : 'var(--bg-secondary)', 
          color: activeForm === 'journal' ? 'white' : 'var(--text-primary)', 
          border: '1px solid var(--accent-vibrant)', 
          cursor: 'pointer',
          borderRadius: '8px'
        }}>Add Journal</button>
        <button onClick={() => setActiveForm('verse')} style={{ 
          padding: '0.5rem 1rem', 
          background: activeForm === 'verse' ? 'var(--accent-vibrant)' : 'var(--bg-secondary)', 
          color: activeForm === 'verse' ? 'white' : 'var(--text-primary)', 
          border: '1px solid var(--accent-vibrant)', 
          cursor: 'pointer',
          borderRadius: '8px'
        }}>Add Verse</button>
        <button onClick={() => setActiveForm('art')} style={{ 
          padding: '0.5rem 1rem', 
          background: activeForm === 'art' ? 'var(--accent-vibrant)' : 'var(--bg-secondary)', 
          color: activeForm === 'art' ? 'white' : 'var(--text-primary)', 
          border: '1px solid var(--accent-vibrant)', 
          cursor: 'pointer',
          borderRadius: '8px'
        }}>Add Art</button>
      </div>

      {status && <div style={{ textAlign: 'center', marginBottom: '1rem', fontWeight: 'bold', color: status.includes('Success') ? 'var(--accent-vibrant)' : '#ff4d4d' }}>{status}</div>}

      {activeForm === 'journal' && (
        <form onSubmit={(e) => handleSubmit(e, 'journal')} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <input placeholder="Title" value={journal.title} onChange={e => setJournal({...journal, title: e.target.value})} required style={{ padding: '0.8rem', border: '1px solid var(--border-color)', background: 'var(--bg-secondary)', color: 'var(--text-primary)', borderRadius: '10px' }} />
          <textarea placeholder="Content Text" value={journal.contentText} onChange={e => setJournal({...journal, contentText: e.target.value})} required style={{ padding: '0.8rem', border: '1px solid var(--border-color)', background: 'var(--bg-secondary)', color: 'var(--text-primary)', borderRadius: '10px', minHeight: '200px' }} />
          <input placeholder="Images (comma separated URLs)" value={journal.images} onChange={e => setJournal({...journal, images: e.target.value})} style={{ padding: '0.8rem', border: '1px solid var(--border-color)', background: 'var(--bg-secondary)', color: 'var(--text-primary)', borderRadius: '10px' }} />
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <input type="text" placeholder="Date (e.g., January 1, 2026)" value={journal.date} onChange={e => setJournal({...journal, date: e.target.value})} required style={{ padding: '0.8rem', border: '1px solid var(--border-color)', background: 'var(--bg-secondary)', color: 'var(--text-primary)', borderRadius: '10px' }} />
            <input type="text" placeholder="Time (e.g., 10:30 PM)" value={journal.time} onChange={e => setJournal({...journal, time: e.target.value})} required style={{ padding: '0.8rem', border: '1px solid var(--border-color)', background: 'var(--bg-secondary)', color: 'var(--text-primary)', borderRadius: '10px' }} />
          </div>
          <button type="submit" style={{ padding: '1rem', background: 'var(--accent-vibrant)', color: 'white', border: 'none', cursor: 'pointer', fontWeight: 'bold', borderRadius: '10px' }}>Post Journal Entry</button>
        </form>
      )}

      {activeForm === 'verse' && (
        <form onSubmit={(e) => handleSubmit(e, 'verse')} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <textarea placeholder="Verse Text" value={verse.verseText} onChange={e => setVerse({...verse, verseText: e.target.value})} required style={{ padding: '0.8rem', border: '1px solid var(--border-color)', background: 'var(--bg-secondary)', color: 'var(--text-primary)', borderRadius: '10px', minHeight: '100px' }} />
          <input placeholder="Reference (e.g., Psalm 23:1)" value={verse.reference} onChange={e => setVerse({...verse, reference: e.target.value})} required style={{ padding: '0.8rem', border: '1px solid var(--border-color)', background: 'var(--bg-secondary)', color: 'var(--text-primary)', borderRadius: '10px' }} />
          <textarea placeholder="Reflection (optional)" value={verse.reflection} onChange={e => setVerse({...verse, reflection: e.target.value})} style={{ padding: '0.8rem', border: '1px solid var(--border-color)', background: 'var(--bg-secondary)', color: 'var(--text-primary)', borderRadius: '10px', minHeight: '100px' }} />
          <input type="text" placeholder="Date" value={verse.date} onChange={e => setVerse({...verse, date: e.target.value})} required style={{ padding: '0.8rem', border: '1px solid var(--border-color)', background: 'var(--bg-secondary)', color: 'var(--text-primary)', borderRadius: '10px' }} />
          <button type="submit" style={{ padding: '1rem', background: 'var(--accent-vibrant)', color: 'white', border: 'none', cursor: 'pointer', fontWeight: 'bold', borderRadius: '10px' }}>Post Verse</button>
        </form>
      )}

      {activeForm === 'art' && (
        <form onSubmit={(e) => handleSubmit(e, 'art')} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <input placeholder="Art Title" value={art.title} onChange={e => setArt({...art, title: e.target.value})} required style={{ padding: '0.8rem', border: '1px solid var(--border-color)', background: 'var(--bg-secondary)', color: 'var(--text-primary)', borderRadius: '10px' }} />
          <input placeholder="Image URL" value={art.imageUrl} onChange={e => setArt({...art, imageUrl: e.target.value})} required style={{ padding: '0.8rem', border: '1px solid var(--border-color)', background: 'var(--bg-secondary)', color: 'var(--text-primary)', borderRadius: '10px' }} />
          <textarea placeholder="Description (optional)" value={art.description} onChange={e => setArt({...art, description: e.target.value})} style={{ padding: '0.8rem', border: '1px solid var(--border-color)', background: 'var(--bg-secondary)', color: 'var(--text-primary)', borderRadius: '10px', minHeight: '100px' }} />
          <input type="text" placeholder="Date" value={art.date} onChange={e => setArt({...art, date: e.target.value})} required style={{ padding: '0.8rem', border: '1px solid var(--border-color)', background: 'var(--bg-secondary)', color: 'var(--text-primary)', borderRadius: '10px' }} />
          <button type="submit" style={{ padding: '1rem', background: 'var(--accent-vibrant)', color: 'white', border: 'none', cursor: 'pointer', fontWeight: 'bold', borderRadius: '10px' }}>Post Art</button>
        </form>
      )}
    </div>
  );
}
