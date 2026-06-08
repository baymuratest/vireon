import React from 'react'
import AnimeCard from './AnimeCard'

export default function AnimeGrid({ items, loading, columns = 6 }) {
  if (loading) return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))`,
      gap: 20
    }}>
      {Array.from({ length: columns * 2 }).map((_, i) => (
        <div key={i} style={{
          borderRadius: 'var(--radius-lg)',
          background: 'var(--bg-card)',
          paddingBottom: '160%',
          animation: 'pulse 1.5s infinite ease-in-out',
        }} />
      ))}
    </div>
  )

  if (!items?.length) return (
    <div style={{
      textAlign: 'center', padding: '80px 0',
      color: 'var(--text-muted)', fontSize: 16
    }}>
      <div style={{ fontSize: 64, marginBottom: 16 }}>🎌</div>
      Ничего не найдено
    </div>
  )

  return (
    <>
      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 0.4; }
          50% { opacity: 0.8; }
        }
        @media (max-width: 1200px) { .anime-grid { grid-template-columns: repeat(5, minmax(0,1fr)) !important; } }
        @media (max-width: 900px)  { .anime-grid { grid-template-columns: repeat(4, minmax(0,1fr)) !important; } }
        @media (max-width: 640px)  { .anime-grid { grid-template-columns: repeat(2, minmax(0,1fr)) !important; } }
      `}</style>
      <div className="anime-grid" style={{
        display: 'grid',
        gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))`,
        gap: 20
      }}>
        {items.map((item, i) => (
          <AnimeCard key={item.id || i} item={item} />
        ))}
      </div>
    </>
  )
}
