import React, { useEffect, useState } from 'react'
import { Line, Doughnut } from 'react-chartjs-2'
import dataService from '../services/dataService'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js'

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
)

const Charts = () => {
  const [chartData, setChartData] = useState({
    yearData: {},
    employmentStatus: {}
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadChartData = async () => {
      await dataService.loadData()
      const stats = dataService.getEmploymentStats()
      const yearCounts = dataService.getGraduatesByYear()
      
      setChartData({
        yearData: yearCounts,
        employmentStatus: {
          employed: stats.employed,
          unemployed: stats.unemployed
        }
      })
      setLoading(false)
    }
    loadChartData()
  }, [])

  if (loading) {
    return (
      <div className="grid grid-cols-3 gap-6">
        <div className="col-span-2 card p-6">
          <div className="text-center py-20 text-gray-500">Loading charts...</div>
        </div>
        <div className="card p-6">
          <div className="text-center py-20 text-gray-500">Loading...</div>
        </div>
      </div>
    )
  }

  const years = Object.keys(chartData.yearData).sort()
  const lineData = {
    labels: years,
    datasets: [
      {
        label: 'Graduates per Year',
        data: years.map(year => chartData.yearData[year]),
        borderColor: '#6366f1',
        backgroundColor: 'rgba(99, 102, 241, 0.1)',
        fill: true,
        tension: 0.4,
      }
    ],
  }

  const doughnutData = {
    labels: ['Employed', 'Seeking Employment'],
    datasets: [
      {
        data: [chartData.employmentStatus.employed, chartData.employmentStatus.unemployed],
        backgroundColor: ['#10b981', '#ef4444'],
        borderWidth: 0,
      },
    ],
  }

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          color: '#f1f5f9',
        },
      },
      x: {
        grid: {
          display: false,
        },
      },
    },
  }

  const doughnutOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
    },
    cutout: '75%',
  }

  return (
    <div className="grid grid-cols-3 gap-6">
      {/* Main Chart */}
      <div className="col-span-2 card p-6">
        <div className="flex justify-between items-start mb-6">
          <div>
            <h3 className="text-lg font-bold text-gray-900">Graduates by Year</h3>
            <p className="text-sm text-gray-500 mt-1">Number of graduates from BSED Mathematics program</p>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex gap-4">
              <span className="flex items-center gap-2 text-sm">
                <span className="w-2.5 h-2.5 rounded-full bg-primary-500"></span>
                Graduates
              </span>
            </div>
          </div>
        </div>
        <div className="h-80">
          <Line data={lineData} options={chartOptions} />
        </div>
      </div>

      {/* Doughnut Chart */}
      <div className="card p-6">
        <div className="flex justify-between items-start mb-6">
          <h3 className="text-lg font-bold text-gray-900">Employment Status</h3>
          <button className="text-gray-400 hover:text-gray-600">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
            </svg>
          </button>
        </div>
        <div className="h-64 flex items-center justify-center">
          <Doughnut data={doughnutData} options={doughnutOptions} />
        </div>
        <div className="grid grid-cols-1 gap-3 mt-6 pt-6 border-t border-gray-100">
          {doughnutData.labels.map((label, index) => (
            <div key={label} className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span 
                  className="w-2.5 h-2.5 rounded-full" 
                  style={{ backgroundColor: doughnutData.datasets[0].backgroundColor[index] }}
                ></span>
                <span className="text-sm text-gray-600">{label}</span>
              </div>
              <span className="text-sm font-semibold text-gray-900">
                {doughnutData.datasets[0].data[index]}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default Charts
