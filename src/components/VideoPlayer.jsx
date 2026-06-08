import React from 'react'

export default function VideoPlayer({ link, title }) {
  if (!link) return (
    <div style={{
      aspectRatio: '16/9',
      background: 'var(--bg-card)',
      borderRadius: 'var(--radius-lg)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      flexDirection: 'column', gap: 12,
      border: '1px solid var(--border)'
    }}>
      <span style={{ fontSize: 48 }}>🎌</span>
      <span style={{ color: 'var(--text-muted)', fontSize: 15 }}>Плеер недоступен</span>
    </div>
  )

  // Ensure HTTPS
  const src = link.startsWith('//') ? `https:${link}` : link

  return (
    <div style={{
      borderRadius: 'var(--radius-lg)', overflow: 'hidden',
      boxShadow: '0 20px 60px rgba(0,0,0,0.6)',
      border: '1px solid var(--border)',
      position: 'relative',
      background: '#000',
    }}>
      <iframe
        src={src}
        title={title || 'Kodik Player'}
        width="100%"
        style={{ display: 'block', aspectRatio: '16/9', border: 'none' }}
        allowFullScreen
        allow="autoplay; fullscreen"
        scrolling="no"
      />
    </div>
  )
}
