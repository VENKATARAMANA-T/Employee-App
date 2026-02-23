import { useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, LineChart, Line, Area, AreaChart
} from 'recharts'
import Navbar from '../components/Navbar.jsx'
import { setLoading, setData, setError } from '../store/index.js'
import { fetchEmployees } from '../utils/api.js'

const COLORS = ['#00D4FF', '#7B5EA7', '#00E5A0', '#FFB830', '#FF4D6D', '#A78BFA', '#34D399', '#FF8C42']
const PIE_COLORS = [
  '#2DD4BF', '#60A5FA', '#F59E0B', '#F472B6', '#A78BFA', '#34D399',
  '#FB7185', '#F97316', '#22C55E', '#38BDF8', '#EAB308', '#C084FC',
  '#F43F5E', '#14B8A6', '#0EA5E9', '#84CC16'
]

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null
  const primary = payload[0] || {}
  const displayLabel = primary?.payload?.name || primary?.name || label
  const isPie = primary?.dataKey === 'value' && !!primary?.payload?.name
  if (isPie) {
    const value = Number(primary?.value) || 0
    return (
      <div style={{
        background: 'rgba(10,22,40,0.95)', border: '1px solid var(--border-color)',
        borderRadius: 12, padding: '12px 16px', boxShadow: '0 8px 24px rgba(0,0,0,0.5)'
      }}>
        <div style={{ fontFamily: 'var(--font-display)', fontWeight: 600, marginBottom: 6, color: 'var(--text-primary)' }}>
          {displayLabel}
        </div>
        <div style={{ fontSize: 13, color: 'var(--accent-cyan)' }}>
          Average Salary : <strong>${value.toLocaleString()}</strong>
        </div>
      </div>
    )
  }
  return (
    <div style={{
      background: 'rgba(10,22,40,0.95)', border: '1px solid var(--border-color)',
      borderRadius: 12, padding: '12px 16px', boxShadow: '0 8px 24px rgba(0,0,0,0.5)'
    }}>
      <div style={{ fontFamily: 'var(--font-display)', fontWeight: 600, marginBottom: 6, color: 'var(--text-primary)' }}>{displayLabel}</div>
      {payload.map((p, i) => (
        <div key={i} style={{ fontSize: 13, color: p.color || 'var(--accent-cyan)' }}>
          {p.name}: <strong>{typeof p.value === 'number' && p.value > 1000 ? `$${p.value.toLocaleString()}` : p.value}</strong>
        </div>
      ))}
    </div>
  )
}


