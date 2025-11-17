<?php
$csv = 'C:\xampp\htdocs\GraduateSurveyResponses\data\Employability Status of Bachelor of Secondary Education Major in Mathematics Graduates for the Academic Year 2024 (Responses).csv';
$f = fopen($csv, 'r');
$headers = fgetcsv($f);
fclose($f);

echo "Total headers: " . count($headers) . "\n\n";

// Check for duplicates
$seen = [];
$dupes = [];
foreach($headers as $i => $h) {
    if(isset($seen[$h])) {
        $dupes[] = "Index $i: [$h] (first seen at index {$seen[$h]})";
    } else {
        $seen[$h] = $i;
    }
}

if($dupes) {
    echo "DUPLICATE HEADERS FOUND:\n";
    foreach($dupes as $d) echo "$d\n";
} else {
    echo "No duplicates found\n";
}
?>
