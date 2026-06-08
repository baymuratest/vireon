import React, { useEffect, useState } from 'react'
import { useParams, useSearchParams } from 'react-router-dom'
import VideoPlayer from '../components/VideoPlayer'
import EpisodeList from '../components/EpisodeList'
import { getByShikimoriId, searchAnime } from '../api/kodik'
import { addFavorite, removeFavorite, isFavorite } from '../store/favorites'

export default function AnimePage() {
  const { id } = useParams()
  const [searchParams] = useSearchParams()
  const [anime, setAnime] = useState(null)
  const [loading, setLoading] = useState(true)
  const [playerLink, setPlayerLink] = useState(null)
  const [currentEp, setCurrentEp] = useState(null)
  const [fav, setFav] = useState(false)

  useEffect(() => {
    const fetchAnime = async () => {
      setLoading(true)
      try {
        let data = null
        // Try shikimori ID first
        if (id && !isNaN(id)) {
          const res = await getByShikimoriId(id)
          if (res?.results?.length) data = res.results[0]
        }
        // Fallback: search by kodikId param
        if (!data) {
          const kodikId = searchParams.get('kodikId')
          if (kodikId) {
            const res = await searchAnime(decodeURIComponent(kodikId).split('/').pop(), 1)
            if (res?.results?.length) data = res.results[0]
          }
        }
        if (data) {
          setAnime(data)
          setFav(isFavorite(data.id))
          // Set default player link
          const link = data.link || data.iframe_url
          if (link) setPlayerLink(link)
        }
      } finally {
        setLoading(false)
      }
    }
    fetchAnime()
  }, [id])

  if (loading) return (
    <div style={{
      minHeight: '100vh', display: 'flex',
      alignItems: 'center', justifyContent: 'center'
    }}>
      <div style={{
        width: 60, height: 60, borderRadius: '50%',
        border: '3px solid var(--accent)', borderTopColor: 'transparent',
        animation: 'spin 0.8s linear infinite'
      }} />
      <style>{`@keyframes spin { to { transform: rotate(360deg) } }`}</style>
    </div>
  )

  if (!anime) return (
    <div style={{
      minHeight: '100vh', display: 'flex',
      alignItems: 'center', justifyContent: 'center',
      flexDirection: 'column', gap: 16
    }}>
      <span style={{ fontSize: 64 }}>😕</span>
      <p style={{ color: 'var(--text-muted)', fontSize: 18 }}>Аниме не найдено</p>
    </div>
  )

  const data = anime.material_data || {}
  const title = data.title || data.title_en || anime.title
  const titleEn = data.title_en
  const poster = data.poster_url || data.anime_poster_url
  const desc = data.anime_description || data.description
  const score = data.shikimori_rating
  const genres = data.anime_genres || data.genres || []
  const year = data.year || anime.year
  const status = data.anime_status
  const episodes = data.episodes_total
  const studio = data.anime_studios?.[0]
  const screenshots = data.screenshots || []
  const allEpisodes = anime.seasons || {}

  const toggleFav = () => {
    if (fav) { removeFavorite(anime.id); setFav(false) }
    else { addFavorite({ id: anime.id, title, poster, year }); setFav(true) }
  }

  return (
    <div>
      {/* Hero backdrop */}
      <div style={{
        position: 'relative', height: 360, overflow: 'hidden',
        marginTop: 0
      }}>
        <div style={{
          position: 'absolute', inset: 0,
          background: poster ? `url(${poster}) center/cover` : 'var(--bg-secondary)',
          filter: 'blur(4px) brightness(0.25)', transform: 'scale(1.1)'
        }} />
        <div style={{
          position: 'absolute', inset: 0,
          background: 'linear-gradient(to top, var(--bg-primary) 0%, transparent 50%)'
        }} />
      </div>

      <div className="container" style={{ marginTop: -200, position: 'relative', zIndex: 1, paddingBottom: 60 }}>
        <div style={{ display: 'grid', gridTemplateColumns: '220px 1fr', gap: 40, marginBottom: 40 }}>
          {/* Poster */}
          <div style={{ paddingTop: 70 }}>
            {poster ? (
              <img src={poster} alt={title} style={{
                width: '100%', borderRadius: 'var(--radius-lg)',
                boxShadow: '0 20px 60px rgba(0,0,0,0.6)',
                border: '2px solid var(--border)'
              }} />
            ) : (
              <div style={{
                width: '100%', paddingBottom: '145%',
                background: 'var(--bg-card)',
                borderRadius: 'var(--radius-lg)',
                display: 'flex', alignItems: 'center', justifyContent: 'center'
              }}>🎌</div>
            )}

            {/* Action buttons */}
            <div style={{ marginTop: 14, display: 'flex', flexDirection: 'column', gap: 10 }}>
              <button onClick={toggleFav} style={{
                width: '100%', padding: '11px',
                borderRadius: 10, border: 'none', cursor: 'pointer',
                fontSize: 14, fontWeight: 600,
                background: fav
                  ? 'rgba(236,72,153,0.15)'
                  : 'var(--bg-card)',
                color: fav ? '#ec4899' : 'var(--text-secondary)',
                border: `1px solid ${fav ? 'rgba(236,72,153,0.4)' : 'var(--border)'}`,
                transition: 'all 0.2s'
              }}>{fav ? '❤️ В избранном' : '🤍 В избранное'}</button>
            </div>
          </div>

          {/* Info */}
          <div style={{ paddingTop: 120 }}>
            <h1 style={{
              fontSize: 'clamp(22px, 4vw, 40px)',
              fontWeight: 900, marginBottom: 6, lineHeight: 1.2
            }}>{title}</h1>
            {titleEn && titleEn !== title && (
              <p style={{ color: 'var(--text-muted)', fontSize: 16, marginBottom: 16 }}>{titleEn}</p>
            )}

            {/* Meta badges */}
            <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', marginBottom: 20 }}>
              {score && (
                <span style={{
                  background: 'rgba(251,191,36,0.1)',
                  border: '1px solid rgba(251,191,36,0.3)',
                  borderRadius: 8, padding: '5px 14px',
                  fontSize: 14, fontWeight: 700, color: '#fbbf24'
                }}>⭐ {parseFloat(score).toFixed(1)}</span>
              )}
              {year && (
                <span style={{
                  background: 'rgba(255,255,255,0.07)',
                  border: '1px solid var(--border)',
                  borderRadius: 8, padding: '5px 14px',
                  fontSize: 13, color: 'var(--text-secondary)'
                }}>{year}</span>
              )}
              {episodes && (
                <span style={{
                  background: 'rgba(255,255,255,0.07)',
                  border: '1px solid var(--border)',
                  borderRadius: 8, padding: '5px 14px',
                  fontSize: 13, color: 'var(--text-secondary)'
                }}>{episodes} эп.</span>
              )}
              {status && (
                <span style={{
                  background: status === 'ongoing' ? 'rgba(124,58,237,0.15)' : 'rgba(16,185,129,0.1)',
                  border: `1px solid ${status === 'ongoing' ? 'rgba(124,58,237,0.4)' : 'rgba(16,185,129,0.3)'}`,
                  borderRadius: 8, padding: '5px 14px',
                  fontSize: 13, fontWeight: 600,
                  color: status === 'ongoing' ? 'var(--accent-light)' : '#10b981'
                }}>{status === 'ongoing' ? 'Онгоинг' : 'Завершён'}</span>
              )}
              {studio && (
                <span style={{
                  background: 'rgba(255,255,255,0.07)',
                  border: '1px solid var(--border)',
                  borderRadius: 8, padding: '5px 14px',
                  fontSize: 13, color: 'var(--text-secondary)'
                }}>🏢 {studio}</span>
              )}
            </div>

            {/* Genres */}
            {genres.length > 0 && (
              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 20 }}>
                {genres.map(g => (
                  <span key={g} style={{
                    background: 'rgba(124,58,237,0.1)',
                    border: '1px solid rgba(124,58,237,0.2)',
                    borderRadius: 20, padding: '5px 14px',
                    fontSize: 12, color: 'var(--accent-light)', fontWeight: 500
                  }}>{g}</span>
                ))}
              </div>
            )}

            {/* Description */}
            {desc && (
              <p style={{
                color: 'var(--text-secondary)', fontSize: 15,
                lineHeight: 1.8, maxWidth: 700
              }}>{desc}</p>
            )}
          </div>
        </div>

        {/* Player */}
        <div style={{
          background: 'var(--bg-card)',
          borderRadius: 'var(--radius-lg)',
          padding: 24, marginBottom: 24,
          border: '1px solid var(--border)'
        }}>
          <h2 style={{ fontSize: 18, fontWeight: 700, marginBottom: 16 }}>📺 Плеер</h2>
          <VideoPlayer link={playerLink} title={title} />
        </div>

        {/* Episodes */}
        {Object.keys(allEpisodes).length > 0 && (
          <EpisodeList
            episodes={allEpisodes}
            currentEp={currentEp}
            onSelect={(link, ep) => {
              setPlayerLink(link)
              setCurrentEp(ep)
              window.scrollTo({ top: 500, behavior: 'smooth' })
            }}
          />
        )}

        {/* Screenshots */}
        {screenshots.length > 0 && (
          <div style={{ marginTop: 32 }}>
            <h2 style={{ fontSize: 18, fontWeight: 700, marginBottom: 16 }}>📸 Скриншоты</h2>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
              gap: 12
            }}>
              {screenshots.slice(0, 8).map((src, i) => (
                <img key={i} src={src} alt="" style={{
                  width: '100%', borderRadius: 10,
                  objectFit: 'cover', height: 130,
                  border: '1px solid var(--border)'
                }} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
