<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: GET, PUT, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') { http_response_code(204); exit; }

require_once __DIR__ . '/../lib/db.php';
require_once __DIR__ . '/../lib/auth_middleware.php';
require_once __DIR__ . '/../lib/audit.php';

$user = authenticate('admin');
$pdo = getDB();

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    try {
        $reports = $pdo->query(
            "SELECT r.*, reporter.full_name as reporter_name, reported.full_name as reported_name
             FROM reports r
             LEFT JOIN users reporter ON r.reporter_id = reporter.id
             LEFT JOIN users reported ON r.reported_id = reported.id
             ORDER BY r.created_at DESC"
        )->fetchAll();
        echo json_encode(["reports" => $reports]);
    } catch (Exception $e) {
        http_response_code(500);
        echo json_encode(["error" => "Failed to load reports"]);
    }
} elseif ($_SERVER['REQUEST_METHOD'] === 'PUT') {
    $data = json_decode(file_get_contents("php://input"), true);
    $id = $data['id'] ?? '';
    $notes = $data['resolution_notes'] ?? '';
    
    if (!$id) {
        http_response_code(400);
        echo json_encode(["error" => "Missing report id"]);
        exit;
    }
    
    try {
        $stmt = $pdo->prepare("SELECT * FROM reports WHERE id = ?");
        $stmt->execute([$id]);
        $before = $stmt->fetch();
        
        if (!$before) {
            http_response_code(404);
            echo json_encode(["error" => "Report not found"]);
            exit;
        }
        
        $updateStmt = $pdo->prepare("UPDATE reports SET status = 'resolved', resolution_notes = ? WHERE id = ?");
        $updateStmt->execute([$notes, $id]);
        
        $stmt->execute([$id]);
        $after = $stmt->fetch();
        
        logAdminAction($pdo, $user['id'], 'resolve_report', 'reports', $id, $before, $after);

        echo json_encode(["message" => "Report resolved successfully", "report" => $after]);
    } catch (Exception $e) {
        http_response_code(500);
        echo json_encode(["error" => "Failed to resolve report"]);
    }
} else {
    http_response_code(405);
    echo json_encode(["error" => "Method not allowed"]);
}
