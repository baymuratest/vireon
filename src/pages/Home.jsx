import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import Hero from '../components/Hero'
import AnimeGrid from '../components/AnimeGrid'
import { getTopAnime, getRecent, getByGenre } from '../api/kodik'

function Section({ title, items, loading, link }) {
  return (
    <section style={{ marginBottom: 60 }}>
      <div style={{
        display: 'flex', alignItems: 'center',
        justifyContent: 'space-between', marginBottom: 24
      }}>
        <h2 style={{
          fontSize: 22, fontWeight: 800,
          display: 'flex', alignItems: 'center', gap: 12
        }}>
          <span style={{
            width: 4, height: 24, borderRadius: 2,
            background: 'linear-gradient(to bottom, #7c3aed, #ec4899)',
            display: 'inline-block'
          }} />
          {title}
        </h2>
        {link && (
          <Link to={link} style={{
            fontSize: 13, color: 'var(--accent-light)',
            background: 'rgba(124,58,237,0.1)',
            border: '1px solid rgba(124,58,237,0.2)',
            borderRadius: 8, padding: '6px 14px',
            transition: 'all 0.2s'
          }}>Все →</Link>
        )}
      </div>
      <AnimeGrid items={items} loading={loading} />
    </section>
  )
}

export default function Home() {
  const [top, setTop] = useState([])
  const [recent, setRecent] = useState([])
  const [action, setAction] = useState([])
  const [loading, setLoading] = useState({ top: true, recent: true, action: true })

  useEffect(() => {
    getTopAnime(12).then(d => {
      setTop(d?.results || [])
      setLoading(p => ({ ...p, top: false }))
    }).catch(() => setLoading(p => ({ ...p, top: false })))

    getRecent(12).then(d => {
      setRecent(d?.results || [])
      setLoading(p => ({ ...p, recent: false }))
    }).catch(() => setLoading(p => ({ ...p, recent: false })))

    getByGenre('экшн', 12).then(d => {
      setAction(d?.results || [])
      setLoading(p => ({ ...p, action: false }))
    }).catch(() => setLoading(p => ({ ...p, action: false })))
  }, [])

  return (
    <div>
      <Hero />
      <div className="container" style={{ paddingTop: 60 }}>
        <Section title="🔥 Топ аниме" items={top} loading={loading.top} link="/catalog?sort=top" />
        <Section title="🆕 Недавно обновлено" items={recent} loading={loading.recent} link="/catalog?sort=recent" />
        <Section title="⚔️ Экшн" items={action} loading={loading.action} link="/catalog?genre=экшн" />
      </div>
    </div>
  )
}
