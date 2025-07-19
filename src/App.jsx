import { Routes, Route } from 'react-router-dom'
import Login from './pages/Login.jsx'
import Home from './pages/Home.jsx'
import Bookmarks from './pages/Bookmarks.jsx'

function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/" element={<Home />} />
      <Route path="/bookmarks" element={<Bookmarks/>} />
    </Routes>
  )
}

export default App
