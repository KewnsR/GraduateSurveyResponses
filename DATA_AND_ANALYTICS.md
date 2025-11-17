# Data & Analytics — Dashboard Reference

This document explains the dashboard's data model, the analytics shown on each dashboard chart and card, how each metric is computed from the CSV, and interpretation guidance. Use this as the authoritative reference when adding data, debugging charts, or migrating to a server-side API.

## Overview
- Source: CSV located in `data/` (file name long; check `dashboard.js` `csvFileName`).
- Parsing: PapaParse (client) or `php/get_data.php` (server) — both yield a row array with header keys equal to CSV column names (trimmed).
- Normalization: `dashboard.js` trims headers and cell values before using them.

## Key dashboard metrics (cards)

1. Total Respondents (Total alumni)
   - Source: Count of parsed rows
   - Formula: total = number of rows in parsed CSV
   - Notes: Rows that are fully empty may still be counted by PapaParse; confirm row has at least one non-empty cell if you need to exclude blanks.

2. Employment Rate
   - Source: CSV column: `ARE YOU CURRENTLY EMPLOYED?`
   - Formula: employment_rate = round((employed_count / total) * 100) + "%"
   - Employed count: rows where column equals `Yes` (trimmed, case-sensitive in current code). Adjust normalization if CSV uses different casing or values.

3. Average Months to Employment
   - Source: CSV column: `HOW MANY MONTHS DID YOU WAIT BEFORE OBTAINING YOUR FIRST EMPLOYMENT AFTER GRADUATION?`
   - Mapped buckets in `dashboard.js`:
     - `Less than 3 months` => 1
     - `3-6 months` => 4.5
     - `7-12 months` => 9.5
     - `More than 12 months` => 15
   - Formula: avg = mean of numeric values for respondents with non-zero mapping; displayed with one decimal place and `months` unit.
   - Caveat: Bucket mappings are heuristics; change mapping to median or exact months if raw numeric months are available.

4. Recent Graduates (e.g., 2024)
   - Source: CSV column: `YEAR GRADUATED`
   - Formula: count rows where `YEAR GRADUATED` equals target (e.g., `2024`).


## Charts and analytics

Each chart lists the CSV columns used, the computation, and notes.

1) Employment Status Distribution (doughnut)
   - Columns: `ARE YOU CURRENTLY EMPLOYED?`
   - Data: [employed_count, unemployed_count]
   - Labels: `Employed`, `Unemployed`
   - Notes: Used for the single-number Employment Rate and small multiple comparisons.

2) Graduates by Year (bar)
   - Columns: `YEAR GRADUATED`
   - Data: counts per unique year value. Sorted ascending by year in charts.
   - Use: trend of graduating cohort sizes; helps detect sampling bias across years.

3) Employment by Industry (pie)
   - Columns: `WHAT NATURE OF BUSINESS DOES YOUR COMPANY ENGAGE IN?` (field name used in `dashboard.js`)
   - Filter: only counts employed respondents (rows where `ARE YOU CURRENTLY EMPLOYED?` === `Yes`).
   - Data: aggregated counts grouped by industry string. Consider normalizing synonyms (e.g., `Education` vs `Education and Training`).

4) Time to Employment (bar)
   - Columns: `HOW MANY MONTHS DID YOU WAIT BEFORE OBTAINING YOUR FIRST EMPLOYMENT AFTER GRADUATION?`
   - Data: count per bucket string (labels are bucket strings). Use same bucket-to-number mapping if you need numeric analysis.

5) Demographic Breakdown (age, gender, civil status)
   - Age Chart:
     - Column: `AGE`
     - Current approach: counts each distinct age value. For grouped analysis, convert to ranges (e.g., `<25`, `25-29`, `30+`).
   - Gender Chart:
     - Column: `SEX`
     - Data: counts per unique value; unknown/empty grouped as `Unknown`.
   - Civil Status Chart:
     - Column: `CIVIL STATUS`
     - Data: counts per unique value.

6) Socio-Economic Mobility (before vs after) (bar)
   - Columns: `SOCIO-ECONOMIC STATUS (Before Employment)`, `SOCIO-ECONOMIC STATUS (After Employment)`
   - Data: two datasets (Before, After). `After` is computed only for employed respondents.
   - Notes: Ensure categories align (same labels) before plotting; use union of labels for x-axis.

7) Licensure Exam Outcomes (pie)
   - Column(s): `ELIGIBILITY` or `LET PASSER / ELIGIBILITY` depending on CSV
   - Logic: a basic text check — if cell includes `passer` or `yes` (case-insensitive) it increments `Passed`; otherwise `Did Not Pass`.
   - Recommendation: map specific standard responses to `Passed`/`Not Passed` explicitly in a preprocessing step to avoid false negatives.

8) Reasons for Unemployment (bar)
   - Column: `PLEASE STATE YOUR REASON WHY YOU ARE NOT EMPLOYED (Check all that apply)`
   - Data: for rows with `ARE YOU CURRENTLY EMPLOYED?` === `No`, split the reasons by comma and aggregate counts per reason.
   - Note: free-text or combined entries require normalization (e.g., synonyms, trimming).

9) Awards and Achievements (bar)
   - Column: `AWARDS RECEIVED`
   - Data: count distinct award descriptions; rows with `None` counted as `None` (so chart shows proportion with awards vs none).

