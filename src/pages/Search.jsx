import React, { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import AnimeGrid from '../components/AnimeGrid'
import { searchAnime } from '../api/kodik'

export default function Search() {
  const [params] = useSearchParams()
  const query = params.get('q') || ''
  const [results, setResults] = useState([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!query) return
    setLoading(true)
    searchAnime(query, 24).then(d => {
      setResults(d?.results || [])
    }).finally(() => setLoading(false))
  }, [query])

  return (
    <div className="container" style={{ paddingTop: 100, paddingBottom: 60 }}>
      <h1 style={{ fontSize: 28, fontWeight: 800, marginBottom: 8 }}>
        Поиск: <span className="gradient-text">«{query}»</span>
      </h1>
      <p style={{ color: 'var(--text-muted)', marginBottom: 32, fontSize: 14 }}>
        {!loading && `Найдено: ${results.length} результатов`}
      </p>
      <AnimeGrid items={results} loading={loading} />
    </div>
  )
}
