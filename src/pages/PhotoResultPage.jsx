import { useSelector, useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import Navbar from '../components/Navbar.jsx'
import { clearPhoto } from '../store/index.js'

export default function PhotoResultPage() {
  const photo = useSelector(s => s.photo.capturedPhoto)
  const navigate = useNavigate()
  const dispatch = useDispatch()

  const handleDownload = () => {
    const a = document.createElement('a')
    a.href = photo
    a.download = `capture-${Date.now()}.jpg`
    a.click()
  }

  const handleRetake = () => {
    dispatch(clearPhoto())
    navigate(-1)
  }

  if (!photo) {
    return (
      <div className="page-container">
        <Navbar />
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '60vh', gap: 16 }}>
          <div style={{ fontSize: 48 }}>📷</div>
          <h2 style={{ fontFamily: 'var(--font-display)' }}>No photo captured</h2>
          <button className="btn-primary-custom" onClick={() => navigate('/')}><span>← Go Home</span></button>
        </div>
      </div>
    )
  }

  return (
    <div className="page-container">
      <Navbar />
      <div className="container-fluid px-3 px-md-4 py-4" style={{ maxWidth: 800, margin: '0 auto' }}>

        <button className="btn-ghost mb-4" onClick={handleRetake}>
          ← Retake Photo
        </button>

        <div style={{ animation: 'fadeInUp 0.6s ease' }}>
          {/* Header */}
          <div style={{ textAlign: 'center', marginBottom: 32 }}>
            <div style={{ fontSize: 48, marginBottom: 12, animation: 'float 3s ease-in-out infinite' }}>🎉</div>
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 28, fontWeight: 700, marginBottom: 8 }}>
              Photo <span className="gradient-text">Captured!</span>
            </h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: 15 }}>
              Your photo has been successfully captured.
            </p>
          </div>

          {/* Photo display */}
          <div className="glass-card p-4 mb-4" style={{ textAlign: 'center' }}>
            <div style={{ position: 'relative', display: 'inline-block', width: '100%' }}>
              {/* Decorative border */}
              <div style={{
                position: 'absolute', inset: -3, borderRadius: 22,
                background: 'linear-gradient(135deg, var(--accent-cyan), var(--accent-violet), var(--accent-emerald))',
                zIndex: 0, padding: 3
              }} />
              <img
                src={photo}
                alt="Captured"
                style={{
                  width: '100%', maxWidth: 560, borderRadius: 18,
                  display: 'block', margin: '0 auto',
                  position: 'relative', zIndex: 1,
                  transform: 'scaleX(-1)', // mirror effect since we mirrored video
                  boxShadow: '0 20px 60px rgba(0,0,0,0.5)'
                }}
              />
              {/* Timestamp overlay */}
              <div style={{
                position: 'absolute', bottom: 16, left: '50%', transform: 'translateX(-50%)',
                background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(10px)',
                borderRadius: 8, padding: '4px 12px',
                fontSize: 11, fontFamily: 'var(--font-mono)', color: 'var(--text-secondary)',
                zIndex: 2, whiteSpace: 'nowrap'
              }}>
                📅 {new Date().toLocaleString()}
              </div>
            </div>
          </div>

          {/* Info card */}
          <div className="glass-card p-4 mb-4">
            <div className="row g-3">
              {[
                { label: 'Format', value: 'JPEG', icon: '📄' },
                { label: 'Quality', value: '90%', icon: '⭐' },
                { label: 'Captured At', value: new Date().toLocaleTimeString(), icon: '⏰' },
                { label: 'Status', value: 'Saved', icon: '✅' },
              ].map(item => (
                <div key={item.label} className="col-6 col-md-3">
                  <div style={{
                    background: 'rgba(0,0,0,0.2)', borderRadius: 12,
                    padding: '14px 16px', textAlign: 'center',
                    border: '1px solid var(--border-color)'
                  }}>
                    <div style={{ fontSize: 24, marginBottom: 6 }}>{item.icon}</div>
                    <div style={{ fontSize: 10, fontFamily: 'var(--font-mono)', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: 0.8 }}>{item.label}</div>
                    <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-primary)', marginTop: 2 }}>{item.value}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Action buttons */}
          <div className="d-flex gap-3 justify-content-center flex-wrap">
            <button className="btn-primary-custom" style={{ padding: '12px 28px' }} onClick={handleDownload}>
              <span>⬇️ Download Photo</span>
            </button>
            <button className="btn-ghost" style={{ padding: '12px 24px' }} onClick={() => navigate('/')}>
              🏠 Back to Directory
            </button>
            <button className="btn-ghost" style={{ padding: '12px 24px' }} onClick={handleRetake}>
              🔄 Retake Photo
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
