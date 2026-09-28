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
        $reviews = $pdo->query(
            "SELECT r.*, s.full_name as student_name, f.full_name as faculty_name
             FROM reviews r
             JOIN users s ON r.student_id = s.id
             JOIN faculty fac ON r.faculty_id = fac.id
             JOIN users f ON fac.user_id = f.id
             ORDER BY r.created_at DESC"
        )->fetchAll();
        echo json_encode(["reviews" => $reviews]);
    } catch (Exception $e) {
        http_response_code(500);
        echo json_encode(["error" => "Failed to load reviews"]);
    }
} elseif ($_SERVER['REQUEST_METHOD'] === 'PUT') {
    $data = json_decode(file_get_contents("php://input"), true);
    $id = $data['id'] ?? '';
    
    if (!$id) {
        http_response_code(400);
        echo json_encode(["error" => "Missing review id"]);
        exit;
    }
    
    try {
        $stmt = $pdo->prepare("SELECT * FROM reviews WHERE id = ?");
        $stmt->execute([$id]);
        $before = $stmt->fetch();
        
        if (!$before) {
            http_response_code(404);
            echo json_encode(["error" => "Review not found"]);
            exit;
        }
        
        // toggle is_published
        $newStatus = $before['is_published'] ? 0 : 1;
        $pdo->prepare("UPDATE reviews SET is_published = ? WHERE id = ?")->execute([$newStatus, $id]);
        
        $stmt->execute([$id]);
        $after = $stmt->fetch();
        
        $action = $newStatus ? 'publish_review' : 'unpublish_review';
        logAdminAction($pdo, $user['id'], $action, 'reviews', $id, $before, $after);

        echo json_encode(["message" => "Review status updated", "review" => $after]);
    } catch (Exception $e) {
        http_response_code(500);
        echo json_encode(["error" => "Failed to update review"]);
    }
} else {
    http_response_code(405);
    echo json_encode(["error" => "Method not allowed"]);
}
