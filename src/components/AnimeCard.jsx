import { useState } from "react"

export default function AnimeCard({ anime, onClick }) {
  const [fav, setFav] = useState(() => {
    const stored = JSON.parse(localStorage.getItem("favorites")) || []
    return stored.includes(anime.mal_id)
  })

  const toggleFav = e => {
    e.stopPropagation()
    let stored = JSON.parse(localStorage.getItem("favorites")) || []

    if (stored.includes(anime.mal_id)) {
      stored = stored.filter(id => id !== anime.mal_id)
      setFav(false)
    } else {
      stored.push(anime.mal_id)
      setFav(true)
    }

    localStorage.setItem("favorites", JSON.stringify(stored))
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
        >
          {fav ? "❤️" : "🤍"}
        </button>
      </div>

      <h3 className="mt-2 text-sm font-semibold line-clamp-2">
        {anime.title}
      </h3>
      <p className="text-xs text-gray-400">⭐ {anime.score || "-"}</p>
    </div>
  )
}
