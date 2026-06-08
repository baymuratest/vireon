import React, { useState } from 'react'
import { Link } from 'react-router-dom'

export default function AnimeCard({ item }) {
  const [imgError, setImgError] = useState(false)
  const [hovered, setHovered] = useState(false)

  const data = item.material_data || {}
  const title = data.title || data.title_en || item.title || 'Без названия'
  const poster = imgError ? null : (data.poster_url || data.anime_poster_url)
  const year = data.year || item.year
  const score = data.shikimori_rating || data.kinopoisk_rating
  const genres = data.anime_genres || data.genres || []
  const status = data.anime_status
  const episodes = data.episodes_total

  // Encode ID for URL - use shikimori_id or item id
  const animeId = data.shikimori_id || item.id?.replace(/[/:]/g, '_')

  return (
    <Link
      to={`/anime/${animeId}?kodikId=${encodeURIComponent(item.id || '')}`}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        display: 'block',
        background: 'var(--bg-card)',
        borderRadius: 'var(--radius-lg)',
        overflow: 'hidden',
        border: `1px solid ${hovered ? 'rgba(124,58,237,0.4)' : 'var(--border)'}`,
        transform: hovered ? 'translateY(-6px) scale(1.01)' : 'none',
        transition: 'all 0.3s cubic-bezier(0.4,0,0.2,1)',
        boxShadow: hovered ? '0 20px 40px rgba(124,58,237,0.2)' : '0 2px 10px rgba(0,0,0,0.3)',
        cursor: 'pointer',
        position: 'relative',
      }}
    >
      {/* Poster */}
      <div style={{ position: 'relative', paddingBottom: '140%', overflow: 'hidden' }}>
        {poster ? (
          <img
            src={poster} alt={title}
            onError={() => setImgError(true)}
            style={{
              position: 'absolute', inset: 0,
              width: '100%', height: '100%', objectFit: 'cover',
              transition: 'transform 0.4s ease',
              transform: hovered ? 'scale(1.08)' : 'scale(1)'
            }}
          />
        ) : (
          <div style={{
            position: 'absolute', inset: 0,
            background: 'linear-gradient(135deg, #1e1e2a, #0d0d14)',
            display: 'flex', flexDirection: 'column',
            alignItems: 'center', justifyContent: 'center', gap: 8
          }}>
            <span style={{ fontSize: 48 }}>🎌</span>
            <span style={{ fontSize: 11, color: 'var(--text-muted)', textAlign: 'center', padding: '0 12px' }}>{title}</span>
          </div>
        )}

        {/* Score badge */}
        {score && (
          <div style={{
            position: 'absolute', top: 10, right: 10,
            background: 'rgba(0,0,0,0.8)',
            backdropFilter: 'blur(8px)',
            border: '1px solid rgba(255,200,0,0.3)',
            borderRadius: 8, padding: '4px 8px',
            fontSize: 12, fontWeight: 700,
            color: '#fbbf24',
            display: 'flex', alignItems: 'center', gap: 4
          }}>
            ⭐ {parseFloat(score).toFixed(1)}
          </div>
        )}

        {/* Status badge */}
        {status === 'released' && (
          <div style={{
            position: 'absolute', top: 10, left: 10,
            background: 'rgba(16,185,129,0.9)',
            borderRadius: 6, padding: '3px 8px',
            fontSize: 10, fontWeight: 600, color: 'white'
          }}>ЗАВЕРШЁН</div>
        )}
        {status === 'ongoing' && (
          <div style={{
            position: 'absolute', top: 10, left: 10,
            background: 'rgba(124,58,237,0.9)',
            borderRadius: 6, padding: '3px 8px',
            fontSize: 10, fontWeight: 600, color: 'white'
          }}>ОНГОИНГ</div>
        )}

        {/* Hover overlay */}
        <div style={{
          position: 'absolute', inset: 0,
          background: 'linear-gradient(to top, rgba(10,10,15,0.9) 0%, transparent 50%)',
          opacity: hovered ? 1 : 0, transition: 'opacity 0.3s'
        }}>
          <div style={{
            position: 'absolute', bottom: 12, left: 0, right: 0,
            display: 'flex', justifyContent: 'center'
          }}>
            <div style={{
              background: 'linear-gradient(135deg, #7c3aed, #ec4899)',
              borderRadius: 8, padding: '8px 20px',
              fontSize: 13, fontWeight: 600, color: 'white',
              boxShadow: '0 4px 15px rgba(124,58,237,0.5)'
            }}>▶ Смотреть</div>
          </div>
        </div>
      </div>

      {/* Info */}
      <div style={{ padding: '14px 14px 16px' }}>
        <h3 style={{
          fontSize: 13, fontWeight: 600, lineHeight: 1.4,
          color: 'var(--text-primary)', marginBottom: 8,
          overflow: 'hidden', display: '-webkit-box',
          WebkitLineClamp: 2, WebkitBoxOrient: 'vertical'
        }}>{title}</h3>

        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 8 }}>
          {year && (
            <span style={{
              fontSize: 11, color: 'var(--text-muted)',
              background: 'rgba(255,255,255,0.05)',
              borderRadius: 5, padding: '2px 7px'
            }}>{year}</span>
          )}
          {episodes && (
            <span style={{
              fontSize: 11, color: 'var(--text-muted)',
              background: 'rgba(255,255,255,0.05)',
              borderRadius: 5, padding: '2px 7px'
            }}>{episodes} эп.</span>
          )}
        </div>

        {genres.length > 0 && (
          <div style={{ display: 'flex', gap: 5, flexWrap: 'wrap' }}>
            {genres.slice(0, 2).map(g => (
              <span key={g} style={{
                fontSize: 10, color: 'var(--accent-light)',
                background: 'rgba(124,58,237,0.12)',
                border: '1px solid rgba(124,58,237,0.2)',
                borderRadius: 5, padding: '2px 7px'
              }}>{g}</span>
            ))}
          </div>
        )}
      </div>
    </Link>
  )
}
