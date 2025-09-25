// Database connection simulation
const dbConfig = {
    host: 'localhost',
    username: 'root',
    password: '',
    database: 'alumni_tracer_study'
};

// Sample data for 56 respondents
const sampleData = {
    totalAlumni: 56,
    employedAlumni: 46,
    avgEmploymentTime: 2.8,
    recentGraduates: 20,
    graduatesByYear: {
        '2022': 14,
        '2023': 22,
        '2024': 20
    },
    industryData: {
        'Education': 22,
        'Technology': 8,
        'Government': 7,
        'Healthcare': 5,
        'Business': 4,
        'Others': 2
    },
    financialImprovementFactors: {
        'Higher salary/income': 35,
        'Job security': 28,
        'Better benefits': 22,
        'Career advancement': 25,
        'Skill development': 20,
        'Work-life balance': 18,
        'Professional growth': 23,
        'Recognition/promotion': 15
    }
};

// Global variable to store CSV data
let globalCSVData = [];
let chartsInitialized = {
    employment: false,
    analytics: false
};

// Initialize dashboard
document.addEventListener('DOMContentLoaded', function() {
    loadDashboardData();
    initializeOverviewCharts();
    loadAlumniData();
    loadCSVDataForCharts();
});

function loadDashboardData() {
    if (globalCSVData.length > 0) {
        const total = globalCSVData.length;
        const employed = globalCSVData.filter(row => row['ARE YOU CURRENTLY EMPLOYED?']?.trim() === 'Yes').length;
        const recent = globalCSVData.filter(row => row['YEAR GRADUATED']?.trim() === '2024').length;
        
        // Compute avg months
        const times = globalCSVData.map(row => {
            const t = row['HOW MANY MONTHS DID YOU WAIT BEFORE OBTAINING YOUR FIRST EMPLOYMENT AFTER GRADUATION?']?.trim();
            if (t === 'Less than 3 months') return 1;
            if (t === '3-6 months') return 4.5;
            if (t === '7-12 months') return 9.5;
            if (t === 'More than 12 months') return 15;
            return 0;
        }).filter(t => t > 0);
        const avgTime = times.length > 0 ? (times.reduce((a,b)=>a+b,0) / times.length).toFixed(1) : 0;
        
        document.getElementById('totalAlumni').textContent = total.toLocaleString();
        document.getElementById('employmentRate').textContent = 
            Math.round((employed / total) * 100) + '%';
        document.getElementById('avgEmployment').textContent = avgTime + ' months';
        document.getElementById('recentGraduates').textContent = recent;
        
        document.getElementById('employedCount').textContent = employed;
        document.getElementById('unemployedCount').textContent = total - employed;
    } else {
        // Fallback to sample
        document.getElementById('totalAlumni').textContent = sampleData.totalAlumni.toLocaleString();
        document.getElementById('employmentRate').textContent = 
            Math.round((sampleData.employedAlumni / sampleData.totalAlumni) * 100) + '%';
        document.getElementById('avgEmployment').textContent = sampleData.avgEmploymentTime + ' months';
        document.getElementById('recentGraduates').textContent = sampleData.recentGraduates;
        
        document.getElementById('employedCount').textContent = sampleData.employedAlumni;
        document.getElementById('unemployedCount').textContent = sampleData.totalAlumni - sampleData.employedAlumni;
    }
}

