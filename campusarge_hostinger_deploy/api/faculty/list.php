<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");

require_once __DIR__ . '/../lib/db.php';

$pdo = getDB();

try {
    // We also need universities for the filter dropdown
    $uniStmt = $pdo->query("SELECT id, name FROM universities ORDER BY name ASC");
    $universities = $uniStmt->fetchAll();

    // Fetch verified faculty
    $facStmt = $pdo->query("SELECT * FROM faculty WHERE verification_status = 'verified' ORDER BY rating DESC");
    $faculty = $facStmt->fetchAll();

    // Decode JSON fields and cast numbers
    foreach ($faculty as &$fac) {
        $fac['subjects'] = json_decode($fac['subjects'] ?? '[]', true);
        $fac['languages'] = json_decode($fac['languages'] ?? '[]', true);
        $fac['research_interests'] = json_decode($fac['research_interests'] ?? '[]', true);
        
        $fac['rating'] = (float)($fac['rating'] ?? 0);
        $fac['review_count'] = (int)($fac['review_count'] ?? 0);
        $fac['session_fee'] = (int)($fac['session_fee'] ?? 0);
        $fac['experience_years'] = (int)($fac['experience_years'] ?? 0);
        $fac['is_available'] = (bool)$fac['is_available'];
    }

    http_response_code(200);
    echo json_encode([
        "faculty" => $faculty,
        "universities" => $universities
    ]);
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(["error" => "Failed to fetch faculty list"]);
}
