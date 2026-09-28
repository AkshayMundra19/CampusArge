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
        $users = $pdo->query("SELECT id, email, full_name, role, created_at, status FROM users ORDER BY created_at DESC")->fetchAll();
        echo json_encode(["users" => $users]);
    } catch (Exception $e) {
        http_response_code(500);
        echo json_encode(["error" => "Failed to load users"]);
    }
} elseif ($_SERVER['REQUEST_METHOD'] === 'PUT') {
    $data = json_decode(file_get_contents("php://input"), true);
    $targetId = $data['id'] ?? '';
    $actionType = $data['action'] ?? ''; // 'suspend', 'reactivate', 'promote_admin'
    
    if (!$targetId || !$actionType) {
        http_response_code(400);
        echo json_encode(["error" => "Missing parameters"]);
        exit;
    }
    
    try {
        $stmt = $pdo->prepare("SELECT * FROM users WHERE id = ?");
        $stmt->execute([$targetId]);
        $before = $stmt->fetch();
        if (!$before) {
            http_response_code(404);
            echo json_encode(["error" => "User not found"]);
            exit;
        }

        if ($actionType === 'suspend') {
            $pdo->prepare("UPDATE users SET status = 'suspended' WHERE id = ?")->execute([$targetId]);
            $actionStr = "suspend_user";
        } elseif ($actionType === 'reactivate') {
            $pdo->prepare("UPDATE users SET status = 'active' WHERE id = ?")->execute([$targetId]);
            $actionStr = "reactivate_user";
        } elseif ($actionType === 'promote_admin') {
            $pdo->prepare("UPDATE users SET role = 'admin' WHERE id = ?")->execute([$targetId]);
            $actionStr = "promote_admin";
        } else {
            http_response_code(400);
            echo json_encode(["error" => "Invalid action"]);
            exit;
        }

        $stmt->execute([$targetId]);
        $after = $stmt->fetch();
        
        logAdminAction($pdo, $user['id'], $actionStr, 'users', $targetId, $before, $after);

        echo json_encode(["message" => "User updated successfully", "user" => $after]);

    } catch (Exception $e) {
        http_response_code(500);
        echo json_encode(["error" => "Failed to update user"]);
    }
} else {
    http_response_code(405);
    echo json_encode(["error" => "Method not allowed"]);
}
