'use client';

import { useState, useEffect } from 'react';
import { fetchJournalEntries, fetchVerses, fetchArt } from '@/services/api';
import { sanitizeImageUrl } from '@/utils/urlHelper';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

export default function AdminPage() {
  const [token, setToken] = useState<string | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loginForm, setLoginForm] = useState({ username: '', password: '' });
  const [activeForm, setActiveForm] = useState('journal');
  const [status, setStatus] = useState('');

  const [items, setItems] = useState<any[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);

  const initialJournal = { title: '', contentText: '', images: '', date: '', time: '' };
  const initialVerse = { verseText: '', reference: '', reflection: '', date: '' };
  const initialArt = { title: '', imageUrl: '', description: '', date: '' };

  const [journal, setJournal] = useState(initialJournal);
  const [verse, setVerse] = useState(initialVerse);
  const [art, setArt] = useState(initialArt);

  // Load token from localStorage on mount
  useEffect(() => {
    const savedToken = localStorage.getItem('adminToken');
    if (savedToken) {
      setToken(savedToken);
      setIsLoggedIn(true);
    }
  }, []);

  const fetchItems = async () => {
    try {
      const type = activeForm === 'journal' ? 'journal' : activeForm === 'verse' ? 'verses' : 'art';
      const res = await fetch(`${API_URL}/${type}`);
      if (res.ok) {
        const data = await res.json();
        setItems(data);
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchItems();
    setEditingId(null);
    setJournal(initialJournal);
    setVerse(initialVerse);
    setArt(initialArt);
    setStatus('');
  }, [activeForm]);

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

  const openUploadWidget = (target: 'journal' | 'art') => {
    // @ts-ignore
    if (window.cloudinary) {
      // @ts-ignore
      const widget = window.cloudinary.createUploadWidget(
        {
          cloudName: 'dpr2der7g',
          uploadPreset: 'ml_feben',
          sources: ['local', 'url', 'camera'],
          multiple: target === 'journal',
          cropping: false,
          styles: {
            palette: {
              window: '#1e293b',
              sourceBg: '#0f172a',
              windowBorder: '#334155',
              tabIcon: '#fbbf24',
              inactiveTabIcon: '#94a3b8',
              menuIcons: '#cbd5e1',
              link: '#fbbf24',
              action: '#fbbf24',
              inProgress: '#fbbf24',
              complete: '#10b981',
              error: '#ef4444',
              textDark: '#000000',
              textLight: '#ffffff'
            }
          }
        },
        (error: any, result: any) => {
          if (!error && result && result.event === "success") {
            const url = result.info.secure_url;
            if (target === 'journal') {
              setJournal(prev => ({
                ...prev,
                images: prev.images ? `${prev.images}, ${url}` : url
              }));
            } else {
              setArt(prev => ({
                ...prev,
                imageUrl: url
              }));
            }
          }
        }
      );
      widget.open();
    } else {
      setStatus('Upload system still loading... please try again in a second.');
    }
  };

  const handleSubmit = async (e: React.FormEvent, type: string) => {
    e.preventDefault();
    setStatus('Saving...');
    
    let body: any = {};
    if (type === 'journal') {
      body = { ...journal, images: typeof journal.images === 'string' && journal.images.trim() !== '' ? journal.images.split(',').map(img => img.trim()) : journal.images || [] };
    } else if (type === 'verse') {
      body = verse;
    } else if (type === 'art') {
      body = art;
    }

    const endpoint = type === 'journal' ? 'journal' : type === 'verse' ? 'verses' : 'art';
    const url = editingId ? `${API_URL}/${endpoint}/${editingId}` : `${API_URL}/${endpoint}`;
    const method = editingId ? 'PUT' : 'POST';

    try {
      const res = await fetch(url, {
        method,
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(body),
      });

      if (res.ok) {
        setStatus(`Success! ${editingId ? 'Updated' : 'Added new'} entry.`);
        setEditingId(null);
        if (type === 'journal') setJournal(initialJournal);
        if (type === 'verse') setVerse(initialVerse);
        if (type === 'art') setArt(initialArt);
        fetchItems();
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

  const handleDelete = async (id: string, type: string) => {
    if (!confirm('Are you sure you want to delete this entry?')) return;
    
    setStatus('Deleting...');
    const endpoint = type === 'journal' ? 'journal' : type === 'verse' ? 'verses' : 'art';
    
    try {
      const res = await fetch(`${API_URL}/${endpoint}/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (res.ok) {
        setStatus('Success! Entry deleted.');
        fetchItems();
      } else if (res.status === 401) {
        setStatus('Session expired. Please log in again.');
        logout();
      } else {
        setStatus('Error deleting entry.');
      }
    } catch (err) {
      console.error(err);
      setStatus('Failed to connect to API.');
    }
  };

  const startEdit = (item: any) => {
    setEditingId(item._id);
    if (activeForm === 'journal') {
      setJournal({ title: item.title, contentText: item.contentText, images: Array.isArray(item.images) ? item.images.join(', ') : '', date: item.date, time: item.time });
    } else if (activeForm === 'verse') {
      setVerse({ verseText: item.verseText, reference: item.reference, reflection: item.reflection || '', date: item.date });
    } else if (activeForm === 'art') {
      setArt({ title: item.title, imageUrl: item.imageUrl, description: item.description || '', date: item.date });
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const cancelEdit = () => {
    setEditingId(null);
    if (activeForm === 'journal') setJournal(initialJournal);
    if (activeForm === 'verse') setVerse(initialVerse);
    if (activeForm === 'art') setArt(initialArt);
    setStatus('Edit cancelled.');
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
        }}>Manage Journals</button>
        <button onClick={() => setActiveForm('verse')} style={{ 
          padding: '0.5rem 1rem', 
          background: activeForm === 'verse' ? 'var(--accent-vibrant)' : 'var(--bg-secondary)', 
          color: activeForm === 'verse' ? 'white' : 'var(--text-primary)', 
          border: '1px solid var(--accent-vibrant)', 
          cursor: 'pointer',
          borderRadius: '8px'
        }}>Manage Verses</button>
        <button onClick={() => setActiveForm('art')} style={{ 
          padding: '0.5rem 1rem', 
          background: activeForm === 'art' ? 'var(--accent-vibrant)' : 'var(--bg-secondary)', 
          color: activeForm === 'art' ? 'white' : 'var(--text-primary)', 
          border: '1px solid var(--accent-vibrant)', 
          cursor: 'pointer',
          borderRadius: '8px'
        }}>Manage Art</button>
      </div>

      {status && <div style={{ textAlign: 'center', marginBottom: '1rem', fontWeight: 'bold', color: status.includes('Success') ? 'var(--accent-vibrant)' : '#ff4d4d' }}>{status}</div>}

      <div style={{ marginBottom: '3rem' }}>
        <h2 style={{ marginBottom: '1rem', color: 'var(--text-primary)', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.5rem' }}>
          {editingId ? `Edit ${activeForm}` : `Add New ${activeForm}`}
        </h2>

        {activeForm === 'journal' && (
          <form onSubmit={(e) => handleSubmit(e, 'journal')} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <input placeholder="Title" value={journal.title} onChange={e => setJournal({...journal, title: e.target.value})} required style={{ padding: '0.8rem', border: '1px solid var(--border-color)', background: 'var(--bg-secondary)', color: 'var(--text-primary)', borderRadius: '10px' }} />
            <textarea placeholder="Content Text" value={journal.contentText} onChange={e => setJournal({...journal, contentText: e.target.value})} required style={{ padding: '0.8rem', border: '1px solid var(--border-color)', background: 'var(--bg-secondary)', color: 'var(--text-primary)', borderRadius: '10px', minHeight: '200px' }} />
            <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
              <input placeholder="Images (comma separated URLs)" value={journal.images} onChange={e => setJournal({...journal, images: e.target.value})} style={{ flex: 1, padding: '0.8rem', border: '1px solid var(--border-color)', background: 'var(--bg-secondary)', color: 'var(--text-primary)', borderRadius: '10px' }} />
              <button type="button" onClick={() => openUploadWidget('journal')} style={{ padding: '0.8rem 1.2rem', background: 'var(--accent-vibrant)', color: 'white', border: 'none', borderRadius: '10px', cursor: 'pointer', fontSize: '0.9rem', whiteSpace: 'nowrap' }}>📷 Upload / Take Photo</button>
            </div>
            {journal.images && journal.images.split(',').map((img, idx) => (
              <img key={idx} src={sanitizeImageUrl(img.trim())} alt="Preview" style={{ maxWidth: '300px', maxHeight: '200px', objectFit: 'cover', borderRadius: '8px', marginBottom: '0.5rem' }} />
            ))}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <input type="text" placeholder="Date (e.g., January 1, 2026)" value={journal.date} onChange={e => setJournal({...journal, date: e.target.value})} required style={{ padding: '0.8rem', border: '1px solid var(--border-color)', background: 'var(--bg-secondary)', color: 'var(--text-primary)', borderRadius: '10px' }} />
              <input type="text" placeholder="Time (e.g., 10:30 PM)" value={journal.time} onChange={e => setJournal({...journal, time: e.target.value})} required style={{ padding: '0.8rem', border: '1px solid var(--border-color)', background: 'var(--bg-secondary)', color: 'var(--text-primary)', borderRadius: '10px' }} />
            </div>
            <div style={{ display: 'flex', gap: '1rem' }}>
              <button type="submit" style={{ flex: 1, padding: '1rem', background: 'var(--accent-vibrant)', color: 'white', border: 'none', cursor: 'pointer', fontWeight: 'bold', borderRadius: '10px' }}>
                {editingId ? 'Update Journal Entry' : 'Post Journal Entry'}
              </button>
              {editingId && (
                <button type="button" onClick={cancelEdit} style={{ padding: '1rem', background: 'transparent', color: 'var(--text-primary)', border: '1px solid var(--border-color)', cursor: 'pointer', fontWeight: 'bold', borderRadius: '10px' }}>
                  Cancel Edit
                </button>
              )}
            </div>
          </form>
        )}

        {activeForm === 'verse' && (
          <form onSubmit={(e) => handleSubmit(e, 'verse')} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <textarea placeholder="Verse Text" value={verse.verseText} onChange={e => setVerse({...verse, verseText: e.target.value})} required style={{ padding: '0.8rem', border: '1px solid var(--border-color)', background: 'var(--bg-secondary)', color: 'var(--text-primary)', borderRadius: '10px', minHeight: '100px' }} />
            <input placeholder="Reference (e.g., Psalm 23:1)" value={verse.reference} onChange={e => setVerse({...verse, reference: e.target.value})} required style={{ padding: '0.8rem', border: '1px solid var(--border-color)', background: 'var(--bg-secondary)', color: 'var(--text-primary)', borderRadius: '10px' }} />
            <textarea placeholder="Reflection (optional)" value={verse.reflection} onChange={e => setVerse({...verse, reflection: e.target.value})} style={{ padding: '0.8rem', border: '1px solid var(--border-color)', background: 'var(--bg-secondary)', color: 'var(--text-primary)', borderRadius: '10px', minHeight: '100px' }} />
            <input type="text" placeholder="Date" value={verse.date} onChange={e => setVerse({...verse, date: e.target.value})} required style={{ padding: '0.8rem', border: '1px solid var(--border-color)', background: 'var(--bg-secondary)', color: 'var(--text-primary)', borderRadius: '10px' }} />
            <div style={{ display: 'flex', gap: '1rem' }}>
              <button type="submit" style={{ flex: 1, padding: '1rem', background: 'var(--accent-vibrant)', color: 'white', border: 'none', cursor: 'pointer', fontWeight: 'bold', borderRadius: '10px' }}>
                {editingId ? 'Update Verse' : 'Post Verse'}
              </button>
              {editingId && (
                <button type="button" onClick={cancelEdit} style={{ padding: '1rem', background: 'transparent', color: 'var(--text-primary)', border: '1px solid var(--border-color)', cursor: 'pointer', fontWeight: 'bold', borderRadius: '10px' }}>
                  Cancel Edit
                </button>
              )}
            </div>
          </form>
        )}

        {activeForm === 'art' && (
          <form onSubmit={(e) => handleSubmit(e, 'art')} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <input placeholder="Art Title" value={art.title} onChange={e => setArt({...art, title: e.target.value})} required style={{ padding: '0.8rem', border: '1px solid var(--border-color)', background: 'var(--bg-secondary)', color: 'var(--text-primary)', borderRadius: '10px' }} />
            <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
              <input placeholder="Image URL" value={art.imageUrl} onChange={e => setArt({...art, imageUrl: e.target.value})} required style={{ flex: 1, padding: '0.8rem', border: '1px solid var(--border-color)', background: 'var(--bg-secondary)', color: 'var(--text-primary)', borderRadius: '10px' }} />
              <button type="button" onClick={() => openUploadWidget('art')} style={{ padding: '0.8rem 1.2rem', background: 'var(--accent-vibrant)', color: 'white', border: 'none', borderRadius: '10px', cursor: 'pointer', fontSize: '0.9rem', whiteSpace: 'nowrap' }}>📷 Upload / Take Photo</button>
            </div>
            {art.imageUrl && <img src={sanitizeImageUrl(art.imageUrl)} alt="Preview" style={{ width: '100%', borderRadius: '8px', marginBottom: '1rem' }} />}
            <textarea placeholder="Description (optional)" value={art.description} onChange={e => setArt({...art, description: e.target.value})} style={{ padding: '0.8rem', border: '1px solid var(--border-color)', background: 'var(--bg-secondary)', color: 'var(--text-primary)', borderRadius: '10px', minHeight: '100px' }} />
            <input type="text" placeholder="Date" value={art.date} onChange={e => setArt({...art, date: e.target.value})} required style={{ padding: '0.8rem', border: '1px solid var(--border-color)', background: 'var(--bg-secondary)', color: 'var(--text-primary)', borderRadius: '10px' }} />
            <div style={{ display: 'flex', gap: '1rem' }}>
              <button type="submit" style={{ flex: 1, padding: '1rem', background: 'var(--accent-vibrant)', color: 'white', border: 'none', cursor: 'pointer', fontWeight: 'bold', borderRadius: '10px' }}>
                {editingId ? 'Update Art' : 'Post Art'}
              </button>
              {editingId && (
                <button type="button" onClick={cancelEdit} style={{ padding: '1rem', background: 'transparent', color: 'var(--text-primary)', border: '1px solid var(--border-color)', cursor: 'pointer', fontWeight: 'bold', borderRadius: '10px' }}>
                  Cancel Edit
                </button>
              )}
            </div>
          </form>
        )}
      </div>

      <div>
        <h3 style={{ marginBottom: '1rem', color: 'var(--text-secondary)' }}>Existing {activeForm === 'journal' ? 'Journals' : activeForm === 'verse' ? 'Verses' : 'Art'}</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {items.map(item => (
            <div key={item._id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem', border: '1px solid var(--border-color)', borderRadius: '10px', background: 'var(--bg-secondary)' }}>
              <div>
                <strong style={{ color: 'var(--text-primary)' }}>{item.title || item.reference}</strong>
                <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>{item.date}</div>
              </div>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <button onClick={() => startEdit(item)} style={{ padding: '0.4rem 0.8rem', background: '#f39c12', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer', fontSize: '0.85rem' }}>Edit</button>
                <button onClick={() => handleDelete(item._id, activeForm)} style={{ padding: '0.4rem 0.8rem', background: '#ff4d4d', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer', fontSize: '0.85rem' }}>Delete</button>
              </div>
            </div>
          ))}
          {items.length === 0 && <p style={{ color: 'var(--text-secondary)' }}>No entries found.</p>}
        </div>
      </div>
    </div>
  );
}
