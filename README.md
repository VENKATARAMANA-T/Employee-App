# 🚀 EmpSphere — Employee Intelligence Platform

A stunning, production-grade React 19 application built with Vite for managing and visualizing employee data. This enterprise-level platform combines modern UI/UX design with powerful analytics, real-time data management, and interactive geolocation features. Built for scalability, performance, and exceptional user experience.

## 📱 Demo

- **Live Application:** [https://venkataramana-t.github.io/Employee-App/](https://venkataramana-t.github.io/Employee-App/)
- **Repository:** [https://github.com/VENKATARAMANA-T/Employee-App](https://github.com/VENKATARAMANA-T/Employee-App)
- **Demo Video:** [Watch on YouTube](https://youtu.be/rWpU2WAY_RQ)

## ✨ Features

### 🔐 Authentication & Security
- **Secure Login Page** — Animated, modern login interface with credential validation
- **Session Management** — Persistent authentication with Redux state management
- **Demo Credentials** — Username: `testuser` | Password: `Test123`
- **Protected Routes** — All pages require authentication

### 👥 Employee Management
1. **Employee List View**
   - 📊 **Dual View Modes** — Switch between table and grid layouts
   - 🔍 **Advanced Search** — Real-time employee search functionality
   - 🏢 **Department Filtering** — Filter employees by department
   - 📈 **Sorting Options** — Sort by name, salary, department, and more
   - 📄 **Pagination** — Navigate through employee records efficiently
   - 📋 **Table Columns** — ID, Name, Email, Department, Position, Salary

2. **Employee Details & Profile**
   - 👤 **Comprehensive Profile** — Full employee information display
   - 📸 **Live Camera Capture** — Integrated webcam with 3-second countdown
   - 💾 **Photo Management** — Save and download captured photos
   - 📞 **Contact Information** — Email, phone, and address details
   - 💼 **Professional History** — Position, department, salary, and joining date

3. **Photo Capture & Download**
   - 📷 **Real-time Camera Feed** — Live preview from webcam
   - ⏱️ **Countdown Timer** — 3-second countdown before photo capture
   - 📥 **Download Option** — Save captured photos locally
   - 🖼️ **Photo Gallery** — View and manage captured photos

### 📊 Analytics & Reporting
4. **Advanced Analytics Dashboard**
   - 📊 **Salary Bar Chart** — Top 10 employees by salary visualization
   - 🥧 **Department Distribution** — Pie chart showing department-wise employee count
   - 📈 **Area Chart** — Salary trends and distribution analysis
   - 📌 **KPI Cards** — Key metrics including total employees, departments, average salary
   - 💰 **Salary Statistics** — Min, max, and average salary insights

### 🗺️ Geolocation & Mapping
5. **Interactive Map View**
   - 🌍 **Leaflet Maps** — Interactive geographical map powered by Leaflet.js
   - 📍 **Location Markers** — Pin employees by their city location
   - 🏙️ **City-wise Distribution** — Visual representation of employees by city
   - 💬 **Popup Details** — Click markers to view employee information
   - 🎯 **Zoom & Pan** — Full map navigation controls

### 🎨 User Experience Enhancements
- **Responsive Design** — Works seamlessly on desktop, tablet, and mobile devices
- **Dark Theme** — Modern dark interface with cyan, violet, and emerald accents
- **Smooth Animations** — Framer Motion animations for fluid transitions
- **Glass Morphism** — Frosted glass effect cards with backdrop blur
- **Micro-interactions** — Hover effects, button states, and visual feedback
- **Loading States** — Skeleton loaders and spinners for better UX

## � Project Screenshots
📁 **View all screenshots:** [public/screenshots folder](./public/screenshots/)
### 🔐 Login Page
Animated, secure login interface with credential validation and modern design

![Login Page](./public/screenshots/01-login.png)

### 👥 Employee Directory - Table View
Comprehensive employee list with search, filter, sort, and pagination

![Employee List - Table View](./public/screenshots/02-employee-list-table.png)

### 🎯 Employee Directory - Grid View
Card-based grid layout for visual employee browsing with quick view details

![Employee List - Grid View](./public/screenshots/03-employee-list-grid.png)

### 📱 Employee Details & Camera Capture
Full employee profile with integrated webcam and photo capture functionality

![Employee Details](./public/screenshots/04-employee-details.png)

### 📊 Analytics Dashboard - KPI Overview
Key performance indicators showing total employees, departments, salaries, and remote workers

![Analytics KPI Cards](./public/screenshots/05-analytics-kpi.png)

### 📈 Top 10 Earners Bar Chart
Salary visualization showing highest compensated employees

![Top Earners Chart](./public/screenshots/06-top-earners.png)

### 📉 Salary Distribution Area Chart
Distribution of employees across salary bands with trend analysis

![Salary Distribution](./public/screenshots/07-salary-distribution.png)

### 🥧 Department Salary Breakdown - Pie Chart
Visual representation of average salary by department with multi-departmental view

![Department Breakdown](./public/screenshots/08-department-pie.png)

### 💼 Department Salary Summary Table
Detailed department-wise compensation analysis with headcount and average salary

![Department Summary](./public/screenshots/09-department-summary.png)

### 🗺️ Geographic Distribution Map
Interactive Leaflet map showing employee locations worldwide with city-wise breakdown

![Map View](./public/screenshots/10-map-view.png)

## �🛠️ Tech Stack
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
