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

## 📁 Project Structure

```
GraduateSurveyResponses/
├── public/
│   └── data/                    # CSV data files
├── src/
│   ├── components/
│   │   ├── Header.jsx          # Dashboard header with metrics
│   │   ├── Sidebar.jsx         # Navigation sidebar
│   │   ├── Login.jsx           # Authentication screen
│   │   ├── LogoutModal.jsx     # Logout confirmation
│   │   └── KPICards.jsx        # Key metrics display
│   ├── pages/
│   │   ├── Overview.jsx        # Main dashboard page
│   │   ├── AlumniRecords.jsx   # Alumni directory with search/filter
│   │   ├── Employment.jsx      # Employment analytics & charts
│   │   └── Analytics.jsx       # Advanced analytics
│   ├── services/
│   │   └── dataService.js      # CSV data processing & analytics
│   ├── App.jsx                 # Main app component
│   ├── main.jsx               # React entry point
│   └── index.css              # Global styles
├── index.html                  # HTML entry point
├── vite.config.js             # Vite configuration
├── tailwind.config.js         # Tailwind configuration
└── package.json               # Dependencies

```

## 🔑 Features

### Authentication & Access Control
- **Admin Access**: Password-protected (password: `alumni2024`)
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

### Installation

1. Clone the repository:
```bash
git clone https://github.com/KewnsR/GraduateSurveyResponses.git
cd GraduateSurveyResponses
```

2. Install dependencies:
```bash
npm install
```

3. Start development server:
```bash
npm run dev
```

4. Open browser to `http://localhost:5173`

### Build for Production

```bash
npm run build
```

The production build will be in the `dist/` folder.

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

## 🔐 Authentication

### Login Credentials
- **Admin Password**: `alumni2024`
- **Viewer Access**: Click "Continue as Viewer" (no password)

### Session Persistence
- Uses `localStorage` to maintain login state
- Session persists across page refreshes
- Clear browser data to reset session

## 🎨 UI/UX Features

- Modern gradient backgrounds
- Glassmorphism effects with backdrop blur
- Smooth animations and transitions
- Responsive design (mobile-friendly)
- Role badge indicators
- Interactive hover states
- Clean typography with Inter font

## 📈 Analytics Methods

### Available Metrics
- Total alumni count
- Employment rate percentage
- Average time to employment
- Recent graduates (2024)
- Industry distribution
- Gender demographics
- Age group analysis
- Civil status breakdown
- Socioeconomic mobility
- LET passer statistics
- Organization type distribution

## 🚀 Deployment

### Vercel Deployment
The project is configured for Vercel deployment:

1. Push changes to GitHub
2. Vercel automatically builds and deploys
3. CSV data served from `public/data/` directory

**Important**: The `public/` folder is required for Vite to include static assets in production builds.

## ⚙️ Configuration

### Tailwind CSS
- Version: 3.4.16 (PostCSS compatible)
- Custom color scheme with indigo/purple gradients
- Extended shadow utilities

### Vite
- React plugin enabled
- Development server on port 5173
- Production builds optimized with code splitting

## 🐛 Troubleshooting

### Common Issues

**No data showing in charts:**
- Verify CSV file exists in `public/data/`
- Check browser console for parsing errors
- Ensure CSV headers match expected format

**Build errors on Vercel:**
- Confirm `public/data/` folder structure
- Check that CSV file is committed to git
- Review build logs for specific errors

**@apply errors in CSS:**
- Ensure no `group` utility in @apply directives
- Verify Tailwind version compatibility
- Check PostCSS configuration

**Import order warnings:**
- Place `@import` statements before `@tailwind` directives

## 📝 Development Notes

### Code Quality
- React hooks for state management
- Modular component architecture
- Reusable data service layer
- Consistent naming conventions

### Performance
- Lazy data loading with useEffect
- Memoized calculations where applicable
- Optimized Chart.js rendering
- Efficient CSV parsing

## 🔒 Security Considerations

⚠️ **Important**: Current implementation is for demonstration purposes only.

- Password is hardcoded (not secure for production)
- All data accessible in browser
- No backend authentication
- Session stored in localStorage

**For Production Use:**
- Implement proper authentication backend
- Use environment variables for secrets
- Add API authentication
- Enable HTTPS
- Implement rate limiting
- Add data encryption

## 📄 License

ISC License

## 👥 Contributors

- KewnsR - Initial work and ongoing development

## 🔗 Links

- **Repository**: https://github.com/KewnsR/GraduateSurveyResponses
- **Live Demo**: [Vercel Deployment URL]
- **Issues**: https://github.com/KewnsR/GraduateSurveyResponses/issues

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
