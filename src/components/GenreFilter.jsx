import { useEffect, useState } from "react"

export default function GenreFilter({ onSelectGenre }) {
  const [genres, setGenres] = useState([])

  useEffect(() => {
    fetch("https://api.jikan.moe/v4/genres/anime")
      .then(res => res.json())
      .then(data => setGenres(data.data))
  }, [])

  return (
    <select
      className="px-4 py-2 bg-gray-800 rounded"
      onChange={(e) => onSelectGenre(e.target.value)}
    >
      <option value="">All Genre</option>
      {genres.map(g => (
        <option key={g.mal_id} value={g.mal_id}>
          {g.name}
        </option>
      ))}
    </select>
  )
}
