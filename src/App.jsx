import { HashRouter, Routes, Route, Navigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import LoginPage from './pages/LoginPage.jsx'
import ListPage from './pages/ListPage.jsx'
import DetailsPage from './pages/DetailsPage.jsx'
import PhotoResultPage from './pages/PhotoResultPage.jsx'
import BarChartPage from './pages/BarChartPage.jsx'
import MapPage from './pages/MapPage.jsx'

function ProtectedRoute({ children }) {
  const isAuthenticated = useSelector(s => s.auth.isAuthenticated)
  return isAuthenticated ? children : <Navigate to="/login" replace />
}

export default function App() {
  return (
    <HashRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/" element={<ProtectedRoute><ListPage /></ProtectedRoute>} />
        <Route path="/employee/:id" element={<ProtectedRoute><DetailsPage /></ProtectedRoute>} />
        <Route path="/photo-result" element={<ProtectedRoute><PhotoResultPage /></ProtectedRoute>} />
        <Route path="/charts" element={<ProtectedRoute><BarChartPage /></ProtectedRoute>} />
        <Route path="/map" element={<ProtectedRoute><MapPage /></ProtectedRoute>} />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </HashRouter>
  )
}
