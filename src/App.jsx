import { useState, useEffect } from 'react'
import Sidebar from './components/Sidebar'
import Header from './components/Header'
import KPICards from './components/KPICards'
import Charts from './components/Charts'
import Overview from './pages/Overview'
import AlumniRecords from './pages/AlumniRecords'
import Employment from './pages/Employment'
import Analytics from './pages/Analytics'
import Login from './components/Login'

function App() {
  const [activeTab, setActiveTab] = useState('overview')
  const [userRole, setUserRole] = useState(null)

  useEffect(() => {
    // Check if user is already logged in
    const savedRole = localStorage.getItem('userRole')
    if (savedRole) {
      setUserRole(savedRole)
    }
  }, [])

  const handleLogin = (role) => {
    setUserRole(role)
    localStorage.setItem('userRole', role)
  }

  const handleLogout = () => {
    setUserRole(null)
    localStorage.removeItem('userRole')
  }

  // Show login screen if not logged in
  if (!userRole) {
    return <Login onLogin={handleLogin} onViewAsGuest={handleLogin} />
  }

  const renderContent = () => {
    switch (activeTab) {
      case 'overview':
        return <Overview userRole={userRole} />
      case 'alumni':
        return <AlumniRecords userRole={userRole} />
      case 'employment':
        return <Employment userRole={userRole} />
      case 'analytics':
        return <Analytics userRole={userRole} />
      default:
        return <Overview userRole={userRole} />
    }
  }

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-gray-50 via-white to-indigo-50/30">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} onLogout={handleLogout} />
      
      <main className="flex-1 ml-72">
        <Header userRole={userRole} />
        
        <div className="p-8">
          <KPICards userRole={userRole} />
          {renderContent()}
        </div>
      </main>
    </div>
  )
}

export default App
