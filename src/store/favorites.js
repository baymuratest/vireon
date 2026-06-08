const KEY = 'vireon_favorites'

export const getFavorites = () => {
  try { return JSON.parse(localStorage.getItem(KEY)) || [] }
  catch { return [] }
}

export const addFavorite = (item) => {
  const favs = getFavorites()
  if (!favs.find(f => f.id === item.id)) {
    localStorage.setItem(KEY, JSON.stringify([...favs, item]))
  }
}

export const removeFavorite = (id) => {
  const favs = getFavorites().filter(f => f.id !== id)
  localStorage.setItem(KEY, JSON.stringify(favs))
}

export const isFavorite = (id) => getFavorites().some(f => f.id === id)
