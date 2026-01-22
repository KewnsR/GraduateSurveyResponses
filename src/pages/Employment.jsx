import React, { useEffect, useState } from 'react'
import { Bar, Doughnut, Pie } from 'react-chartjs-2'
import dataService from '../services/dataService'
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, ArcElement, Title, Tooltip, Legend } from 'chart.js'

ChartJS.register(CategoryScale, LinearScale, BarElement, ArcElement, Title, Tooltip, Legend)

const Employment = ({ userRole }) => {
  const [data, setData] = useState({
    industries: {},
    timeToEmployment: {},
    genders: {},
    ageGroups: {},
    civilStatus: {},
    socioeconomic: {},
    unemployment: {}
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadData = async () => {
      await dataService.loadData()
      setData({
        industries: dataService.getEmploymentByIndustry(),
        timeToEmployment: dataService.getTimeToEmploymentDistribution(),
        genders: dataService.getGenderDistribution(),
        ageGroups: dataService.getAgeGroupDistribution(),
        civilStatus: dataService.getCivilStatusDistribution(),
        socioeconomic: dataService.getSocioeconomicMobility(),
        unemployment: dataService.getUnemploymentReasons()
      })
      setLoading(false)
    }
    loadData()
  }, [])

  if (loading) {
    return <div className="card p-6"><div className="text-center py-20 text-gray-500">Loading employment data...</div></div>
  }

  const industryData = {
    labels: Object.keys(data.industries),
    datasets: [{
      label: 'Number of Employees',
      data: Object.values(data.industries),
      backgroundColor: 'rgba(99, 102, 241, 0.8)',
      borderColor: '#6366f1',
      borderWidth: 1
    }]
  }

  const timeToEmploymentData = {
    labels: Object.keys(data.timeToEmployment),
    datasets: [{
      data: Object.values(data.timeToEmployment),
      backgroundColor: ['#10b981', '#3b82f6', '#f59e0b', '#ef4444'],
      borderWidth: 0
    }]
  }

  const genderData = {
    labels: Object.keys(data.genders),
    datasets: [{
      data: Object.values(data.genders),
      backgroundColor: ['#6366f1', '#ec4899'],
      borderWidth: 0
    }]
  }

  const civilStatusData = {
    labels: Object.keys(data.civilStatus),
    datasets: [{
      data: Object.values(data.civilStatus),
      backgroundColor: ['#8b5cf6', '#06b6d4', '#f59e0b', '#ef4444'],
      borderWidth: 0
    }]
  }

  const socioeconomicData = {
    labels: ['Improved', 'Same', 'Declined'],
    datasets: [{
      data: [data.socioeconomic.improved, data.socioeconomic.same, data.socioeconomic.declined],
      backgroundColor: ['#10b981', '#94a3b8', '#ef4444'],
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
    }
  }

  const barOptions = {
    ...chartOptions,
    scales: {
      y: {
        beginAtZero: true,
        ticks: { stepSize: 1 }
      }
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-gray-900 mb-2">Employment Analysis</h2>
        <p className="text-gray-600">Comprehensive employment statistics and trends</p>
      </div>

      {/* Industry and Time to Employment */}
      <div className="grid grid-cols-2 gap-6">
        <div className="card p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-4">Employment by Industry</h3>
          <div className="h-80">
            <Bar data={industryData} options={barOptions} />
          </div>
        </div>
        <div className="card p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-4">Time to Employment</h3>
          <div className="h-80 flex items-center justify-center">
            <Doughnut data={timeToEmploymentData} options={chartOptions} />
          </div>
        </div>
      </div>

      {/* Demographics */}
      <div className="card p-6">
        <h3 className="text-lg font-bold text-gray-900 mb-6">Demographic Breakdown</h3>
        <div className="grid grid-cols-3 gap-6">
          <div>
            <h4 className="text-sm font-semibold text-gray-700 mb-3">Gender Distribution</h4>
            <div className="h-48">
              <Pie data={genderData} options={chartOptions} />
            </div>
          </div>
          <div>
            <h4 className="text-sm font-semibold text-gray-700 mb-3">Age Groups</h4>
            <div className="space-y-2">
              {Object.entries(data.ageGroups).map(([age, count]) => (
                <div key={age} className="flex justify-between items-center text-sm">
                  <span className="text-gray-600">{age}</span>
                  <span className="font-semibold text-gray-900">{count}</span>
                </div>
              ))}
            </div>
          </div>
          <div>
            <h4 className="text-sm font-semibold text-gray-700 mb-3">Civil Status</h4>
            <div className="h-48">
              <Pie data={civilStatusData} options={chartOptions} />
            </div>
          </div>
        </div>
      </div>

      {/* Socioeconomic Mobility */}
      <div className="card p-6">
        <h3 className="text-lg font-bold text-gray-900 mb-4">Socio-Economic Mobility</h3>
        <div className="h-80">
          <Bar 
            data={socioeconomicData} 
            options={{
              ...barOptions,
              plugins: {
                legend: { display: false }
              }
            }} 
          />
        </div>
        <div className="mt-4 text-sm text-gray-600 text-center">
          Employment impact on graduates' socio-economic status
        </div>
      </div>

      {/* Unemployment Reasons */}
      {Object.keys(data.unemployment).length > 0 && (
        <div className="card p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-4">Reasons for Unemployment</h3>
          <div className="space-y-3">
            {Object.entries(data.unemployment).map(([reason, count]) => (
              <div key={reason} className="flex items-center gap-4">
                <div className="flex-1">
                  <div className="flex justify-between mb-1">
                    <span className="text-sm text-gray-700">{reason}</span>
                    <span className="text-sm font-semibold text-gray-900">{count}</span>
                  </div>
                  <div className="w-full bg-gray-100 rounded-full h-2">
                    <div 
                      className="bg-primary-500 h-2 rounded-full" 
                      style={{ width: `${(count / Math.max(...Object.values(data.unemployment))) * 100}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default Employment
