import { useEffect, useRef, useState } from "react"
import { useNavigate } from "react-router-dom"
import AnimeCard from "../components/AnimeCard"
import SearchBar from "../components/SearchBar"
import GenreFilter from "../components/GenreFilter"
import SkeletonCard from "../components/SkeletonCard"
import { fetchApi } from "../api"

export default function Home() {
  const [animeList, setAnimeList] = useState([])
  const [page, setPage] = useState(1)
  const [loading, setLoading] = useState(false)
  const [hasMore, setHasMore] = useState(true)
  const [query, setQuery] = useState("")
  const [genre, setGenre] = useState("")
  const [error, setError] = useState("")

  const loaderRef = useRef(null)
  const navigate = useNavigate()

  useEffect(() => {
    document.title = "BRONIME | Streaming Anime"
  }, [])

  useEffect(() => {
    setAnimeList([])
    setPage(1)
    setHasMore(true)
  }, [query, genre])

  useEffect(() => {
    fetchAnime()
   
  }, [page, query, genre])

 
  useEffect(() => {
    const observer = new IntersectionObserver(
      entries => {
        if (entries[0].isIntersecting && hasMore && !loading) {
         
          setTimeout(() => {
            setPage(prev => prev + 1)
          }, 800)
        }
      },
      { threshold: 1 }
    )

    if (loaderRef.current) observer.observe(loaderRef.current)
    return () => observer.disconnect()
  }, [hasMore, loading])

  const fetchAnime = async () => {
    setLoading(true)
    setError("")
    try {
      let url = `/top/anime?page=${page}`

      if (query || genre) {
        url = `/anime?q=${encodeURIComponent(query)}&page=${page}`
      }

      if (genre) {
        url += `${query ? "&" : "?"}genres=${genre}`
      }

      const data = await fetchApi(url)

      let results = data.data || []

      if (results.length === 0) {
        setHasMore(false)
      } else {
        setAnimeList(prev => [...prev, ...results])
      }
    } catch (err) {
      console.error("Gagal fetch anime:", err)
      setError("Data anime tidak dapat dimuat. Coba lagi beberapa saat lagi.")
      setHasMore(false)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Search & Filter */}
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <SearchBar onSearch={setQuery} />
        <GenreFilter onSelectGenre={setGenre} />
      </div>

      {/* Anime Grid */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-6">
        {animeList.map(anime => (
          <AnimeCard
            key={anime.mal_id}
            anime={anime}
            onClick={() => navigate(`/anime/${anime.mal_id}`)}
          />
        ))}

        {/* Skeleton Loading */}
        {loading &&
          Array.from({ length: 10 }).map((_, i) => (
            <SkeletonCard key={i} />
          ))}
      </div>

      {/* Error and empty states */}
      {error && (
        <p className="text-center text-red-400 mt-10">{error}</p>
      )}
      {!error && !loading && animeList.length === 0 && (
        <p className="text-center text-gray-400 mt-10">
          Anime tidak ditemukan
        </p>
      )}

      {/* Loader Trigger */}
      <div ref={loaderRef} className="h-10"></div>

      {/* End Message */}
      {!hasMore && animeList.length > 0 && (
        <p className="text-center text-gray-500 mt-6">
          Tidak ada anime lagi
        </p>
      )}
    </div>
  )
}
