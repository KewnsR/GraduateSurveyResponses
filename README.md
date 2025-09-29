# Alumni Tracer Study Dashboard

## Overview

This project is an interactive web-based dashboard for analyzing the employability and career outcomes of Bachelor of Secondary Education Major in Mathematics graduates from the Academic Year 2024. The dashboard visualizes survey responses from 54 graduates, providing insights into employment rates, industry distribution, skills proficiency, and socio-economic mobility.

## Features

### Dashboard Statistics
- Total respondents count
- Employment rate calculation
- Average months to employment
- Recent graduates (2024) count

### Interactive Charts and Visualizations
- **Employment Status Distribution**: Doughnut chart showing employed vs unemployed
- **Graduates by Year**: Bar chart of graduation years (2022-2024)
- **Employment by Industry**: Pie chart of industry sectors
- **Time to Employment**: Line chart showing employment timeline
- **Demographic Breakdown**: Charts for age groups, gender, and civil status
- **Socio-Economic Mobility**: Bar chart comparing pre and post-employment status
- **Licensure Exam Outcomes**: Pie chart of LET passer rates
- **Reasons for Unemployment**: Bar chart of unemployment factors
- **Awards and Achievements**: Bar chart of received awards
- **Skills Proficiency vs Usage**: Radar chart comparing graduation proficiency and job usage
- **Skill Distribution Charts**: Bar charts for specific skills

### Alumni Records Management
- **Search and Filter**: Filter alumni by name, year, employment status, gender, civil status, and organization type
- **Detailed Records**: View complete alumni information including contact details, employment history, and socio-economic data
- **Modal Details**: Click to view full alumni details in a modal popup

### Responsive Design
- Mobile-friendly interface with adaptive layouts
- Scroll-to-top functionality
- Modern gradient backgrounds and card-based UI

## Technologies Used

- **Frontend**: HTML5, CSS3, JavaScript (ES6+)
- **Data Visualization**: Chart.js library
- **Data Parsing**: PapaParse for CSV processing
- **Styling**: Custom CSS with gradients and animations
- **Icons**: Unicode emojis for visual elements

## Installation and Setup

### Prerequisites
- Web browser (Chrome, Firefox, Safari, Edge)
- Internet connection for CDN libraries (Chart.js, PapaParse)

### Local Development
1. **Clone or Download the Project**
   ```
   Place the project folder in your web server directory or open index.html directly in a browser
   ```

2. **File Structure**
   ```
   GraduateSurveyResponses/
   ├── index.html             # Main dashboard page
   ├── dashboard.js           # JavaScript functionality
   ├── dashboard.css          # Styling
   ├── README.md              # This file
   ├── data/
   │   └── Employability Status of Bachelor of Secondary Education Major in Mathematics Graduates for the Academic Year 2024 (Responses).csv
   └── php/
       ├── dashboard.php      # Legacy PHP version (not used)
       ├── db.php            # Database configuration (not used)
       └── get_data.php      # PHP endpoint for CSV data (not used)
   ```

3. **Access the Dashboard**
   - Open `index.html` in your web browser
   - Or serve the folder with any static web server

### Deployment to GitHub Pages

1. **Push to GitHub**
   - Ensure your repository is public
   - Push the code to the `main` branch

2. **Enable GitHub Pages**
   - Go to your repository settings
   - Scroll to "Pages" section
   - Select "Deploy from a branch"
   - Choose `main` branch and `/ (root)` folder
   - Save

3. **Access Your Deployed Site**
   - GitHub will provide a URL like: `https://[username].github.io/GraduateSurveyResponses/`
   - The dashboard will be live and accessible worldwide

### Alternative Deployment Options
- **Netlify**: Drag and drop the folder to netlify.com
- **Vercel**: Connect your GitHub repo to vercel.com
- **Any static hosting**: Upload the files to any web host that supports static sites

## Usage

### Navigating the Dashboard
1. **Overview Tab**: View key statistics and employment status charts
2. **Alumni Records Tab**: Browse and search through individual graduate records
3. **Employment Data Tab**: Analyze employment patterns, demographics, and socio-economic data
4. **Analytics Tab**: Explore skills proficiency and usage patterns

### Filtering Alumni Records
- Use the search box to find alumni by name, company, or position
- Apply filters for graduation year, employment status, gender, civil status, and organization type
- Click "View Full Details" to see complete information for any alumni

### Viewing Charts
- Charts load automatically when switching to relevant tabs
- Hover over chart elements for detailed information
- All charts are responsive and adapt to different screen sizes

## Data Source

The dashboard analyzes responses from a survey of 56 Bachelor of Secondary Education Major in Mathematics graduates. The CSV file contains comprehensive data including:

- Personal information (name, contact, demographics)
- Employment status and job details
- Educational background and licensure status
- Skills proficiency ratings
- Socio-economic indicators
- Survey responses on program relevance and suggestions

## Key Insights from the Data

- **Employment Rate**: 85% of respondents are currently employed
- **Average Time to Employment**: 2.8 months
- **Primary Industries**: Education (22), Technology (8), Government (7)
- **Skills Usage**: Communication and ICT skills are most frequently used in current jobs
- **Licensure**: Mixed results on LET (Licensure Examination for Teachers) passing rates

## Contributing

To contribute to this project:

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

### Potential Improvements
- Implement database storage for better performance
- Add user authentication for data management
- Include export functionality for charts and reports
- Add more advanced analytics and predictive modeling
- Implement real-time data updates

## License

This project is open-source and available under the MIT License.

## Contact

For questions or support, please contact the project maintainer.

---

**Note**: This dashboard provides valuable insights for educational institutions to improve their programs and better prepare graduates for the workforce. The data visualization helps identify trends in employability, skills gaps, and career progression in the field of mathematics education.