function initializeOverviewCharts() {
    // Employment Status Chart
    const employmentCtx = document.getElementById('employmentChart').getContext('2d');
    if (globalCSVData.length > 0) {
        const employed = globalCSVData.filter(row => row['ARE YOU CURRENTLY EMPLOYED?']?.trim() === 'Yes').length;
        const total = globalCSVData.length;
        new Chart(employmentCtx, {
            type: 'doughnut',
            data: {
                labels: ['Employed', 'Unemployed'],
                datasets: [{
                    data: [employed, total - employed],
                    backgroundColor: ['#10b981', '#ef4444'],
                    borderWidth: 0
                }]
            },
            options: {
                responsive: true,
                plugins: {
                    legend: {
                        position: 'bottom'
                    }
                }
            }
        });
    } else {
        // Fallback
        new Chart(employmentCtx, {
            type: 'doughnut',
            data: {
                labels: ['Employed', 'Unemployed'],
                datasets: [{
                    data: [sampleData.employedAlumni, sampleData.totalAlumni - sampleData.employedAlumni],
                    backgroundColor: ['#10b981', '#ef4444'],
                    borderWidth: 0
                }]
            },
            options: {
                responsive: true,
                plugins: {
                    legend: {
                        position: 'bottom'
                    }
                }
            }
        });
    }

    // Graduates by Year Chart
    const graduatesCtx = document.getElementById('graduatesChart').getContext('2d');
    if (globalCSVData.length > 0) {
        const yearCounts = {};
        globalCSVData.forEach(row => {
            const year = row['YEAR GRADUATED']?.trim();
            if (year) yearCounts[year] = (yearCounts[year] || 0) + 1;
        });
        new Chart(graduatesCtx, {
            type: 'bar',
            data: {
                labels: Object.keys(yearCounts).sort(),
                datasets: [{
                    label: 'Graduates',
                    data: Object.values(yearCounts),
                    backgroundColor: 'rgba(102, 126, 234, 0.8)',
                    borderColor: '#667eea',
                    borderWidth: 2,
                    borderRadius: 8
                }]
            },
            options: {
                responsive: true,
                plugins: {
                    legend: {
                        display: false
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true
                    }
                }
            }
        });
    } else {
        // Fallback
        new Chart(graduatesCtx, {
            type: 'bar',
            data: {
                labels: Object.keys(sampleData.graduatesByYear),
                datasets: [{
                    label: 'Graduates',
                    data: Object.values(sampleData.graduatesByYear),
                    backgroundColor: 'rgba(102, 126, 234, 0.8)',
                    borderColor: '#667eea',
                    borderWidth: 2,
                    borderRadius: 8
                }]
            },
            options: {
                responsive: true,
                plugins: {
                    legend: {
                        display: false
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true
                    }
                }
            }
        });
    }
}

function showTab(tabName, event) {
    // Hide all tab contents
    document.querySelectorAll('.tab-content').forEach(tab => {
        tab.classList.remove('active');
    });
    
    // Remove active class from all buttons
    document.querySelectorAll('.tab-button').forEach(btn => {
        btn.classList.remove('active');
    });
    
    // Show selected tab
    document.getElementById(tabName + '-tab').classList.add('active');
    if (event && event.target) {
        event.target.classList.add('active');
    }

    // Initialize charts for specific tabs when they become visible
    if (tabName === 'employment' && !chartsInitialized.employment && globalCSVData.length > 0) {
        setTimeout(() => initializeEmploymentCharts(), 100);
        chartsInitialized.employment = true;
    }
    
    if (tabName === 'analytics' && !chartsInitialized.analytics && globalCSVData.length > 0) {
        setTimeout(() => initializeAnalyticsCharts(), 100);
        chartsInitialized.analytics = true;
    }
}

// Load CSV data for charts
async function loadCSVDataForCharts() {
    try {
        const response = await fetch('/GraduateSurveyResponses/php/get_data.php');
        if (!response.ok) {
            throw new Error('Failed to load data');
        }
        globalCSVData = await response.json();
        
        // Fix: Trim all keys in each row to avoid issues with extra spaces in CSV headers
        globalCSVData = globalCSVData.map(row => {
            const trimmedRow = {};
            Object.keys(row).forEach(key => {
                trimmedRow[key.trim()] = typeof row[key] === 'string' ? row[key].trim() : row[key];
            });
            return trimmedRow;
        });

        console.log('CSV data loaded:', globalCSVData.length, 'records');
    } catch (error) {
        console.error('Error loading CSV data:', error);
        // Use fallback data if CSV fails to load
        globalCSVData = [];
    }
}

