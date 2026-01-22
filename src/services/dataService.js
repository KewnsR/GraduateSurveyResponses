import Papa from 'papaparse'

class DataService {
  constructor() {
    this.data = []
    this.isLoaded = false
  }

  async loadData() {
    if (this.isLoaded) return this.data

    try {
      const response = await fetch('/data/Employability Status of Bachelor of Secondary Education Major in Mathematics Graduates for the Academic Year 2024 (Responses).csv')
      const csvText = await response.text()
      
      const result = Papa.parse(csvText, {
        header: true,
        skipEmptyLines: true,
        transformHeader: (header) => header.trim()
      })
      
      this.data = result.data
      this.isLoaded = true
      return this.data
    } catch (error) {
      console.error('Error loading CSV data:', error)
      return []
    }
  }

  // Get total respondents
  getTotalRespondents() {
    return this.data.length
  }

  // Get employment statistics
  getEmploymentStats() {
    const employed = this.data.filter(row => 
      row['ARE YOU CURRENTLY EMPLOYED?']?.trim().toLowerCase() === 'yes'
    ).length
    
    const seekingEmployment = this.data.filter(row => 
      row['ARE YOU CURRENTLY EMPLOYED?']?.trim().toLowerCase() === 'no'
    ).length
    
    const employmentRate = this.data.length > 0 
      ? Math.round((employed / this.data.length) * 100) 
      : 0

    return { 
      employed, 
      seekingEmployment, 
      unemployed: seekingEmployment, 
      employmentRate, 
      total: this.data.length 
    }
  }

  // Get average months to employment
  getAverageMonthsToEmployment() {
    const employedData = this.data.filter(row => 
      row['ARE YOU CURRENTLY EMPLOYED?']?.trim().toLowerCase() === 'yes'
    )
    
    const employmentTimes = employedData
      .map(row => {
        // Find the time column (it has trailing spaces)
        const timeKey = Object.keys(row).find(key => 
          key.includes('HOW MANY MONTHS DID YOU WAIT')
        )
        const time = row[timeKey]?.trim()
        if (!time || time === 'N/A' || time === '') return null
        if (time.toLowerCase().includes('less than 3')) return 1.5
        if (time.includes('3-6')) return 4.5
        if (time.includes('7-12')) return 9.5
        if (time.toLowerCase().includes('more than 12')) return 15
        return null
      })
      .filter(time => time !== null)
    
    if (employmentTimes.length === 0) return 0
    
    const avg = employmentTimes.reduce((a, b) => a + b, 0) / employmentTimes.length
    return Math.round(avg * 10) / 10
  }

  // Get graduates by year
  getGraduatesByYear() {
    const yearCounts = {}
    this.data.forEach(row => {
      const year = row['YEAR GRADUATED']?.trim()
      if (year) {
        yearCounts[year] = (yearCounts[year] || 0) + 1
      }
    })
    return yearCounts
  }

  // Get recent graduates (2024)
  getRecentGraduates() {
    return this.data.filter(row => 
      row['YEAR GRADUATED']?.trim() === '2024'
    ).length
  }

  // Get employment by industry
  getEmploymentByIndustry() {
    const industries = {}
    this.data
      .filter(row => row['ARE YOU CURRENTLY EMPLOYED?']?.trim().toLowerCase() === 'yes')
      .forEach(row => {
        const industry = row['WHAT NATURE OF BUSINESS DOES YOUR COMPANY ENGAGE IN?']?.trim()
        if (industry && industry !== 'N/A') {
          industries[industry] = (industries[industry] || 0) + 1
        }
      })
    return industries
  }

  // Get time to employment distribution
  getTimeToEmploymentDistribution() {
    const distribution = {
      'Less than 3 months': 0,
      '3-6 months': 0,
      '7-12 months': 0,
      'More than 12 months': 0
    }

    this.data
      .filter(row => row['ARE YOU CURRENTLY EMPLOYED?']?.trim().toLowerCase() === 'yes')
      .forEach(row => {
        // Find the time column dynamically
        const timeKey = Object.keys(row).find(key => 
          key.includes('HOW MANY MONTHS DID YOU WAIT')
        )
        const time = row[timeKey]?.trim()
        if (time && time !== 'N/A' && time !== '') {
          if (time.toLowerCase().includes('less than 3')) distribution['Less than 3 months']++
          else if (time.includes('3-6')) distribution['3-6 months']++
          else if (time.includes('7-12')) distribution['7-12 months']++
          else if (time.toLowerCase().includes('more than 12')) distribution['More than 12 months']++
        }
      })

    return distribution
  }

  // Get gender distribution
  getGenderDistribution() {
    const genders = {}
    this.data.forEach(row => {
      const gender = row['SEX']?.trim()
      if (gender) {
        genders[gender] = (genders[gender] || 0) + 1
      }
    })
    return genders
  }

