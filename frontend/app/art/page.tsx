import { fetchArt } from '@/services/api';
import GalleryGrid from '@/components/GalleryGrid';

export default async function ArtGallery() {
  let artPieces = [];
  try {
    artPieces = await fetchArt();
  } catch (err) {
    console.error(err);
  }

  return (
    <div className="fade-up">
      <section style={{ textAlign: 'center', padding: '6rem 0 4rem 0' }}>
        <h1 className="section-title">The Gallery.</h1>
        <p className="serif" style={{ fontSize: '1.4rem', color: 'var(--text-secondary)', fontStyle: 'italic', marginBottom: '2rem' }}>
          "Returning to my first love — colors, lines, and joy."
        </p>
        <div className="art-separator"></div>
      </section>

      {artPieces.length === 0 ? (
        <div className="art-card" style={{ textAlign: 'center' }}>
          <p className="serif" style={{ fontSize: '1.2rem' }}>The canvas is clean. New art coming soon.</p>
        </div>
      ) : (
        <GalleryGrid artPieces={artPieces} />
      )}
    </div>
  );
}
