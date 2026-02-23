import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate, useLocation } from 'react-router-dom'
import { logout } from '../store/index.js'

export default function Navbar() {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const location = useLocation()
  const user = useSelector(s => s.auth.user)
  const [signingOut, setSigningOut] = useState(false)

  const handleLogout = () => {
    if (signingOut) return
    setSigningOut(true)
    setTimeout(() => {
      dispatch(logout())
      navigate('/login')
    }, 700)
  }

  const navItems = [
    { path: '/', label: 'Employees', icon: '👥' },
    { path: '/charts', label: 'Analytics', icon: '📊' },
    { path: '/map', label: 'Map View', icon: '🗺️' },
  ]

  return (
    <>
      {signingOut && (
        <div style={{
          position: 'fixed', inset: 0, zIndex: 9999,
          background: 'rgba(5,10,20,0.55)',
          backdropFilter: 'blur(8px)',
          WebkitBackdropFilter: 'blur(8px)',
          display: 'flex', alignItems: 'center', justifyContent: 'center'
        }}>
          <div style={{
            background: 'rgba(10,22,40,0.85)',
            border: '1px solid var(--border-color)',
            borderRadius: 16,
            padding: '18px 22px',
            boxShadow: '0 12px 40px rgba(0,0,0,0.45)',
            display: 'flex', alignItems: 'center', gap: 12
          }}>
            <span style={{ width: 18, height: 18, border: '2px solid rgba(255,255,255,0.3)', borderTopColor: 'white', borderRadius: '50%', animation: 'spin-slow 0.8s linear infinite', display: 'inline-block' }} />
            <span style={{ fontFamily: 'var(--font-display)', fontSize: 16, color: 'var(--text-primary)' }}>Signing out...</span>
          </div>
        </div>
      )}
      <nav className="navbar-custom py-3">
        <div className="container-fluid px-4">
          <div className="d-flex align-items-center justify-content-between">
          {/* Logo */}
          <div className="d-flex align-items-center gap-3" style={{ cursor: 'pointer' }} onClick={() => navigate('/')}>
            <div style={{
              width: 40, height: 40, borderRadius: 12,
              background: 'linear-gradient(135deg, var(--accent-cyan), var(--accent-violet))',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 20, boxShadow: '0 4px 15px rgba(0,212,255,0.3)'
            }}>⚡</div>
            <div>
              <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 18, letterSpacing: '-0.5px' }}>
                Emp<span className="gradient-text">Sphere</span>
              </div>
              <div style={{ fontSize: 9, letterSpacing: 1 }}>INTELLIGENCE PLATFORM</div>
            </div>
          </div>

          {/* Nav links - desktop */}
          <div className="d-none d-md-flex align-items-center gap-2">
            {navItems.map(item => (
              <button
                key={item.path}
                onClick={() => navigate(item.path)}
                style={{
                  background: location.pathname === item.path ? 'rgba(0,212,255,0.1)' : 'transparent',
                  border: `1px solid ${location.pathname === item.path ? 'var(--accent-cyan)' : 'transparent'}`,
                  color: location.pathname === item.path ? 'var(--accent-cyan)' : 'var(--text-secondary)',
                  padding: '8px 18px',
                  borderRadius: 10,
                  cursor: 'pointer',
                  fontFamily: 'var(--font-body)',
                  fontSize: 14,
                  fontWeight: 500,
                  transition: 'all 0.2s',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 6
                }}
                onMouseEnter={e => {
                  if (location.pathname !== item.path) {
                    e.currentTarget.style.color = 'var(--text-primary)'
                    e.currentTarget.style.background = 'rgba(255,255,255,0.04)'
                  }
                }}
                onMouseLeave={e => {
                  if (location.pathname !== item.path) {
                    e.currentTarget.style.color = 'var(--text-secondary)'
                    e.currentTarget.style.background = 'transparent'
                  }
                }}
              >
                <span>{item.icon}</span> {item.label}
              </button>
            ))}
          </div>

          {/* User info + logout */}
          <div className="d-flex align-items-center gap-3">
            <div className="d-none d-sm-flex align-items-center gap-2">
              <div style={{
                width: 34, height: 34, borderRadius: 10,
                background: 'linear-gradient(135deg, var(--accent-violet), var(--accent-cyan))',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 14, fontWeight: 700, fontFamily: 'var(--font-display)'
              }}>
                {user?.toUpperCase().charAt(0)}
              </div>
              <div>
                <div style={{ fontSize: 13, fontWeight: 600, lineHeight: 1 }}>{user}</div>
                <div style={{ fontSize: 10, color:'var(--text-secondary)' }}>ADMIN</div>
              </div>
            </div>
            <button
              className="btn-ghost"
              style={{ padding: '8px 16px', fontSize: 13, opacity: signingOut ? 0.7 : 1 }}
              onClick={handleLogout}
              disabled={signingOut}
            >
              Sign Out
            </button>
          </div>
        </div>

        {/* Mobile nav */}
        <div className="d-flex d-md-none gap-2 mt-3">
          {navItems.map(item => (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              style={{
                background: location.pathname === item.path ? 'rgba(0,212,255,0.1)' : 'rgba(255,255,255,0.03)',
                border: `1px solid ${location.pathname === item.path ? 'var(--accent-cyan)' : 'var(--border-color)'}`,
                color: location.pathname === item.path ? 'var(--accent-cyan)' : 'var(--text-secondary)',
                padding: '7px 14px',
                borderRadius: 8,
                cursor: 'pointer',
                fontFamily: 'var(--font-body)',
                fontSize: 12,
                fontWeight: 500,
                flex: 1
              }}
            >
              {item.icon} {item.label}
            </button>
          ))}
        </div>
      </div>
      </nav>
    </>
  )
}