10) Skills Proficiency vs Usage (radar)
    - Proficiency columns (examples):
      - `How would you rate your proficiency in the following skills upon graduating? [Communication Skills]`
      - `... [Information and Computer Technology Skills]`
      - `... [Problem-Solving and Critical Thinking Skills]`
      - `... [Teaching and Lesson Planning Skills]`
      - `... [Research and Ethical Skills]`
      - `... [Time Management and Leadership Skills]`
    - Usage columns (examples):
      - `How often do you use the following skills in your current job? [Communication Skills]`
      - (same pattern for other skills)
    - Mapping: proficiency mapped to numeric scale:
      - `Very Good (4)` => 4
      - `Good (3)` => 3
      - `Fair (2)` => 2
      - `Poor (1)` => 1
    - Usage mapping:
      - `Often (4)` => 4
      - `Sometimes (3)` => 3
      - `Rarely (2)` => 2
      - `Never (1)` => 1
    - Data: per-skill average score across respondents (proficiency uses all respondents where value exists; usage averages only employed respondents).
    - Visualization: Radar with two datasets (Proficiency, Usage). Scale can be 1..4 (chart code sets max to 5 in case of future higher scales).

11) Skill Proficiency Distribution (stacked bar)
    - Columns: same proficiency columns as radar
    - Data: for each skill, counts of responses per level (`Very Good (4)`, `Good (3)`, `Fair (2)`, `Poor (1)`). This produces a stacked view across skills.

12) Most Used Skills in Current Jobs (stacked bar)
    - Columns: same usage columns as radar
    - Data: for employed respondents only — counts for `Often`, `Sometimes`, `Rarely`, `Never` per skill.


## Column mapping (common CSV header names used in code)
Below are the exact header names referenced in `dashboard.js`. If your CSV headers differ, update `dashboard.js` or pre-process CSV headers to match.

- `ARE YOU CURRENTLY EMPLOYED?`
- `YEAR GRADUATED`
- `HOW MANY MONTHS DID YOU WAIT BEFORE OBTAINING YOUR FIRST EMPLOYMENT AFTER GRADUATION?`
- `WHAT NATURE OF BUSINESS DOES YOUR COMPANY ENGAGE IN?`
- `AGE`
- `SEX`
- `CIVIL STATUS`
- `SOCIO-ECONOMIC STATUS (Before Employment)`
- `SOCIO-ECONOMIC STATUS (After Employment)`
- `ELIGIBILITY` (or `LET PASSER / ELIGIBILITY`)
- `PLEASE STATE YOUR REASON WHY YOU ARE NOT EMPLOYED (Check all that apply)`
- `AWARDS RECEIVED`
- Skills proficiency columns (examples):
  - `How would you rate your proficiency in the following skills upon graduating? [Communication Skills]`
  - `How would you rate your proficiency in the following skills upon graduating? [Information and Computer Technology Skills]`
  - (and others as used in `dashboard.js`)
- Skills usage columns (examples):
  - `How often do you use the following skills in your current job? [Communication Skills]`
  - `How often do you use the following skills in your current job? [Information and Computer Technology Skills]`
  - (and others)

If your CSV contains trailing spaces in header names, the code trims them; nonetheless, exact names help readability and reduce mapping bugs.

## Data quality checks (recommended preprocessing)
- Trim header names and all cells.
- Normalize values for common categorical columns (e.g., `Yes`/`No` for employment; unify `Male`/`M` and `Female`/`F`).
- Normalize industry names (mapping synonyms to canonical labels).
- Ensure skill question headers match exactly; if not, build a mapping table in code.
- Validate required columns exist; fail early with a readable error if a required column is missing.

## Reproducing metrics programmatically
If you move analytics to a server, follow these steps for each metric:
1. Read CSV or DB rows.
2. Normalize columns (trim, lowercase if needed, map synonyms).
3. Compute counts and aggregates (GROUP BY SQL or map/reduce on server language).
4. Return JSON shape compatible with Chart.js datasets.

Example JSON for Graduates by Year:
{
  "labels": ["2022", "2023", "2024"],
  "data": [12, 22, 20]
}

Example JSON for Skills Radar:
{
  "labels": ["Communication", "ICT", "Problem Solving", "Teaching", "Research", "Leadership"],
  "datasets": [
    { "label": "Proficiency", "data": [3.4, 2.8, 3.1, 3.6, 2.9, 3.0] },
    { "label": "Usage", "data": [3.2, 2.5, 2.8, 3.4, 2.6, 2.9] }
  ]
}

## Interpretation guidance
- Employment Rate: a snapshot of current employment among respondents; not a population employment rate.
- Average months: influenced by bucket mapping — consider reporting median and distribution for skewed data.
- Industry and Demographics: small sample sizes for rare categories may produce noisy percentages; show raw counts alongside percentages.
- Skills chart: compare proficiency vs usage to spot skills underutilized in the workplace or skills gaps needing curriculum adjustments.

## Quick checklist for adding new analytics
1. Confirm CSV contains the fields needed or add logic to compute them.
2. Normalize/clean values and map to numeric scales if needed.
3. Compute aggregates on the server or client depending on dataset size.
4. Create Chart.js dataset(s) and render with sensible color palette and legend.
5. Add tooltip text explaining interpretation for non-expert users.

## Notes and next steps
- For large datasets, move parsing off the client and implement server-side endpoints that return paginated data and aggregated metrics.
- Add a small CSV validator or migration tool to unify header names and canonical category values (I can add this if you want).

---

File created to document analytics and data mapping for the dashboard. If you want, I can:
- Add a `csv_validator.php` or `csv_validator.js` to validate headers and report rows with missing required fields, or
- Implement a server endpoint that returns aggregated metrics (JSON) to reduce client compute and enable pagination.
