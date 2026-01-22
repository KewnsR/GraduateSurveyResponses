import React, { useState, useEffect } from 'react'
import { Clock, Shield, Eye } from 'lucide-react'
import dataService from '../services/dataService'

const Header = ({ userRole }) => {
  const [avgTime, setAvgTime] = useState(0)

  useEffect(() => {
    const loadData = async () => {
      await dataService.loadData()
      const avg = dataService.getAverageMonthsToEmployment()
      console.log('Average time to employment:', avg)
      console.log('Data loaded:', dataService.data.length, 'records')
      setAvgTime(avg || 0)
    }
    loadData()
  }, [])

  return (
    <header className="bg-white/80 backdrop-blur-md border-b border-gray-200/50 sticky top-0 z-40 shadow-sm">
      <div className="px-8 py-5 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight mb-1">
            Analytics Dashboard
          </h1>
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1.5 px-3 py-1 bg-indigo-50 rounded-lg">
              <Clock className="w-3.5 h-3.5 text-indigo-600" />
              <p className="text-xs font-medium text-indigo-900">
                Avg Employment: <span className="font-bold">{avgTime}mo</span>
              </p>
            </div>
          </div>
        </div>
        
        {/* User Role Badge */}
        <div className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl border border-gray-200">
          {userRole === 'admin' ? (
            <>
              <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
              <Shield className="w-4 h-4 text-indigo-600" />
              <span className="text-sm font-semibold text-gray-900">Administrator</span>
            </>
          ) : (
            <>
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              <Eye className="w-4 h-4 text-gray-600" />
              <span className="text-sm font-semibold text-gray-900">Viewer</span>
            </>
          )}
        </div>
      </div>
    </header>
  )
}

export default Header