function initializeEmploymentCharts() {
    if (globalCSVData.length === 0) {
        console.log('No CSV data available for employment charts');
        return;
    }

    try {
        // Industry Chart - compute from data
        const industryCounts = {};
        globalCSVData.forEach(row => {
            const industry = row['WHAT NATURE OF BUSINESS DOES YOUR COMPANY ENGAGE IN?']?.trim();
            if (industry) {
                industryCounts[industry] = (industryCounts[industry] || 0) + 1;
            }
        });
        const industryCtx = document.getElementById('industryChart');
        if (industryCtx) {
            new Chart(industryCtx.getContext('2d'), {
                type: 'pie',
                data: {
                    labels: Object.keys(industryCounts),
                    datasets: [{
                        data: Object.values(industryCounts),
                        backgroundColor: [
                            '#667eea', '#764ba2', '#f093fb', '#f5576c',
                            '#4facfe', '#00f2fe', '#43e97b', '#38f9d7'
                        ],
                        borderWidth: 0
                    }]
                },
                options: {
                    responsive: true,
                    plugins: {
                        legend: {
                            position: 'bottom'
                        }
                    }
                }
            });
        }

        // Time to Employment Chart - compute from data
        const timeCounts = {};
        globalCSVData.forEach(row => {
            const time = row['HOW MANY MONTHS DID YOU WAIT BEFORE OBTAINING YOUR FIRST EMPLOYMENT AFTER GRADUATION?']?.trim();
            if (time) {
                timeCounts[time] = (timeCounts[time] || 0) + 1;
            }
        });
        const timeCtx = document.getElementById('timeToEmploymentChart');
        if (timeCtx) {
            const labels = Object.keys(timeCounts).sort();
            new Chart(timeCtx.getContext('2d'), {
                type: 'bar',
                data: {
                    labels: labels,
                    datasets: [{
                        label: 'Number of Alumni',
                        data: labels.map(l => timeCounts[l]),
                        borderColor: '#667eea',
                        backgroundColor: 'rgba(102, 126, 234, 0.8)',
                        borderWidth: 2,
                        borderRadius: 8
                    }]
                },
                options: {
                    responsive: true,
                    plugins: {
                        legend: {
                            display: false
                        }
                    },
                    scales: {
                        y: {
                            beginAtZero: true
                        }
                    }
                }
            });
        }

        // Initialize demographic charts
        renderAgeGroupChart(globalCSVData);
        renderGenderChart(globalCSVData);
        renderCivilStatusChart(globalCSVData);
        renderSocioEconomicChart(globalCSVData);
        renderLicensureChart(globalCSVData);
        renderUnemploymentReasonsChart(globalCSVData);
        renderAwardsChart(globalCSVData);

        console.log('Employment charts initialized successfully');
    } catch (error) {
        console.error('Error initializing employment charts:', error);
    }
}

function initializeAnalyticsCharts() {
    if (globalCSVData.length === 0) {
        console.log('No CSV data available for analytics charts');
        return;
    }

    try {
        // Main Skills Chart (Radar)
        const skillsCtx = document.getElementById('skillsChart');
        if (skillsCtx) {
            new Chart(skillsCtx.getContext('2d'), {
                type: 'radar',
                data: {
                    labels: [
                        'Communication', 'ICT Skills', 'Problem Solving',
                        'Leadership', 'Research Skills', 'Teaching Skills'
                    ],
                    datasets: [{
                        label: 'Proficiency upon Graduation',
                        data: [4.2, 3.8, 4.0, 3.5, 3.9, 4.3],
                        borderColor: '#667eea',
                        backgroundColor: 'rgba(102, 126, 234, 0.2)',
                        borderWidth: 2
                    }, {
                        label: 'Usage in Current Job',
                        data: [4.5, 4.2, 4.1, 3.8, 3.2, 4.0],
                        borderColor: '#764ba2',
                        backgroundColor: 'rgba(118, 75, 162, 0.2)',
                        borderWidth: 2
                    }]
                },
                options: {
                    responsive: true,
                    scales: {
                        r: {
                            beginAtZero: true,
                            max: 5
                        }
                    }
                }
            });
        }

        // Initialize other analytics charts
        renderSkillProficiencyChart(globalCSVData);
        renderSkillsUsageChart(globalCSVData);

        console.log('Analytics charts initialized successfully');
    } catch (error) {
        console.error('Error initializing analytics charts:', error);
    }
}

