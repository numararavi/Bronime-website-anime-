import { useEffect, useRef, useState } from "react"
import { useNavigate } from "react-router-dom"
import AnimeCard from "../components/AnimeCard"
import SearchBar from "../components/SearchBar"
import GenreFilter from "../components/GenreFilter"
import SkeletonCard from "../components/SkeletonCard"
import { fetchApi } from "../api"

const selectClass = "rounded bg-gray-800 px-3 py-2 text-sm text-gray-200 outline-none"

export default function Home() {
  const [animeList, setAnimeList] = useState([])
  const [page, setPage] = useState(1)
  const [loading, setLoading] = useState(false)
  const [hasMore, setHasMore] = useState(true)
  const [query, setQuery] = useState("")
  const [genre, setGenre] = useState("")
  const [type, setType] = useState("")
  const [airingStatus, setAiringStatus] = useState("")
  const [minScore, setMinScore] = useState("")
  const [sort, setSort] = useState("top")
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
  }, [query, genre, type, airingStatus, minScore, sort])

  useEffect(() => {
    fetchAnime()
  }, [page, query, genre, type, airingStatus, minScore, sort])

  useEffect(() => {
    const observer = new IntersectionObserver(
      entries => {
        if (entries[0].isIntersecting && hasMore && !loading) {
          setTimeout(() => setPage(previous => previous + 1), 800)
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
      const params = new URLSearchParams({ page: String(page) })
      if (query) params.set("q", query)
      if (genre) params.set("genres", genre)
      if (type) params.set("type", type)
      if (airingStatus) params.set("status", airingStatus)
      if (minScore) params.set("score", minScore)

      const hasFilters = query || genre || type || airingStatus || minScore
      const endpoint = hasFilters ? `/anime?${params}` : `/top/anime?page=${page}`
      const data = await fetchApi(endpoint)
      let results = data.data || []

      if (sort === "title") {
        results = [...results].sort((first, second) => first.title.localeCompare(second.title))
      } else if (sort === "score") {
        results = [...results].sort((first, second) => (second.score || 0) - (first.score || 0))
      } else if (sort === "popular") {
        results = [...results].sort((first, second) => (second.members || 0) - (first.members || 0))
      }

      if (results.length === 0) {
        setHasMore(false)
      } else {
        setAnimeList(previous => [...previous, ...results])
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
    <div className="mx-auto max-w-7xl p-6">
      <div className="mb-6 flex flex-col gap-4">
        <div className="flex flex-col gap-4 md:flex-row">
          <SearchBar onSearch={setQuery} />
          <GenreFilter onSelectGenre={setGenre} />
        </div>

        <div className="flex flex-wrap gap-3">
          <select value={type} onChange={e => setType(e.target.value)} className={selectClass} aria-label="Filter anime type">
            <option value="">All Types</option>
            <option value="tv">TV</option>
            <option value="movie">Movie</option>
            <option value="ova">OVA</option>
            <option value="ona">ONA</option>
            <option value="special">Special</option>
          </select>
          <select value={airingStatus} onChange={e => setAiringStatus(e.target.value)} className={selectClass} aria-label="Filter anime status">
            <option value="">All Airing Status</option>
            <option value="airing">Currently Airing</option>
            <option value="complete">Completed</option>
            <option value="upcoming">Upcoming</option>
          </select>
          <select value={minScore} onChange={e => setMinScore(e.target.value)} className={selectClass} aria-label="Filter minimum score">
            <option value="">Any Score</option>
            <option value="8">Score 8+</option>
            <option value="7">Score 7+</option>
            <option value="6">Score 6+</option>
          </select>
          <select value={sort} onChange={e => setSort(e.target.value)} className={selectClass} aria-label="Sort anime">
            <option value="top">Top Rated</option>
            <option value="score">Highest Score</option>
            <option value="popular">Most Popular</option>
            <option value="title">Title A-Z</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-6 md:grid-cols-5">
        {animeList.map(anime => (
          <AnimeCard
            key={`${anime.mal_id}-${page}-${anime.title}`}
            anime={anime}
            onClick={() => navigate(`/anime/${anime.mal_id}`)}
          />
        ))}
        {loading && Array.from({ length: 10 }).map((_, index) => <SkeletonCard key={index} />)}
      </div>

      {error && <p className="mt-10 text-center text-red-400">{error}</p>}
      {!error && !loading && animeList.length === 0 && (
        <p className="mt-10 text-center text-gray-400">Anime tidak ditemukan</p>
      )}

      <div ref={loaderRef} className="h-10" />
      {!hasMore && animeList.length > 0 && (
        <p className="mt-6 text-center text-gray-500">Tidak ada anime lagi</p>
      )}
    </div>
  )
}
