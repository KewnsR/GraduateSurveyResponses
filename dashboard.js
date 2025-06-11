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
            recentGraduates: 20, // set to 2024 graduates if you want "recent" to mean 2024
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

        // Initialize dashboard
        document.addEventListener('DOMContentLoaded', function() {
            loadDashboardData();
            initializeCharts();
            loadAlumniData();
        });

        function loadDashboardData() {
            // Update statistics cards
            document.getElementById('totalAlumni').textContent = sampleData.totalAlumni.toLocaleString();
            document.getElementById('employmentRate').textContent = 
                Math.round((sampleData.employedAlumni / sampleData.totalAlumni) * 100) + '%';
            document.getElementById('avgEmployment').textContent = sampleData.avgEmploymentTime + ' months';
            document.getElementById('recentGraduates').textContent = sampleData.recentGraduates;
            
            document.getElementById('employedCount').textContent = sampleData.employedAlumni;
            document.getElementById('unemployedCount').textContent = sampleData.totalAlumni - sampleData.employedAlumni; // 56 - 46 = 10

            // Populate year filter
            const yearFilter = document.getElementById('yearFilter');
            Object.keys(sampleData.graduatesByYear).forEach(year => {
                const option = document.createElement('option');
                option.value = year;
                option.textContent = year;
                yearFilter.appendChild(option);
            });
        }

        function initializeCharts() {
            // Employment Status Chart
            const employmentCtx = document.getElementById('employmentChart').getContext('2d');
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

            // Graduates by Year Chart
            const graduatesCtx = document.getElementById('graduatesChart').getContext('2d');
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

            // Industry Chart
            const industryCtx = document.getElementById('industryChart').getContext('2d');
            new Chart(industryCtx, {
                type: 'pie',
                data: {
                    labels: Object.keys(sampleData.industryData),
                    datasets: [{
                        data: Object.values(sampleData.industryData),
                        backgroundColor: [
                            '#667eea', '#764ba2', '#f093fb', '#f5576c',
                            '#4facfe', '#00f2fe'
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

            // Time to Employment Chart (adjusted for smaller sample)
            const timeCtx = document.getElementById('timeToEmploymentChart').getContext('2d');
            new Chart(timeCtx, {
                type: 'line',
                data: {
                    labels: ['0-1 months', '2-3 months', '4-6 months', '7-12 months', '12+ months'],
                    datasets: [{
                        label: 'Number of Alumni',
                        data: [15, 18, 10, 4, 1],
                        borderColor: '#667eea',
                        backgroundColor: 'rgba(102, 126, 234, 0.1)',
                        borderWidth: 3,
                        fill: true,
                        tension: 0.4
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

            // Skills Chart
            const skillsCtx = document.getElementById('skillsChart').getContext('2d');
            new Chart(skillsCtx, {
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

            // Financial Improvement Factors Chart
            const financialCtx = document.getElementById('financialFactorsChart').getContext('2d');
            new Chart(financialCtx, {
                type: 'horizontalBar',
                data: {
                    labels: Object.keys(sampleData.financialImprovementFactors),
                    datasets: [{
                        label: 'Number of Alumni',
                        data: Object.values(sampleData.financialImprovementFactors),
                        backgroundColor: [
                            '#667eea', '#764ba2', '#f093fb', '#f5576c',
                            '#4facfe', '#00f2fe', '#43e97b', '#38f9d7'
                        ],
                        borderColor: [
                            '#5a67d8', '#6b46c1', '#d946ef', '#dc2626',
                            '#2563eb', '#0891b2', '#059669', '#0d9488'
                        ],
                        borderWidth: 2,
                        borderRadius: 5
                    }]
                },
                options: {
                    indexAxis: 'y',
                    responsive: true,
                    plugins: {
                        legend: {
                            display: false
                        },
                        title: {
                            display: true,
                            text: 'Factors Contributing to Financial Improvement (Multiple selections allowed)'
                        }
                    },
                    scales: {
                        x: {
                            beginAtZero: true,
                            max: Math.max(...Object.values(sampleData.financialImprovementFactors)) + 5
                        }
                    }
                }
            });

            // Add this code to display the data in a table
function renderFinancialFactorsTable() {
    const factors = sampleData.financialImprovementFactors;
    let html = `<table class="table table-striped" style="margin-top:16px;">
        <thead>
            <tr>
                <th>Factor</th>
                <th>Number of Alumni</th>
            </tr>
        </thead>
        <tbody>
            ${Object.entries(factors).map(([factor, count]) => `
                <tr>
                    <td>${factor}</td>
                    <td>${count}</td>
                </tr>
            `).join('')}
        </tbody>
    </table>`;
    // Make sure you have a container with this ID in your HTML
    document.getElementById('financialFactorsTableContainer').innerHTML = html;
}

// Call this after initializing the chart
renderFinancialFactorsTable();
        }

        function showTab(tabName) {
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
            event.target.classList.add('active');
        }

        // Helper: Parse CSV to array of objects
function parseCSV(csv, delimiter = ',') {
    const lines = csv.split('\n').filter(line => line.trim());
    const headers = lines[0].split(delimiter).map(h => h.replace(/(^"|"$)/g, '').trim());
    return lines.slice(1).map(line => {
        const values = [];
        let inQuotes = false, value = '';
        for (let i = 0; i < line.length; i++) {
            const char = line[i];
            if (char === '"' && line[i + 1] === '"') {
                value += '"'; i++; // escaped quote
            } else if (char === '"') {
                inQuotes = !inQuotes;
            } else if (char === delimiter && !inQuotes) {
                values.push(value); value = '';
            } else {
                value += char;
            }
        }
        values.push(value);
        const obj = {};
        headers.forEach((h, i) => obj[h] = values[i] ? values[i].trim() : '');
        return obj;
    });
}

let alumniRawData = [];
let alumniFilteredData = [];

// Load and display alumni data from CSV
function loadAlumniData() {
    fetch('../data/Employability Status of Bachelor of Secondary Education Major in Mathematics Graduates for the Academic Year 2024 (Responses).csv')
        .then(response => response.text())
        .then(csvText => {
            const rows = csvText.split('\n').slice(1); // skip header
            let employed = 0, unemployed = 0;
            const alumni = rows.map(row => {
                const cols = row.split(/,(?=(?:(?:[^"]*"){2})*[^"]*$)/);
                const employedStatus = (cols[16]?.trim() === 'Yes') ? 'Employed' : 'Unemployed';
                if (employedStatus === 'Employed') employed++;
                else if (employedStatus === 'Unemployed') unemployed++;
                return {
                    name: cols[2]?.replace(/"/g, '').trim(),
                    year: cols[12]?.trim(),
                    employed: employedStatus,
                    position: cols[18]?.replace(/"/g, '').trim(),
                    company: cols[19]?.replace(/"/g, '').trim()
                };
            }).filter(a => a.name);

            // Update dashboard counts dynamically
            document.getElementById('totalAlumni').textContent = alumni.length;
            document.getElementById('employedCount').textContent = employed;
            document.getElementById('unemployedCount').textContent = unemployed;
            document.getElementById('employmentRate').textContent = Math.round((employed / alumni.length) * 100) + '%';

            const tbody = document.getElementById('alumniTableBody');
            tbody.innerHTML = '';
            alumni.forEach((a, idx) => {
                const tr = document.createElement('tr');
                tr.innerHTML = `
                    <td>${idx + 1}</td>
                    <td>${a.name}</td>
                    <td>${a.year}</td>
                    <td>${a.employed}</td>
                    <td>${a.position}</td>
                    <td>${a.company}</td>
                `;
                tbody.appendChild(tr);
            });

            document.getElementById('alumniLoading').style.display = 'none';
            document.getElementById('alumniTable').style.display = '';
        });
}

// Call this function when the page loads or when the Alumni tab is shown
document.addEventListener('DOMContentLoaded', loadAlumniData);

// Filter alumni by year and employment status
function filterAlumni() {
    const year = document.getElementById('yearFilter').value;
    const employment = document.getElementById('employmentFilter').value;
    alumniFilteredData = alumniRawData.filter(a => {
        let match = true;
        if (year) match = match && a['YEAR GRADUATED'] === year;
        if (employment) {
            const employed = a['ARE YOU CURRENTLY EMPLOYED?'] && a['ARE YOU CURRENTLY EMPLOYED?'].toLowerCase().startsWith('y');
            match = match && ((employment === 'Yes' && employed) || (employment === 'No' && !employed));
        }
        return match;
    });
    displayAlumniData(alumniFilteredData);
}

// PHP Integration Functions (to be implemented on server-side)
        function connectDatabase() {
            // This would be implemented in PHP
            const php = `
            <?php
            $servername = "localhost";
            $username = "root";
            $password = "";
            $dbname = "alumni_tracer_study";

            try {
                $pdo = new PDO("mysql:host=$servername;dbname=$dbname", $username, $password);
                $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
                return $pdo;
            } catch(PDOException $e) {
                die("Connection failed: " . $e->getMessage());
            }
            ?>
            `;
        }

        function fetchDashboardStats() {
            // This would be an AJAX call to a PHP endpoint
            const phpEndpoint = `
            <?php
            include 'db_connection.php';
            
            // Get total alumni count
            $stmt = $pdo->query("SELECT COUNT(*) as total FROM alumni");
            $totalAlumni = $stmt->fetch()['total'];
            
            // Get employment statistics
            $stmt = $pdo->query("SELECT currently_employed, COUNT(*) as count FROM alumni GROUP BY currently_employed");
            $employmentStats = $stmt->fetchAll(PDO::FETCH_ASSOC);
            
            // Get average employment time
            $stmt = $pdo->query("SELECT AVG(months_waited_for_employment) as avg_time FROM alumni WHERE currently_employed = 'Yes'");
            $avgEmploymentTime = $stmt->fetch()['avg_time'];
            
            // Get financial improvement factors
            $stmt = $pdo->query("
                SELECT fif.factor_name, COUNT(aiff.alumni_id) as count 
                FROM financial_improvement_factors fif
                LEFT JOIN alumni_financial_improvement_factors aiff ON fif.id = aiff.factor_id
                GROUP BY fif.id, fif.factor_name
                ORDER BY count DESC
            ");
            $financialFactors = $stmt->fetchAll(PDO::FETCH_ASSOC);
            
            // Return JSON response
            echo json_encode([
                'total_alumni' => $totalAlumni,
                'employment_stats' => $employmentStats,
                'avg_employment_time' => round($avgEmploymentTime, 1),
                'financial_factors' => $financialFactors
            ]);
            ?>
            `;
        }