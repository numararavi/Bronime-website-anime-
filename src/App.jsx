import { Routes, Route } from "react-router-dom"
import Home from "./pages/Home"
import Favorites from "./pages/Favorites"
import AnimeDetail from "./components/AnimeDetail"
import Navbar from "./components/Navbar"
import ScrollToTop from "./components/ScrollToTop"

export default function App() {
  return (
    <div className="bg-gray-900 min-h-screen text-white">
      <Navbar />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/favorites" element={<Favorites />} />
        <Route path="/anime/:id" element={<AnimeDetail />} />
      </Routes>

      <ScrollToTop />
    </div>
  )
}
