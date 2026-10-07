import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import AnimeCard from "../components/AnimeCard"
import { fetchApi } from "../api"
import { getWatchStatus, WATCH_STATUSES } from "../watchlist"

export default function Favorites() {
  const [animeList, setAnimeList] = useState([])
  const [statusFilter, setStatusFilter] = useState("")
  const navigate = useNavigate()

  useEffect(() => {
    const favIds = JSON.parse(localStorage.getItem("favorites")) || []

    if (favIds.length === 0) return

    Promise.all(
      favIds.slice(0, 10).map(id =>
        fetchApi(`/anime/${id}`).then(data => data.data)
      )
    )
      .then(setAnimeList)
      .catch(error => console.error("Gagal fetch favorites:", error))
  }, [])

  const filteredAnime = statusFilter
    ? animeList.filter(anime => getWatchStatus(anime.mal_id) === statusFilter)
    : animeList

  return (
    <div className="mx-auto max-w-7xl p-6">
      <div className="mb-6 flex flex-col justify-between gap-4 md:flex-row md:items-center">
        <h1 className="text-2xl font-bold">Favorite Anime</h1>
        <select
          value={statusFilter}
          onChange={event => setStatusFilter(event.target.value)}
          className="rounded bg-gray-800 px-3 py-2 text-sm text-gray-200"
          aria-label="Filter watchlist status"
        >
          <option value="">All Watchlist</option>
          {WATCH_STATUSES.map(status => (
            <option key={status.value} value={status.value}>
              {status.label}
            </option>
          ))}
        </select>
      </div>

      {filteredAnime.length === 0 ? (
        <p className="text-gray-400">
          {animeList.length === 0 ? "Belum ada anime favorit" : "Tidak ada anime dengan status ini"}
        </p>
      ) : (
        <div className="grid grid-cols-2 gap-6 md:grid-cols-5">
          {filteredAnime.map(anime => (
            <AnimeCard
              key={anime.mal_id}
              anime={anime}
              onClick={() => navigate(`/anime/${anime.mal_id}`)}
            />
          ))}
        </div>
      )}
    </div>
  )
}
