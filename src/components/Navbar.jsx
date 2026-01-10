import { Link } from "react-router-dom"

export default function Navbar() {
  return (
    <nav className="bg-gray-900 px-6 py-4 flex justify-between items-center">
      <Link to="/" className="text-2xl font-bold text-red-500">
        BRONIME
      </Link>

      <div className="flex gap-4">
        <Link to="/" className="hover:text-red-400">Home</Link>
        <Link to="/favorites" className="hover:text-red-400">Favorites</Link>
      </div>
    </nav>
  )
}
