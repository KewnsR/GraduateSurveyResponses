<?php
$csv = 'C:\xampp\htdocs\GraduateSurveyResponses\data\Employability Status of Bachelor of Secondary Education Major in Mathematics Graduates for the Academic Year 2024 (Responses).csv';
$f = fopen($csv, 'r');
$headers = fgetcsv($f);
$dataRow = fgetcsv($f); // Get first data row
fclose($f);

echo "Looking for MONTHS column:\n";
foreach($headers as $i => $h) {
    if(stripos($h, 'MONTH') !== false) {
        echo "Index $i: [$h] = '" . (isset($dataRow[$i]) ? $dataRow[$i] : 'N/A') . "'\n";
    }
}
?>
