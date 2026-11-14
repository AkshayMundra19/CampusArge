<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') { http_response_code(204); exit; }

require_once __DIR__ . '/../lib/db.php';
require_once __DIR__ . '/../lib/auth_middleware.php';

$user = authenticate(); // any authenticated user
if ($user['role'] !== 'student') {
    http_response_code(403);
    echo json_encode(["error" => "Only students can save universities"]);
    exit;
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(["error" => "Method not allowed"]);
    exit;
}

$data = json_decode(file_get_contents("php://input"), true);
$universityId = $data['university_id'] ?? '';

if (!$universityId) {
    http_response_code(400);
    echo json_encode(["error" => "Missing university_id"]);
    exit;
}

$pdo = getDB();
$studentId = $user['id'];

try {
    // Check if already saved
    $checkStmt = $pdo->prepare("SELECT id FROM saved_universities WHERE student_id = ? AND university_id = ?");
    $checkStmt->execute([$studentId, $universityId]);
    $existing = $checkStmt->fetch();

    if ($existing) {
        // Unsave
        $pdo->prepare("DELETE FROM saved_universities WHERE student_id = ? AND university_id = ?")->execute([$studentId, $universityId]);
        echo json_encode(["saved" => false]);
    } else {
        // Save
        $uuid = sprintf('%04x%04x-%04x-%04x-%04x-%04x%04x%04x',
            mt_rand(0,0xffff), mt_rand(0,0xffff), mt_rand(0,0xffff),
            mt_rand(0,0x0fff)|0x4000, mt_rand(0,0x3fff)|0x8000,
            mt_rand(0,0xffff), mt_rand(0,0xffff), mt_rand(0,0xffff));
        $pdo->prepare("INSERT INTO saved_universities (id, student_id, university_id, created_at) VALUES (?, ?, ?, NOW())")
            ->execute([$uuid, $studentId, $universityId]);
        echo json_encode(["saved" => true]);
    }
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(["error" => "Failed to toggle save"]);
}
