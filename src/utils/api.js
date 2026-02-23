const API_URL = import.meta.env.VITE_API_BASE_URL;
const API_USERNAME = import.meta.env.VITE_API_USERNAME;
const API_PASSWORD = import.meta.env.VITE_API_PASSWORD;

const CITY_COORDS = {
  'Edinburgh': { lat: 55.9533, lng: -3.1883 },
  'Tokyo': { lat: 35.6762, lng: 139.6503 },
  'San Francisco': { lat: 37.7749, lng: -122.4194 },
  'New York': { lat: 40.7128, lng: -74.0060 },
  'London': { lat: 51.5074, lng: -0.1278 },
  'Sidney': { lat: -33.8688, lng: 151.2093 },
  'Singapore': { lat: 1.3521, lng: 103.8198 },
}

function parseSalary(salaryStr) {
  if (typeof salaryStr === 'number') return salaryStr
  return parseFloat(String(salaryStr).replace(/[^0-9.]/g, '')) || 0
}

function transformEmployee(row, idx) {
  const [name, department, city, ext, startDate, salary] = row
  const coords = CITY_COORDS[city] || { lat: 20 + Math.random() * 30, lng: -50 + Math.random() * 200 }
  return {
    id: ext || idx + 1,
    name: name || `Employee ${idx + 1}`,
    email: (name || `employee${idx + 1}`).toLowerCase().replace(/\s+/g, '.') + '@company.com',
    department: department || 'N/A',
    salary: parseSalary(salary),
    city: city || 'N/A',
    lat: coords.lat,
    lng: coords.lng,
    phone: `Ext: ${ext || 'N/A'}`,
    age: Math.floor(Math.random() * 20 + 25),
    status: idx % 5 === 0 ? 'Remote' : 'Active',
    startDate: startDate || 'N/A',
  }
}

export async function fetchEmployees() {
  const res = await fetch(API_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username: API_USERNAME, password: API_PASSWORD })
  })

  if (!res.ok) {
    throw new Error(`API request failed with status ${res.status}: ${res.statusText}`)
  }

  const json = await res.json()
  const rawData = json?.TABLE_DATA?.data

  if (!rawData || !Array.isArray(rawData) || rawData.length === 0) {
    throw new Error('No employee data received from API')
  }

  return rawData.map(transformEmployee)
}
