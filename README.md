# Alumni Tracker - Analytics Platform

A modern React-based dashboard for visualizing graduate employment survey data from the Bachelor of Secondary Education Major in Mathematics program (Academic Year 2024). Features interactive charts, role-based access control, and comprehensive employment analytics.

## 🚀 Tech Stack

- **Frontend Framework**: React 19.2.3
- **Build Tool**: Vite 7.3.1
- **Styling**: Tailwind CSS 3.4.16
- **Charts**: Chart.js 4.5.1 + react-chartjs-2
- **Icons**: Lucide React 0.562.0
- **CSV Parsing**: PapaParse 5.5.3
- **Deployment**: Vercel

## 🔑 Features

### Authentication & Access Control
- **Admin Access**: Password-protected
  - Full access to all data including personal information
  - View contact details, addresses, and employment specifics
- **Viewer Access**: Guest mode (no password required)
  - Limited access to aggregated statistics
  - Personal information hidden for privacy

### Dashboard Pages

1. **Overview**
   - Key performance indicators (KPIs)
   - Employment rate statistics
   - Graduates by year breakdown
   - Top employment industries

2. **Alumni Records**
   - Searchable directory of 54 alumni
   - Filter by year, employment status, gender, organization type
   - Admin: Full contact information displayed
   - Viewer: Personal details hidden

3. **Employment Analytics**
   - Employment by industry (bar chart)
   - Time to employment distribution (doughnut chart)
   - Gender, age, and civil status demographics
   - Socioeconomic mobility analysis
   - Unemployment reasons breakdown

4. **Analytics**
   - Organization types distribution
   - Awards and achievements
   - LET passer statistics
   - Program success metrics

## 🛠️ Local Development

### Prerequisites
- Node.js 16+ and npm
- Modern web browser


## 📊 Data Source

The dashboard uses CSV data located in `public/data/`:
- **File**: `Employability Status of Bachelor of Secondary Education Major in Mathematics Graduates for the Academic Year 2024 (Responses).csv`
- **Records**: 54 alumni responses
- **Fields**: 100+ columns including employment status, demographics, skills assessment, and feedback

### Data Processing
The `dataService.js` handles:
- CSV parsing with PapaParse
- Data normalization and cleaning
- Statistical calculations
- Chart data preparation
- Dynamic column name matching (handles trailing spaces in headers)

## ⚙️ Configuration

### Tailwind CSS
- Version: 3.4.16 (PostCSS compatible)
- Custom color scheme with indigo/purple gradients
- Extended shadow utilities

### Vite
- React plugin enabled
- Development server on port 5173
- Production builds optimized with code splitting

## 📄 License

ISC License

## 👥 Contributors

- KewnsR - Initial work and ongoing development

To enable editing:
1. Set up MySQL database as described above.
2. Run `php/php setup_db.php` to import data.
3. Access `php/dashboard.php` — researchers can now edit records directly in the UI.

This allows ongoing data management without modifying CSV files manually.

## Developer notes
- Primary charting uses Chart.js (v3.x). PapaParse is used for CSV parsing but `dashboard.js` includes a fallback `fetch` parser if PapaParse is unavailable.
- The code takes care to trim header keys and row values to reduce errors from stray whitespace in the CSV.

## Example: switching from CSV to `php/get_data.php`
1. Upload CSV to `data/` (same path as before).
2. Update the client to fetch `php/get_data.php` instead of the CSV (or let `dashboard.js` continue using PapaParse; both work).
3. If you prefer JSON, call: `http://localhost/GraduateSurveyResponses/php/get_data.php`.

## License
MIT — see the repository LICENSE or include one if you plan to distribute.

## Contact
If you need help or want enhancements, open an issue or create a pull request in the repository.

---

Thank you — this dashboard is intended as a lightweight tool to help visualize graduate outcomes and support data-driven decisions in program improvement.
