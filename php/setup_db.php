<?php
// Connect without DB first
$servername = "localhost";
$username = "root";
$password = "";

try {
    $pdo = new PDO("mysql:host=$servername", $username, $password);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    
    // Create database if not exists
    $pdo->exec("CREATE DATABASE IF NOT EXISTS alumni_tracer_study");
    $pdo->exec("USE alumni_tracer_study");
} catch(PDOException $e) {
    die("Connection failed: " . $e->getMessage());
}

// Create table if not exists - comprehensive schema with all CSV fields
$sql = "CREATE TABLE IF NOT EXISTS alumni (
    id INT AUTO_INCREMENT PRIMARY KEY,
    timestamp VARCHAR(255),
    email_timestamp VARCHAR(255),
    name VARCHAR(200),
    contact_no VARCHAR(50),
    facebook_link TEXT,
    email VARCHAR(100),
    home_address TEXT,
    sex VARCHAR(50),
    age VARCHAR(50),
    civil_status VARCHAR(50),
    socio_before VARCHAR(100),
    socio_after VARCHAR(100),
    year_graduated VARCHAR(20),
    awards TEXT,
    highest_edu VARCHAR(100),
    eligibility VARCHAR(100),
    employed VARCHAR(10),
    months_to_employment VARCHAR(100),
    position VARCHAR(200),
    company VARCHAR(200),
    company_address TEXT,
    employment_status VARCHAR(100),
    place_of_work VARCHAR(100),
    org_type VARCHAR(100),
    means_of_job_search TEXT,
    industry VARCHAR(100),
    length_of_service VARCHAR(100),
    reasons_for_staying TEXT,
    rqa_applied VARCHAR(100),
    rqa_no_reasons TEXT,
    rqa_passed VARCHAR(100),
    rqa_failed_criteria TEXT,
    unemployment_reason TEXT,
    family_members VARCHAR(20),
    birth_order VARCHAR(100),
    dwelling_type VARCHAR(100),
    residence_length VARCHAR(100),
    family_type VARCHAR(100),
    employment_improved_family VARCHAR(20),
    improvement_factors TEXT,
    no_improvement_factors TEXT,
    -- School relevance factors
    relevance_curriculum VARCHAR(50),
    relevance_general VARCHAR(50),
    relevance_core VARCHAR(50),
    relevance_specialization VARCHAR(50),
    relevance_research VARCHAR(50),
    relevance_extension VARCHAR(50),
    relevance_services VARCHAR(50),
    relevance_facilities VARCHAR(50),
    relevance_environment VARCHAR(50),
    -- Skill proficiency ratings
    comm_prof VARCHAR(50),
    human_rel_prof VARCHAR(50),
    ict_prof VARCHAR(50),
    audio_vis_prof VARCHAR(50),
    prob_solve_prof VARCHAR(50),
    comp_anal_prof VARCHAR(50),
    teaching_prof VARCHAR(50),
    leadership_prof VARCHAR(50),
    research_prof VARCHAR(50),
    test_const_prof VARCHAR(50),
    creativity_prof VARCHAR(50),
    -- Skill usage ratings
    comm_usage VARCHAR(50),
    human_rel_usage VARCHAR(50),
    ict_usage VARCHAR(50),
    audio_vis_usage VARCHAR(50),
    prob_solve_usage VARCHAR(50),
    comp_anal_usage VARCHAR(50),
    teaching_usage VARCHAR(50),
    leadership_usage VARCHAR(50),
    research_usage VARCHAR(50),
    test_const_usage VARCHAR(50),
    creativity_usage VARCHAR(50),
    -- Values and feedback stored as TEXT to reduce row size
    values_data TEXT,
    feedback_data TEXT
)";

try {
    $pdo->exec($sql);
    echo "Table created successfully.\n";
} catch(PDOException $e) {
    echo "Error creating table: " . $e->getMessage() . "\n";
}

// Import CSV
$csvFile = '../data/Employability Status of Bachelor of Secondary Education Major in Mathematics Graduates for the Academic Year 2024 (Responses).csv';

if (!file_exists($csvFile)) {
    die("CSV file not found.\n");
}

$handle = fopen($csvFile, 'r');
$headers = fgetcsv($handle);
// DON'T trim headers - column map uses exact headers with trailing spaces

// Create index map - map DB columns to CSV column index
$headerIndex = [];
foreach($headers as $idx => $header) {
    $headerIndex[$header] = $idx;
}

