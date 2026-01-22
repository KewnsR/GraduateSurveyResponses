import React, { useEffect, useState } from 'react'
import Charts from '../components/Charts'
import { Activity, AlertCircle, Briefcase, Users, TrendingUp, Award, BookOpen, Building2 } from 'lucide-react'
import dataService from '../services/dataService'

const Overview = ({ userRole }) => {
  const [stats, setStats] = useState({
    totalRespondents: 0,
    employmentRate: 0,
    avgTimeToEmployment: 0,
    letPassers: 0,
    employedCount: 0,
    seekingCount: 0,
    graduatesByYear: {},
    topIndustries: []
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadStats = async () => {
      await dataService.loadData()
      const employment = dataService.getEmploymentStats()
      const industries = dataService.getEmploymentByIndustry()
      const topIndustries = Object.entries(industries)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 5)
      
      setStats({
        totalRespondents: dataService.getTotalRespondents(),
        employmentRate: employment.employmentRate,
        avgTimeToEmployment: dataService.getAverageMonthsToEmployment(),
        letPassers: dataService.getLETPassers(),
        employedCount: employment.employed,
        seekingCount: employment.seekingEmployment,
        graduatesByYear: dataService.getGraduatesByYear(),
        topIndustries: topIndustries
      })
      setLoading(false)
    }
    loadStats()
  }, [])

  if (loading) {
    return <div className="card p-6"><div className="text-center py-20 text-gray-500">Loading overview...</div></div>
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-gray-900 mb-2">Dashboard Overview</h2>
        <p className="text-gray-600">Graduate employability status and key metrics</p>
      </div>

      <Charts />

      {/* Employment Status Breakdown */}
      <div className="grid grid-cols-2 gap-6">
        <div className="card p-6 hover:shadow-soft-lg transition-shadow">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-emerald-50 text-emerald-600 rounded-lg flex items-center justify-center">
              <Activity className="w-7 h-7" />
            </div>
            <div>
              <div className="text-3xl font-bold text-gray-900">{stats.employedCount}</div>
              <div className="text-sm text-gray-600 mt-1">Currently Employed</div>
              <div className="text-xs text-emerald-600 mt-1">{stats.employmentRate}% of total respondents</div>
            </div>
          </div>
        </div>
        
        <div className="card p-6 hover:shadow-soft-lg transition-shadow">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-red-50 text-red-600 rounded-lg flex items-center justify-center">
              <AlertCircle className="w-7 h-7" />
            </div>
            <div>
              <div className="text-3xl font-bold text-gray-900">{stats.seekingCount}</div>
              <div className="text-sm text-gray-600 mt-1">Seeking Employment</div>
              <div className="text-xs text-orange-600 mt-1">{((stats.seekingCount / stats.totalRespondents) * 100).toFixed(1)}% of total respondents</div>
            </div>
          </div>
        </div>
      </div>

      {/* Graduates by Year & Top Industries */}
      <div className="grid grid-cols-2 gap-6">
        <div className="card p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-4">Graduates by Year</h3>
          <div className="space-y-3">
            {Object.entries(stats.graduatesByYear).map(([year, count]) => (
              <div key={year} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <BookOpen className="w-5 h-5 text-blue-500" />
                  <span className="text-sm font-medium text-gray-900">Class of {year}</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-32 bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-blue-500 h-2 rounded-full" 
                      style={{ width: `${(count / stats.totalRespondents * 100)}%` }}
                    ></div>
                  </div>
                  <span className="text-sm font-bold text-gray-900 w-8 text-right">{count}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="card p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-4">Top Employment Industries</h3>
          <div className="space-y-3">
            {stats.topIndustries.map(([industry, count], index) => (
              <div key={industry} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Building2 className="w-5 h-5 text-emerald-500" />
                  <span className="text-sm font-medium text-gray-900">{industry || 'Other'}</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-32 bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-emerald-500 h-2 rounded-full" 
                      style={{ width: `${(count / stats.employedCount * 100)}%` }}
                    ></div>
                  </div>
                  <span className="text-sm font-bold text-gray-900 w-8 text-right">{count}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Key Insights */}
      <div className="grid grid-cols-2 gap-6">
        <div className="card p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-4">Program Success Rate</h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Employment Rate</span>
              <span className="text-sm font-semibold text-emerald-600">{stats.employmentRate}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-emerald-500 h-2 rounded-full" 
                style={{ width: `${stats.employmentRate}%` }}
              ></div>
            </div>
            <p className="text-xs text-gray-500 mt-2">
              {stats.employedCount} out of {stats.totalRespondents} graduates are currently employed
            </p>
          </div>
        </div>

        <div className="card p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-4">Certification Success</h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">LET Passers</span>
              <span className="text-sm font-semibold text-purple-600">{stats.letPassers} graduates</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-purple-500 h-2 rounded-full" 
                style={{ width: `${(stats.letPassers / stats.totalRespondents * 100).toFixed(0)}%` }}
              ></div>
            </div>
            <p className="text-xs text-gray-500 mt-2">
              {((stats.letPassers / stats.totalRespondents) * 100).toFixed(1)}% of respondents passed the LET examination
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Overview
