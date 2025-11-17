<?php
// Script to clear and rebuild the database
header('Content-Type: text/plain');

$servername = "localhost";
$username = "root";
$password = "";
$dbname = "alumni_tracer_study";

try {
    $pdo = new PDO("mysql:host=$servername;dbname=$dbname", $username, $password);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    
    // First, check current count
    $stmt = $pdo->query("SELECT COUNT(*) as count FROM alumni");
    $result = $stmt->fetch(PDO::FETCH_ASSOC);
    echo "Current record count in database: " . $result['count'] . "\n";
    
    // Count employed/unemployed
    $stmt = $pdo->query("SELECT employed, COUNT(*) as count FROM alumni GROUP BY employed");
    echo "\nCurrent employment status breakdown:\n";
    while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
        echo "  {$row['employed']}: {$row['count']}\n";
    }
    
    echo "\n\nTo reset the database with fresh data from CSV, run setup_db.php\n";
    echo "You may need to:\n";
    echo "1. DELETE FROM alumni; (to clear old data)\n";
    echo "2. Then run setup_db.php again\n";
    
} catch(PDOException $e) {
    echo "Connection failed: " . $e->getMessage() . "\n";
    echo "\nThe database may not be set up yet. This is okay - the system will use CSV data instead.\n";
}
?>
