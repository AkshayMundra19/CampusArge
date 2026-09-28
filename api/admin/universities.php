<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: GET, PUT, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') { http_response_code(204); exit; }

require_once __DIR__ . '/../lib/db.php';
require_once __DIR__ . '/../lib/auth_middleware.php';
require_once __DIR__ . '/../lib/audit.php';

$user = authenticate('admin');
$pdo = getDB();

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    try {
        $universities = $pdo->query("SELECT * FROM universities ORDER BY name ASC")->fetchAll();
        echo json_encode(["universities" => $universities]);
    } catch (Exception $e) {
        http_response_code(500);
        echo json_encode(["error" => "Failed to load universities"]);
    }
} elseif ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $data = json_decode(file_get_contents("php://input"), true);
    $name = $data['name'] ?? '';
    
    if (!$name) {
        http_response_code(400);
        echo json_encode(["error" => "Missing university name"]);
        exit;
    }
    
    $uuid = sprintf('%04x%04x-%04x-%04x-%04x-%04x%04x%04x',
        mt_rand(0,0xffff), mt_rand(0,0xffff), mt_rand(0,0xffff),
        mt_rand(0,0x0fff)|0x4000, mt_rand(0,0x3fff)|0x8000,
        mt_rand(0,0xffff), mt_rand(0,0xffff), mt_rand(0,0xffff));
        
    try {
        $stmt = $pdo->prepare(
            "INSERT INTO universities (id, name, city, country, university_type, tuition_min, tuition_max, website) 
             VALUES (?, ?, ?, ?, ?, ?, ?, ?)"
        );
        $stmt->execute([
            $uuid, $name, 
            $data['city'] ?? '', $data['country'] ?? '', $data['university_type'] ?? 'public',
            $data['tuition_min'] ?? null, $data['tuition_max'] ?? null, $data['website'] ?? null
        ]);
        
        $pdoStmt = $pdo->prepare("SELECT * FROM universities WHERE id = ?");
        $pdoStmt->execute([$uuid]);
        $after = $pdoStmt->fetch();
        
        logAdminAction($pdo, $user['id'], 'create_university', 'universities', $uuid, null, $after);

        echo json_encode(["message" => "University created successfully", "university" => $after]);
    } catch (Exception $e) {
        http_response_code(500);
        echo json_encode(["error" => "Failed to create university"]);
    }
} elseif ($_SERVER['REQUEST_METHOD'] === 'PUT') {
    $data = json_decode(file_get_contents("php://input"), true);
    $id = $data['id'] ?? '';
    if (!$id) {
        http_response_code(400);
        echo json_encode(["error" => "Missing university id"]);
        exit;
    }
    
    try {
        $stmt = $pdo->prepare("SELECT * FROM universities WHERE id = ?");
        $stmt->execute([$id]);
        $before = $stmt->fetch();
        
        if (!$before) {
            http_response_code(404);
            echo json_encode(["error" => "University not found"]);
            exit;
        }
        
        $updateStmt = $pdo->prepare(
            "UPDATE universities SET 
             name = ?, city = ?, country = ?, university_type = ?, 
             tuition_min = ?, tuition_max = ?, website = ?, description = ?
             WHERE id = ?"
        );
        $updateStmt->execute([
            $data['name'] ?? $before['name'],
            $data['city'] ?? $before['city'],
            $data['country'] ?? $before['country'],
            $data['university_type'] ?? $before['university_type'],
            $data['tuition_min'] ?? $before['tuition_min'],
            $data['tuition_max'] ?? $before['tuition_max'],
            $data['website'] ?? $before['website'],
            $data['description'] ?? $before['description'],
            $id
        ]);
        
        $stmt->execute([$id]);
        $after = $stmt->fetch();
        
        logAdminAction($pdo, $user['id'], 'edit_university', 'universities', $id, $before, $after);

        echo json_encode(["message" => "University updated successfully", "university" => $after]);
    } catch (Exception $e) {
        http_response_code(500);
        echo json_encode(["error" => "Failed to update university"]);
    }
} else {
    http_response_code(405);
    echo json_encode(["error" => "Method not allowed"]);
}
