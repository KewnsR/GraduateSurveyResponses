<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');

$csvFile = '../data/Employability Status of Bachelor of Secondary Education Major in Mathematics Graduates for the Academic Year 2024 (Responses).csv';

if (!file_exists($csvFile)) {
    echo json_encode(['error' => 'CSV file not found: ' . $csvFile]);
    exit;
}

$data = [];
$handle = fopen($csvFile, 'r');

if ($handle === false) {
    echo json_encode(['error' => 'Cannot open CSV file']);
    exit;
}

$headers = fgetcsv($handle);
if ($headers === false) {
    echo json_encode(['error' => 'Cannot read CSV headers']);
    fclose($handle);
    exit;
}
$headers = array_map('trim', $headers);

$rowCount = 0;
while (($row = fgetcsv($handle)) !== false) {
    $row = array_map('trim', $row);
    if (count($headers) === count($row)) {
        $data[] = array_combine($headers, $row);
        $rowCount++;
        if ($rowCount > 1000) break; // Safety limit
    }
}

fclose($handle);

echo json_encode($data);
?>