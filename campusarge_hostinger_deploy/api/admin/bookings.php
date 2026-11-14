<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') { http_response_code(204); exit; }

require_once __DIR__ . '/../lib/db.php';
require_once __DIR__ . '/../lib/auth_middleware.php';

$user = authenticate('admin');
$pdo = getDB();

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    $id = $_GET['id'] ?? '';
    
    try {
        if ($id) {
            // Get single booking with all details
            $stmt = $pdo->prepare(
                "SELECT b.*, 
                 s.full_name as student_name, s.email as student_email,
                 f.full_name as faculty_name, f.email as faculty_email,
                 u.name as university_name
                 FROM bookings b
                 JOIN users s ON b.student_id = s.id
                 JOIN users f ON b.faculty_id = f.id
                 LEFT JOIN faculty fac ON f.id = fac.user_id
                 LEFT JOIN universities u ON fac.university_id = u.id
                 WHERE b.id = ?"
            );
            $stmt->execute([$id]);
            $booking = $stmt->fetch();
            
            if (!$booking) {
                http_response_code(404);
                echo json_encode(["error" => "Booking not found"]);
                exit;
            }
            echo json_encode(["booking" => $booking]);
        } else {
            // Get all bookings
            $bookings = $pdo->query(
                "SELECT b.id, b.status, b.topic, b.session_date, b.created_at,
                 s.full_name as student_name,
                 f.full_name as faculty_name
                 FROM bookings b
                 JOIN users s ON b.student_id = s.id
                 JOIN users f ON b.faculty_id = f.id
                 ORDER BY b.created_at DESC"
            )->fetchAll();
            echo json_encode(["bookings" => $bookings]);
        }
    } catch (Exception $e) {
        http_response_code(500);
        echo json_encode(["error" => "Failed to load bookings"]);
    }
} else {
    http_response_code(405);
    echo json_encode(["error" => "Method not allowed"]);
}
