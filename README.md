<!--
   README.md - GraduateSurveyResponses
   Updated: comprehensive system documentation
   Purpose: describe architecture, setup, usage, file map, configuration and troubleshooting
-->

# Alumni Tracer Study — Dashboard

This repository contains a small web dashboard that visualizes survey responses from graduates of the
Bachelor of Secondary Education — Major in Mathematics (Academic Year 2024). The dashboard supports
interactive charts, a searchable alumni directory, and client-side analytics driven by a CSV data source.

This README explains how the system is organized, how data flows through the app, how to run it locally,
and notes on configuration and common troubleshooting steps.

## Quick summary
- Frontend: `index.html`, `dashboard.css`, `dashboard.js` — UI + charts (Chart.js) + CSV parsing (PapaParse)
- Data: CSV in `data/` — the canonical dataset used by the dashboard
- Optional PHP endpoint: `php/get_data.php` — returns the CSV as JSON (useful when you want a simple API)
- DB helper: `php/db.php` contains a PDO connection string (project currently reads CSV; DB is optional)

Open `index.html` in a browser (or serve the folder via a local web server) to view the dashboard.

## Contract (what this system expects / produces)
- Inputs: a CSV file located at `data/Employability Status of Bachelor of Secondary Education Major in Mathematics Graduates for the Academic Year 2024 (Responses).csv` (headers-first row). Alternatively, the `php/get_data.php` endpoint serves the same CSV as JSON.
- Outputs: interactive charts and a searchable alumni records UI rendered in the browser.
- Error modes: if the CSV is missing or malformed the app falls back to a small sample dataset embedded in `dashboard.js` and will log errors to the console.

## File map and responsibilities
- `index.html` — main, static front-end page (login modal + dashboard UI). References `dashboard.css` and `dashboard.js`.
- `dashboard.css` — styling for the dashboard, modals, cards, and charts.
- `dashboard.js` — main client-side logic:
   - Loads CSV using PapaParse (or `fetch` fallback).
   - Parses and normalizes headers/rows.
   - Computes summary metrics (total respondents, employment rate, avg months to employment).
   - Renders Chart.js charts for employment, industries, demographics, skills, etc.
   - Implements alumni listing, filters, and modal detail views.
   - Includes a simple client-side password check (hard-coded string) that toggles UI visibility.
- `data/` — contains the CSV dataset. Default file name:
   `Employability Status of Bachelor of Secondary Education Major in Mathematics Graduates for the Academic Year 2024 (Responses).csv`
- `php/get_data.php` — lightweight endpoint that reads the CSV and returns JSON. Useful if you want the browser to fetch JSON rather than parse CSV directly.
- `php/db.php` — PDO connection to a MySQL database; used only if you later migrate data into a DB. Current codebase uses CSV primarily.
- `php/dashboard.php` — an alternate PHP-served HTML view; mirrors the static `index.html` but with paths adjusted for the `php/` folder.

## How data flows (CSV -> UI)
1. The browser loads `index.html` and `dashboard.js`.
2. `dashboard.js` determines the correct CSV path and uses PapaParse to download and parse the CSV.
3. Parsed rows are normalized (header trimming) and stored in `globalCSVData` and `alumniRawData`.
4. Summary stats and charts are calculated client-side and rendered with Chart.js.
5. `php/get_data.php` can be used if you prefer the client to fetch `/php/get_data.php` and receive JSON (the endpoint simply converts the CSV to JSON).

## Prerequisites & how to run locally (Windows / XAMPP)
1. Install XAMPP (or any local web server that can serve PHP and static files).
2. Copy the repository folder to your web server document root (for XAMPP this is typically `C:\xampp\htdocs\`).
   Example path in this project: `C:\xampp\htdocs\GraduateSurveyResponses`.
3. Start Apache (and MySQL if you plan to use `php/db.php`) via the XAMPP Control Panel.
4. For editable version:
   - Run `php setup_db.php` in the `php/` folder to create the database table and import CSV data.
   - Open the dashboard in a browser: http://localhost/GraduateSurveyResponses/php/dashboard.php
5. For static version (read-only): http://localhost/GraduateSurveyResponses/index.html

Notes:
- The editable version uses MySQL to store and edit data.
- Ensure PDO MySQL driver is enabled in php.ini.## Configuration & small but important settings
- CSV filename/path: The client JS expects the CSV filename assigned to `csvFileName` in `dashboard.js`. If you rename the CSV, update that variable or place the file with the same name in `data/`.
- PHP CSV endpoint path: `php/get_data.php` reads `../data/<csvname>` relative to `php/`. If you move files, update the path.
- Client password: `dashboard.js` contains a hard-coded password `alumni2024` used by the modal to show/hide the dashboard. This is convenient but insecure for production — see Security notes below.
- DB connection: `php/db.php` uses the following defaults:
   - host: `localhost`
   - username: `root`
   - password: `` (empty)
   - dbname: `alumni_tracer_study`

If you migrate the CSV into a database, update `db.php` with the appropriate credentials and update the server-side code to query the DB instead of reading the CSV.

## Troubleshooting
- CSV not found / charts empty:
   - Confirm the CSV is present in the `data/` folder and that the filename exactly matches the string in `dashboard.js` or `php/get_data.php`.
   - Check browser console for PapaParse or fetch errors.
- Cross-origin (CORS) errors when fetching `php/get_data.php` from a different origin:
   - `get_data.php` sets `Access-Control-Allow-Origin: *` by default — this should be fine for local testing. For production tighten the origin policy.
- Charts look wrong / missing data:
   - Verify CSV headers are present and match the expected column names used in `dashboard.js` (the code trims header keys before use).
- Login not working (page still hidden):
   - The password is checked in `dashboard.js` (client-side). Ensure JavaScript is enabled and the exact password `alumni2024` (or your updated password) is entered.

If you encounter unexpected errors, check the browser console (F12) and the Apache / PHP logs.

## Edge cases and limitations
- Single-file CSV: the system expects the entire dataset to be in a single CSV file with consistent headers. Merging files or changing column names will break parsing unless code is updated.
- Large datasets: the client parses CSV in the browser — for large datasets (tens of thousands of rows) this will be slow. Consider moving parsing to the server or using pagination/streaming.
- Security: the app uses client-side password gating and exposes data via JavaScript. Do not expose sensitive personal data in the CSV if the site will be public.

## Security recommendations
- Remove hard-coded passwords from `dashboard.js`. Implement server-side authentication if you need protection.
- Store sensitive data in a database and protect API endpoints with authentication and HTTPS.
- Sanitize CSV content and avoid storing personally-identifiable information in public repositories.

## Editability for Researchers
The system now supports editing alumni records for future researchers. In the PHP version (`php/dashboard.php`), each alumni card has an "Edit" button that opens a modal form to update details. Changes are saved to the MySQL database.

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
