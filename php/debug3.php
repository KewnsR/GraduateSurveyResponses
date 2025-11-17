<?php
$csv = 'C:\xampp\htdocs\GraduateSurveyResponses\data\Employability Status of Bachelor of Secondary Education Major in Mathematics Graduates for the Academic Year 2024 (Responses).csv';
$f = fopen($csv, 'r');
$headers = fgetcsv($f);
fclose($f);

// Find the months column
foreach($headers as $i => $h) {
    $trimmed = trim($h);
    if(stripos($trimmed, 'MONTHS') !== false && stripos($trimmed, 'WAIT') !== false) {
        echo "Found at index $i\n";
        echo "Raw header: [$h]\n";
        echo "Length: " . strlen($h) . "\n";
        echo "Trimmed: [$trimmed]\n";
        echo "After trim length: " . strlen($trimmed) . "\n";
        
        // Show hex dump of last few chars
        echo "Last 10 chars hex: ";
        for($j = max(0, strlen($h) - 10); $j < strlen($h); $j++) {
            echo sprintf("%02X ", ord($h[$j]));
        }
        echo "\n";
        break;
    }
}

// Check what's in the column map
$columnMapKey = 'HOW MANY MONTHS DID YOU WAIT BEFORE OBTAINING YOUR FIRST EMPLOYMENT AFTER GRADUATION?  ';
echo "\nColumn map key length: " . strlen($columnMapKey) . "\n";
echo "Column map key: [$columnMapKey]\n";
?>
