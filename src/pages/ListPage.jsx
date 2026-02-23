import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import Navbar from '../components/Navbar.jsx'
import { setLoading, setData, setError } from '../store/index.js'
import { fetchEmployees } from '../utils/api.js'

const DEPT_COLORS = {
  Engineering: '#00D4FF', Design: '#7B5EA7', Marketing: '#FFB830',
  Sales: '#00E5A0', HR: '#FF4D6D', Finance: '#FF8C42',
  'Data Science': '#A78BFA', Product: '#34D399', Default: '#8899BB'
}

function getAvatarColor(name) {
  const colors = ['#00D4FF', '#7B5EA7', '#00E5A0', '#FFB830', '#FF4D6D', '#A78BFA']
  const idx = name.split('').reduce((a, c) => a + c.charCodeAt(0), 0) % colors.length
  return colors[idx]
}

function StatCard({ label, value, icon, color, sub }) {
  return (
    <div className="stat-card">
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12 }}>
        <div>
          <div style={{ fontSize: 11, fontFamily: 'var(--font-mono)', color: 'var(--text-primary)', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 6 }}>{label}</div>
          <div style={{ fontSize: 28, fontWeight: 700, fontFamily: 'var(--font-display)', color, lineHeight: 1 }}>{value}</div>
          {sub && <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 4 }}>{sub}</div>}
        </div>
        <div style={{ fontSize: 28, opacity: 0.7 }}>{icon}</div>
      </div>
    </div>
  )
}

