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
        $faculty = $pdo->query(
            "SELECT f.*, u.name as university_name 
             FROM faculty f 
             LEFT JOIN universities u ON f.university_id = u.id 
             WHERE f.verification_status = 'pending' 
             ORDER BY f.created_at DESC"
        )->fetchAll();
        
        // Decode subjects/languages
        foreach ($faculty as &$fac) {
            $fac['subjects'] = json_decode($fac['subjects'] ?? '[]');
            $fac['languages'] = json_decode($fac['languages'] ?? '[]');
        }
        
        echo json_encode(["faculty" => $faculty]);
    } catch (Exception $e) {
        http_response_code(500);
        echo json_encode(["error" => "Failed to load verification queue"]);
    }
} elseif ($_SERVER['REQUEST_METHOD'] === 'PUT') {
    $data = json_decode(file_get_contents("php://input"), true);
    $facultyId = $data['id'] ?? '';
    $action = $data['action'] ?? ''; // 'approve' or 'reject'
    
    if (!$facultyId || !in_array($action, ['approve', 'reject'])) {
        http_response_code(400);
        echo json_encode(["error" => "Missing or invalid parameters"]);
        exit;
    }
    
    try {
        $stmt = $pdo->prepare("SELECT * FROM faculty WHERE id = ?");
        $stmt->execute([$facultyId]);
        $before = $stmt->fetch();
        
        if (!$before) {
            http_response_code(404);
            echo json_encode(["error" => "Faculty not found"]);
            exit;
        }
        
        $newStatus = $action === 'approve' ? 'verified' : 'rejected';
        $pdo->prepare("UPDATE faculty SET verification_status = ? WHERE id = ?")->execute([$newStatus, $facultyId]);
        
        $stmt->execute([$facultyId]);
        $after = $stmt->fetch();
        
        logAdminAction($pdo, $user['id'], $action . '_faculty_verification', 'faculty', $facultyId, $before, $after);

        echo json_encode(["message" => "Verification status updated", "faculty" => $after]);

    } catch (Exception $e) {
        http_response_code(500);
        echo json_encode(["error" => "Failed to update verification status"]);
    }
} else {
    http_response_code(405);
    echo json_encode(["error" => "Method not allowed"]);
}