  // Get age group distribution
  getAgeGroupDistribution() {
    const ageGroups = {}
    this.data.forEach(row => {
      const age = row['AGE']?.trim()
      if (age) {
        ageGroups[age] = (ageGroups[age] || 0) + 1
      }
    })
    return ageGroups
  }

  // Get civil status distribution
  getCivilStatusDistribution() {
    const status = {}
    this.data.forEach(row => {
      const civil = row['CIVIL STATUS']?.trim()
      if (civil) {
        status[civil] = (status[civil] || 0) + 1
      }
    })
    return status
  }

  // Get organization types
  getOrganizationTypes() {
    const types = {}
    this.data
      .filter(row => row['ARE YOU CURRENTLY EMPLOYED?']?.trim().toLowerCase() === 'yes')
      .forEach(row => {
        const type = row['TYPE OF ORGANIZATION']?.trim()
        if (type) {
          types[type] = (types[type] || 0) + 1
        }
      })
    return types
  }

  // Get unemployment reasons
  getUnemploymentReasons() {
    const reasons = {}
    this.data
      .filter(row => row['ARE YOU CURRENTLY EMPLOYED?']?.trim().toLowerCase() === 'no')
      .forEach(row => {
        const reason = row['PLEASE STATE YOUR REASON WHY YOU ARE NOT EMPLOYED (Check all that apply)']?.trim()
        if (reason && reason !== 'N/A') {
          const reasonsList = reason.split(',')
          reasonsList.forEach(r => {
            const trimmed = r.trim()
            if (trimmed) {
              reasons[trimmed] = (reasons[trimmed] || 0) + 1
            }
          })
        }
      })
    return reasons
  }

  // Get all alumni data
  getAllAlumni() {
    return this.data.map((row, index) => {
      // Find the time column with flexible matching
      const timeKey = Object.keys(row).find(key => 
        key.includes('HOW MANY MONTHS DID YOU WAIT')
      )
      
      return {
        id: index + 1,
        name: row['LAST NAME, FIRST NAME, MIDDLE INITIAL (Ex. DELA CRUZ, JUAN A.)']?.trim() || '',
        email: row['EMAIL ADDRESS']?.trim() || '',
        contact: row['CONTACT NO.']?.trim() || '',
        employed: row['ARE YOU CURRENTLY EMPLOYED?']?.trim() || 'No',
        position: row['CURRENT JOB POSITION/DESIGNATION']?.trim() || '-',
        company: row['NAME OF COMPANY/AGENCY/ORGANIZATION']?.trim() || '-',
        yearGraduated: row['YEAR GRADUATED']?.trim() || '',
        sex: row['SEX']?.trim() || '',
        civilStatus: row['CIVIL STATUS']?.trim() || '',
        orgType: row['TYPE OF ORGANIZATION']?.trim() || '',
        address: row['HOME ADDRESS']?.trim() || '',
        facebook: row['FACEBOOK LINK']?.trim() || '',
        age: row['AGE']?.trim() || '',
        industry: row['WHAT NATURE OF BUSINESS DOES YOUR COMPANY ENGAGE IN?']?.trim() || '',
        employmentStatus: row['CURRENT EMPLOYMENT STATUS']?.trim() || '',
        timeToEmployment: row[timeKey]?.trim() || ''
      }
    })
  }

  // Get LET passers
  getLETPassers() {
    return this.data.filter(row => {
      const eligibility = row['ELIGIBILITY']?.trim().toLowerCase() || ''
      return eligibility.includes('let passer')
    }).length
  }

  // Get awards distribution
  getAwardsDistribution() {
    const awards = {}
    this.data.forEach(row => {
      const award = row['AWARDS RECEIVED']?.trim()
      if (award && award !== 'None') {
        awards[award] = (awards[award] || 0) + 1
      }
    })
    return awards
  }

  // Get socioeconomic mobility
  getSocioeconomicMobility() {
    const mobility = {
      improved: 0,
      same: 0,
      declined: 0
    }

    this.data.forEach(row => {
      const before = row['SOCIO-ECONOMIC STATUS (Before Employment)']?.trim()
      const after = row['SOCIO-ECONOMIC STATUS (After Employment)']?.trim()
      
      if (before && after) {
        const levels = [
          'Low Income (Below 10,000 per month)',
          'Lower Middle Income (10,000 - 30,000 per month)',
          'Middle Income (?30,001 - 70,000 per month)',
          'Upper Middle Income (70,001 - 140,000 per month)',
          'High Income (Above 140,000 per month)'
        ]
        
        const beforeIndex = levels.indexOf(before)
        const afterIndex = levels.indexOf(after)
        
        if (beforeIndex !== -1 && afterIndex !== -1) {
          if (afterIndex > beforeIndex) mobility.improved++
          else if (afterIndex === beforeIndex) mobility.same++
          else mobility.declined++
        }
      }
    })

    return mobility
  }
}

export default new DataService()
