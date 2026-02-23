# 🚀 EmpSphere — Employee Intelligence Platform

A stunning, production-grade React 19 application built with Vite for managing and visualizing employee data.

## ✨ Features

### Required Screens
1. **Login Page** — Animated login with credential validation (testuser / Test123)
2. **Employee List** — Table & grid views, search, filter by dept, sort, pagination
3. **Employee Details** — Full profile with live camera capture (3-second countdown)
4. **Photo Result** — Displays captured photo with download option

### Bonus Features
5. **Analytics / Bar Chart** — Salary bar chart (top 10), pie chart by dept, area distribution, KPI cards
6. **Map View** — Interactive Leaflet map showing employees by city with popup details

## 🛠️ Tech Stack
- ⚛️ **React 19.x** + **Vite 6**
- 🔄 **Redux Toolkit** (state management)
- 🛣️ **React Router v7**
- 🎨 **Tailwind CSS v3** + **Bootstrap 5**
- 📊 **Recharts** (BarChart, PieChart, AreaChart)
- 🗺️ **Leaflet** (interactive map)
- 🎭 **Framer Motion** (animations)
- 🎨 **Lucide React** (icons)
- 🔤 **Google Fonts**: Clash Display, Sora, DM Mono

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ installed

### Installation

```bash
cd employee-app
npm install
npm run dev
```

App will be available at `http://localhost:5173`

### Build for Production
```bash
npm run build
npm run preview
```

## 🔐 Login Credentials
- **Username:** `testuser`
- **Password:** `Test123`

## 📡 API
- **URL:** set in `.env` as `VITE_API_BASE_URL`
- **Credentials:** set in `.env` as `VITE_API_USERNAME` and `VITE_API_PASSWORD`
- **Method:** POST
- Falls back to mock employee data if API is unavailable

## 📁 Project Structure
```
src/
├── pages/
│   ├── LoginPage.jsx       # Animated login
│   ├── ListPage.jsx        # Employee directory (table + grid)
│   ├── DetailsPage.jsx     # Employee details + camera
│   ├── PhotoResultPage.jsx # Captured photo display
│   ├── BarChartPage.jsx    # Salary analytics & charts
│   └── MapPage.jsx         # Geographic distribution map
├── components/
│   └── Navbar.jsx          # Sticky navigation
├── store/
│   └── index.js            # Redux store (auth, employees, photo)
├── utils/
│   └── api.js              # REST API service (fetches real-time data)
└── styles/
    └── global.css          # Custom CSS variables & animations
```

## 🎨 Design Philosophy
- **Dark futuristic** theme with cyan/violet/emerald accents
- **Glass morphism** cards with backdrop blur
- **CSS animations** — fadeInUp, float, pulse-glow
- **Fully responsive** — mobile-first design with Bootstrap grid
- **Micro-interactions** — hover states, transitions on every element