export default function BarChartPage() {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const { data: employees, loading, error } = useSelector(s => s.employees)

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
          <p style={{ color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', fontSize: 13 }}>LOADING ANALYTICS...</p>
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
                <div style={{ fontFamily: 'var(--font-display)', fontSize: 20, fontWeight: 600, color: 'var(--accent-rose)', marginBottom: 8 }}>Failed to load analytics</div>
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

  // Top 10 by salary for bar chart
  const top10 = [...employees]
    .sort((a, b) => Number(b.salary) - Number(a.salary))
    .slice(0, 10)
    .map(e => ({
      name: (e.name || '').split(' ')[0],
      salary: Number(e.salary),
      dept: e.department
    }))

  // Dept salary avg for pie
  const deptMap = {}
  employees.forEach(e => {
    if (!deptMap[e.department]) deptMap[e.department] = { total: 0, count: 0 }
    deptMap[e.department].total += Number(e.salary) || 0
    deptMap[e.department].count++
  })
  const deptPieData = Object.entries(deptMap).map(([dept, v]) => ({
    name: dept,
    value: Math.round(v.total / v.count)
  }))
  const deptColors = deptPieData.map((_, i) => PIE_COLORS[i] || `hsl(${(i * 37) % 360}, 70%, 55%)`)
  const deptColorMap = deptPieData.reduce((acc, d, i) => {
    acc[d.name] = deptColors[i]
    return acc
  }, {})

  // Salary distribution for area chart
  const salaryRanges = [
    { range: '< 60K', min: 0, max: 60000 },
    { range: '60–75K', min: 60000, max: 75000 },
    { range: '75–90K', min: 75000, max: 90000 },
    { range: '90–105K', min: 90000, max: 105000 },
    { range: '> 105K', min: 105000, max: Infinity },
  ].map(r => ({
    range: r.range,
    count: employees.filter(e => Number(e.salary) >= r.min && Number(e.salary) < r.max).length
  }))

  const totalSalarySpend = employees.reduce((s, e) => s + Number(e.salary), 0)
  const avgSalary = employees.length ? Math.round(totalSalarySpend / employees.length) : 0
  const maxSalary = Math.max(...employees.map(e => Number(e.salary) || 0))
  const minSalary = Math.min(...employees.filter(e => e.salary).map(e => Number(e.salary) || 0))

  return (
    <div className="page-container">
      <Navbar />
      <div className="container-fluid px-3 px-md-4 py-4">

        <div className="d-flex align-items-start justify-content-between mb-4" style={{ flexWrap: 'wrap', gap: 12 }}>
          <div>
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 26, fontWeight: 700, marginBottom: 4 }}>
              Salary <span className="gradient-text">Analytics</span>
            </h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: 14 }}>
              Compensation insights across {employees.length} employees
            </p>
          </div>
          <button className="btn-ghost" onClick={() => navigate('/')} style={{ fontSize: 13, padding: '9px 16px' }}>
            ← Back to Directory
          </button>
        </div>

        {/* KPI Row */}
        <div className="row g-3 mb-4">
          {[
            { label: 'Total Payroll', value: `$${(totalSalarySpend / 1000000).toFixed(2)}M`, icon: '💼', color: 'var(--accent-cyan)' },
            { label: 'Average Salary', value: `$${avgSalary.toLocaleString()}`, icon: '📊', color: 'var(--accent-violet)' },
            { label: 'Highest Salary', value: `$${maxSalary.toLocaleString()}`, icon: '🏆', color: 'var(--accent-emerald)' },
            { label: 'Lowest Salary', value: `$${minSalary.toLocaleString()}`, icon: '📉', color: 'var(--accent-amber)' },
          ].map(s => (
            <div key={s.label} className="col-6 col-md-3">
              <div className="stat-card">
                <div style={{ fontSize: 28, marginBottom: 8 }}>{s.icon}</div>
                <div style={{ fontSize: 11, fontFamily: 'var(--font-mono)', color: 'var(--text-primary)', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 4 }}>{s.label}</div>
                <div style={{ fontFamily: 'var(--font-display)', fontSize: 22, fontWeight: 700, color: s.color }}>{s.value}</div>
              </div>
            </div>
          ))}
        </div>

        {/* 1. Bar Chart - Top 10 Earners */}
        <div className="glass-card p-4 mb-4" style={{ minHeight: 480 }}>
          <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 18, marginBottom: 4 }}>
            💰 Top 10 Earners
          </h3>
          <p style={{ color: 'var(--text-muted)', fontSize: 13, marginBottom: 24 }}>Highest compensated employees</p>
          <div style={{ width: '100%', height: 320 }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={top10} margin={{ top: 10, right: 20, left: 10, bottom: 10 }}>
                <defs>
                  <linearGradient id="barGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#00D4FF" stopOpacity={1} />
                    <stop offset="100%" stopColor="#7B5EA7" stopOpacity={0.8} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                <XAxis dataKey="name" tick={{ fill: '#8899BB', fontSize: 12, fontFamily: 'Sora' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: '#8899BB', fontSize: 11 }} axisLine={false} tickLine={false} tickFormatter={v => `$${(v / 1000).toFixed(0)}K`} />
                <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(0,212,255,0.05)' }} />
                <Bar dataKey="salary" fill="url(#barGrad)" radius={[8, 8, 0, 0]} name="Salary" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* 2. Salary Distribution - Full Width */}
        <div className="glass-card p-4 mb-4">
          <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 18, marginBottom: 4 }}>
            📈 Salary Distribution
          </h3>
          <p style={{ color: 'var(--text-muted)', fontSize: 13, marginBottom: 16 }}>Employee count per salary band</p>
          <div style={{ width: '100%', height: 420 }}>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={salaryRanges}>
                <defs>
                  <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#00E5A0" stopOpacity={0.4} />
                    <stop offset="100%" stopColor="#00E5A0" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                <XAxis dataKey="range" tick={{ fill: '#8899BB', fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: '#8899BB', fontSize: 11 }} axisLine={false} tickLine={false} allowDecimals={false} />
                <Tooltip content={<CustomTooltip />} />
                <Area type="monotone" dataKey="count" stroke="#00E5A0" strokeWidth={2} fill="url(#areaGrad)" name="Employees" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* 3. Pie Chart - Full Width */}
        <div className="glass-card p-4 mb-4" style={{ minHeight: 480 }}>
          <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 18, marginBottom: 4 }}>
            🏢 Avg Salary by Department
          </h3>
          <p style={{ color: 'var(--text-muted)', fontSize: 13, marginBottom: 16 }}>Compensation breakdown per dept</p>
          <div style={{ width: '100%', height: 420 }}>
            <div style={{ width: '100%', height: '100%', transform: 'scaleX(1) scaleY(1)', transformOrigin: 'center' }}>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={deptPieData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={150} paddingAngle={3} label={false} labelLine={false}>
                    {deptPieData.map((_, i) => (
                      <Cell key={i} fill={deptColors[i]} />
                    ))}
                  </Pie>
                  <Tooltip content={<CustomTooltip />} formatter={(value) => [`$${Number(value).toLocaleString()}`, 'Avg Salary']} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* 4. Department Salary Summary Table - Full Width */}
        <div className="glass-card p-4">
          <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 18, marginBottom: 16 }}>
            📋 Department Salary Summary
          </h3>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'separate', borderSpacing: '0 6px' }}>
              <thead>
                <tr>
                  {['Department', 'Headcount', 'Avg Salary'].map(h => (
                    <th key={h} style={{ padding: '8px 12px', fontSize: 11, fontFamily: 'var(--font-mono)', color: 'var(--text-primary)', textTransform: 'uppercase', letterSpacing: 1, textAlign: 'left' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {Object.entries(deptMap).sort((a, b) => b[1].total - a[1].total).map(([dept, v], i) => (
                  <tr key={dept} style={{ background: 'rgba(255,255,255,0.02)', animation: `fadeInUp 0.3s ease ${i * 0.05}s both` }}>
                    <td style={{ padding: '10px 12px', borderRadius: '8px 0 0 8px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <div style={{ width: 8, height: 8, borderRadius: '50%', background: deptColorMap[dept] || COLORS[i % COLORS.length], flexShrink: 0 }} />
                        <span style={{ fontWeight: 600, fontSize: 12 }}>{dept}</span>
                      </div>
                    </td>
                    <td style={{ padding: '10px 12px', fontSize: 12, color: 'var(--text-secondary)' }}>{v.count}</td>
                    <td style={{ padding: '10px 12px', borderRadius: '0 8px 8px 0', fontSize: 12, color: 'var(--accent-emerald)', fontFamily: 'var(--font-mono)', fontWeight: 600 }}>
                      ${Math.round(v.total / v.count).toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>


      </div>
    </div>
  )
}
