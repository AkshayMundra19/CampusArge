<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");

require_once __DIR__ . '/../lib/db.php';

$id = $_GET['id'] ?? '';
if (!$id) {
    http_response_code(400);
    echo json_encode(["error" => "Missing faculty id"]);
    exit;
}

$pdo = getDB();

try {
    // Faculty row + joined university name
    $facStmt = $pdo->prepare(
        "SELECT f.*, u.name AS university_name
         FROM faculty f
         LEFT JOIN universities u ON u.id = f.university_id
         WHERE f.id = ?"
    );
    $facStmt->execute([$id]);
    $fac = $facStmt->fetch();

    if (!$fac) {
        http_response_code(404);
        echo json_encode(["error" => "Faculty not found"]);
        exit;
    }

    // Decode JSON arrays
    $fac['subjects']            = json_decode($fac['subjects']            ?? '[]', true);
    $fac['languages']           = json_decode($fac['languages']           ?? '[]', true);
    $fac['research_interests']  = json_decode($fac['research_interests']  ?? '[]', true);
    $fac['rating']              = (float)($fac['rating']           ?? 0);
    $fac['review_count']        = (int)($fac['review_count']       ?? 0);
    $fac['session_fee']         = (int)($fac['session_fee']        ?? 0);
    $fac['experience_years']    = (int)($fac['experience_years']   ?? 0);
    $fac['is_available']        = (bool)$fac['is_available'];

    // Availability slots
    $availStmt = $pdo->prepare(
        "SELECT * FROM faculty_availability WHERE faculty_id = ? AND is_booked = 0 ORDER BY day_of_week, start_time"
    );
    $availStmt->execute([$id]);
    $availability = $availStmt->fetchAll();

    // Published reviews (latest 10)
    $revStmt = $pdo->prepare(
        "SELECT * FROM reviews WHERE faculty_id = ? AND is_published = 1 ORDER BY created_at DESC LIMIT 10"
    );
    $revStmt->execute([$id]);
    $reviews = $revStmt->fetchAll();

    http_response_code(200);
    echo json_encode([
        "faculty"       => $fac,
        "availability"  => $availability,
        "reviews"       => $reviews,
    ]);

} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(["error" => "Failed to fetch faculty profile"]);
}
