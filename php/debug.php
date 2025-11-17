<?php
$json = file_get_contents('http://localhost/GraduateSurveyResponses/php/get_data.php');
$data = json_decode($json, true);
if(count($data) > 0) {
    echo "All columns in first record:\n";
    foreach($data[0] as $key => $val) {
        if(stripos($key, 'month') !== false || stripos($key, 'employ') !== false) {
            echo "$key = '$val'\n";
        }
    }
    
    echo "\n\nSample records with employment data:\n";
    for($i = 0; $i < min(5, count($data)); $i++) {
        if($data[$i]['employed'] === 'Yes') {
            echo "Record $i: employed={$data[$i]['employed']}, months={$data[$i]['months_to_employment']}, industry={$data[$i]['industry']}\n";
        }
    }
}
?>
