import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="/dashboard" element={<div>Dashboard</div>} />
        <Route path="/videogames" element={<div>Video Games</div>} />
        <Route path="/platforms" element={<div>Platforms</div>} />
        <Route path="/hardware" element={<div>Hardware</div>} />
        <Route path="/accessories" element={<div>Accessories</div>} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
