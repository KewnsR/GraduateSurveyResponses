import React, { useState, useEffect } from 'react'
import { Search, Filter, MapPin, Briefcase, Eye, Phone, Facebook, Home, User, Calendar, Heart } from 'lucide-react'
import dataService from '../services/dataService'

const AlumniRecords = ({ userRole }) => {
  const [searchTerm, setSearchTerm] = useState('')
  const [alumni, setAlumni] = useState([])
  const [filteredAlumni, setFilteredAlumni] = useState([])
  const [filters, setFilters] = useState({
    year: '',
    status: '',
    gender: '',
    orgType: ''
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadAlumni = async () => {
      await dataService.loadData()
      const data = dataService.getAllAlumni()
      setAlumni(data)
      setFilteredAlumni(data)
      setLoading(false)
    }
    loadAlumni()
  }, [])

  useEffect(() => {
    let filtered = [...alumni]

    // Search filter
    if (searchTerm) {
      const term = searchTerm.toLowerCase()
      filtered = filtered.filter(person =>
        person.name.toLowerCase().includes(term) ||
        person.company.toLowerCase().includes(term) ||
        person.position.toLowerCase().includes(term) ||
        person.email.toLowerCase().includes(term)
      )
    }

    // Year filter
    if (filters.year) {
      filtered = filtered.filter(person => person.yearGraduated === filters.year)
    }

    // Employment status filter
    if (filters.status) {
      filtered = filtered.filter(person => 
        person.employed.toLowerCase() === filters.status.toLowerCase()
      )
    }

    // Gender filter
    if (filters.gender) {
      filtered = filtered.filter(person => person.sex === filters.gender)
    }

    // Organization type filter
    if (filters.orgType) {
      filtered = filtered.filter(person => person.orgType === filters.orgType)
    }

    setFilteredAlumni(filtered)
  }, [searchTerm, filters, alumni])

  const clearFilters = () => {
    setSearchTerm('')
    setFilters({ year: '', status: '', gender: '', orgType: '' })
  }

  const getUniqueYears = () => {
    const years = [...new Set(alumni.map(a => a.yearGraduated))].filter(Boolean).sort()
    return years
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="card p-6">
          <div className="text-center py-10 text-gray-500">Loading alumni data...</div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Filters */}
      <div className="card p-6">
        <div className="flex items-center gap-3 mb-4">
          <Filter className="w-5 h-5 text-gray-500" />
          <h3 className="font-semibold text-gray-900">Filters & Search</h3>
        </div>
        
        <div className="grid grid-cols-6 gap-4">
          <div className="col-span-2">
            <input
              type="text"
              placeholder="Search name, company, position..."
              className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <select 
            className="px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm"
            value={filters.year}
            onChange={(e) => setFilters({...filters, year: e.target.value})}
          >
            <option value="">All Years</option>
            {getUniqueYears().map(year => (
              <option key={year} value={year}>{year}</option>
            ))}
          </select>
          <select 
            className="px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm"
            value={filters.status}
            onChange={(e) => setFilters({...filters, status: e.target.value})}
          >
            <option value="">All Statuses</option>
            <option value="Yes">Employed</option>
            <option value="No">Unemployed</option>
          </select>
          <select 
            className="px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm"
            value={filters.gender}
            onChange={(e) => setFilters({...filters, gender: e.target.value})}
          >
            <option value="">All Genders</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
          </select>
          <select 
            className="px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm"
            value={filters.orgType}
            onChange={(e) => setFilters({...filters, orgType: e.target.value})}
          >
            <option value="">All Types</option>
            <option value="Private">Private</option>
            <option value="Public">Public</option>
          </select>
          <button 
            className="px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium"
            onClick={clearFilters}
          >
            Clear All
          </button>
        </div>
        
        <div className="mt-3 text-sm text-gray-600">
          Showing {filteredAlumni.length} of {alumni.length} results
        </div>
      </div>

      {/* Alumni Cards */}
      <div className="grid grid-cols-3 gap-6">
        {filteredAlumni.map((person) => {
          const initials = person.name
            .split(',')[0]
            .split(' ')
            .map(n => n[0])
            .join('')
            .substring(0, 2)

          const isEmployed = person.employed.toLowerCase() === 'yes'

          return (
            <div key={person.id} className="card p-6 hover:shadow-soft-lg transition-all">
              <div className="flex items-start justify-between mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-primary-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold">
                  {initials}
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                  isEmployed
                    ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' 
                    : 'bg-orange-50 text-orange-700 border border-orange-200'
                }`}>
                  {isEmployed ? 'Employed' : 'Seeking'}
                </span>
              </div>
              
              <h4 className="font-semibold text-gray-900 mb-1 line-clamp-1">{person.name}</h4>
              {userRole === 'admin' && (
                <p className="text-sm text-gray-500 mb-1 line-clamp-1">{person.email}</p>
              )}
              {userRole === 'viewer' && (
                <div className="flex items-center gap-1 text-xs text-gray-400 mb-1">
                  <Eye className="w-3 h-3" />
                  <span className="text-gray-400 italic">Contact info hidden</span>
                </div>
              )}
              <div className="flex items-center gap-1 text-xs text-gray-400 mb-4">
                <MapPin className="w-3 h-3" />
                <span>Class of {person.yearGraduated}</span>
              </div>
              
              {/* Admin-only personal details */}
              {userRole === 'admin' && (
                <div className="pt-3 border-t border-gray-100 space-y-2 mb-4">
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    {person.contact && person.contact !== '-' && (
                      <div className="flex items-center gap-1.5 text-gray-600">
                        <Phone className="w-3 h-3 text-gray-400" />
                        <span className="truncate">{person.contact}</span>
                      </div>
                    )}
                    {person.sex && (
                      <div className="flex items-center gap-1.5 text-gray-600">
                        <User className="w-3 h-3 text-gray-400" />
                        <span>{person.sex}</span>
                      </div>
                    )}
                    {person.age && (
                      <div className="flex items-center gap-1.5 text-gray-600">
                        <Calendar className="w-3 h-3 text-gray-400" />
                        <span>{person.age}</span>
                      </div>
                    )}
                    {person.civilStatus && (
                      <div className="flex items-center gap-1.5 text-gray-600">
                        <Heart className="w-3 h-3 text-gray-400" />
                        <span>{person.civilStatus}</span>
                      </div>
                    )}
                  </div>
                  {person.address && person.address !== '-' && (
                    <div className="flex items-start gap-1.5 text-xs text-gray-600">
                      <Home className="w-3 h-3 text-gray-400 mt-0.5 flex-shrink-0" />
                      <span className="line-clamp-2">{person.address}</span>
                    </div>
                  )}
                  {person.facebook && person.facebook !== '-' && (
                    <div className="flex items-center gap-1.5 text-xs">
                      <Facebook className="w-3 h-3 text-gray-400" />
                      <a href={person.facebook} target="_blank" rel="noopener noreferrer" 
                         className="text-primary-600 hover:text-primary-700 truncate">
                        Facebook Profile
                      </a>
                    </div>
                  )}
                </div>
              )}
              
              {isEmployed && person.company !== '-' && (
                <div className="pt-4 border-t border-gray-100 space-y-2">
                  <div className="flex items-start gap-2">
                    <Briefcase className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-medium text-gray-900 line-clamp-1">{person.position}</div>
                      <div className="text-xs text-gray-500 line-clamp-1">{person.company}</div>
                      {userRole === 'admin' && person.orgType && person.orgType !== '-' && (
                        <div className="text-xs text-gray-400 mt-1">
                          <span className="inline-block px-2 py-0.5 bg-blue-50 text-blue-700 rounded">{person.orgType}</span>
                        </div>
                      )}
                    </div>
                  </div>
                  {person.industry && person.industry !== 'N/A' && (
                    <div className="text-xs text-gray-400 line-clamp-1">
                      <span className="inline-block px-2 py-1 bg-gray-50 rounded">{person.industry}</span>
                    </div>
                  )}
                  {userRole === 'admin' && person.employmentStatus && person.employmentStatus !== '-' && (
                    <div className="text-xs text-gray-500">
                      Status: <span className="font-medium">{person.employmentStatus}</span>
                    </div>
                  )}
                  {userRole === 'admin' && person.timeToEmployment && person.timeToEmployment !== '-' && (
                    <div className="text-xs text-gray-500">
                      Time to employment: <span className="font-medium">{person.timeToEmployment}</span>
                    </div>
                  )}
                </div>
              )}
            </div>
          )
        })}
      </div>

      {filteredAlumni.length === 0 && (
        <div className="card p-12 text-center">
          <div className="text-gray-400 mb-2">
            <Search className="w-12 h-12 mx-auto" />
          </div>
          <p className="text-gray-600 font-medium">No alumni found</p>
          <p className="text-sm text-gray-500 mt-1">Try adjusting your search or filters</p>
        </div>
      )}
    </div>
  )
}

export default AlumniRecords
