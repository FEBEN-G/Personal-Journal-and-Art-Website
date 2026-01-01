import EntryCard from '@/components/EntryCard';
import { fetchJournalEntries } from '@/services/api';

export default async function JournalList() {
  let entries = [];
  try {
    entries = await fetchJournalEntries();
  } catch (err) {
    console.error(err);
  }

  return (
    <div className="fade-up">
      <section style={{ textAlign: 'center', padding: '6rem 0 4rem 0' }}>
        <h1 className="section-title">The Journal.</h1>
        <p className="serif" style={{ fontSize: '1.4rem', color: 'var(--text-secondary)', fontStyle: 'italic', marginBottom: '2rem' }}>
          "Thoughts, plans, and prayers — documented with care."
        </p>
        <div className="art-separator"></div>
      </section>

      <div style={{ maxWidth: '800px', margin: '0 auto', paddingBottom: '6rem' }}>
        {entries.length === 0 ? (
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
    </div>
  );
}
