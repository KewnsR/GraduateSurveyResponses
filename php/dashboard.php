<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Alumni Tracer Study Dashboard</title>
    <link rel="stylesheet" href="../dashboard.css">
    <script src="https://cdnjs.cloudflare.com/ajax/libs/Chart.js/3.9.1/chart.min.js"></script>
    <script src="../dashboard.js"></script>

</head>
<body>
    <div class="dashboard-container">
        <div class="header">
            <h1>Alumni Tracer Study Dashboard</h1>
            <p>Comprehensive analysis of graduate employment and outcomes (56 Respondents)</p>
        </div>

        <!-- Statistics Cards -->
        <div class="stats-grid">
            <div class="stat-card">
                <div class="stat-number total-alumni" id="totalAlumni">-</div>
                <div class="stat-label">Total Respondents</div>
            </div>
            <div class="stat-card">
                <div class="stat-number employment-rate" id="employmentRate">-</div>
                <div class="stat-label">Employment Rate</div>
            </div>
            <div class="stat-card">
                <div class="stat-number avg-employment" id="avgEmployment">-</div>
                <div class="stat-label">Avg. Months to Employment</div>
            </div>
            <div class="stat-card">
                <div class="stat-number recent-graduates" id="recentGraduates">-</div>
                <div class="stat-label">Recent Graduates (2024)</div>
            </div>
        </div>

        <!-- Charts -->
        <div class="charts-container">
            <div class="chart-card">
                <h3 class="chart-title">Employment Status Distribution</h3>
                <canvas id="employmentChart"></canvas>
            </div>
            <div class="chart-card">
                <h3 class="chart-title">Graduates by Year</h3>
                <canvas id="graduatesChart"></canvas>
            </div>
        </div>

        <!-- Tabs Navigation -->
        <div class="tabs">
            <button class="tab-button active" onclick="showTab('overview', event)">Overview</button>
            <button class="tab-button" onclick="showTab('alumni', event)">Alumni Records</button>
            <button class="tab-button" onclick="showTab('employment', event)">Employment Data</button>
            <button class="tab-button" onclick="showTab('analytics', event)">Analytics</button>
        </div>

        <!-- Tab Contents -->
        <div id="overview-tab" class="tab-content active">
            <h2>Dashboard Overview</h2>
            <p>Welcome to the Alumni Tracer Study Dashboard. This system tracks the employment outcomes and career progression of 56 program graduates who responded to the survey.</p>
            
            <div style="margin-top: 30px;">
                <h3>Key Metrics</h3>
                <div class="stats-grid" style="margin-top: 20px;">
                    <div class="stat-card">
                        <div class="stat-number" style="color: #059669;" id="employedCount">-</div>
                        <div class="stat-label">Currently Employed</div>
                    </div>
                    <div class="stat-card">
                        <div class="stat-number" style="color: #dc2626;" id="unemployedCount">-</div>
                        <div class="stat-label">Seeking Employment</div>
                    </div>
                </div>
            </div>
        </div>

        <div id="alumni-tab" class="tab-content">
            <h2>Alumni Records</h2>
            <div class="filter-section">
                <div class="filter-group">
                    <label>Graduation Year</label>
                    <select id="yearFilter">
                        <option value="">All Years</option>
                    </select>
                </div>
                <div class="filter-group">
                    <label>Employment Status</label>
                    <select id="employmentFilter">
                        <option value="">All Statuses</option>
                        <option value="Yes">Employed</option>
                        <option value="No">Unemployed</option>
                    </select>
                </div>
                <button class="btn btn-primary" onclick="filterAlumni()">Apply Filters</button>
            </div>
            <div class="loading" id="alumniLoading">Loading alumni data...</div>
            <table class="data-table" id="alumniTable" style="display: none;">
                <thead>
                    <tr>
                        <th>No.</th>
                        <th>Name</th>
                        <th>Year Graduated</th>
                        <th>Employment Status</th>
                        <th>Position</th>
                        <th>Company</th>
                    </tr>
                </thead>
                <tbody id="alumniTableBody">
                </tbody>
            </table>
        </div>

        <div id="employment-tab" class="tab-content">
            <h2>Employment Analysis</h2>
            <div class="charts-container">
                <div class="chart-card">
                    <h3 class="chart-title">Employment by Industry</h3>
                    <canvas id="industryChart"></canvas>
                </div>
                <div class="chart-card">
                    <h3 class="chart-title">Time to Employment</h3>
                    <canvas id="timeToEmploymentChart"></canvas>
                </div>
            </div>
            <div class="chart-card" style="margin-top: 30px;">
                <h3 class="chart-title">Financial Improvement Factors</h3>
                <div style="width:100%;">
                    <canvas id="financialFactorsChart"></canvas>
                    <div id="financialFactorsTableContainer"></div>
                </div>
            </div>
        </div>

        <div id="analytics-tab" class="tab-content">
            <h2>Advanced Analytics</h2>
            <div class="chart-card">
                <h3 class="chart-title">Skills Proficiency vs Usage</h3>
                <canvas id="skillsChart"></canvas>
            </div>
        </div>
    </div>
</body>
</html>