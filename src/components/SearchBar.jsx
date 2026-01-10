import { useEffect, useState } from "react"

export default function SearchBar({ onSearch }) {
  const [value, setValue] = useState("")

  useEffect(() => {
    const delay = setTimeout(() => {
      onSearch(value)
    }, 600) // debounce 600ms

    return () => clearTimeout(delay)
  }, [value])

  return (
    <input
      type="text"
      placeholder="Search anime..."
      value={value}
      onChange={e => setValue(e.target.value)}
      className="w-full md:w-80 px-4 py-2 rounded bg-gray-800 outline-none"
    />
  )
}
