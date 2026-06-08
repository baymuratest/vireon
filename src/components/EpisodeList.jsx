import React, { useState } from 'react'

export default function EpisodeList({ episodes, onSelect, currentEp }) {
  const [season, setSeason] = useState(
    Object.keys(episodes || {})[0] || '1'
  )

  if (!episodes || !Object.keys(episodes).length) return null

  const seasons = Object.keys(episodes)
  const eps = episodes[season] || {}
  const epNums = Object.keys(eps).sort((a, b) => parseInt(a) - parseInt(b))

  return (
    <div style={{
      background: 'var(--bg-card)',
      borderRadius: 'var(--radius-lg)',
      padding: 24,
      border: '1px solid var(--border)'
    }}>
      <h3 style={{ fontSize: 17, fontWeight: 700, marginBottom: 16 }}>Серии</h3>

      {/* Season selector */}
      {seasons.length > 1 && (
        <div style={{ display: 'flex', gap: 8, marginBottom: 16, flexWrap: 'wrap' }}>
          {seasons.map(s => (
            <button key={s} onClick={() => setSeason(s)} style={{
              padding: '6px 16px', borderRadius: 8, border: 'none',
              cursor: 'pointer', fontSize: 13, fontWeight: 600,
              background: season === s
                ? 'linear-gradient(135deg, #7c3aed, #a855f7)'
                : 'rgba(255,255,255,0.07)',
              color: season === s ? 'white' : 'var(--text-secondary)',
              transition: 'all 0.2s'
            }}>Сезон {s}</button>
          ))}
        </div>
      )}

      {/* Episode grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(52px, 1fr))',
        gap: 8, maxHeight: 300, overflowY: 'auto'
      }} className="no-scrollbar">
        {epNums.map(ep => {
          const epData = eps[ep]
          const link = epData?.link || (typeof epData === 'string' ? epData : null)
          const active = currentEp === `${season}-${ep}`
          return (
            <button key={ep} onClick={() => link && onSelect(link, `${season}-${ep}`)} style={{
              padding: '10px 8px',
              borderRadius: 8, border: 'none',
              cursor: link ? 'pointer' : 'not-allowed',
              fontSize: 13, fontWeight: 600,
              background: active
                ? 'linear-gradient(135deg, #7c3aed, #ec4899)'
                : 'rgba(255,255,255,0.06)',
              color: active ? 'white' : link ? 'var(--text-primary)' : 'var(--text-muted)',
              boxShadow: active ? '0 4px 12px rgba(124,58,237,0.4)' : 'none',
              transition: 'all 0.2s'
            }}>{ep}</button>
          )
        })}
      </div>
    </div>
  )
}
