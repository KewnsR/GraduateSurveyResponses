// Database connection simulation
const dbConfig = {
    host: 'localhost',
    username: 'root',
    password: '',
    database: 'alumni_tracer_study'
};

// Sample data for 54 respondents
const sampleData = {
    totalAlumni: 54,
    employedAlumni: 45,
    avgEmploymentTime: 2.6,
    recentGraduates: 20,
    graduatesByYear: {
        '2022': 12,
        '2023': 22,
        '2024': 20
    },
    industryData: {
        'Education and Training': 27,
        'Finance, Real Estate, and Business Services': 6,
        'BPO': 2,
        'Food': 1,
        'Community and Personal Services': 1,
        'NGO': 1,
        'Food Industry': 1,
        'Health and Social Services': 2,
        'Transportation and Communication': 1,
        'Information and Technology Services': 1,
        'Hospitality and Tourism': 1,
        'Public Administration and Security': 1
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

// Determine data path - always try PHP endpoint first
const dataPath = 'php/get_data.php';
const csvFileName = 'Employability Status of Bachelor of Secondary Education Major in Mathematics Graduates for the Academic Year 2024 (Responses).csv';

// Initialize dashboard
document.addEventListener('DOMContentLoaded', async function() {
    await loadCSVDataForCharts();
    loadDashboardData();
    initializeOverviewCharts();
    await loadAlumniData();
    
    // Attach event listeners after data is loaded
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
});

function loadDashboardData() {
    if (globalCSVData.length > 0) {
        const total = globalCSVData.length;
        const employed = globalCSVData.filter(row => row['employed']?.trim() === 'Yes').length;
        const recent = globalCSVData.filter(row => row['year_graduated']?.trim() === '2024').length;
        
        // Compute avg months
        const times = globalCSVData.map(row => {
            const t = row['months_to_employment']?.trim();
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
        const employed = globalCSVData.filter(row => row['employed']?.trim() === 'Yes').length;
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
            const year = row['year_graduated']?.trim();
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
        globalCSVData = await loadCSVData(dataPath);
        
        // Fix: Trim all keys in each row to avoid issues with extra spaces in CSV headers
        globalCSVData = globalCSVData.map(row => {
            const trimmedRow = {};
            Object.keys(row).forEach(key => {
                trimmedRow[key.trim()] = typeof row[key] === 'string' ? row[key].trim() : row[key];
            });
            return trimmedRow;
        });

        // Filter out any empty/invalid rows (but keep rows with at least a name)
        globalCSVData = globalCSVData.filter(row => {
            const hasName = row.name && row.name !== '';
            return hasName;
        });

        console.log('CSV data loaded:', globalCSVData.length, 'records');
        console.log('Employed count:', globalCSVData.filter(row => row.employed === 'Yes').length);
        console.log('Unemployed count:', globalCSVData.filter(row => row.employed === 'No').length);
        
        // Debug: Check if we have all 54 records
        if (globalCSVData.length !== 54) {
            console.warn(`Expected 54 records but got ${globalCSVData.length}`);
        }
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
        // Industry Chart - compute from data (employed respondents only)
        const industryCounts = {};
        globalCSVData.filter(row => row['employed']?.trim() === 'Yes').forEach(row => {
            const industry = row['industry']?.trim();
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

        // Time to Employment Chart - compute from data (employed respondents only)
        const timeCounts = {};
        globalCSVData.filter(row => row['employed']?.trim() === 'Yes').forEach(row => {
            const time = row['months_to_employment']?.trim();
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
        // Main Skills Chart (Radar) - compute from actual data
        const skillsCtx = document.getElementById('skillsChart');
        if (skillsCtx) {
            // Compute average proficiency and usage from CSV data
            const proficiencySkills = [
                'comm_prof',
                'ict_prof',
                'prob_solve_prof',
                'teaching_prof',
                'research_prof',
                'leadership_prof'
            ];
            
            const usageSkills = [
                'comm_usage',
                'ict_usage',
                'prob_solve_usage',
                'teaching_usage',
                'research_usage',
                'leadership_usage'
            ];
            
            const proficiencyAverages = proficiencySkills.map(skill => {
                const values = globalCSVData.map(row => {
                    const val = row[skill]?.trim();
                    if (val === 'Very Good (4)') return 4;
                    if (val === 'Good (3)') return 3;
                    if (val === 'Fair (2)') return 2;
                    if (val === 'Poor (1)') return 1;
                    return 0;
                }).filter(v => v > 0);
                return values.length > 0 ? (values.reduce((a,b)=>a+b,0) / values.length).toFixed(1) : 0;
            });
            
            const usageAverages = usageSkills.map(skill => {
                const values = globalCSVData.filter(row => row['employed']?.trim() === 'Yes').map(row => {
                    const val = row[skill]?.trim();
                    if (val === 'Often (4)') return 4;
                    if (val === 'Sometimes (3)') return 3;
                    if (val === 'Rarely (2)') return 2;
                    if (val === 'Never (1)') return 1;
                    return 0;
                }).filter(v => v > 0);
                return values.length > 0 ? (values.reduce((a,b)=>a+b,0) / values.length).toFixed(1) : 0;
            });
            
            new Chart(skillsCtx.getContext('2d'), {
                type: 'radar',
                data: {
                    labels: [
                        'Communication', 'ICT Skills', 'Problem Solving',
                        'Teaching Skills', 'Research Skills', 'Leadership'
                    ],
                    datasets: [{
                        label: 'Proficiency upon Graduation',
                        data: proficiencyAverages.map(v => parseFloat(v)),
                        borderColor: '#667eea',
                        backgroundColor: 'rgba(102, 126, 234, 0.2)',
                        borderWidth: 2
                    }, {
                        label: 'Usage in Current Job',
                        data: usageAverages.map(v => parseFloat(v)),
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

// Utility: Map CSV columns to database field names
function mapCSVColumnsToDBFields(csvRow) {
    const columnMap = {
        'LAST NAME, FIRST NAME, MIDDLE INITIAL (Ex. DELA CRUZ, JUAN A.)': 'name',
        'CONTACT NO.': 'contact_no',
        'FACEBOOK LINK': 'facebook_link',
        'EMAIL ADDRESS': 'email',
        'HOME ADDRESS': 'home_address',
        'SEX': 'sex',
        'AGE': 'age',
        'CIVIL STATUS': 'civil_status',
        'YEAR GRADUATED': 'year_graduated',
        'ARE YOU CURRENTLY EMPLOYED?': 'employed',
        'CURRENT JOB POSITION/DESIGNATION': 'position',
        'NAME OF COMPANY/AGENCY/ORGANIZATION': 'company',
        'TYPE OF ORGANIZATION': 'org_type',
        'ELIGIBILITY': 'eligibility',
        'AWARDS RECEIVED': 'awards',
        'SOCIO-ECONOMIC STATUS (Before Employment)': 'socio_before',
        'SOCIO-ECONOMIC STATUS (After Employment)': 'socio_after',
        'HOW MANY MONTHS DID YOU WAIT BEFORE OBTAINING YOUR FIRST EMPLOYMENT AFTER GRADUATION?  ': 'months_to_employment',
        'WHAT NATURE OF BUSINESS DOES YOUR COMPANY ENGAGE IN?': 'industry',
        'PLEASE STATE YOUR REASON WHY YOU ARE NOT EMPLOYED (Check all that apply)': 'unemployment_reason',
        'WHAT IS THE TOTAL NUMBER OF FAMILY MEMBERS IN YOUR HOUSEHOLD?   ': 'family_members',
        'FAMILY POSITION ? BIRTH ORDER  ': 'birth_order',
        'WHAT TYPE OF DWELLING DO YOU CURRENTLY RESIDE IN?  ': 'dwelling_type',
        'HOW WOULD YOU DESCRIBE YOUR FAMILY CLUSTER OR TYPE?  ': 'family_type',
        // Skills proficiency
        'How would you rate your proficiency in the following skills upon graduating? [Communication Skills]': 'comm_prof',
        'How would you rate your proficiency in the following skills upon graduating? [Human Relations Skills]': 'human_rel_prof',
        'How would you rate your proficiency in the following skills upon graduating? [Information and Computer Technology Skills]': 'ict_prof',
        'How would you rate your proficiency in the following skills upon graduating? [Audio-Visual Skills]': 'audio_vis_prof',
        'How would you rate your proficiency in the following skills upon graduating? [Problem-Solving and Critical Thinking Skills]': 'prob_solve_prof',
        'How would you rate your proficiency in the following skills upon graduating? [Comprehension and Analytical Skills]': 'comp_anal_prof',
        'How would you rate your proficiency in the following skills upon graduating? [Teaching and Lesson Planning Skills]': 'teaching_prof',
        'How would you rate your proficiency in the following skills upon graduating? [Time Management and Leadership Skills]': 'leadership_prof',
        'How would you rate your proficiency in the following skills upon graduating? [Research and Ethical Skills]': 'research_prof',
        'How would you rate your proficiency in the following skills upon graduating? [Test Construction and Assessment Skills]': 'test_const_prof',
        'How would you rate your proficiency in the following skills upon graduating? [Creativity, Innovation, and Adaptability]': 'creativity_prof',
        // Skills usage
        'How often do you use the following skills in your current job? [Communication Skills]': 'comm_usage',
        'How often do you use the following skills in your current job? [Human Relations Skills]': 'human_rel_usage',
        'How often do you use the following skills in your current job? [Information and Computer Technology Skills]': 'ict_usage',
        'How often do you use the following skills in your current job? [Audio-Visual Skills]': 'audio_vis_usage',
        'How often do you use the following skills in your current job? [Problem-Solving and Critical Thinking Skills]': 'prob_solve_usage',
        'How often do you use the following skills in your current job? [Comprehension and Analytical Skills]': 'comp_anal_usage',
        'How often do you use the following skills in your current job? [Teaching and Lesson Planning Skills]': 'teaching_usage',
        'How often do you use the following skills in your current job? [Time Management and Leadership Skills]': 'leadership_usage',
        'How often do you use the following skills in your current job? [Research and Ethical Skills]': 'research_usage',
        'How often do you use the following skills in your current job? [Test Construction and Assessment Skills]': 'test_const_usage',
        'How often do you use the following skills in your current job? [Creativity, Innovation, and Adaptability]': 'creativity_usage'
    };
    
    const mappedRow = {};
    
    // First, copy all existing short field names
    for (let key in csvRow) {
        if (csvRow.hasOwnProperty(key)) {
            mappedRow[key] = csvRow[key];
        }
    }
    
    // Then, apply mappings from long column names to short field names
    for (let longName in columnMap) {
        if (csvRow.hasOwnProperty(longName)) {
            mappedRow[columnMap[longName]] = csvRow[longName];
        }
    }
    
    return mappedRow;
}

// Utility: Load CSV and return Promise of data array
function loadCSVData(url) {
    return new Promise((resolve, reject) => {
        // Try PHP endpoint first
        fetch(url)
            .then(response => {
                if (!response.ok) {
                    throw new Error('PHP endpoint not available');
                }
                return response.json();
            })
            .then(data => {
                console.log('Loaded data from database:', data.length, 'records');
                resolve(data);
            })
            .catch(phpError => {
                console.warn('Database load failed, trying CSV fallback:', phpError);
                // Fallback to CSV
                const csvUrl = 'data/' + csvFileName;
                if (typeof Papa !== 'undefined') {
                    Papa.parse(csvUrl, {
                        header: true,
                        download: true,
                        skipEmptyLines: true,
                        complete: results => {
                            console.log('Loaded data from CSV:', results.data.length, 'records');
                            // Map CSV columns to DB field names
                            const mappedData = results.data.map(row => mapCSVColumnsToDBFields(row));
                            resolve(mappedData);
                        },
                        error: err => reject(err)
                    });
                } else {
                    fetch(csvUrl)
                        .then(response => response.text())
                        .then(csvText => {
                            const lines = csvText.split('\n');
                            const headers = lines[0].split(',').map(h => h.replace(/(^"|"$)/g, '').trim());
                            const data = lines.slice(1).map(line => {
                                const values = line.split(',');
                                const obj = {};
                                headers.forEach((h, i) => obj[h] = values[i] ? values[i].replace(/(^"|"$)/g, '').trim() : '');
                                return obj;
                            });
                            console.log('Loaded data from CSV (manual parse):', data.length, 'records');
                            // Map CSV columns to DB field names
                            const mappedData = data.map(row => mapCSVColumnsToDBFields(row));
                            resolve(mappedData);
                        })
                        .catch(err => reject(err));
                }
            });
    });
}

// Chart rendering functions
function renderAgeGroupChart(data) {
    const ctx = document.getElementById('ageGroupChart');
    if (!ctx) return;
    
    const counts = {};
    data.forEach(row => {
        let age = row['age'];
        if (age === undefined || age === null) age = 'Unknown';
        if (typeof age === 'string') age = age.trim();
        if (!age) age = 'Unknown';
        counts[age] = (counts[age] || 0) + 1;
    });
    
    new Chart(ctx.getContext('2d'), {
        type: 'pie',
        data: {
            labels: Object.keys(counts).filter(key => key !== 'undefined'),
            datasets: [{ 
                data: Object.keys(counts).filter(key => key !== 'undefined').map(key => counts[key]), 
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
        let gender = row['sex'];
        if (gender === undefined || gender === null) gender = 'Unknown';
        if (typeof gender === 'string') gender = gender.trim();
        if (!gender) gender = 'Unknown';
        counts[gender] = (counts[gender] || 0) + 1;
    });
    
    new Chart(ctx.getContext('2d'), {
        type: 'doughnut',
        data: {
            labels: Object.keys(counts).filter(key => key !== 'undefined'),
            datasets: [{ 
                data: Object.keys(counts).filter(key => key !== 'undefined').map(key => counts[key]), 
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
        let status = row['civil_status'];
        if (status === undefined || status === null) status = 'Unknown';
        if (typeof status === 'string') status = status.trim();
        if (!status) status = 'Unknown';
        counts[status] = (counts[status] || 0) + 1;
    });
    
    new Chart(ctx.getContext('2d'), {
        type: 'bar',
        data: {
            labels: Object.keys(counts).filter(key => key !== 'undefined'),
            datasets: [{ 
                label: 'Civil Status', 
                data: Object.keys(counts).filter(key => key !== 'undefined').map(key => counts[key]), 
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
        let bef = row['socio_before'];
        if (bef === undefined || bef === null) bef = 'Unknown';
        if (typeof bef === 'string') bef = bef.trim();
        if (!bef) bef = 'Unknown';
        before[bef] = (before[bef] || 0) + 1;
        
        // Only count "after" for employed respondents
        const employed = row['employed']?.trim();
        if (employed === 'Yes') {
            let aft = row['socio_after'];
            if (aft === undefined || aft === null) aft = 'Unknown';
            if (typeof aft === 'string') aft = aft.trim();
            if (!aft) aft = 'Unknown';
            after[aft] = (after[aft] || 0) + 1;
        }
    });
    
    const allLabels = Array.from(new Set([...Object.keys(before), ...Object.keys(after)])).filter(key => key !== 'undefined');
    
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
        let lic = (row['eligibility'] || '').trim().toLowerCase();
        if (lic) { // Only count rows that have eligibility data
            if (lic.includes('passer') || lic.includes('yes')) {
                passed++;
            } else {
                notPassed++;
            }
        }
    });
    
    new Chart(ctx.getContext('2d'), {
        type: 'pie',
        data: {
            labels: ['Passed Licensure/Civil Service', 'Did Not Pass'],
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
        const employed = row['employed']?.trim();
        if (employed === 'No') {
            let reasons = row['unemployment_reason'];
            if (typeof reasons === 'string' && reasons.trim()) {
                reasons.split(',').forEach(r => {
                    const reason = r.trim();
                    if (reason) counts[reason] = (counts[reason] || 0) + 1;
                });
            }
        }
    });
    
    if (Object.keys(counts).length === 0) {
        counts['No specific reasons provided'] = data.filter(row => row['employed']?.trim() === 'No').length;
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
        let award = row['awards']?.trim();
        if (award && award.toLowerCase() !== 'none') {
            counts[award] = (counts[award] || 0) + 1;
        } else {
            counts['None'] = (counts['None'] || 0) + 1;
        }
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
        'comm_prof',
        'human_rel_prof',
        'ict_prof',
        'audio_vis_prof',
        'prob_solve_prof',
        'comp_anal_prof',
        'teaching_prof',
        'leadership_prof',
        'research_prof',
        'test_const_prof',
        'creativity_prof'
    ];
    const skillLabels = [
        'Communication Skills',
        'Human Relations Skills',
        'Information and Computer Technology Skills',
        'Audio-Visual Skills',
        'Problem-Solving and Critical Thinking Skills',
        'Comprehension and Analytical Skills',
        'Teaching and Lesson Planning Skills',
        'Time Management and Leadership Skills',
        'Research and Ethical Skills',
        'Test Construction and Assessment Skills',
        'Creativity, Innovation, and Adaptability'
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
            label: skillLabels[idx],
            data: levels.map(lvl => counts[lvl]),
            backgroundColor: [
                '#60a5fa', '#fbbf24', '#34d399', '#f87171', '#a78bfa',
                '#fb7185', '#4ade80', '#fbbf24', '#60a5fa', '#f87171', '#a78bfa'
            ][idx % 11]
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
        'comm_usage',
        'human_rel_usage',
        'ict_usage',
        'audio_vis_usage',
        'prob_solve_usage',
        'comp_anal_usage',
        'teaching_usage',
        'leadership_usage',
        'research_usage',
        'test_const_usage',
        'creativity_usage'
    ];
    const skillLabels = [
        'Communication Skills',
        'Human Relations Skills',
        'Information and Computer Technology Skills',
        'Audio-Visual Skills',
        'Problem-Solving and Critical Thinking Skills',
        'Comprehension and Analytical Skills',
        'Teaching and Lesson Planning Skills',
        'Time Management and Leadership Skills',
        'Research and Ethical Skills',
        'Test Construction and Assessment Skills',
        'Creativity, Innovation, and Adaptability'
    ];
    const levels = ['Often (4)', 'Sometimes (3)', 'Rarely (2)', 'Never (1)'];
    
    // Filter for employed respondents only
    const employedData = data.filter(row => row['employed']?.trim() === 'Yes');
    
    const datasets = skills.map((skill, idx) => {
        const counts = {};
        levels.forEach(lvl => counts[lvl] = 0);
        employedData.forEach(row => {
            const val = row[skill]?.trim();
            if (val && counts.hasOwnProperty(val)) counts[val]++;
        });
        
        return {
            label: skillLabels[idx],
            data: levels.map(lvl => counts[lvl]),
            backgroundColor: [
                '#818cf8', '#f472b6', '#facc15', '#fb7185', '#4ade80',
                '#fbbf24', '#60a5fa', '#f87171', '#a78bfa', '#fb7185', '#4ade80'
            ][idx % 11]
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
    return loadCSVData(dataPath)
        .then(data => {
            alumniRawData = [];
            let employed = 0, unemployed = 0;
            let yearsSet = new Set();
            let gendersSet = new Set();
            let civilSet = new Set();
            let orgTypeSet = new Set();
            
            data.forEach(row => {
                // Skip empty rows
                const name = row['name'] || row['LAST NAME, FIRST NAME, MIDDLE INITIAL (Ex. DELA CRUZ, JUAN A.)']?.trim();
                if (!name || name === '') return;
                
                const employedStatus = row['employed'] || row['ARE YOU CURRENTLY EMPLOYED?']?.trim();
                if (employedStatus === 'Yes') employed++;
                else if (employedStatus === 'No') unemployed++;
                const year = row['year_graduated'] || row['YEAR GRADUATED']?.trim();
                yearsSet.add(year);
                gendersSet.add(row['sex'] || row['SEX']?.trim());
                civilSet.add(row['civil_status'] || row['CIVIL STATUS']?.trim());
                orgTypeSet.add(row['org_type'] || row['TYPE OF ORGANIZATION']?.trim());
                
                // Build alumni object with ALL fields including skills
                const alumniObj = {
                    'id': row['id'],
                    'name': name,
                    'contact_no': row['contact_no'] || row['CONTACT NO.']?.trim(),
                    'facebook_link': row['facebook_link'] || row['FACEBOOK LINK']?.trim(),
                    'email': row['email'] || row['EMAIL ADDRESS']?.trim(),
                    'home_address': row['home_address'] || row['HOME ADDRESS']?.trim(),
                    'sex': row['sex'] || row['SEX']?.trim(),
                    'age': row['age'] || row['AGE']?.trim(),
                    'civil_status': row['civil_status'] || row['CIVIL STATUS']?.trim(),
                    'year_graduated': year,
                    'employed': employedStatus,
                    'position': row['position'] || row['CURRENT JOB POSITION/DESIGNATION']?.trim(),
                    'company': row['company'] || row['NAME OF COMPANY/AGENCY/ORGANIZATION']?.trim(),
                    'org_type': row['org_type'] || row['TYPE OF ORGANIZATION']?.trim(),
                    // Add all skill fields
                    'comm_prof': row['comm_prof'],
                    'human_rel_prof': row['human_rel_prof'],
                    'ict_prof': row['ict_prof'],
                    'audio_vis_prof': row['audio_vis_prof'],
                    'prob_solve_prof': row['prob_solve_prof'],
                    'comp_anal_prof': row['comp_anal_prof'],
                    'teaching_prof': row['teaching_prof'],
                    'leadership_prof': row['leadership_prof'],
                    'research_prof': row['research_prof'],
                    'test_const_prof': row['test_const_prof'],
                    'creativity_prof': row['creativity_prof'],
                    'comm_usage': row['comm_usage'],
                    'human_rel_usage': row['human_rel_usage'],
                    'ict_usage': row['ict_usage'],
                    'audio_vis_usage': row['audio_vis_usage'],
                    'prob_solve_usage': row['prob_solve_usage'],
                    'comp_anal_usage': row['comp_anal_usage'],
                    'teaching_usage': row['teaching_usage'],
                    'leadership_usage': row['leadership_usage'],
                    'research_usage': row['research_usage'],
                    'test_const_usage': row['test_const_usage'],
                    'creativity_usage': row['creativity_usage']
                };
                
                alumniRawData.push(alumniObj);
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
            <div class="alumni-header">${a['name'] || a['NAME']}</div>
            <div class="alumni-tags">
                <span class="alumni-tag ${a['employed'] === 'Yes' ? 'employed' : 'unemployed'}">${a['employed'] === 'Yes' ? 'Employed' : 'Unemployed'}</span>
                <span class="alumni-tag">Class of ${a['year_graduated']}</span>
                <span class="alumni-tag">${a['sex']}</span>
            </div>
            <div class="alumni-details">
                <div><span class="icon">&#128188;</span> ${a['position'] || '—'}</div>
                <div><span class="icon">&#127891;</span> ${a['company'] || '—'}</div>
                <div><span class="icon">&#127968;</span> ${a['home_address'] || '—'}</div>
                <div><span class="icon">&#128222;</span> ${a['contact_no'] || '—'}
                    ${a['email'] ? `<span style='margin-left:10px;'>&#9993; <a href='mailto:${a['email']}' target='_blank'>Email</a></span>` : ''}
                    ${a['facebook_link'] ? `<span style='margin-left:10px;'>&#128100; <a href='${a['facebook_link']}' target='_blank'>Facebook</a></span>` : ''}
                </div>
            </div>
            <div class="alumni-actions">
                <button class="btn view-details-btn" data-idx="${idx}">&#128065; View Full Details</button>
                ${window.location.pathname.includes('view.html') ? '' : '<button class="btn edit-btn" data-idx="${idx}">&#9998; Edit</button>'}
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
    // Add event listeners for edit buttons (only if not in view-only mode)
    if (!window.location.pathname.includes('view.html')) {
        const editBtns = grid.querySelectorAll('.edit-btn');
        editBtns.forEach(btn => {
            btn.addEventListener('click', function() {
                const idx = parseInt(btn.getAttribute('data-idx'));
                openEditModal(data[idx]);
            });
        });
    }
}

// Show alumni details modal (global scope)
function showAlumniDetailsModal(alumni) {
    const modal = document.getElementById('alumniDetailsModal');
    const body = document.getElementById('alumniModalBody');
    if (!modal || !body) return;

    // Map field names to display labels
    const fieldLabels = {
        'name': 'Name',
        'contact_no': 'Contact Number',
        'facebook_link': 'Facebook',
        'email': 'Email',
        'home_address': 'Home Address',
        'sex': 'Gender',
        'age': 'Age',
        'civil_status': 'Civil Status',
        'year_graduated': 'Year Graduated',
        'employed': 'Employment Status',
        'position': 'Position',
        'company': 'Company',
        'company_address': 'Company Address',
        'employment_status': 'Employment Type',
        'place_of_work': 'Place of Work',
        'org_type': 'Organization Type',
        'industry': 'Industry',
        'length_of_service': 'Length of Service',
        'eligibility': 'Eligibility/License',
        'awards': 'Awards Received',
        'socio_before': 'Socio-Economic (Before)',
        'socio_after': 'Socio-Economic (After)',
        'months_to_employment': 'Months to Employment',
        'unemployment_reason': 'Unemployment Reason',
        'family_members': 'Family Members',
        'birth_order': 'Birth Order',
        'dwelling_type': 'Dwelling Type',
        'family_type': 'Family Type'
    };

    // Build details HTML
    let html = `<h2>${alumni['name'] || 'Alumni Details'}</h2>`;
    html += '<div class="alumni-details-grid">';
    
    // Display main fields in order
    Object.keys(fieldLabels).forEach(key => {
        if (alumni[key] && alumni[key] !== '' && alumni[key] !== 'N/A' && alumni[key] !== 'None') {
            const value = alumni[key];
            const label = fieldLabels[key];
            if (key === 'facebook_link' && value) {
                html += `<div class="detail-item"><strong>${label}:</strong> <a href="${value}" target="_blank">View Profile</a></div>`;
            } else if (key === 'email' && value) {
                html += `<div class="detail-item"><strong>${label}:</strong> <a href="mailto:${value}">${value}</a></div>`;
            } else {
                html += `<div class="detail-item"><strong>${label}:</strong> ${value}</div>`;
            }
        }
    });
    
    // Add skill proficiency section
    html += '<div class="detail-item" style="grid-column: 1 / -1;"><strong>Skill Proficiency Upon Graduation:</strong>';
    const profSkills = ['comm_prof', 'human_rel_prof', 'ict_prof', 'audio_vis_prof', 'prob_solve_prof', 'comp_anal_prof', 'teaching_prof', 'leadership_prof', 'research_prof', 'test_const_prof', 'creativity_prof'];
    const profLabels = ['Communication', 'Human Relations', 'ICT', 'Audio-Visual', 'Problem-Solving', 'Comprehension', 'Teaching', 'Leadership', 'Research', 'Test Construction', 'Creativity'];
    
    let hasProfData = profSkills.some(skill => alumni[skill] && alumni[skill] !== '');
    
    if (hasProfData) {
        html += '<ul style="list-style: none; padding: 0; margin: 5px 0; columns: 2;">';
        profSkills.forEach((skill, idx) => {
            if (alumni[skill] && alumni[skill] !== '') {
                html += `<li style="margin: 2px 0;">• ${profLabels[idx]}: ${alumni[skill]}</li>`;
            }
        });
        html += '</ul>';
    } else {
        html += '<p style="margin: 5px 0; color: #888; font-style: italic;">No skill proficiency data available</p>';
    }
    html += '</div>';
    
    // Add skill usage section if employed
    if (alumni['employed'] === 'Yes') {
        html += '<div class="detail-item" style="grid-column: 1 / -1;"><strong>Skill Usage in Current Job:</strong>';
        const usageSkills = ['comm_usage', 'human_rel_usage', 'ict_usage', 'audio_vis_usage', 'prob_solve_usage', 'comp_anal_usage', 'teaching_usage', 'leadership_usage', 'research_usage', 'test_const_usage', 'creativity_usage'];
        
        let hasUsageData = usageSkills.some(skill => alumni[skill] && alumni[skill] !== '');
        
        if (hasUsageData) {
            html += '<ul style="list-style: none; padding: 0; margin: 5px 0; columns: 2;">';
            usageSkills.forEach((skill, idx) => {
                if (alumni[skill] && alumni[skill] !== '') {
                    html += `<li style="margin: 2px 0;">• ${profLabels[idx]}: ${alumni[skill]}</li>`;
                }
            });
            html += '</ul>';
        } else {
            html += '<p style="margin: 5px 0; color: #888; font-style: italic;">No skill usage data available</p>';
        }
        html += '</div>';
    }
    
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

function filterAlumni() {
    const year = document.getElementById('yearFilter')?.value || '';
    const employment = document.getElementById('employmentFilter')?.value || '';
    const gender = document.getElementById('genderFilter')?.value || '';
    const civil = document.getElementById('civilStatusFilter')?.value || '';
    const orgType = document.getElementById('orgTypeFilter')?.value || '';
    const search = document.getElementById('searchInput')?.value.trim().toLowerCase() || '';
    
    alumniFilteredData = alumniRawData.filter(a => {
        let match = true;
        if (year) match = match && a['year_graduated'] === year;
        if (employment) match = match && a['employed'] === employment;
        if (gender) match = match && a['sex'] === gender;
        if (civil) match = match && a['civil_status'] === civil;
        if (orgType) match = match && a['org_type'] === orgType;
        if (search) {
            match = match && (
                a['name'].toLowerCase().includes(search) ||
                (a['company'] && a['company'].toLowerCase().includes(search)) ||
                (a['position'] && a['position'].toLowerCase().includes(search))
            );
        }
        return match;
    });
    renderAlumniCards(alumniFilteredData);
}

// Event listeners for filters
// Moved to DOMContentLoaded after data loading

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

// Login functionality
function checkPassword() {
    const password = document.getElementById('passwordInput').value;
    const correctPassword = 'alumni2024'; // Change this to your desired password
    const errorMessage = document.getElementById('errorMessage');
    
    if (password === correctPassword) {
        document.getElementById('loginModal').style.display = 'none';
        document.getElementById('dashboardContainer').style.display = 'block';
    } else {
        errorMessage.style.display = 'block';
        setTimeout(() => {
            errorMessage.style.display = 'none';
        }, 3000);
    }
}

// Union/Staff login functionality
function checkUnionPassword() {
    const password = document.getElementById('passwordInput').value;
    const correctPassword = 'alumni2024'; // Union/Staff password
    const errorMessage = document.getElementById('errorMessage');
    
    if (password === correctPassword) {
        document.getElementById('loginModal').style.display = 'none';
        document.getElementById('dashboardContainer').style.display = 'block';
        // You can add additional union-specific features here
        console.log('Union/Staff login successful');
    } else {
        errorMessage.style.display = 'block';
        setTimeout(() => {
            errorMessage.style.display = 'none';
        }, 3000);
    }
}

// Password toggle functionality
function togglePassword() {
    const input = document.getElementById('passwordInput');
    const toggle = document.querySelector('.password-toggle');
    if (input.type === 'password') {
        input.type = 'text';
        toggle.classList.add('hidden');
    } else {
        input.type = 'password';
        toggle.classList.remove('hidden');
    }
}

// Allow Enter key to submit password
document.addEventListener('DOMContentLoaded', function() {
    const passwordInput = document.getElementById('passwordInput');
    if (passwordInput) {
        passwordInput.addEventListener('keypress', function(event) {
            if (event.key === 'Enter') {
                checkPassword();
            }
        });
    }

    // Show/hide scroll-to-top button
    const scrollBtn = document.getElementById('scrollToTopBtn');
    if (scrollBtn) {
        window.addEventListener('scroll', function() {
            if (window.scrollY > 200) {
                scrollBtn.style.display = 'block';
            } else {
                scrollBtn.style.display = 'none';
            }
        });
        scrollBtn.addEventListener('click', function() {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }
});

// Make functions global for HTML onclick
window.checkPassword = checkPassword;
window.togglePassword = togglePassword;
window.checkUnionPassword = checkUnionPassword;

// Edit functionality
function openEditModal(alumni) {
    document.getElementById('editId').value = alumni.id;
    document.getElementById('editName').value = alumni.name || '';
    document.getElementById('editContact').value = alumni.contact_no || '';
    document.getElementById('editEmail').value = alumni.email || '';
    document.getElementById('editEmployed').value = alumni.employed || 'No';
    document.getElementById('editPosition').value = alumni.position || '';
    document.getElementById('editCompany').value = alumni.company || '';
    
    // Additional fields
    const homeAddressField = document.getElementById('editHomeAddress');
    const facebookField = document.getElementById('editFacebookLink');
    const sexField = document.getElementById('editSex');
    const ageField = document.getElementById('editAge');
    const civilStatusField = document.getElementById('editCivilStatus');
    const yearGradField = document.getElementById('editYearGraduated');
    
    if (homeAddressField) homeAddressField.value = alumni.home_address || '';
    if (facebookField) facebookField.value = alumni.facebook_link || '';
    if (sexField) sexField.value = alumni.sex || 'Male';
    if (ageField) ageField.value = alumni.age || '';
    if (civilStatusField) civilStatusField.value = alumni.civil_status || 'Single';
    if (yearGradField) yearGradField.value = alumni.year_graduated || '';
    
    document.getElementById('editAlumniModal').style.display = 'block';
}

function closeEditModal() {
    document.getElementById('editAlumniModal').style.display = 'none';
}

// Make edit functions global
window.openEditModal = openEditModal;
window.closeEditModal = closeEditModal;

// Initialize edit form handler when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initEditForm);
} else {
    initEditForm();
}

function initEditForm() {
    const editForm = document.getElementById('editForm');
    if (editForm) {
        editForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const formData = new FormData(this);
            const data = Object.fromEntries(formData);
            
            fetch('php/get_data.php', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            })
            .then(response => response.json())
            .then(result => {
                if (result.success) {
                    alert('Changes saved successfully!');
                    closeEditModal();
                    // Reload the data to show updates
                    loadCSVDataForCharts();
                    loadAlumniData();
                    loadDashboardData();
                } else {
                    alert('Error saving changes: ' + (result.error || 'Unknown error'));
                }
            })
            .catch(error => {
                console.error('Error:', error);
                alert('Error saving changes: ' + error.message);
            });
        });
    }
}