import { useEffect, useState } from "react"
import { useParams, useNavigate } from "react-router-dom"

export default function AnimeDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [anime, setAnime] = useState(null)
  const [loading, setLoading] = useState(true)
  const [showTrailer, setShowTrailer] = useState(false)

  useEffect(() => {
    fetch(`https://api.jikan.moe/v4/anime/${id}`)
      .then(res => res.json())
      .then(data => setAnime(data.data))
      .finally(() => setLoading(false))
  }, [id])

  if (loading) return <p className="p-6">Loading...</p>
  if (!anime) return <p className="p-6">Anime tidak ditemukan</p>

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <button
        onClick={() => navigate(-1)}
        className="mb-6 text-red-500 hover:underline"
      >
        ← Back
      </button>

      <div className="flex flex-col md:flex-row gap-6">
        <img
          src={anime.images.jpg.large_image_url}
          className="w-full md:w-72 rounded-lg shadow-lg"
        />

        <div>
          <h1 className="text-3xl font-bold mb-3">{anime.title}</h1>
          <p className="text-gray-300 mb-4">{anime.synopsis}</p>

          <div className="flex gap-2 flex-wrap mb-4">
            {anime.genres.map(g => (
              <span
                key={g.mal_id}
                className="bg-gray-700 px-3 py-1 rounded text-sm"
              >
                {g.name}
              </span>
            ))}
          </div>

          <p className="mb-4">⭐ Score: {anime.score || "-"}</p>

          <button
            onClick={() => setShowTrailer(true)}
            className="bg-red-600 px-6 py-3 rounded font-semibold hover:bg-red-700"
          >
            ▶ Watch Trailer
          </button>
        </div>
      </div>

      {/* MODAL */}
      {showTrailer && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50">
          <div className="bg-gray-900 p-6 rounded-lg w-full max-w-3xl relative">
            <button
              onClick={() => setShowTrailer(false)}
              className="absolute top-3 right-4 text-xl"
            >
              ✕
            </button>

            {anime.trailer?.embed_url ? (
              <iframe
                className="w-full h-[400px]"
                src={anime.trailer.embed_url}
                allowFullScreen
              />
            ) : (
              <div className="h-[400px] flex items-center justify-center text-gray-400">
                Trailer tidak tersedia
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
