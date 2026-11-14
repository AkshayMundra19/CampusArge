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
        $testimonials = $pdo->query(
            "SELECT t.*, u.full_name, u.role, u.avatar_url 
             FROM testimonials t
             JOIN users u ON t.user_id = u.id
             ORDER BY t.created_at DESC"
        )->fetchAll();
        echo json_encode(["testimonials" => $testimonials]);
    } catch (Exception $e) {
        http_response_code(500);
        echo json_encode(["error" => "Failed to load testimonials"]);
    }
} elseif ($_SERVER['REQUEST_METHOD'] === 'PUT') {
    $data = json_decode(file_get_contents("php://input"), true);
    $id = $data['id'] ?? '';
    
    if (!$id) {
        http_response_code(400);
        echo json_encode(["error" => "Missing testimonial id"]);
        exit;
    }
    
    try {
        $stmt = $pdo->prepare("SELECT * FROM testimonials WHERE id = ?");
        $stmt->execute([$id]);
        $before = $stmt->fetch();
        
        if (!$before) {
            http_response_code(404);
            echo json_encode(["error" => "Testimonial not found"]);
            exit;
        }
        
        // toggle is_featured
        $newStatus = $before['is_featured'] ? 0 : 1;
        $pdo->prepare("UPDATE testimonials SET is_featured = ? WHERE id = ?")->execute([$newStatus, $id]);
        
        $stmt->execute([$id]);
        $after = $stmt->fetch();
        
        $action = $newStatus ? 'feature_testimonial' : 'unfeature_testimonial';
        logAdminAction($pdo, $user['id'], $action, 'testimonials', $id, $before, $after);

        echo json_encode(["message" => "Testimonial status updated", "testimonial" => $after]);
    } catch (Exception $e) {
        http_response_code(500);
        echo json_encode(["error" => "Failed to update testimonial"]);
    }
} else {
    http_response_code(405);
    echo json_encode(["error" => "Method not allowed"]);
}