// Debug: check if months key exists
$monthsKey = 'HOW MANY MONTHS DID YOU WAIT BEFORE OBTAINING YOUR FIRST EMPLOYMENT AFTER GRADUATION?  ';
echo "Months key in headerIndex: " . (isset($headerIndex[$monthsKey]) ? 'YES at index ' . $headerIndex[$monthsKey] : 'NO') . "\n";
echo "Months key length: " . strlen($monthsKey) . "\n";
// Show all keys with 'MONTHS' in them
echo "All keys with MONTHS:\n";
foreach($headerIndex as $key => $idx) {
    if(stripos($key, 'MONTHS') !== false) {
        echo "  Index $idx: [$key] (len=" . strlen($key) . ")\n";
    }
}

// Map CSV headers to DB columns - comprehensive mapping
$columnMap = [
    'Timestamp' => 'timestamp',
    'Email Address' => 'email_timestamp',
    'LAST NAME, FIRST NAME, MIDDLE INITIAL (Ex. DELA CRUZ, JUAN A.)' => 'name',
    'CONTACT NO.' => 'contact_no',
    'FACEBOOK LINK' => 'facebook_link',
    'EMAIL ADDRESS' => 'email',
    'HOME ADDRESS' => 'home_address',
    'SEX' => 'sex',
    'AGE' => 'age',
    'CIVIL STATUS' => 'civil_status',
    'YEAR GRADUATED' => 'year_graduated',
    'ARE YOU CURRENTLY EMPLOYED?' => 'employed',
    'CURRENT JOB POSITION/DESIGNATION' => 'position',
    'NAME OF COMPANY/AGENCY/ORGANIZATION' => 'company',
    'TYPE OF ORGANIZATION' => 'org_type',
    'ELIGIBILITY' => 'eligibility',
    'AWARDS RECEIVED' => 'awards',
    'SOCIO-ECONOMIC STATUS (Before Employment)' => 'socio_before',
    'SOCIO-ECONOMIC STATUS (After Employment)' => 'socio_after',
    'HIGHEST EDUCATIONAL ATTAINMENT' => 'highest_edu',
    'HOW MANY MONTHS DID YOU WAIT BEFORE OBTAINING YOUR FIRST EMPLOYMENT AFTER GRADUATION?  ' => 'months_to_employment',
    'ADDRESS OF YOUR COMPANY/AGENCY/ORGANIZATION' => 'company_address',
    'CURRENT EMPLOYMENT STATUS' => 'employment_status',
    'PLACE OF WORK' => 'place_of_work',
    'MEANS OF JOB SEARCH' => 'means_of_job_search',
    'WHAT NATURE OF BUSINESS DOES YOUR COMPANY ENGAGE IN?' => 'industry',
    'LENGTH OF SERVICE' => 'length_of_service',
    'WHAT IS/ARE YOUR REASON(S) FOR STAYING ON THE JOB? (Check all that apply)' => 'reasons_for_staying',
    'HAVE YOU ALREADY APPLIED FOR OR PROCESSED YOUR DEPED (RQA) REGISTRY OF QUALIFIED APPLICANTS?   ' => 'rqa_applied',
    'If ?NO?, please state reasons (check all that applies):  ' => 'rqa_no_reasons',
    'DID YOU PASSED THE RQA?  ' => 'rqa_passed',
    'If ?NO? please state which criteria you have failed to meet? (check all that applies):' => 'rqa_failed_criteria',
    'PLEASE STATE YOUR REASON WHY YOU ARE NOT EMPLOYED (Check all that apply)' => 'unemployment_reason',
    'WHAT IS THE TOTAL NUMBER OF FAMILY MEMBERS IN YOUR HOUSEHOLD?   ' => 'family_members',
    'FAMILY POSITION ? BIRTH ORDER  ' => 'birth_order',
    'WHAT TYPE OF DWELLING DO YOU CURRENTLY RESIDE IN?  ' => 'dwelling_type',
    'HOW LONG HAVE YOU LIVED IN YOUR CURRENT RESIDENCE?  ' => 'residence_length',
    'HOW WOULD YOU DESCRIBE YOUR FAMILY CLUSTER OR TYPE?  ' => 'family_type',
    'DID YOUR EMPLOYMENT AFTER GRADUATION CONTRIBUTE TO IMPROVING YOUR FAMILY\'S FINANCIAL STATUS?  ' => 'employment_improved_family',
    'If "Yes," please check all factors that contributed to improving your family\'s financial status:   ' => 'improvement_factors',
    'If "No," please check all factors that prevented your employment from contributing to your family\'s financial status:  ' => 'no_improvement_factors',
    // School relevance
    'How relevant are the school related factors to your employability? [Curriculum and Instruction]' => 'relevance_curriculum',
    'How relevant are the school related factors to your employability? [General Subjects]' => 'relevance_general',
    'How relevant are the school related factors to your employability? [Core Subjects]' => 'relevance_core',
    'How relevant are the school related factors to your employability? [Specialization/Major Subjects]' => 'relevance_specialization',
    'How relevant are the school related factors to your employability? [Research Subject]' => 'relevance_research',
    'How relevant are the school related factors to your employability? [Community Extension]' => 'relevance_extension',
    'How relevant are the school related factors to your employability? [School Services]' => 'relevance_services',
    'How relevant are the school related factors to your employability? [School Facilities]' => 'relevance_facilities',
    'How relevant are the school related factors to your employability? [Learning Environment]' => 'relevance_environment',
    // Skills proficiency
    'How would you rate your proficiency in the following skills upon graduating? [Communication Skills]' => 'comm_prof',
    'How would you rate your proficiency in the following skills upon graduating? [Human Relations Skills]' => 'human_rel_prof',
    'How would you rate your proficiency in the following skills upon graduating? [Information and Computer Technology Skills]' => 'ict_prof',
    'How would you rate your proficiency in the following skills upon graduating? [Audio-Visual Skills]' => 'audio_vis_prof',
    'How would you rate your proficiency in the following skills upon graduating? [Problem-Solving and Critical Thinking Skills]' => 'prob_solve_prof',
    'How would you rate your proficiency in the following skills upon graduating? [Comprehension and Analytical Skills]' => 'comp_anal_prof',
    'How would you rate your proficiency in the following skills upon graduating? [Teaching and Lesson Planning Skills]' => 'teaching_prof',
    'How would you rate your proficiency in the following skills upon graduating? [Time Management and Leadership Skills]' => 'leadership_prof',
    'How would you rate your proficiency in the following skills upon graduating? [Research and Ethical Skills]' => 'research_prof',
    'How would you rate your proficiency in the following skills upon graduating? [Test Construction and Assessment Skills]' => 'test_const_prof',
    'How would you rate your proficiency in the following skills upon graduating? [Creativity, Innovation, and Adaptability]' => 'creativity_prof',
    // Skills usage
    'How often do you use the following skills in your current job? [Communication Skills]' => 'comm_usage',
    'How often do you use the following skills in your current job? [Human Relations Skills]' => 'human_rel_usage',
    'How often do you use the following skills in your current job? [Information and Computer Technology Skills]' => 'ict_usage',
    'How often do you use the following skills in your current job? [Audio-Visual Skills]' => 'audio_vis_usage',
    'How often do you use the following skills in your current job? [Problem-Solving and Critical Thinking Skills]' => 'prob_solve_usage',
    'How often do you use the following skills in your current job? [Comprehension and Analytical Skills]' => 'comp_anal_usage',
    'How often do you use the following skills in your current job? [Teaching and Lesson Planning Skills]' => 'teaching_usage',
    'How often do you use the following skills in your current job? [Time Management and Leadership Skills]' => 'leadership_usage',
    'How often do you use the following skills in your current job? [Research and Ethical Skills]' => 'research_usage',
    'How often do you use the following skills in your current job? [Test Construction and Assessment Skills]' => 'test_const_usage',
    'How often do you use the following skills in your current job? [Creativity, Innovation, and Adaptability]' => 'creativity_usage'
];

