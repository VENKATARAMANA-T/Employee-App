import { useEffect, useRef, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import Navbar from '../components/Navbar.jsx'
import { setPhoto, setLoading, setData, setError } from '../store/index.js'
import { fetchEmployees } from '../utils/api.js'

const DEPT_COLORS = {
  Engineering: '#00D4FF', Design: '#7B5EA7', Marketing: '#FFB830',
  Sales: '#00E5A0', HR: '#FF4D6D', Finance: '#FF8C42',
  'Data Science': '#A78BFA', Product: '#34D399', Default: '#8899BB'
}

function getAvatarColor(name = '') {
  const colors = ['#00D4FF', '#7B5EA7', '#00E5A0', '#FFB830', '#FF4D6D', '#A78BFA']
  const idx = name.split('').reduce((a, c) => a + c.charCodeAt(0), 0) % colors.length
  return colors[idx]
}

export default function DetailsPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const { data: employees, loading, error } = useSelector(s => s.employees)
  const [cameraActive, setCameraActive] = useState(false)
  const [cameraError, setCameraError] = useState('')
  const [countdown, setCountdown] = useState(null)
  const [cameraReady, setCameraReady] = useState(false)
  const videoRef = useRef(null)
  const canvasRef = useRef(null)
  const streamRef = useRef(null)

  useEffect(() => {
    if (employees.length === 0) {
      dispatch(setLoading())
      fetchEmployees()
        .then(data => dispatch(setData(data)))
        .catch(err => dispatch(setError(err.message)))
    }
  }, [dispatch, employees.length])

  const emp = employees.find((e, i) => String(e.id) === String(id) || String(i) === String(id))

  useEffect(() => () => { stopCamera() }, [])

  const startCamera = async () => {
    setCameraError('')
    setCameraReady(false)
    setCameraActive(true)
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: 'user', width: { ideal: 1280 }, height: { ideal: 720 } }, 
        audio: false 
      })
      streamRef.current = stream
      if (videoRef.current) {
        videoRef.current.srcObject = stream
        
        // Handle video playing with multiple fallback attempts
        const playPromise = videoRef.current.play()
        if (playPromise !== undefined) {
          playPromise
            .then(() => {
              setCameraReady(true)
            })
            .catch(err => {
              // Autoplay might be blocked, but camera is still ready
              setCameraReady(true)
            })
        }
        
        // Also set ready after metadata loads
        videoRef.current.onloadedmetadata = () => {
          setCameraReady(true)
        }
      }
    } catch (err) {
      setCameraActive(false)
      setCameraError(`Camera access denied or unavailable. ${err.message}`)
    }
  }

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(t => t.stop())
      streamRef.current = null
    }
    setCameraActive(false)
    setCameraReady(false)
    setCountdown(null)
  }

  const captureWithCountdown = () => {
    let count = 3
    setCountdown(count)
    const interval = setInterval(() => {
      count--
      if (count > 0) {
        setCountdown(count)
      } else {
        clearInterval(interval)
        setCountdown('📸')
        setTimeout(() => {
          capturePhoto()
          setCountdown(null)
        }, 300)
      }
    }, 1000)
  }

  const capturePhoto = () => {
    if (!videoRef.current || !canvasRef.current) return
    const video = videoRef.current
    const canvas = canvasRef.current
    canvas.width = video.videoWidth || 640
    canvas.height = video.videoHeight || 480
    const ctx = canvas.getContext('2d')
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height)
    const imageData = canvas.toDataURL('image/jpeg', 0.9)
    dispatch(setPhoto(imageData))
    stopCamera()
    navigate('/photo-result')
  }

  if (loading) {
    return (
      <div className="page-container">
        <Navbar />
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh', flexDirection: 'column', gap: 16 }}>
          <div className="loader" />
          <p style={{ color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', fontSize: 13 }}>LOADING EMPLOYEE...</p>
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
            <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start', marginBottom: 16 }}>
              <span style={{ fontSize: 32, flexShrink: 0 }}>⚠️</span>
              <div style={{ flex: 1 }}>
                <div style={{ fontFamily: 'var(--font-display)', fontSize: 20, fontWeight: 600, color: 'var(--accent-rose)', marginBottom: 8 }}>Failed to load employee</div>
                <div style={{ fontSize: 14, color: 'var(--text-secondary)', lineHeight: 1.6 }}>{error}</div>
              </div>
            </div>
            <button className="btn-ghost" onClick={() => window.location.reload()} style={{ fontSize: 13, padding: '10px 16px' }}>
              🔄 Retry
            </button>
          </div>
        </div>
      </div>
    )
  }

  if (!emp) {
    return (
      <div className="page-container">
        <Navbar />
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '60vh', gap: 16 }}>
          <div style={{ fontSize: 48 }}>😕</div>
          <h2 style={{ fontFamily: 'var(--font-display)' }}>Employee not found</h2>
          <button className="btn-primary-custom" onClick={() => navigate('/')}><span>← Back to List</span></button>
        </div>
      </div>
    )
  }

  const accentColor = getAvatarColor(emp.name)
  const deptColor = DEPT_COLORS[emp.department] || DEPT_COLORS.Default

  const infoHeadingColor = 'var(--text-secondary)'
  const infoItems = [
    { label: 'Email', value: emp.email || 'N/A', icon: '✉️' },
    { label: 'Department', value: emp.department || 'N/A', icon: '🏢' },
    { label: 'Location', value: emp.city || 'N/A', icon: '📍' },
    { label: 'Age', value: emp.age || 'N/A', icon: '🎂' },
    { label: 'Salary', value: `$${Number(emp.salary).toLocaleString()}`, icon: '💰' },
    { label: 'Status', value: emp.status || 'Active', icon: '✅' },
    { label: 'Employee ID', value: `#${emp.id}`, icon: '🆔' },
  ]

  return (
    <div className="page-container">
      <Navbar />
      <div className="container-fluid px-3 px-md-4 py-4" style={{ maxWidth: 1000, margin: '0 auto' }}>

        {/* Back button */}
        <button
          className="btn-ghost mb-4"
          style={{ display: 'flex', alignItems: 'center', gap: 8 }}
          onClick={() => navigate('/')}
        >
          ← Back to Directory
        </button>

        <div style={{ animation: 'fadeInUp 0.5s ease' }}>
          {/* Hero card */}
          <div className="glass-card p-4 p-md-5 mb-4" style={{
            position: 'relative', overflow: 'hidden',
            borderColor: `${accentColor}30`
          }}>
            {/* BG decoration */}
            <div style={{
              position: 'absolute', top: -80, right: -80, width: 280, height: 280,
              borderRadius: '50%', background: `radial-gradient(circle, ${accentColor}12, transparent 70%)`,
              pointerEvents: 'none'
            }} />

            <div className="d-flex align-items-start gap-4 flex-wrap">
              {/* Avatar */}
              <div style={{
                width: 90, height: 90, borderRadius: 24, flexShrink: 0,
                background: `${accentColor}18`, color: accentColor,
                border: `2px solid ${accentColor}44`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 36, fontWeight: 700, fontFamily: 'var(--font-display)',
                boxShadow: `0 8px 30px ${accentColor}25`
              }}>
                {(emp.name || '?').charAt(0)}
              </div>

              <div style={{ flex: 1, minWidth: 200 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap', marginBottom: 8 }}>
                  <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 28, fontWeight: 700, margin: 0 }}>{emp.name}</h1>
                  <span className={`status-badge status-${(emp.status || 'active').toLowerCase()}`}>{emp.status || 'Active'}</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                  <span style={{
                    background: `${deptColor}18`, color: deptColor,
                    border: `1px solid ${deptColor}33`,
                    padding: '4px 12px', borderRadius: 8, fontSize: 13, fontWeight: 600
                  }}>{emp.department}</span>
                  <span style={{ color: 'var(--text-primary)', fontSize: 13 }}>📍 {emp.city}</span>
                </div>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: 13, color: 'var(--text-primary)' }}>
                  EMP ID: <span style={{ color: accentColor }}>#{String(emp.id).padStart(4, '0')}</span>
                </div>
              </div>

              {/* Salary highlight */}
              <div style={{
                background: 'rgba(0,229,160,0.08)', border: '1px solid rgba(0,229,160,0.2)',
                borderRadius: 16, padding: '16px 24px', textAlign: 'center'
              }}>
                <div style={{ fontSize: 11, fontFamily: 'var(--font-mono)', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 4 }}>Annual Salary</div>
                <div style={{ fontFamily: 'var(--font-display)', fontSize: 26, fontWeight: 700, color: 'var(--accent-emerald)' }}>
                  ${Number(emp.salary).toLocaleString()}
                </div>
              </div>
            </div>
          </div>

          <div className="row g-4">
            {/* Info grid */}
            <div className="col-12 col-md-6">
              <div className="glass-card p-4" style={{ height: '100%' }}>
                <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 18, marginBottom: 20, color: infoHeadingColor }}>
                  📋 Employee Information
                </h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                  {infoItems.map(item => (
                    <div key={item.label} style={{
                      display: 'flex', alignItems: 'center', gap: 12,
                      padding: '12px 14px', borderRadius: 10,
                      background: 'rgba(0,0,0,0.2)',
                      border: '1px solid var(--border-color)'
                    }}>
                      <span style={{ fontSize: 18, width: 28, textAlign: 'center', flexShrink: 0 }}>{item.icon}</span>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontSize: 10, fontFamily: 'var(--font-mono)', color: infoHeadingColor, textTransform: 'uppercase', letterSpacing: 0.8 }}>{item.label}</div>
                        <div style={{ fontSize: 14, fontWeight: 500, color: item.label === 'Salary' ? 'var(--accent-emerald)' : 'var(--text-primary)' }}>{item.value}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Camera section */}
            <div className="col-12 col-md-6">
              <div className="glass-card p-4" style={{ height: '100%' }}>
                <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 18, marginBottom: 20, color: 'var(--text-secondary)' }}>
                  📸 Capture Photo
                </h3>

                {!cameraActive ? (
                  <div style={{ textAlign: 'center' }}>
                    <div style={{
                      width: '100%', aspectRatio: '4/3', borderRadius: 16, marginBottom: 20,
                      background: 'rgba(0,0,0,0.3)', border: '2px dashed var(--border-color)',
                      display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 12,
                      position: 'relative', overflow: 'hidden'
                    }}>
                      <div style={{ fontSize: 48, animation: 'float 3s ease-in-out infinite' }}>📷</div>
                      <div style={{ fontFamily: 'var(--font-display)', fontSize: 16, color: 'var(--text-secondary)' }}>Camera Ready</div>
                      <div style={{ fontSize: 13, color: 'var(--text-muted)' }}>Click below to activate webcam</div>
                    </div>

                    {cameraError && (
                      <div style={{
                        background: 'rgba(255,77,109,0.1)', border: '1px solid rgba(255,77,109,0.3)',
                        borderRadius: 10, padding: '10px 14px', marginBottom: 16,
                        color: 'var(--accent-rose)', fontSize: 13
                      }}>{cameraError}</div>
                    )}

                    <button className="btn-primary-custom" style={{ width: '100%', fontSize: 15, padding: '14px' }} onClick={startCamera}>
                      <span>🎥 Activate Camera</span>
                    </button>
                  </div>
                ) : (
                  <div>
                    <div style={{ position: 'relative', borderRadius: 16, overflow: 'hidden', marginBottom: 16 }}>
                      <video
                        ref={videoRef}
                        autoPlay
                        playsInline
                        muted
                        style={{ width: '100%', height: 'auto', borderRadius: 16, display: 'block', transform: 'scaleX(-1)', background: '#000' }}
                      />
                      {countdown !== null && (
                        <div style={{
                          position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center',
                          background: 'rgba(0,0,0,0.5)',
                          fontSize: 80, fontFamily: 'var(--font-display)', fontWeight: 700,
                          color: typeof countdown === 'number' ? 'var(--accent-cyan)' : 'var(--accent-emerald)',
                          textShadow: '0 0 40px currentColor'
                        }}>
                          {countdown}
                        </div>
                      )}
                      {cameraReady && (
                        <div style={{
                          position: 'absolute', top: 12, right: 12, display: 'flex', alignItems: 'center', gap: 6,
                          background: 'rgba(0,0,0,0.6)', borderRadius: 20, padding: '4px 10px'
                        }}>
                          <div style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--accent-emerald)', animation: 'pulse-glow 1s ease-in-out infinite' }} />
                          <span style={{ fontSize: 11, fontFamily: 'var(--font-mono)', color: 'var(--accent-emerald)' }}>READY</span>
                        </div>
                      )}
                      {!cameraReady && (
                        <div style={{
                          position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center',
                          background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(5px)'
                        }}>
                          <div style={{ textAlign: 'center' }}>
                            <div className="loader" style={{ marginBottom: 12 }} />
                            <div style={{ color: 'var(--text-secondary)', fontFamily: 'var(--font-mono)', fontSize: 13 }}>Initializing camera...</div>
                          </div>
                        </div>
                      )}
                    </div>
                    <canvas ref={canvasRef} style={{ display: 'none' }} />
                    <div className="d-flex gap-2">
                      <button className="btn-primary-custom" style={{ flex: 1, padding: '12px' }} onClick={captureWithCountdown} disabled={countdown !== null || !cameraReady}>
                        <span>{countdown !== null ? 'Get ready...' : '📸 Capture Photo'}</span>
                      </button>
                      <button className="btn-ghost" style={{ padding: '12px 16px' }} onClick={stopCamera}>✕</button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
