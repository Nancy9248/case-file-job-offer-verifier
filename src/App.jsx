import { useEffect, useState } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Nav from './components/Nav.jsx'
import Scan from './pages/Scan.jsx'
import Verify from './pages/Verify.jsx'
import Community from './pages/Community.jsx'
import Awareness from './pages/Awareness.jsx'
import History from './pages/History.jsx'
import { getUserId } from './lib/firebase.js'

function App() {
  const [uid, setUid] = useState(null)

  useEffect(() => {
    getUserId().then(setUid)
  }, [])

  return (
    <BrowserRouter>
      <div className="min-h-screen bg-amber-50 text-slate-900">
        <Nav />
        <Routes>
          <Route path="/" element={<Scan uid={uid} />} />
          <Route path="/verify" element={<Verify />} />
          <Route path="/community" element={<Community />} />
          <Route path="/awareness" element={<Awareness />} />
          <Route path="/history" element={<History uid={uid} />} />
        </Routes>
      </div>
    </BrowserRouter>
  )
}

export default App
