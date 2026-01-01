import Link from 'next/link';

export default function Home() {
  return (
    <div className="fade-up">
      <section className="container" style={{ textAlign: 'center', paddingTop: 'clamp(4rem, 10vw, 8rem)', paddingBottom: '4rem' }}>
        <h1 className="section-title fade-up" style={{ fontSize: 'clamp(2.5rem, 8vw, 5rem)', marginBottom: '2rem' }}>
          Capturing <span style={{ fontStyle: 'italic', fontWeight: 'normal' }}>Time</span> <br /> 
          Through <span style={{ color: 'var(--accent-vibrant)' }}>Art</span> & Thought.
        </h1>
        <p className="serif" style={{ fontSize: 'clamp(1.1rem, 3vw, 1.4rem)', color: 'var(--text-secondary)', maxWidth: '700px', margin: '0 auto 3rem auto', lineHeight: 1.6 }}>
          A private sanctuary where the brush meets the page. Welcome to Feben's digital gallery and reflective journal.
        </p>
        <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', flexWrap: 'wrap' }}>
          <Link href="/journal" className="btn btn-primary" style={{ padding: '1rem 2rem', fontSize: '1rem' }}>Enter Journal</Link>
          <Link href="/art" className="btn" style={{ padding: '1rem 2rem', fontSize: '1rem', border: '1px solid var(--border-color)', background: 'var(--bg-secondary)', color: 'var(--text-primary)' }}>View Gallery</Link>
        </div>
      </section>

      <div className="art-separator"></div>

      <section className="container" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem', padding: '4rem 0' }}>
        <div className="art-card">
          <h2 className="serif" style={{ fontSize: 'clamp(1.8rem, 4vw, 2.5rem)', marginBottom: '1.5rem' }}>The Journal</h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '1rem', marginBottom: '2rem' }}>
            Daily reflections, prayers, and insights documented with intention. A journey of growth spanning through 2026.
          </p>
          <Link href="/journal" style={{ fontWeight: 600, color: 'var(--accent-vibrant)' }}>Browse the archives →</Link>
        </div>
        <div className="art-card">
          <h2 className="serif" style={{ fontSize: 'clamp(1.8rem, 4vw, 2.5rem)', marginBottom: '1.5rem' }}>The Art</h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '1rem', marginBottom: '2rem' }}>
            Returning to the first love. A collection of midnight drawings, vibrant paintings, and the joy of creation.
          </p>
          <Link href="/art" style={{ fontWeight: 600, color: 'var(--accent-vibrant)' }}>Explore the gallery →</Link>
        </div>
      </section>

      <section className="container" style={{ padding: '4rem 0', textAlign: 'center' }}>
        <div className="art-card" style={{ background: 'linear-gradient(135deg, #1D3557 0%, #457B9D 100%)', color: 'white', border: 'none', padding: 'clamp(2rem, 5vw, 4rem)' }}>
          <h2 className="serif" style={{ fontSize: 'clamp(2rem, 6vw, 3rem)', marginBottom: '1rem', color: '#F1FAEE' }}>Faith & Verses</h2>
          <p style={{ fontSize: 'clamp(1rem, 2.5vw, 1.2rem)', marginBottom: '2.5rem', opacity: 0.9, maxWidth: '600px', margin: '0 auto 2.5rem auto' }}>
            "His word is a lamp to my feet and a light to my path."
          </p>
          <Link href="/verses" className="btn" style={{ background: 'white', color: 'var(--accent-primary)' }}>Read Reflections</Link>
        </div>
      </section>
    </div>
  );
}
