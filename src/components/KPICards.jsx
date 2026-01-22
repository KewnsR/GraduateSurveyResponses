import React, { useEffect, useState } from 'react'
import { Users, Briefcase, UserPlus, Clock, TrendingUp, TrendingDown } from 'lucide-react'
import dataService from '../services/dataService'

const KPICards = () => {
  const [data, setData] = useState({
    totalAlumni: 0,
    employmentRate: 0,
    avgEmployment: '0',
    recentGraduates: 0,
    employed: 0
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadData = async () => {
      await dataService.loadData()
      const stats = dataService.getEmploymentStats()
      setData({
        totalAlumni: dataService.getTotalRespondents(),
        employmentRate: stats.employmentRate,
        avgEmployment: dataService.getAverageMonthsToEmployment(),
        recentGraduates: dataService.getRecentGraduates(),
        employed: stats.employed
      })
      setLoading(false)
    }
    loadData()
  }, [])

  const kpis = [
    {
      label: 'Total Alumni',
      value: loading ? '...' : data.totalAlumni,
      icon: Users,
      color: 'blue',
      trend: '+10.2%',
      trendLabel: 'vs last year',
      isPositive: true
    },
    {
      label: 'Employment Rate',
      value: loading ? '...' : `${data.employmentRate}%`,
      icon: Briefcase,
      color: 'orange',
      trend: `${data.employed} employed`,
      trendLabel: `of ${data.totalAlumni} total`,
      isPositive: true
    },
    {
      label: 'Class of 2024',
      value: loading ? '...' : data.recentGraduates,
      icon: UserPlus,
      color: 'green',
      trend: '2024',
      trendLabel: 'newest cohort',
      isPositive: true
    },
    {
      label: 'Time to Hire',
      value: loading ? '...' : `${data.avgEmployment}mo`,
      icon: Clock,
      color: 'purple',
      trend: 'Average',
      trendLabel: 'placement time',
      isPositive: true
    },
  ]

  const colorClasses = {
    blue: 'bg-gradient-to-br from-blue-500 to-blue-600 text-white shadow-lg shadow-blue-500/30',
    orange: 'bg-gradient-to-br from-orange-500 to-orange-600 text-white shadow-lg shadow-orange-500/30',
    green: 'bg-gradient-to-br from-emerald-500 to-emerald-600 text-white shadow-lg shadow-emerald-500/30',
    purple: 'bg-gradient-to-br from-purple-500 to-purple-600 text-white shadow-lg shadow-purple-500/30',
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6 mb-6 lg:mb-8">
      {kpis.map((kpi, index) => {
        const Icon = kpi.icon
        const TrendIcon = kpi.isPositive ? TrendingUp : TrendingDown
        
        return (
          <div
            key={index}
            className="card p-4 sm:p-6 hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 group"
          >
            <div className="flex justify-between items-start mb-4">
              <span className="text-sm font-semibold text-gray-600 uppercase tracking-wide">{kpi.label}</span>
              <div className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-transform group-hover:scale-110 ${colorClasses[kpi.color]}`}>
                <Icon className="w-6 h-6" />
              </div>
            </div>
            
            <div className="text-4xl font-bold text-gray-900 mb-3 tracking-tight">
              {kpi.value}
            </div>
            
            <div className="flex items-center gap-2 text-xs">
              <span className={`flex items-center gap-1 font-bold ${kpi.isPositive ? 'text-emerald-600' : 'text-red-600'}`}>
                <TrendIcon className="w-3.5 h-3.5" />
                {kpi.trend}
              </span>
              <span className="text-gray-500 font-medium">{kpi.trendLabel}</span>
            </div>
          </div>
        )
      })}
    </div>
  )
}

export default KPICards
