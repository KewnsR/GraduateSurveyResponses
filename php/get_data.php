<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE');
header('Access-Control-Allow-Headers: Content-Type');

require_once 'db.php';

$method = $_SERVER['REQUEST_METHOD'];

if ($method === 'GET') {
    // Read data
    $stmt = $pdo->query("SELECT * FROM alumni");
    $data = $stmt->fetchAll(PDO::FETCH_ASSOC);
    echo json_encode($data);
} elseif ($method === 'POST') {
    // Update record
    $input = json_decode(file_get_contents('php://input'), true);
    if (isset($input['id'])) {
        $id = $input['id'];
        unset($input['id']);
        $setParts = [];
        $values = [];
        foreach ($input as $key => $value) {
            $setParts[] = "$key = ?";
            $values[] = $value;
        }
        $values[] = $id;
        $sql = "UPDATE alumni SET " . implode(', ', $setParts) . " WHERE id = ?";
        $stmt = $pdo->prepare($sql);
        $stmt->execute($values);
        echo json_encode(['success' => true]);
    } else {
        echo json_encode(['error' => 'ID required for update']);
    }
} elseif ($method === 'PUT') {
    // Create new record
    $input = json_decode(file_get_contents('php://input'), true);
    $columns = array_keys($input);
    $placeholders = str_repeat('?,', count($columns) - 1) . '?';
    $sql = "INSERT INTO alumni (" . implode(',', $columns) . ") VALUES ($placeholders)";
    $stmt = $pdo->prepare($sql);
    $stmt->execute(array_values($input));
    echo json_encode(['success' => true, 'id' => $pdo->lastInsertId()]);
} elseif ($method === 'DELETE') {
    $input = json_decode(file_get_contents('php://input'), true);
    if (isset($input['id'])) {
        $stmt = $pdo->prepare("DELETE FROM alumni WHERE id = ?");
        $stmt->execute([$input['id']]);
        echo json_encode(['success' => true]);
    } else {
        echo json_encode(['error' => 'ID required for delete']);
    }
} else {
    echo json_encode(['error' => 'Method not allowed']);
}
?>