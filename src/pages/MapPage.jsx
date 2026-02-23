import { useEffect, useRef } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import Navbar from '../components/Navbar.jsx'
import { setLoading, setData, setError } from '../store/index.js'
import { fetchEmployees } from '../utils/api.js'

export default function MapPage() {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const { data: employees, loading, error } = useSelector(s => s.employees)
  const mapRef = useRef(null)
  const mapInstanceRef = useRef(null)

  useEffect(() => {
    if (employees.length === 0) {
      dispatch(setLoading())
      fetchEmployees()
        .then(data => dispatch(setData(data)))
        .catch(err => dispatch(setError(err.message)))
    }
  }, [dispatch, employees.length])

  if (loading) {
    return (
      <div className="page-container">
        <Navbar />
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh', flexDirection: 'column', gap: 16 }}>
          <div className="loader" />
          <p style={{ color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', fontSize: 13 }}>LOADING MAP...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="page-container">
        <Navbar />
        <div className="container-fluid px-3 px-md-4 py-4">
          <div className="glass-card p-4" style={{ background: 'rgba(255,77,109,0.08)', border: '1px solid rgba(255,77,109,0.3)' }}>
            <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
              <span style={{ fontSize: 32, flexShrink: 0 }}>⚠️</span>
              <div style={{ flex: 1 }}>
                <div style={{ fontFamily: 'var(--font-display)', fontSize: 20, fontWeight: 600, color: 'var(--accent-rose)', marginBottom: 8 }}>Failed to load map</div>
                <div style={{ fontSize: 14, color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: 16 }}>{error}</div>
                <button className="btn-ghost" onClick={() => window.location.reload()} style={{ fontSize: 13, padding: '10px 16px' }}>
                  🔄 Retry
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  useEffect(() => {
    if (!mapRef.current || mapInstanceRef.current) return

    // Dynamically load Leaflet
    const L = window.L
    if (!L) {
      console.error('Leaflet not loaded')
      return
    }

    const map = L.map(mapRef.current, {
      center: [30, 0],
      zoom: 2,
      zoomControl: true,
    })
    mapInstanceRef.current = map

    // Dark tile layer
    L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
      attribution: '© OpenStreetMap contributors, © CARTO',
      maxZoom: 18,
    }).addTo(map)

    // Group employees by city
    const cityMap = {}
    employees.forEach(emp => {
      const key = emp.city || 'Unknown'
      if (!cityMap[key]) cityMap[key] = { lat: emp.lat, lng: emp.lng, employees: [] }
      cityMap[key].employees.push(emp)
    })

    Object.entries(cityMap).forEach(([city, data]) => {
      if (!data.lat || !data.lng || isNaN(data.lat) || isNaN(data.lng)) return

      const count = data.employees.length
      const avgSalary = Math.round(data.employees.reduce((s, e) => s + Number(e.salary), 0) / count)

      // Custom marker - fixed size
      const markerHtml = `
        <div style="
          background: linear-gradient(135deg, #00D4FF, #7B5EA7);
          width: 44px;
          height: 44px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          font-weight: 700;
          font-family: Sora, sans-serif;
          font-size: 14px;
          border: 2px solid rgba(255,255,255,0.3);
          box-shadow: 0 4px 20px rgba(0,212,255,0.5), 0 0 0 4px rgba(0,212,255,0.1);
          cursor: pointer;
          transition: transform 0.2s;
        ">
          ${count}
        </div>
      `

      const icon = L.divIcon({ html: markerHtml, className: '', iconSize: [44, 44], iconAnchor: [22, 22] })



      const popup = L.popup({
        className: 'custom-popup',
        maxWidth: 280,
      }).setContent(`
        <div style="
          background: #0A1628;
          border: 1px solid rgba(0,212,255,0.2);
          border-radius: 12px;
          padding: 14px;
          color: #F0F4FF;
          font-family: Sora, sans-serif;
          min-width: 220px;
        ">
          <div style="font-size:16px; font-weight:700; margin-bottom:4px; color:#00D4FF;">📍 ${city}</div>
          <div style="font-size:12px; color:#8899BB; margin-bottom:12px;">
            ${count} employee${count > 1 ? 's' : ''} · Avg $${avgSalary.toLocaleString()}
          </div>
        </div>
      `)

      L.marker([data.lat, data.lng], { icon }).addTo(map).bindPopup(popup)
    })

    return () => {
      map.remove()
      mapInstanceRef.current = null
    }
  }, [employees])

  // Group cities for sidebar
  const cityData = {}
  employees.forEach(emp => {
    const key = emp.city || 'Unknown'
    if (!cityData[key]) cityData[key] = 0
    cityData[key]++
  })
  const topCities = Object.entries(cityData).sort((a, b) => b[1] - a[1])

  return (
    <div className="page-container">
      <Navbar />

      <div className="container-fluid px-3 px-md-4 py-4">
        <div className="d-flex align-items-start justify-content-between mb-4" style={{ flexWrap: 'wrap', gap: 12 }}>
          <div>
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 26, fontWeight: 700, marginBottom: 4 }}>
              Geographic <span className="gradient-text">Distribution</span>
            </h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: 14 }}>
              Employee locations across {Object.keys(cityData).length} cities
            </p>
          </div>
          <button className="btn-ghost" onClick={() => navigate('/')} style={{ fontSize: 13, padding: '9px 16px' }}>
            ← Back to Directory
          </button>
        </div>

        <div className="row g-4">
          {/* Map */}
          <div className="col-12 col-md-8">
            <div className="glass-card" style={{ overflow: 'hidden', height: 520 }}>
              <div ref={mapRef} style={{ width: '100%', height: '100%' }} />
            </div>
          </div>

          {/* Sidebar */}
          <div className="col-12 col-md-4">
            <div className="glass-card p-4" style={{ height: 520, overflowY: 'auto' }}>
              <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 17, marginBottom: 16 }}>
                🏙️ City Breakdown
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {topCities.map(([city, count], i) => (
                  <div key={city} style={{
                    display: 'flex', alignItems: 'center', gap: 12,
                    padding: '10px 12px', borderRadius: 10,
                    background: 'rgba(0,0,0,0.2)', border: '1px solid var(--border-color)',
                    animation: `fadeInUp 0.3s ease ${i * 0.05}s both`
                  }}>
                    <div style={{
                      width: 32, height: 32, borderRadius: 8,
                      background: `linear-gradient(135deg, var(--accent-cyan), var(--accent-violet))`,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: 12, fontWeight: 700, color: 'white'
                    }}>{i + 1}</div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: 14, fontWeight: 600 }}>{city}</div>
                      <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>{count} employee{count > 1 ? 's' : ''}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Legend */}
        <div className="glass-card p-3 mt-4">
          <div className="d-flex align-items-center gap-4 flex-wrap">
            <span style={{ fontSize: 13, fontWeight: 600, fontFamily: 'var(--font-display)', color: 'var(--text-secondary)' }}>Map Legend:</span>
            <div className="d-flex align-items-center gap-2">
              <div style={{ width: 28, height: 28, borderRadius: '50%', background: 'linear-gradient(135deg, #00D4FF, #7B5EA7)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 10, color: 'white', fontWeight: 700 }}>1</div>
              <span style={{ fontSize: 13, color: 'var(--text-muted)' }}>Number = employee count at that location</span>
            </div>
            <div className="d-flex align-items-center gap-2">
              <span style={{ fontSize: 18 }}>📍</span>
              <span style={{ fontSize: 13, color: 'var(--text-muted)' }}>Click markers to see location summary</span>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        .leaflet-popup-content-wrapper { background: transparent !important; border: none !important; box-shadow: none !important; padding: 0 !important; }
        .leaflet-popup-tip-container { display: none !important; }
        .leaflet-popup-content { margin: 0 !important; }
        .leaflet-container { background: #050A14; }
        .leaflet-control-zoom a { background: #0A1628 !important; color: #00D4FF !important; border-color: rgba(0,212,255,0.2) !important; }
        .leaflet-control-attribution { background: rgba(5,10,20,0.8) !important; color: #445577 !important; }
      `}</style>
    </div>
  )
}
