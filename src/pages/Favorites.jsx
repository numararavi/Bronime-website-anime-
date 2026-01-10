import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import AnimeCard from "../components/AnimeCard"

export default function Favorites() {
  const [animeList, setAnimeList] = useState([])
  const navigate = useNavigate()

  useEffect(() => {
    const favIds = JSON.parse(localStorage.getItem("favorites")) || []

    if (favIds.length === 0) return

    // BATASI MAX 10 REQUEST SEKALIGUS (AMAN DARI 429)
    Promise.all(
      favIds.slice(0, 10).map(id =>
        fetch(`https://api.jikan.moe/v4/anime/${id}`)
          .then(res => res.json())
          .then(data => data.data)
      )
    ).then(setAnimeList)
  }, [])

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">❤️ Favorite Anime</h1>

      {animeList.length === 0 ? (
        <p className="text-gray-400">Belum ada anime favorit</p>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-5 gap-6">
          {animeList.map(anime => (
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
