import React, { useState } from 'react'
import { 
  LayoutDashboard, 
  Users, 
  Briefcase, 
  BarChart3, 
  LogOut 
} from 'lucide-react'
import LogoutModal from './LogoutModal'

const Sidebar = ({ activeTab, setActiveTab, onLogout, isMobileMenuOpen, setIsMobileMenuOpen }) => {
  const [showLogoutModal, setShowLogoutModal] = useState(false)
  
  const navItems = [
    { id: 'overview', label: 'Overview', icon: LayoutDashboard },
    { id: 'alumni', label: 'Alumni Records', icon: Users },
    { id: 'employment', label: 'Employment', icon: Briefcase },
    { id: 'analytics', label: 'Analytics', icon: BarChart3 },
  ]

  const handleLogoutClick = () => {
    setShowLogoutModal(true)
  }

  const handleLogoutConfirm = () => {
    setShowLogoutModal(false)
    if (onLogout) {
      onLogout()
    }
  }

  const handleLogoutCancel = () => {
    setShowLogoutModal(false)
  }

  return (
    <>
      {/* Mobile Overlay */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        ></div>
      )}
      
      {/* Sidebar */}
      <aside className={`w-72 bg-gradient-to-b from-slate-900 via-slate-900 to-slate-800 fixed left-0 top-0 bottom-0 flex flex-col shadow-2xl z-50 transform transition-transform duration-300 lg:translate-x-0 ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        {/* Logo */}
        <div className="p-8 border-b border-white/5">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg">
              <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
            </div>
            <div>
              <span className="text-white font-bold text-lg tracking-tight block">Alumni Tracker</span>
              <span className="text-gray-400 text-xs">Analytics Platform</span>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-6 space-y-2">
          {navItems.map((item) => {
            const Icon = item.icon
            return (
              <div
                key={item.id}
                onClick={() => {
                  setActiveTab(item.id)
                  setIsMobileMenuOpen(false)
                }}
                className={`nav-item ${activeTab === item.id ? 'active' : ''}`}
              >
                <Icon className="w-5 h-5" />
                <span className="font-semibold text-sm">{item.label}</span>
              </div>
            )
          })}
        </nav>

        {/* Logout */}
        <div className="p-6 border-t border-white/5">
          <div 
            onClick={handleLogoutClick}
            className="flex items-center gap-3 px-4 py-3 rounded-xl text-gray-400 hover:bg-red-500/10 hover:text-red-400 transition-all duration-200 cursor-pointer group"
          >
            <LogOut className="w-5 h-5 group-hover:rotate-12 transition-transform" />
            <span className="font-semibold text-sm">Sign Out</span>
          </div>
        </div>
      </aside>

      <LogoutModal 
        isOpen={showLogoutModal}
        onConfirm={handleLogoutConfirm}
        onCancel={handleLogoutCancel}
      />
    </>
  )
}

export default Sidebar
