import { fetchVerses } from '@/services/api';

export default async function VersePage() {
  let verses = [];
  try {
    verses = await fetchVerses();
  } catch (err) {
    console.error(err);
  }

  return (
    <div className="fade-up">
      <section style={{ textAlign: 'center', padding: '6rem 0 4rem 0' }}>
        <h1 className="section-title">Faith.</h1>
        <p className="serif" style={{ fontSize: '1.4rem', color: 'var(--text-secondary)', fontStyle: 'italic', marginBottom: '2rem' }}>
          "His word is a lamp to my feet and a light to my path."
        </p>
        <div className="art-separator"></div>
      </section>

      <div style={{ maxWidth: '800px', margin: '0 auto', paddingBottom: '6rem' }}>
        {verses.length === 0 ? (
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
    </div>
  );
}
