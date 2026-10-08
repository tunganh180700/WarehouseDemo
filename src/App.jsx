import { Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'
import RawPage from './pages/RawPage'
import StagingPage from './pages/StagingPage'
import NdsPage from './pages/NdsPage'

function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<RawPage />} />
        <Route path="staging" element={<StagingPage />} />
        <Route path="nds" element={<NdsPage />} />
      </Route>
    </Routes>
  )
}

export default App
