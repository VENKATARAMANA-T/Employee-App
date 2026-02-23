import { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { login } from '../store/index.js'

const PARTICLES = Array.from({ length: 20 }, (_, i) => ({
  id: i,
  x: Math.random() * 100,
  y: Math.random() * 100,
  size: Math.random() * 3 + 1,
  delay: Math.random() * 3,
  duration: Math.random() * 3 + 3,
}))

export default function LoginPage() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [showPass, setShowPass] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [shake, setShake] = useState(false)
  const [focused, setFocused] = useState('')
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const isAuthenticated = useSelector(s => s.auth.isAuthenticated)

  useEffect(() => {
    if (isAuthenticated) navigate('/')
  }, [isAuthenticated, navigate])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    await new Promise(r => setTimeout(r, 900))
    if (username === 'testuser' && password === 'Test123') {
      dispatch(login(username))
      navigate('/')
    } else {
      setLoading(false)
      setError('Invalid credentials. Try testuser / Test123')
      setShake(true)
      setTimeout(() => setShake(false), 600)
    }
  }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', overflow: 'hidden' }}>
      
      {/* Animated background particles */}
      {PARTICLES.map(p => (
        <div key={p.id} style={{
          position: 'fixed',
          left: `${p.x}%`,
          top: `${p.y}%`,
          width: p.size,
          height: p.size,
          borderRadius: '50%',
          background: p.id % 3 === 0 ? 'var(--accent-cyan)' : p.id % 3 === 1 ? 'var(--accent-violet)' : 'var(--accent-emerald)',
          opacity: 0.4,
          animation: `float ${p.duration}s ease-in-out ${p.delay}s infinite`,
          pointerEvents: 'none'
        }} />
      ))}

      {/* Glow orbs */}
      <div style={{
        position: 'fixed', width: 600, height: 600, borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(0,212,255,0.06) 0%, transparent 70%)',
        top: -200, left: -200, pointerEvents: 'none'
      }} />
      <div style={{
        position: 'fixed', width: 500, height: 500, borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(123,94,167,0.08) 0%, transparent 70%)',
        bottom: -150, right: -100, pointerEvents: 'none'
      }} />

      {/* Main card */}
      <div style={{
        width: '100%',
        maxWidth: 460,
        padding: '0 20px',
        animation: 'fadeInUp 0.7s ease',
        transform: shake ? 'translateX(0)' : undefined,
      }}>
        <div
          className="glass-card"
          style={{
            padding: '48px 40px',
            animation: shake ? 'shake 0.5s ease' : undefined,
          }}
        >
          {/* Logo area */}
          <div style={{ textAlign: 'center', marginBottom: 36 }}>
            <div style={{
              width: 70, height: 70, borderRadius: 20, margin: '0 auto 16px',
              background: 'linear-gradient(135deg, var(--accent-cyan), var(--accent-violet))',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 32, boxShadow: '0 8px 30px rgba(0,212,255,0.35)',
              animation: 'float 3s ease-in-out infinite'
            }}>⚡</div>
            <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 28, fontWeight: 700, marginBottom: 6 }}>
              Welcome to <span className="gradient-text">EmpSphere</span>
            </h1>
            <p style={{ color: 'var(--text-secondary)', fontSize: 14 }}>
              Employee Intelligence Platform
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit}>
            {/* Username */}
            <div style={{ marginBottom: 18 }}>
              <label style={{ fontSize: 12, fontFamily: 'var(--font-mono)', color: 'var(--text-muted)', letterSpacing: 1, textTransform: 'uppercase', display: 'block', marginBottom: 8 }}>
                Username
              </label>
              <div style={{ position: 'relative' }}>
                <span style={{
                  position: 'absolute', left: 16, top: '50%', transform: 'translateY(-50%)',
                  fontSize: 16, opacity: 0.5
                }}>👤</span>
                <input
                  type="text"
                  className="input-custom"
                  style={{ paddingLeft: 44, borderColor: focused === 'user' ? 'var(--accent-cyan)' : undefined }}
                  placeholder="Enter username"
                  value={username}
                  onChange={e => setUsername(e.target.value)}
                  onFocus={() => setFocused('user')}
                  onBlur={() => setFocused('')}
                  autoComplete="username"
                  required
                />
              </div>
            </div>

            {/* Password */}
            <div style={{ marginBottom: 24 }}>
              <label style={{ fontSize: 12, fontFamily: 'var(--font-mono)', color: 'var(--text-muted)', letterSpacing: 1, textTransform: 'uppercase', display: 'block', marginBottom: 8 }}>
                Password
              </label>
              <div style={{ position: 'relative' }}>
                <span style={{
                  position: 'absolute', left: 16, top: '50%', transform: 'translateY(-50%)',
                  fontSize: 16, opacity: 0.5
                }}>🔑</span>
                <input
                  type={showPass ? 'text' : 'password'}
                  className="input-custom"
                  style={{ paddingLeft: 44, paddingRight: 50, borderColor: focused === 'pass' ? 'var(--accent-cyan)' : undefined }}
                  placeholder="Enter password"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  onFocus={() => setFocused('pass')}
                  onBlur={() => setFocused('')}
                  autoComplete="current-password"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPass(!showPass)}
                  style={{
                    position: 'absolute', right: 14, top: '50%', transform: 'translateY(-50%)',
                    background: 'none', border: 'none', cursor: 'pointer', fontSize: 16, opacity: 0.6
                  }}
                >
                  {showPass ? '🙈' : '👁️'}
                </button>
              </div>
            </div>

            {/* Error */}
            {error && (
              <div style={{
                background: 'rgba(255,77,109,0.1)', border: '1px solid rgba(255,77,109,0.3)',
                borderRadius: 10, padding: '10px 14px', marginBottom: 18,
                color: 'var(--accent-rose)', fontSize: 13, display: 'flex', alignItems: 'center', gap: 8
              }}>
                <span>⚠️</span> {error}
              </div>
            )}

            {/* Demo hint */}
            <div style={{
              background: 'rgba(0,212,255,0.05)', border: '1px solid rgba(0,212,255,0.15)',
              borderRadius: 10, padding: '10px 14px', marginBottom: 20, fontSize: 12,
              color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: 8
            }}>
              <span>💡</span>
              <span>Demo: <code style={{ fontFamily: 'var(--font-mono)', color: 'var(--accent-cyan)' }}>testuser</code> / <code style={{ fontFamily: 'var(--font-mono)', color: 'var(--accent-cyan)' }}>Test123</code></span>
            </div>

            {/* Submit */}
            <button
              type="submit"
              className="btn-primary-custom"
              disabled={loading}
              style={{ width: '100%', fontSize: 15, padding: '14px', letterSpacing: 0.5 }}
            >
              {loading ? (
                <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10 }}>
                  <span style={{ width: 18, height: 18, border: '2px solid rgba(255,255,255,0.3)', borderTopColor: 'white', borderRadius: '50%', animation: 'spin-slow 0.8s linear infinite', display: 'inline-block' }} />
                  Authenticating...
                </span>
              ) : (
                <span>Sign In →</span>
              )}
            </button>
          </form>

          {/* Footer */}
          <p style={{ textAlign: 'center', marginTop: 24, fontSize: 12, color: 'var(--text-muted)' }}>
            Secured by <span style={{ color: 'var(--accent-violet)' }}>EmpSphere Auth</span> · v2.0
          </p>
        </div>
      </div>

      <style>{`
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          20% { transform: translateX(-10px); }
          40% { transform: translateX(10px); }
          60% { transform: translateX(-6px); }
          80% { transform: translateX(6px); }
        }
      `}</style>
    </div>
  )
}
