'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function MobileMenu() {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => setIsOpen(!isOpen);

  return (
    <div className="mobile-menu-wrapper">
      <button 
        onClick={toggleMenu} 
        className="hamburger-btn"
        aria-label="Toggle menu"
      >
        <div className={`line ${isOpen ? 'open' : ''}`}></div>
        <div className={`line ${isOpen ? 'open' : ''}`}></div>
        <div className={`line ${isOpen ? 'open' : ''}`}></div>
      </button>

      {isOpen && (
        <div className="mobile-overlay fade-in" onClick={toggleMenu}>
          <nav className="mobile-nav" onClick={(e) => e.stopPropagation()}>
            <button className="close-btn" onClick={toggleMenu}>×</button>
            <div className="mobile-links">
              <Link href="/" onClick={toggleMenu}>Home</Link>
              <Link href="/journal" onClick={toggleMenu}>Journal</Link>
              <Link href="/verses" onClick={toggleMenu}>Verses</Link>
              <Link href="/art" onClick={toggleMenu}>Art</Link>
              <Link href="/about" onClick={toggleMenu}>About</Link>
            </div>
            <div className="mobile-footer serif">
              Feben Getachew ✧ 2026
            </div>
          </nav>
        </div>
      )}

      <style jsx>{`
        .mobile-menu-wrapper {
          display: none;
        }

        .hamburger-btn {
          background: none;
          border: none;
          display: flex;
          flex-direction: column;
          gap: 6px;
          cursor: pointer;
          padding: 8px;
          z-index: 1001;
        }

        .line {
          width: 24px;
          height: 2px;
          background: var(--text-primary);
          transition: all 0.3s ease;
        }

        .line.open:nth-child(1) { transform: translateY(8px) rotate(45deg); }
        .line.open:nth-child(2) { opacity: 0; }
        .line.open:nth-child(3) { transform: translateY(-8px) rotate(-45deg); }

        .mobile-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.6); /* Slightly darker for better focus */
          z-index: 1000;
          display: flex;
          justify-content: flex-end;
        }

        .mobile-nav {
          width: 85%;
          max-width: 310px;
          height: 100%;
          background: var(--bg-secondary); /* This is solid white/dark based on theme */
          opacity: 1;
          padding: 6.5rem 2.5rem;
          display: flex;
          flex-direction: column;
          box-shadow: -15px 0 45px rgba(0,0,0,0.5); /* Stronger shadow */
          animation: slideIn 0.4s cubic-bezier(0.19, 1, 0.22, 1);
          border-left: 3px solid var(--accent-vibrant); /* Strong visual separation */
          z-index: 1002;
        }

        @keyframes slideIn {
          from { transform: translateX(100%); }
          to { transform: translateX(0); }
        }

        .close-btn {
          position: absolute;
          top: 2rem;
          right: 2rem;
          background: none;
          border: none;
          font-size: 2.8rem;
          color: var(--text-primary);
          cursor: pointer;
        }

        .mobile-links {
          display: flex;
          flex-direction: column;
          gap: 2.5rem;
        }

        .mobile-links a {
          font-size: 1.7rem;
          font-weight: 700; /* Extra bold for visibility */
          color: var(--text-primary);
          text-decoration: none;
          transition: transform 0.2s ease, color 0.2s ease;
        }

        .mobile-links a:active {
          transform: scale(0.95);
          color: var(--accent-vibrant);
        }

        .mobile-footer {
          margin-top: auto;
          font-size: 1.1rem;
          opacity: 0.8;
          color: var(--text-secondary);
        }

        @media (max-width: 768px) {
          .mobile-menu-wrapper {
            display: block;
          }
        }
      `}</style>
    </div>
  );
}
