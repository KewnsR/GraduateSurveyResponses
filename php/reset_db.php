<?php
// Script to reset the database - DELETES ALL DATA and reimports from CSV
header('Content-Type: text/plain');

$servername = "localhost";
$username = "root";
$password = "";
$dbname = "alumni_tracer_study";

try {
    $pdo = new PDO("mysql:host=$servername;dbname=$dbname", $username, $password);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    
    echo "Clearing existing data...\n";
    $pdo->exec("DELETE FROM alumni");
    echo "Database cleared.\n\n";
    
    echo "Now run setup_db.php to reimport data from CSV.\n";
    echo "Or refresh this page to automatically import:\n\n";
    
    // Auto-import
    include 'setup_db.php';
    
} catch(PDOException $e) {
    echo "Error: " . $e->getMessage() . "\n";
}
?>
