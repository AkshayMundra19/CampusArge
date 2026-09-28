<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') { http_response_code(204); exit; }

require_once __DIR__ . '/../lib/db.php';
require_once __DIR__ . '/../lib/auth_middleware.php';

$user = authenticate('faculty');
$facultyUserId = $user['id'];
$pdo = getDB();

try {
    // 1. Get faculty profile
    $facStmt = $pdo->prepare("SELECT * FROM faculty WHERE user_id = ?");
    $facStmt->execute([$facultyUserId]);
    $facultyProfile = $facStmt->fetch();


    if ($facultyProfile) {
        $facultyId = $facultyProfile['id'];
        
        // Decode JSON arrays
        $facultyProfile['subjects']            = json_decode($facultyProfile['subjects']            ?? '[]', true);
        $facultyProfile['languages']           = json_decode($facultyProfile['languages']           ?? '[]', true);
        $facultyProfile['research_interests']  = json_decode($facultyProfile['research_interests']  ?? '[]', true);
        $facultyProfile['rating']              = (float)($facultyProfile['rating']           ?? 0);
        $facultyProfile['review_count']        = (int)($facultyProfile['review_count']       ?? 0);
        
    }

    echo json_encode([
        "facultyProfile" => $facultyProfile
    ]);

} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(["error" => "Failed to load dashboard data"]);
}
