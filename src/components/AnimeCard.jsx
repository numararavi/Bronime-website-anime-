import { useState } from "react"
import { getWatchStatus, removeWatchStatus, setWatchStatus, WATCH_STATUSES } from "../watchlist"

export default function AnimeCard({ anime, onClick }) {
  const [fav, setFav] = useState(() => {
    const stored = JSON.parse(localStorage.getItem("favorites")) || []
    return stored.includes(anime.mal_id)
  })
  const [watchStatus, setWatchStatusState] = useState(() => getWatchStatus(anime.mal_id))

  const toggleFav = e => {
    e.stopPropagation()
    let stored = JSON.parse(localStorage.getItem("favorites")) || []

    if (stored.includes(anime.mal_id)) {
      stored = stored.filter(id => id !== anime.mal_id)
      removeWatchStatus(anime.mal_id)
      setFav(false)
    } else {
      stored.push(anime.mal_id)
      setWatchStatus(anime.mal_id, watchStatus)
      setFav(true)
    }

    localStorage.setItem("favorites", JSON.stringify(stored))
  }

  const changeWatchStatus = e => {
    e.stopPropagation()
    const status = e.target.value
    setWatchStatus(anime.mal_id, status)
    setWatchStatusState(status)
  }

  return (
    <div
      onClick={onClick}
      className="cursor-pointer group transform hover:scale-105 transition"
    >
      <div className="relative">
        <img
          src={anime.images.jpg.image_url}
          className="rounded-lg shadow-lg"
        />
        <button
          onClick={toggleFav}
          className="absolute top-2 right-2 text-xl"
          aria-label={fav ? "Remove from favorites" : "Add to favorites"}
        >
          {fav ? "❤️" : "🤍"}
        </button>
      </div>

      <h3 className="mt-2 text-sm font-semibold line-clamp-2">
        {anime.title}
      </h3>
      <p className="text-xs text-gray-400">⭐ {anime.score || "-"}</p>
      <select
        value={watchStatus}
        onChange={changeWatchStatus}
        onClick={e => e.stopPropagation()}
        className="mt-2 w-full rounded bg-gray-800 px-2 py-1 text-xs text-gray-200"
        aria-label={`Watch status for ${anime.title}`}
      >
        {WATCH_STATUSES.map(status => (
          <option key={status.value} value={status.value}>
            {status.label}
          </option>
        ))}
      </select>
    </div>
  )
}
