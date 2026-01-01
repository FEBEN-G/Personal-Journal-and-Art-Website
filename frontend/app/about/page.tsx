export default function About() {
  return (
    <div className="fade-up" style={{ padding: '6rem 0' }}>
      <div style={{ maxWidth: '800px', margin: '0 auto' }}>
        <h1 className="section-title" style={{ textAlign: 'left', fontSize: '4rem' }}>The Story.</h1>
        <div className="art-separator" style={{ margin: '2rem 0' }}></div>
        
        <div className="art-card" style={{ padding: '4rem', background: 'var(--bg-primary)', border: '1px solid var(--border-color)' }}>
          <div style={{ 
            fontSize: '1.15rem', 
            lineHeight: '1.8', 
            color: 'var(--text-primary)',
            fontFamily: 'var(--font-sans)'
          }}>
            <p style={{ marginBottom: '2rem' }}>
              Welcome to my quiet corner. This space isn't meant for the noise of social media or the rush of public validation. It's a digital home built for reflection, faith, and the simple joy of art.
            </p>
            <p style={{ marginBottom: '2rem' }}>
              In <span style={{ color: 'var(--accent-vibrant)', fontWeight: 700 }}>2026</span>, I committed to living with more intention. To slow down, to think more deeply about the path ahead, and to return to my first love: <span style={{ fontStyle: 'italic' }}>painting</span>.
            </p>
            <p style={{ marginBottom: '2rem' }}>
              This website serves as my canvas and my diary. A place where color meets thought, and where every brushstroke tells a part of the journey.
            </p>
            <p>I hope you find a moment of peace and inspiration as you wander through these pages.</p>
          </div>
          
          <div style={{ marginTop: '4rem', display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
            <div style={{ width: '60px', height: '1px', background: 'var(--border-color)' }}></div>
            <div style={{ color: 'var(--accent-secondary)', fontWeight: 800, letterSpacing: '4px', textTransform: 'uppercase', fontSize: '0.9rem' }}>
              Feben Getachew
            </div>
          </div>
        </div>
        
        <div style={{ marginTop: '4rem', textAlign: 'center', color: 'var(--accent-vibrant)', fontSize: '1.5rem' }}>
          🌿
        </div>
      </div>
    </div>
  );
}
