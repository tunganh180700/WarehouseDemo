import { NavLink, Outlet } from 'react-router-dom'
import './Layout.css'

function Layout() {
  return (
    <div className="app">
      <header className="header">
        <h1>Data Pipeline Viewer</h1>
        <p className="subtitle">Raw → Staging → NDS</p>
      </header>

      <nav className="nav">
        <NavLink to="/" end className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>
          📦 Dữ liệu Thô (Raw)
        </NavLink>
        <NavLink to="/staging" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>
          🔧 Staging
        </NavLink>
        <NavLink to="/nds" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>
          🗄️ NDS
        </NavLink>
      </nav>

      <main className="main">
        <Outlet />
      </main>

      <footer className="footer">
        ReactJS · Data Warehouse Demo
      </footer>
    </div>
  )
}

export default Layout
