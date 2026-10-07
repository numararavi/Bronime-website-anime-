import { useEffect, useState } from "react"
import { fetchApi } from "../api"

export default function GenreFilter({ onSelectGenre }) {
  const [genres, setGenres] = useState([])
  const [error, setError] = useState(false)

  useEffect(() => {
    fetchApi("/genres/anime")
      .then(data => setGenres(data.data || []))
      .catch(err => {
        console.error("Gagal fetch genre:", err)
        setError(true)
      })
  }, [])

  return (
    <select
      className="px-4 py-2 bg-gray-800 rounded"
      onChange={(e) => onSelectGenre(e.target.value)}
    >
      <option value="">{error ? "Genre unavailable" : "All Genre"}</option>
      {genres.map(g => (
        <option key={g.mal_id} value={g.mal_id}>
          {g.name}
        </option>
      ))}
    </select>
  )
}
