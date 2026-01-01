import Link from 'next/link';

interface EntryCardProps {
  id: string;
  title: string;
  date: string;
  time: string;
  excerpt: string;
}

export default function EntryCard({ id, title, date, time, excerpt }: EntryCardProps) {
  return (
    <Link href={`/journal/${id}`} className="art-card fade-up" style={{ display: 'block', marginBottom: '2.5rem', textDecoration: 'none' }}>
      <div style={{ marginBottom: '1.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '0.8rem' }}>
          <span style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '2px', color: 'var(--accent-vibrant)', background: 'rgba(231, 111, 81, 0.1)', padding: '4px 12px', borderRadius: '4px' }}>
            Reflections
          </span>
          <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', fontWeight: 500 }}>
            {date}
          </span>
        </div>
        <h2 className="serif" style={{ fontSize: 'clamp(1.5rem, 5vw, 2.2rem)', color: 'var(--text-primary)', lineHeight: 1.2 }}>
          {title}
        </h2>
      </div>
      <p style={{ 
        color: 'var(--text-secondary)', 
        fontSize: 'clamp(0.9rem, 2.5vw, 1rem)', 
        lineHeight: 1.6, 
        display: '-webkit-box', 
        WebkitLineClamp: 3, 
        WebkitBoxOrient: 'vertical', 
        overflow: 'hidden', 
        marginBottom: '1.5rem',
        fontFamily: 'var(--font-sans)'
      }}>
        {excerpt.replace(/#+\s?/g, '').replace(/\*+\s?/g, '').replace(/---\s?/g, '')}
      </p>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--accent-vibrant)', fontWeight: 600, fontSize: '0.9rem' }}>
        Read Full Story <span style={{ fontSize: '1.1rem' }}>→</span>
      </div>
    </Link>
  );
}
