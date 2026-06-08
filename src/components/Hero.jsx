import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { getTopAnime } from '../api/kodik'

export default function Hero() {
  const [featured, setFeatured] = useState(null)
  const [idx, setIdx] = useState(0)
  const [items, setItems] = useState([])

  useEffect(() => {
    getTopAnime(5).then(data => {
      if (data?.results?.length) {
        setItems(data.results)
        setFeatured(data.results[0])
      }
    }).catch(() => {})
  }, [])

  useEffect(() => {
    if (!items.length) return
    const t = setInterval(() => {
      setIdx(i => {
        const next = (i + 1) % items.length
        setFeatured(items[next])
        return next
      })
    }, 7000)
    return () => clearInterval(t)
  }, [items])

  if (!featured) return (
    <div style={{ height: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ textAlign: 'center' }}>
        <div style={{
          width: 60, height: 60, borderRadius: '50%',
          border: '3px solid var(--accent)',
          borderTopColor: 'transparent',
          animation: 'spin 0.8s linear infinite',
          margin: '0 auto 16px'
        }} />
        <style>{`@keyframes spin { to { transform: rotate(360deg) } }`}</style>
      </div>
    </div>
  )

  const data = featured.material_data || {}
  const title = data.title || data.title_en || featured.title
  const desc = data.anime_description || data.description || ''
  const poster = data.poster_url || data.anime_poster_url || ''
  const score = data.shikimori_rating
  const genres = (data.anime_genres || []).slice(0, 3)
  const animeId = data.shikimori_id || featured.id?.replace(/[/:]/g, '_')

  return (
    <div style={{
      position: 'relative', minHeight: '85vh',
      display: 'flex', alignItems: 'flex-end',
      overflow: 'hidden', marginTop: 0,
    }}>
      {/* Background */}
      <div style={{
        position: 'absolute', inset: 0, zIndex: 0,
        background: poster
          ? `url(${poster}) center/cover no-repeat`
          : 'linear-gradient(135deg, #1a0533, #0a0a0f)',
        filter: 'blur(2px) brightness(0.35)',
        transform: 'scale(1.05)'
      }} />

      {/* Gradient overlays */}
      <div style={{
        position: 'absolute', inset: 0, zIndex: 1,
        background: `
          linear-gradient(to right, rgba(10,10,15,0.95) 35%, transparent 70%),
          linear-gradient(to top, rgba(10,10,15,1) 0%, transparent 40%)
        `
      }} />

      {/* Purple accent glow */}
      <div style={{
        position: 'absolute', left: -200, top: '20%',
        width: 600, height: 600, borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(124,58,237,0.15) 0%, transparent 70%)',
        zIndex: 1
      }} />

      {/* Content */}
      <div className="container" style={{ position: 'relative', zIndex: 2, paddingBottom: 80, paddingTop: 140 }}>
        <div style={{ maxWidth: 600 }}>
          {/* Badges */}
          <div style={{ display: 'flex', gap: 10, marginBottom: 20, flexWrap: 'wrap' }}>
            <span style={{
              background: 'linear-gradient(135deg, #7c3aed, #ec4899)',
              borderRadius: 8, padding: '5px 14px',
              fontSize: 12, fontWeight: 700, color: 'white',
              letterSpacing: 1
            }}>ТОП АНИМЕ</span>
            {score && (
              <span style={{
                background: 'rgba(251,191,36,0.15)',
                border: '1px solid rgba(251,191,36,0.4)',
                borderRadius: 8, padding: '5px 14px',
                fontSize: 12, fontWeight: 700, color: '#fbbf24'
              }}>⭐ {parseFloat(score).toFixed(1)}</span>
            )}
            {genres.map(g => (
              <span key={g} style={{
                background: 'rgba(255,255,255,0.08)',
                border: '1px solid var(--border)',
                borderRadius: 8, padding: '5px 12px',
                fontSize: 12, color: 'var(--text-secondary)'
              }}>{g}</span>
            ))}
          </div>

          {/* Title */}
          <h1 style={{
            fontSize: 'clamp(28px, 5vw, 56px)',
            fontWeight: 900, lineHeight: 1.1,
            marginBottom: 20,
            textShadow: '0 2px 20px rgba(0,0,0,0.5)'
          }}>{title}</h1>

          {/* Description */}
          {desc && (
            <p style={{
              color: 'var(--text-secondary)', fontSize: 15,
              lineHeight: 1.7, marginBottom: 32,
              overflow: 'hidden', display: '-webkit-box',
              WebkitLineClamp: 3, WebkitBoxOrient: 'vertical'
            }}>{desc}</p>
          )}

          {/* Buttons */}
          <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap' }}>
            <Link
              to={`/anime/${animeId}?kodikId=${encodeURIComponent(featured.id || '')}`}
              style={{
                background: 'linear-gradient(135deg, #7c3aed, #a855f7)',
                borderRadius: 12, padding: '14px 32px',
                fontSize: 15, fontWeight: 700, color: 'white',
                display: 'flex', alignItems: 'center', gap: 8,
                boxShadow: '0 8px 30px rgba(124,58,237,0.4)',
                transition: 'all 0.2s'
              }}
            >▶ Смотреть</Link>
            <Link to="/catalog" style={{
              background: 'rgba(255,255,255,0.08)',
              border: '1px solid var(--border)',
              backdropFilter: 'blur(10px)',
              borderRadius: 12, padding: '14px 28px',
              fontSize: 15, fontWeight: 600,
              transition: 'all 0.2s'
            }}>Каталог</Link>
          </div>
        </div>
      </div>

      {/* Slide indicators */}
      {items.length > 1 && (
        <div style={{
          position: 'absolute', bottom: 30, right: 30, zIndex: 2,
          display: 'flex', gap: 8
        }}>
          {items.map((_, i) => (
            <div
              key={i}
              onClick={() => { setIdx(i); setFeatured(items[i]) }}
              style={{
                width: i === idx ? 24 : 8,
                height: 8, borderRadius: 4,
                background: i === idx
                  ? 'linear-gradient(135deg, #7c3aed, #ec4899)'
                  : 'rgba(255,255,255,0.2)',
                cursor: 'pointer',
                transition: 'all 0.3s'
              }}
            />
          ))}
        </div>
      )}
    </div>
  )
}