// Utility: Load CSV and return Promise of data array
function loadCSVData(url) {
    return new Promise((resolve, reject) => {
        if (typeof Papa !== 'undefined') {
            Papa.parse(url, {
                header: true,
                download: true,
                skipEmptyLines: true,
                complete: results => resolve(results.data),
                error: err => reject(err)
            });
        } else {
            // Fallback if Papa Parse is not available
            fetch(url)
                .then(response => response.text())
                .then(csvText => {
                    const lines = csvText.split('\n').filter(line => line.trim());
                    const headers = lines[0].split(',').map(h => h.replace(/(^"|"$)/g, '').trim());
                    const data = lines.slice(1).map(line => {
                        const values = line.split(',');
                        const obj = {};
                        headers.forEach((h, i) => obj[h] = values[i] ? values[i].replace(/(^"|"$)/g, '').trim() : '');
                        return obj;
                    });
                    resolve(data);
                })
                .catch(err => reject(err));
        }
    });
}

// Chart rendering functions
function renderAgeGroupChart(data) {
    const ctx = document.getElementById('ageGroupChart');
    if (!ctx) return;
    
    const counts = {};
    data.forEach(row => {
        let age = row['AGE'];
        if (typeof age === 'string') age = age.trim();
        if (!age) age = 'Unknown';
        counts[age] = (counts[age] || 0) + 1;
    });
    
    new Chart(ctx.getContext('2d'), {
        type: 'pie',
        data: {
            labels: Object.keys(counts),
            datasets: [{ 
                data: Object.values(counts), 
                backgroundColor: ['#60a5fa', '#fbbf24', '#34d399', '#f87171', '#818cf8', '#a3e635'] 
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: { position: 'bottom' }
            }
        }
    });
}

function renderGenderChart(data) {
    const ctx = document.getElementById('genderChart');
    if (!ctx) return;
    
    const counts = {};
    data.forEach(row => {
        let gender = row['SEX'];
        if (typeof gender === 'string') gender = gender.trim();
        if (!gender) gender = 'Unknown';
        counts[gender] = (counts[gender] || 0) + 1;
    });
    
    new Chart(ctx.getContext('2d'), {
        type: 'doughnut',
        data: {
            labels: Object.keys(counts),
            datasets: [{ 
                data: Object.values(counts), 
                backgroundColor: ['#818cf8', '#f472b6', '#facc15', '#a3e635', '#f87171'] 
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: { position: 'bottom' }
            }
        }
    });
}

function renderCivilStatusChart(data) {
    const ctx = document.getElementById('civilStatusChart');
    if (!ctx) return;
    
    const counts = {};
    data.forEach(row => {
        let status = row['CIVIL STATUS'];
        if (typeof status === 'string') status = status.trim();
        if (!status) status = 'Unknown';
        counts[status] = (counts[status] || 0) + 1;
    });
    
    new Chart(ctx.getContext('2d'), {
        type: 'bar',
        data: {
            labels: Object.keys(counts),
            datasets: [{ 
                label: 'Civil Status', 
                data: Object.values(counts), 
                backgroundColor: '#38bdf8' 
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: { display: false }
            },
            scales: {
                y: { beginAtZero: true }
            }
        }
    });
}

function renderSocioEconomicChart(data) {
    const ctx = document.getElementById('socioEconomicChart');
    if (!ctx) return;
    
    const before = {}, after = {};
    data.forEach(row => {
        let bef = row['SOCIO-ECONOMIC STATUS (Before Employment)'];
        let aft = row['SOCIO-ECONOMIC STATUS (After Employment)'];
        if (typeof bef === 'string') bef = bef.trim();
        if (!bef) bef = 'Unknown';
        if (typeof aft === 'string') aft = aft.trim();
        if (!aft) aft = 'Unknown';
        before[bef] = (before[bef] || 0) + 1;
        after[aft] = (after[aft] || 0) + 1;
    });
    
    const allLabels = Array.from(new Set([...Object.keys(before), ...Object.keys(after)]));
    
    new Chart(ctx.getContext('2d'), {
        type: 'bar',
        data: {
            labels: allLabels,
            datasets: [
                { 
                    label: 'Before Employment', 
                    data: allLabels.map(l => before[l] || 0), 
                    backgroundColor: '#fbbf24' 
                },
                { 
                    label: 'After Employment', 
                    data: allLabels.map(l => after[l] || 0), 
                    backgroundColor: '#34d399' 
                }
            ]
        },
        options: {
            responsive: true,
            plugins: {
                legend: { position: 'top' }
            },
            scales: {
                y: { beginAtZero: true }
            }
        }
    });
}

function renderLicensureChart(data) {
    const ctx = document.getElementById('licensureChart');
    if (!ctx) return;
    
    let passed = 0, notPassed = 0;
    data.forEach(row => {
        let lic = row['LET Passer'] || row['ELIGIBILITY'] || '';
        if (typeof lic === 'string') lic = lic.trim().toLowerCase();
        if (lic.includes('let passer') || lic.includes('yes')) passed++;
        else notPassed++;
    });
    
    new Chart(ctx.getContext('2d'), {
        type: 'pie',
        data: {
            labels: ['LET Passer', 'Not LET Passer'],
            datasets: [{ 
                data: [passed, notPassed], 
                backgroundColor: ['#34d399', '#f87171'] 
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: { position: 'bottom' }
            }
        }
    });
}

function renderUnemploymentReasonsChart(data) {
    const ctx = document.getElementById('unemploymentReasonsChart');
    if (!ctx) return;
    
    const counts = {};
    data.forEach(row => {
        let reasons = row['PLEASE STATE YOUR REASON WHY YOU ARE NOT EMPLOYED (Check all that apply)'];
        if (typeof reasons === 'string' && reasons.trim()) {
            reasons.split(',').forEach(r => {
                const reason = r.trim();
                if (reason) counts[reason] = (counts[reason] || 0) + 1;
            });
        }
    });
    
    if (Object.keys(counts).length === 0) {
        counts['No specific reasons provided'] = 10;
    }
    
    new Chart(ctx.getContext('2d'), {
        type: 'bar',
        data: {
            labels: Object.keys(counts),
            datasets: [{ 
                label: 'Reasons', 
                data: Object.values(counts), 
                backgroundColor: '#f87171' 
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: { display: false }
            },
            scales: {
                y: { beginAtZero: true }
            }
        }
    });
}

function renderAwardsChart(data) {
    const ctx = document.getElementById('awardsChart');
    if (!ctx) return;
    
    const counts = {};
    data.forEach(row => {
        let award = row['AWARDS RECEIVED']?.trim() || 'None';
        if (!award || award.toLowerCase() === 'none') award = 'None';
        counts[award] = (counts[award] || 0) + 1;
    });
    
    new Chart(ctx.getContext('2d'), {
        type: 'bar',
        data: {
            labels: Object.keys(counts),
            datasets: [{ 
                label: 'Awards', 
                data: Object.values(counts), 
                backgroundColor: '#818cf8' 
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: { display: false }
            },
            scales: {
                y: { beginAtZero: true }
            }
        }
    });
}

function renderSkillProficiencyChart(data) {
    const ctx = document.getElementById('skillsProficiencyChart');
    if (!ctx) return;
    
    const skills = [
        'How would you rate your proficiency in the following skills upon graduating? [Communication Skills]',
        'How would you rate your proficiency in the following skills upon graduating? [Information and Computer Technology Skills]',
        'How would you rate your proficiency in the following skills upon graduating? [Problem-Solving and Critical Thinking Skills]'
    ];
    const levels = ['Very Good (4)', 'Good (3)', 'Fair (2)', 'Poor (1)'];
    
    const datasets = skills.map((skill, idx) => {
        const counts = {};
        levels.forEach(lvl => counts[lvl] = 0);
        data.forEach(row => {
            const val = row[skill]?.trim();
            if (val && counts.hasOwnProperty(val)) counts[val]++;
        });
        
        return {
            label: skill.match(/\[(.*?)\]/)?.[1] || `Skill ${idx + 1}`,
            data: levels.map(lvl => counts[lvl]),
            backgroundColor: ['#60a5fa', '#fbbf24', '#34d399'][idx]
        };
    });
    
    new Chart(ctx.getContext('2d'), {
        type: 'bar',
        data: {
            labels: levels,
            datasets: datasets
        },
        options: { 
            responsive: true, 
            plugins: { 
                legend: { position: 'bottom' } 
            },
            scales: {
                y: { beginAtZero: true }
            }
        }
    });
}

function renderSkillsUsageChart(data) {
    const ctx = document.getElementById('skillsUsageChart');
    if (!ctx) return;
    
    const skills = [
        'How often do you use the following skills in your current job? [Communication Skills]',
        'How often do you use the following skills in your current job? [Information and Computer Technology Skills]',
        'How often do you use the following skills in your current job? [Problem-Solving and Critical Thinking Skills]'
    ];
    const levels = ['Often (4)', 'Sometimes (3)', 'Rarely (2)', 'Never (1)'];
    
    const datasets = skills.map((skill, idx) => {
        const counts = {};
        levels.forEach(lvl => counts[lvl] = 0);
        data.forEach(row => {
            const val = row[skill]?.trim();
            if (val && counts.hasOwnProperty(val)) counts[val]++;
        });
        
        return {
            label: skill.match(/\[(.*?)\]/)?.[1] || `Skill ${idx + 1}`,
            data: levels.map(lvl => counts[lvl]),
            backgroundColor: ['#818cf8', '#f472b6', '#facc15'][idx]
        };
    });
    
    new Chart(ctx.getContext('2d'), {
        type: 'bar',
        data: {
            labels: levels,
            datasets: datasets
        },
        options: { 
            responsive: true, 
            plugins: { 
                legend: { position: 'bottom' } 
            },
            scales: {
                y: { beginAtZero: true }
            }
        }
    });
}

// Alumni data loading and filtering functions (keeping existing functionality)
let alumniRawData = [];
let alumniFilteredData = [];

function loadAlumniData() {
    fetch('/GraduateSurveyResponses/php/get_data.php')
        .then(response => response.json())
        .then(data => {
            alumniRawData = [];
            let employed = 0, unemployed = 0;
            let yearsSet = new Set();
            let gendersSet = new Set();
            let civilSet = new Set();
            let orgTypeSet = new Set();
            
            data.forEach(row => {
                const employedStatus = row['ARE YOU CURRENTLY EMPLOYED?']?.trim();
                if (employedStatus === 'Yes') employed++;
                else if (employedStatus === 'No') unemployed++;
                const year = row['YEAR GRADUATED']?.trim();
                yearsSet.add(year);
                gendersSet.add(row['SEX']?.trim());
                civilSet.add(row['CIVIL STATUS']?.trim());
                orgTypeSet.add(row['TYPE OF ORGANIZATION']?.trim());
                alumniRawData.push({
                    'NAME': row['LAST NAME, FIRST NAME, MIDDLE INITIAL (Ex. DELA CRUZ, JUAN A.)']?.trim(),
                    'CONTACT NO.': row['CONTACT NO.']?.trim(),
                    'FACEBOOK LINK': row['FACEBOOK LINK']?.trim(),
                    'EMAIL ADDRESS': row['EMAIL ADDRESS']?.trim(),
                    'HOME ADDRESS': row['HOME ADDRESS']?.trim(),
                    'SEX': row['SEX']?.trim(),
                    'AGE': row['AGE']?.trim(),
                    'CIVIL STATUS': row['CIVIL STATUS']?.trim(),
                    'YEAR GRADUATED': year,
                    'ARE YOU CURRENTLY EMPLOYED?': employedStatus,
                    'POSITION': row['CURRENT JOB POSITION/DESIGNATION']?.trim(),
                    'COMPANY': row['NAME OF COMPANY/AGENCY/ORGANIZATION']?.trim(),
                    'ORG TYPE': row['TYPE OF ORGANIZATION']?.trim(),
                    // Additional info from CSV for full details
                    'LET PASSER / ELIGIBILITY': (row['ELIGIBILITY']?.trim() || ''),
                    'AWARDS RECEIVED': row['AWARDS RECEIVED']?.trim(),
                    'SOCIO-ECONOMIC STATUS (Before Employment)': row['SOCIO-ECONOMIC STATUS (Before Employment)']?.trim(),
                    'SOCIO-ECONOMIC STATUS (After Employment)': row['SOCIO-ECONOMIC STATUS (After Employment)']?.trim(),
                    'REASON FOR UNEMPLOYMENT': row['PLEASE STATE YOUR REASON WHY YOU ARE NOT EMPLOYED (Check all that apply)']?.trim(),
                    'SKILLS PROFICIENCY': `${row['How would you rate your proficiency in the following skills upon graduating? [Communication Skills]']?.trim() || ''} ${row['How would you rate your proficiency in the following skills upon graduating? [Information and Computer Technology Skills]']?.trim() || ''}`,
                    'SKILLS USAGE': `${row['How often do you use the following skills in your current job? [Communication Skills]']?.trim() || ''} ${row['How often do you use the following skills in your current job? [Information and Computer Technology Skills]']?.trim() || ''}`
                });
            });

            // Populate filters
            populateFilters(yearsSet, gendersSet, civilSet, orgTypeSet);
            
            alumniFilteredData = alumniRawData;
            renderAlumniCards(alumniFilteredData);
            document.getElementById('alumniLoading').style.display = 'none';
        })
        .catch(error => {
            console.error('Error loading alumni data:', error);
            document.getElementById('alumniLoading').innerHTML = 'Error loading alumni data';
        });
}

function populateFilters(yearsSet, gendersSet, civilSet, orgTypeSet) {
    const yearFilter = document.getElementById('yearFilter');
    yearFilter.innerHTML = '<option value="">All Years</option>';
    Array.from(yearsSet).sort().forEach(year => {
        if (year) {
            const option = document.createElement('option');
            option.value = year;
            option.textContent = year;
            yearFilter.appendChild(option);
        }
    });
    
    const genderFilter = document.getElementById('genderFilter');
    genderFilter.innerHTML = '<option value="">All Genders</option>';
    Array.from(gendersSet).sort().forEach(gender => {
        if (gender) {
            const option = document.createElement('option');
            option.value = gender;
            option.textContent = gender;
            genderFilter.appendChild(option);
        }
    });
    
    const civilStatusFilter = document.getElementById('civilStatusFilter');
    civilStatusFilter.innerHTML = '<option value="">All Status</option>';
    Array.from(civilSet).sort().forEach(civil => {
        if (civil) {
            const option = document.createElement('option');
            option.value = civil;
            option.textContent = civil;
            civilStatusFilter.appendChild(option);
        }
    });
    
    const orgTypeFilter = document.getElementById('orgTypeFilter');
    orgTypeFilter.innerHTML = '<option value="">All Types</option>';
    Array.from(orgTypeSet).sort().forEach(type => {
        if (type) {
            const option = document.createElement('option');
            option.value = type;
            option.textContent = type;
            orgTypeFilter.appendChild(option);
        }
    });
}

function renderAlumniCards(data) {
    const grid = document.getElementById('alumniCardsGrid');
    if (!grid) return;
    
    grid.innerHTML = '';
    const countElement = document.getElementById('alumniCount');
    if (countElement) {
        countElement.textContent = `Showing ${data.length} of ${alumniRawData.length} records`;
    }
    
    data.forEach((a, idx) => {
        const card = document.createElement('div');
        card.className = 'alumni-card';
        card.innerHTML = `
            <div class="alumni-header">${a['NAME']}</div>
            <div class="alumni-tags">
                <span class="alumni-tag ${a['ARE YOU CURRENTLY EMPLOYED?'] === 'Yes' ? 'employed' : 'unemployed'}">${a['ARE YOU CURRENTLY EMPLOYED?'] === 'Yes' ? 'Employed' : 'Unemployed'}</span>
                <span class="alumni-tag">Class of ${a['YEAR GRADUATED']}</span>
                <span class="alumni-tag">${a['SEX']}</span>
            </div>
            <div class="alumni-details">
                <div><span class="icon">&#128188;</span> ${a['POSITION'] || '—'}</div>
                <div><span class="icon">&#127891;</span> ${a['COMPANY'] || '—'}</div>
                <div><span class="icon">&#127968;</span> ${a['HOME ADDRESS'] || '—'}</div>
                <div><span class="icon">&#128222;</span> ${a['CONTACT NO.'] || '—'}
                    ${a['EMAIL ADDRESS'] ? `<span style='margin-left:10px;'>&#9993; <a href='mailto:${a['EMAIL ADDRESS']}' target='_blank'>Email</a></span>` : ''}
                    ${a['FACEBOOK LINK'] ? `<span style='margin-left:10px;'>&#128100; <a href='${a['FACEBOOK LINK']}' target='_blank'>Facebook</a></span>` : ''}
                </div>
            </div>
            <div class="alumni-actions">
                <button class="btn view-details-btn" data-idx="${idx}">&#128065; View Full Details</button>
            </div>
        `;
        grid.appendChild(card);
    });
    // Add event listeners for view details buttons
    const detailBtns = grid.querySelectorAll('.view-details-btn');
    detailBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const idx = parseInt(btn.getAttribute('data-idx'));
            showAlumniDetailsModal(data[idx]);
        });
    });
// ...existing code...

// Show alumni details modal (global scope)
function showAlumniDetailsModal(alumni) {
    const modal = document.getElementById('alumniDetailsModal');
    const body = document.getElementById('alumniModalBody');
    if (!modal || !body) return;

    // Build details HTML
    let html = `<h2>${alumni['NAME']}</h2>`;
    html += '<div class="alumni-details-grid">';
    Object.keys(alumni).forEach(key => {
        if (key !== 'NAME') {
            html += `<div class="detail-item"><strong>${key}:</strong> ${alumni[key] || '—'}</div>`;
        }
    });
    html += '</div>';
    body.innerHTML = html;
    modal.style.display = 'block';
}

// Close alumni modal (global scope)
function closeAlumniModal() {
    const modal = document.getElementById('alumniDetailsModal');
    if (modal) modal.style.display = 'none';
}

// Make closeAlumniModal global for HTML onclick
window.closeAlumniModal = closeAlumniModal;
}

function filterAlumni() {
    const year = document.getElementById('yearFilter')?.value || '';
    const employment = document.getElementById('employmentFilter')?.value || '';
    const gender = document.getElementById('genderFilter')?.value || '';
    const civil = document.getElementById('civilStatusFilter')?.value || '';
    const orgType = document.getElementById('orgTypeFilter')?.value || '';
    const search = document.getElementById('searchInput')?.value.trim().toLowerCase() || '';
    
    alumniFilteredData = alumniRawData.filter(a => {
        let match = true;
        if (year) match = match && a['YEAR GRADUATED'] === year;
        if (employment) match = match && a['ARE YOU CURRENTLY EMPLOYED?'] === employment;
        if (gender) match = match && a['SEX'] === gender;
        if (civil) match = match && a['CIVIL STATUS'] === civil;
        if (orgType) match = match && a['ORG TYPE'] === orgType;
        if (search) {
            match = match && (
                a['NAME'].toLowerCase().includes(search) ||
                (a['COMPANY'] && a['COMPANY'].toLowerCase().includes(search)) ||
                (a['POSITION'] && a['POSITION'].toLowerCase().includes(search))
            );
        }
        return match;
    });
    renderAlumniCards(alumniFilteredData);
}

// Event listeners for filters
document.addEventListener('DOMContentLoaded', function() {
    // Add event listeners after DOM is loaded
    setTimeout(() => {
        const searchInput = document.getElementById('searchInput');
        const yearFilter = document.getElementById('yearFilter');
        const employmentFilter = document.getElementById('employmentFilter');
        const genderFilter = document.getElementById('genderFilter');
        const civilStatusFilter = document.getElementById('civilStatusFilter');
        const orgTypeFilter = document.getElementById('orgTypeFilter');

        if (searchInput) searchInput.addEventListener('input', filterAlumni);
        if (yearFilter) yearFilter.addEventListener('change', filterAlumni);
        if (employmentFilter) employmentFilter.addEventListener('change', filterAlumni);
        if (genderFilter) genderFilter.addEventListener('change', filterAlumni);
        if (civilStatusFilter) civilStatusFilter.addEventListener('change', filterAlumni);
        if (orgTypeFilter) orgTypeFilter.addEventListener('change', filterAlumni);
    }, 1000);
});

function clearAlumniFilters() {
    const searchInput = document.getElementById('searchInput');
    const yearFilter = document.getElementById('yearFilter');
    const employmentFilter = document.getElementById('employmentFilter');
    const genderFilter = document.getElementById('genderFilter');
    const civilStatusFilter = document.getElementById('civilStatusFilter');
    const orgTypeFilter = document.getElementById('orgTypeFilter');

    if (searchInput) searchInput.value = '';
    if (yearFilter) yearFilter.value = '';
    if (employmentFilter) employmentFilter.value = '';
    if (genderFilter) genderFilter.value = '';
    if (civilStatusFilter) civilStatusFilter.value = '';
    if (orgTypeFilter) orgTypeFilter.value = '';
    
    filterAlumni();
}

// Make showTab function global so it can be called from HTML
window.showTab = showTab;
window.clearAlumniFilters = clearAlumniFilters;