export default function ListPage() {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { data: employees, loading, error } = useSelector(s => s.employees)
  const [search, setSearch] = useState('')
  const [deptFilter, setDeptFilter] = useState('All')
  const [sortBy, setSortBy] = useState('name')
  const [viewMode, setViewMode] = useState('table') // 'table' | 'grid'
  const [page, setPage] = useState(1)
  const PER_PAGE = 8

  useEffect(() => {
    const loadData = async () => {
      dispatch(setLoading())
      try {
        const employees = await fetchEmployees()
        dispatch(setData(employees))
      } catch (err) {
        dispatch(setError(err.message || 'Failed to fetch employee data.'))
      }
    }
    if (employees.length === 0) loadData()
  }, [dispatch, employees.length])

  const departments = ['All', ...new Set(employees.map(e => e.department).filter(Boolean))]

  const filtered = employees
    .filter(e => {
      const q = search.toLowerCase()
      return (
        (e.name?.toLowerCase().includes(q) || e.email?.toLowerCase().includes(q) || e.city?.toLowerCase().includes(q) || e.department?.toLowerCase().includes(q)) &&
        (deptFilter === 'All' || e.department === deptFilter)
      )
    })
    .sort((a, b) => {
      if (sortBy === 'salary-desc') return b.salary - a.salary
      if (sortBy === 'salary-asc') return a.salary - b.salary
      if (sortBy === 'name') return (a.name || '').localeCompare(b.name || '')
      if (sortBy === 'department') return (a.department || '').localeCompare(b.department || '')
      return 0
    })

  const totalPages = Math.ceil(filtered.length / PER_PAGE)
  const paginated = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE)

  const totalSalary = employees.reduce((s, e) => s + (parseFloat(e.salary) || 0), 0)
  const avgSalary = employees.length ? totalSalary / employees.length : 0
  const depts = new Set(employees.map(e => e.department)).size

  const fmtSalary = v => v >= 1000 ? `$${(v / 1000).toFixed(0)}K` : `$${v}`

  return (
    <div className="page-container">
      <Navbar />
      <div className="container-fluid px-3 px-md-4 py-4">

        {/* Header */}
        <div className="d-flex align-items-start justify-content-between mb-4" style={{ flexWrap: 'wrap', gap: 12 }}>
          <div>
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 26, fontWeight: 700, marginBottom: 4 }}>
              Employee <span className="gradient-text">Directory</span>
            </h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: 14 }}>
              {employees.length} team members across {depts} departments
            </p>
          </div>
          
        </div>

        {/* Stats row */}
        <div className="row g-3 mb-4">
          <div className="col-6 col-md-3">
            <StatCard label="Total Employees" value={employees.length} icon="👥" color="var(--accent-cyan)" />
          </div>
          <div className="col-6 col-md-3">
            <StatCard label="Departments" value={depts} icon="🏢" color="var(--accent-violet)" />
          </div>
          <div className="col-6 col-md-3">
            
            <StatCard label="Avg Salary" value={fmtSalary(Math.round(avgSalary))} icon="💰" color="var(--accent-emerald)" />
          </div>
          <div className="col-6 col-md-3">
            <StatCard label="working remotely" value={employees.filter(e => e.status === 'Remote').length} icon="🌐" color="var(--accent-amber)" />
          </div>
        </div>

        {/* Controls */}
        <div className="glass-card p-3 mb-4">
          <div className="d-flex gap-3 flex-wrap align-items-center">
            {/* Search */}
            <div className="search-wrapper flex-grow-1" style={{ minWidth: 200 }}>
              <span className="search-icon" style={{ fontSize: 15 }}>🔍</span>
              <input
                type="text"
                className="input-custom search-input"
                placeholder="Search employees..."
                value={search}
                onChange={e => { setSearch(e.target.value); setPage(1) }}
              />
            </div>

            {/* Dept filter */}
            <select
              value={deptFilter}
              onChange={e => { setDeptFilter(e.target.value); setPage(1) }}
              style={{
                background: 'var(--bg-card)', border: '1px solid var(--border-color)',
                color: 'var(--text-primary)', borderRadius: 12, padding: '10px 14px',
                fontFamily: 'var(--font-body)', fontSize: 14, outline: 'none', cursor: 'pointer',
                transition: 'all 0.3s ease'
              }}
            >
              {departments.map(d => <option key={d} value={d}>{d}</option>)}
            </select>

            {/* Sort */}
            <select
              value={sortBy}
              onChange={e => setSortBy(e.target.value)}
              style={{
                background: 'var(--bg-card)', border: '1px solid var(--border-color)',
                color: 'var(--text-primary)', borderRadius: 12, padding: '10px 14px',
                fontFamily: 'var(--font-body)', fontSize: 14, outline: 'none', cursor: 'pointer',
                transition: 'all 0.3s ease'
              }}
            >
              <option value="name">Sort: Name</option>
              <option value="salary-desc">Sort: Salary ↓</option>
              <option value="salary-asc">Sort: Salary ↑</option>
              <option value="department">Sort: Dept</option>
            </select>

            {/* View toggle */}
            <div style={{ display: 'flex', background: 'rgba(10,22,40,0.8)', border: '1px solid var(--border-color)', borderRadius: 10, overflow: 'hidden' }}>
              {['table', 'grid'].map(m => (
                <button
                  key={m}
                  onClick={() => setViewMode(m)}
                  style={{
                    padding: '10px 14px', border: 'none', cursor: 'pointer', fontSize: 16,
                    background: viewMode === m ? 'rgba(0,212,255,0.15)' : 'transparent',
                    color: viewMode === m ? 'var(--accent-cyan)' : 'var(--text-muted)',
                    transition: 'all 0.2s'
                  }}
                >
                  {m === 'table' ? '☰' : '⊞'}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Loading */}
        {loading && (
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 200, flexDirection: 'column', gap: 16 }}>
            <div className="loader" />
            <p style={{ color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', fontSize: 13 }}>LOADING EMPLOYEES...</p>
          </div>
        )}

        {/* Error state */}
        {error && (
          <div className="glass-card p-4" style={{ background: 'rgba(255,77,109,0.08)', border: '1px solid rgba(255,77,109,0.3)', marginBottom: 16 }}>
            <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
              <span style={{ fontSize: 24, flexShrink: 0 }}>⚠️</span>
              <div style={{ flex: 1 }}>
                <div style={{ fontFamily: 'var(--font-display)', fontSize: 16, fontWeight: 600, color: 'var(--accent-rose)', marginBottom: 4 }}>Failed to load employees</div>
                <div style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.5 }}>{error}</div>
                <button 
                  className="btn-ghost" 
                  onClick={() => window.location.reload()} 
                  style={{ marginTop: 12, fontSize: 13, padding: '8px 16px' }}
                >
                  🔄 Retry
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Table view */}
        {!loading && viewMode === 'table' && (
          <div className="glass-card p-0" style={{ overflow: 'hidden' }}>
            <div style={{ overflowX: 'auto' }}>
              <table className="table-custom" style={{ minWidth: 640 }}>
                <thead>
                  <tr>
                    <th>Employee</th>
                    <th>Department</th>
                    <th>Location</th>
                    <th>Salary</th>
                    <th>Status</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {paginated.map((emp, i) => (
                    <tr
                      key={emp.id || i}
                      onClick={() => navigate(`/employee/${emp.id || i}`)}
                      style={{ animation: `fadeInUp 0.4s ease ${i * 0.05}s both` }}
                    >
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                          <div className="avatar" style={{ background: `${getAvatarColor(emp.name)}22`, color: getAvatarColor(emp.name), border: `1px solid ${getAvatarColor(emp.name)}44` }}>
                            {(emp.name || '?').charAt(0)}
                          </div>
                          <div>
                            <div style={{ fontWeight: 600, fontSize: 14, fontFamily: 'var(--font-display)' }}>{emp.name}</div>
                            <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>{emp.email || 'N/A'}</div>
                          </div>
                        </div>
                      </td>
                      <td>
                        <span style={{
                          background: `${DEPT_COLORS[emp.department] || DEPT_COLORS.Default}18`,
                          color: DEPT_COLORS[emp.department] || DEPT_COLORS.Default,
                          border: `1px solid ${DEPT_COLORS[emp.department] || DEPT_COLORS.Default}33`,
                          padding: '4px 10px', borderRadius: 8, fontSize: 12, fontWeight: 500
                        }}>
                          {emp.department || 'N/A'}
                        </span>
                      </td>
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, color: 'var(--text-secondary)' }}>
                          📍 {emp.city || 'N/A'}
                        </div>
                      </td>
                      <td>
                        <div style={{ fontFamily: 'var(--font-mono)', fontSize: 14, color: 'var(--accent-emerald)', fontWeight: 500 }}>
                          ${Number(emp.salary).toLocaleString()}
                        </div>
                      </td>
                      <td>
                        <span className={`status-badge status-${(emp.status || 'active').toLowerCase()}`}>
                          {emp.status || 'Active'}
                        </span>
                      </td>
                      <td style={{ textAlign: 'right', paddingRight: 20 }}>
                        <span style={{ color: 'var(--accent-cyan)', fontSize: 18 }}>›</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Grid view */}
        {!loading && viewMode === 'grid' && (
          <div className="row g-3">
            {paginated.map((emp, i) => (
              <div key={emp.id || i} className="col-12 col-sm-6 col-lg-4">
                <div
                  className="glass-card p-4"
                  style={{ cursor: 'pointer', animation: `fadeInUp 0.4s ease ${i * 0.05}s both`, height: '100%' }}
                  onClick={() => navigate(`/employee/${emp.id || i}`)}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 16 }}>
                    <div className="avatar" style={{
                      width: 50, height: 50, borderRadius: 14,
                      background: `${getAvatarColor(emp.name)}22`,
                      color: getAvatarColor(emp.name),
                      border: `1px solid ${getAvatarColor(emp.name)}44`,
                      fontSize: 20
                    }}>
                      {(emp.name || '?').charAt(0)}
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontWeight: 700, fontFamily: 'var(--font-display)', fontSize: 15 }}>{emp.name}</div>
                      <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>{emp.email || 'N/A'}</div>
                    </div>
                    <span className={`status-badge status-${(emp.status || 'active').toLowerCase()}`}>{emp.status || 'Active'}</span>
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                    {[
                      { label: 'Dept', value: emp.department || 'N/A', color: DEPT_COLORS[emp.department] },
                      { label: 'City', value: emp.city || 'N/A', color: 'var(--text-secondary)' },
                      { label: 'Salary', value: `$${Number(emp.salary).toLocaleString()}`, color: 'var(--accent-emerald)' },
                      { label: 'Age', value: emp.age || 'N/A', color: 'var(--text-secondary)' },
                    ].map(f => (
                      <div key={f.label} style={{ background: 'rgba(0,0,0,0.2)', borderRadius: 8, padding: '8px 10px' }}>
                        <div style={{ fontSize: 10, fontFamily: 'var(--font-mono)', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 2 }}>{f.label}</div>
                        <div style={{ fontSize: 13, fontWeight: 600, color: f.color || 'var(--text-primary)' }}>{f.value}</div>
                      </div>
                    ))}
                  </div>
                  <div style={{ marginTop: 14, display: 'flex', justifyContent: 'flex-end' }}>
                    <span style={{ fontSize: 12, color: 'var(--accent-cyan)' }}>View Details →</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Empty state */}
        {!loading && filtered.length === 0 && (
          <div style={{ textAlign: 'center', padding: '60px 20px', color: 'var(--text-muted)' }}>
            <div style={{ fontSize: 48, marginBottom: 16 }}>🔍</div>
            <div style={{ fontFamily: 'var(--font-display)', fontSize: 20, marginBottom: 8 }}>No employees found</div>
            <div style={{ fontSize: 14 }}>Try adjusting your search or filters</div>
          </div>
        )}

        {/* Pagination */}
        {!loading && totalPages > 1 && (
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 8, marginTop: 24 }}>
            <button
              className="btn-ghost"
              style={{ padding: '8px 16px', fontSize: 13 }}
              onClick={() => setPage(p => Math.max(1, p - 1))}
              disabled={page === 1}
            >
              ← Prev
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
              <button
                key={p}
                onClick={() => setPage(p)}
                style={{
                  width: 36, height: 36, borderRadius: 8, border: 'none', cursor: 'pointer',
                  background: page === p ? 'linear-gradient(135deg, var(--accent-cyan), var(--accent-violet))' : 'rgba(255,255,255,0.04)',
                  color: page === p ? 'white' : 'var(--text-secondary)',
                  fontWeight: page === p ? 700 : 400,
                  fontSize: 13
                }}
              >{p}</button>
            ))}
            <button
              className="btn-ghost"
              style={{ padding: '8px 16px', fontSize: 13 }}
              onClick={() => setPage(p => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
            >
              Next →
            </button>
          </div>
        )}

        {/* Results count */}
        {!loading && filtered.length > 0 && (
          <div style={{ textAlign: 'center', marginTop: 16, fontSize: 12, color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
            Showing {Math.min((page - 1) * PER_PAGE + 1, filtered.length)}–{Math.min(page * PER_PAGE, filtered.length)} of {filtered.length} results
          </div>
        )}
      </div>
    </div>
  )
}
