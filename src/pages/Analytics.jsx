import React, { useEffect, useState } from 'react'
import { Bar } from 'react-chartjs-2'
import dataService from '../services/dataService'
import { TrendingUp, Award, Building2, Users } from 'lucide-react'

const Analytics = ({ userRole }) => {
  const [stats, setStats] = useState({
    letPassers: 0,
    awards: {},
    orgTypes: {},
    totalRespondents: 0,
    employmentRate: 0
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadStats = async () => {
      await dataService.loadData()
      const employment = dataService.getEmploymentStats()
      setStats({
        letPassers: dataService.getLETPassers(),
        awards: dataService.getAwardsDistribution(),
        orgTypes: dataService.getOrganizationTypes(),
        totalRespondents: dataService.getTotalRespondents(),
        employmentRate: employment.employmentRate
      })
      setLoading(false)
    }
    loadStats()
  }, [])

  if (loading) {
    return <div className="card p-6"><div className="text-center py-20 text-gray-500">Loading analytics...</div></div>
  }

  const orgTypeData = {
    labels: Object.keys(stats.orgTypes),
    datasets: [{
      label: 'Number of Employees',
      data: Object.values(stats.orgTypes),
      backgroundColor: ['#6366f1', '#10b981', '#f59e0b'],
      borderWidth: 0
    }]
  }

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: true,
        position: 'bottom'
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: { stepSize: 1 }
      }
    }
  }

  return (
    <div className="space-y-4 lg:space-y-6">
      <div>
        <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-2">Advanced Analytics</h2>
        <p className="text-sm sm:text-base text-gray-600">Key performance indicators and insights</p>
      </div>

      {/* KPI Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
        <div className="card p-4 sm:p-6">
          <div className="flex items-center gap-3 sm:gap-4">
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-blue-50 text-blue-600 rounded-lg flex items-center justify-center">
              <Users className="w-5 h-5 sm:w-6 sm:h-6" />
            </div>
            <div>
              <div className="text-xl sm:text-2xl font-bold text-gray-900">{stats.totalRespondents}</div>
              <div className="text-xs sm:text-sm text-gray-600">Total Respondents</div>
            </div>
          </div>
        </div>

        <div className="card p-4 sm:p-6">
          <div className="flex items-center gap-3 sm:gap-4">
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-green-50 text-green-600 rounded-lg flex items-center justify-center">
              <TrendingUp className="w-5 h-5 sm:w-6 sm:h-6" />
            </div>
            <div>
              <div className="text-xl sm:text-2xl font-bold text-gray-900">{stats.employmentRate}%</div>
              <div className="text-xs sm:text-sm text-gray-600">Employment Rate</div>
            </div>
          </div>
        </div>

        <div className="card p-4 sm:p-6">
          <div className="flex items-center gap-3 sm:gap-4">
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-purple-50 text-purple-600 rounded-lg flex items-center justify-center">
              <Award className="w-5 h-5 sm:w-6 sm:h-6" />
            </div>
            <div>
              <div className="text-xl sm:text-2xl font-bold text-gray-900">{stats.letPassers}</div>
              <div className="text-xs sm:text-sm text-gray-600">LET Passers</div>
            </div>
          </div>
        </div>

        <div className="card p-4 sm:p-6">
          <div className="flex items-center gap-3 sm:gap-4">
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-orange-50 text-orange-600 rounded-lg flex items-center justify-center">
              <Building2 className="w-5 h-5 sm:w-6 sm:h-6" />
            </div>
            <div>
              <div className="text-xl sm:text-2xl font-bold text-gray-900">{Object.keys(stats.orgTypes).length}</div>
              <div className="text-xs sm:text-sm text-gray-600">Organization Types</div>
            </div>
          </div>
        </div>
      </div>

      {/* Organization Types */}
      <div className="card p-4 sm:p-6">
        <h3 className="text-base sm:text-lg font-bold text-gray-900 mb-4">Employment by Organization Type</h3>
        <div className="h-64 sm:h-80">
          <Bar data={orgTypeData} options={chartOptions} />
        </div>
      </div>

      {/* Awards and Recognition */}
      {Object.keys(stats.awards).length > 0 && (
        <div className="card p-4 sm:p-6">
          <h3 className="text-base sm:text-lg font-bold text-gray-900 mb-4">Awards and Recognition</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {Object.entries(stats.awards).map(([award, count]) => (
              <div key={award} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <Award className="w-5 h-5 text-amber-500" />
                  <span className="text-sm font-medium text-gray-900">{award}</span>
                </div>
                <span className="text-lg font-bold text-primary-600">{count}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Summary Statistics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
        <div className="card p-4 sm:p-6">
          <h4 className="text-sm font-semibold text-gray-700 mb-4">Employment Summary</h4>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Total Graduates</span>
              <span className="text-sm font-semibold text-gray-900">{stats.totalRespondents}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Employment Rate</span>
              <span className="text-sm font-semibold text-emerald-600">{stats.employmentRate}%</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">LET Passers</span>
              <span className="text-sm font-semibold text-purple-600">{stats.letPassers}</span>
            </div>
          </div>
        </div>

        <div className="card p-6">
          <h4 className="text-sm font-semibold text-gray-700 mb-4">Organization Types</h4>
          <div className="space-y-3">
            {Object.entries(stats.orgTypes).map(([type, count]) => (
              <div key={type} className="flex justify-between">
                <span className="text-sm text-gray-600">{type}</span>
                <span className="text-sm font-semibold text-gray-900">{count}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="card p-6">
          <h4 className="text-sm font-semibold text-gray-700 mb-4">Program Highlights</h4>
          <div className="space-y-3">
            <div className="p-3 bg-blue-50 rounded-lg">
              <div className="text-xs text-blue-600 font-medium">Highest Degree</div>
              <div className="text-sm font-semibold text-blue-900 mt-1">Bachelor's Degree</div>
            </div>
            <div className="p-3 bg-green-50 rounded-lg">
              <div className="text-xs text-green-600 font-medium">Program</div>
              <div className="text-sm font-semibold text-green-900 mt-1">BSED Mathematics</div>
            </div>
            <div className="p-3 bg-purple-50 rounded-lg">
              <div className="text-xs text-purple-600 font-medium">Awards Given</div>
              <div className="text-sm font-semibold text-purple-900 mt-1">{Object.keys(stats.awards).length} types</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Analytics