// Note: Values and feedback fields are stored separately as they're not critical for primary display
// They can be added later if needed for detailed analysis

$placeholders = str_repeat('?,', count($columnMap) - 1) . '?';
$insertSql = "INSERT INTO alumni (" . implode(',', array_values($columnMap)) . ") VALUES ($placeholders)";
$stmt = $pdo->prepare($insertSql);

$rowNum = 0;
while (($row = fgetcsv($handle)) !== false) {
    $rowNum++;
    $row = array_map('trim', $row);
    
    // Debug first row
    if($rowNum === 1) {
        $monthsKey = 'HOW MANY MONTHS DID YOU WAIT BEFORE OBTAINING YOUR FIRST EMPLOYMENT AFTER GRADUATION?  ';
        $idx = $headerIndex[$monthsKey] ?? null;
        echo "Debug first row:\n";
        echo "Months key found at index: $idx\n";
        echo "Value at that index: [" . ($row[$idx] ?? 'NOT FOUND') . "]\n";
    }
    
    $values = [];
    foreach ($columnMap as $csvHeader => $dbCol) {
        $idx = $headerIndex[$csvHeader] ?? null;
        $values[] = ($idx !== null && isset($row[$idx])) ? $row[$idx] : '';
    }
    $stmt->execute($values);
}

fclose($handle);
echo "Data imported successfully.\n";
?>