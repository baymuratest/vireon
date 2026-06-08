import React, { useState, useEffect } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [query, setQuery] = useState('')
  const navigate = useNavigate()
  const location = useLocation()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const handleSearch = (e) => {
    e.preventDefault()
    if (query.trim()) navigate(`/search?q=${encodeURIComponent(query.trim())}`)
  }

  return (
    <nav style={{
      position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100,
      padding: '0 24px',
      background: scrolled
        ? 'rgba(10,10,15,0.95)'
        : 'linear-gradient(to bottom, rgba(10,10,15,0.8), transparent)',
      backdropFilter: scrolled ? 'blur(20px)' : 'none',
      borderBottom: scrolled ? '1px solid var(--border)' : 'none',
      transition: 'all 0.3s ease',
      height: '70px',
      display: 'flex', alignItems: 'center',
    }}>
      <div style={{
        maxWidth: 1400, margin: '0 auto', width: '100%',
        display: 'flex', alignItems: 'center', gap: 32
      }}>
        {/* Logo */}
        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{
            width: 36, height: 36, borderRadius: 10,
            background: 'linear-gradient(135deg, #7c3aed, #ec4899)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 18, fontWeight: 900,
            boxShadow: '0 0 20px rgba(124,58,237,0.5)'
          }}>V</div>
          <span style={{
            fontFamily: 'Orbitron, sans-serif',
            fontSize: 22, fontWeight: 900,
            background: 'linear-gradient(135deg, #a855f7, #ec4899)',
            WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent'
          }}>VIREON</span>
        </Link>

        {/* Nav links */}
        <div style={{ display: 'flex', gap: 8 }}>
          {[['/', 'Главная'], ['/catalog', 'Каталог']].map(([path, label]) => (
            <Link key={path} to={path} style={{
              padding: '8px 16px', borderRadius: 8,
              fontSize: 14, fontWeight: 500,
              color: location.pathname === path ? 'var(--accent-light)' : 'var(--text-secondary)',
              background: location.pathname === path ? 'rgba(124,58,237,0.15)' : 'transparent',
              transition: 'all 0.2s'
            }}>{label}</Link>
          ))}
        </div>

        {/* Search */}
        <form onSubmit={handleSearch} style={{ marginLeft: 'auto', display: 'flex' }}>
          <input
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Поиск аниме..."
            style={{
              background: 'rgba(255,255,255,0.06)',
              border: '1px solid var(--border)',
              borderRadius: '10px 0 0 10px',
              padding: '9px 16px', color: 'var(--text-primary)',
              fontSize: 14, outline: 'none', width: 260,
              transition: 'all 0.2s',
            }}
            onFocus={e => e.target.style.borderColor = 'var(--accent)'}
            onBlur={e => e.target.style.borderColor = 'var(--border)'}
          />
          <button type="submit" style={{
            background: 'linear-gradient(135deg, #7c3aed, #a855f7)',
            border: 'none', borderRadius: '0 10px 10px 0',
            padding: '9px 18px', color: 'white',
            cursor: 'pointer', fontSize: 16, transition: 'opacity 0.2s'
          }}>🔍</button>
        </form>
      </div>
    </nav>
  )
}
