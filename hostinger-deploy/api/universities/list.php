<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");

require_once __DIR__ . '/../lib/db.php';

$pdo = getDB();

try {
    $search = isset($_GET['search']) ? $_GET['search'] : '';
    $type   = isset($_GET['type'])   ? $_GET['type']   : '';
    $state  = isset($_GET['state'])  ? $_GET['state']  : '';
    $page   = max(1, (int)($_GET['page'] ?? 1));
    $limit  = max(1, (int)($_GET['limit'] ?? 1000)); // Default to 1000 to fetch all 417
    $offset = ($page - 1) * $limit;

    $where = "WHERE 1=1";
    $params = [];

    if ($search) {
        $where .= " AND (name LIKE ? OR city LIKE ? OR state LIKE ?)";
        $params[] = "%$search%";
        $params[] = "%$search%";
        $params[] = "%$search%";
    }
    if ($type) {
        $where .= " AND university_type = ?";
        $params[] = $type;
    }
    if ($state) {
        $where .= " AND state = ?";
        $params[] = $state;
    }

    // Count total
    $countStmt = $pdo->prepare("SELECT COUNT(*) FROM universities $where");
    $countStmt->execute($params);
    $total = (int)$countStmt->fetchColumn();

    $query = "SELECT id, name, city, state, country, qs_rank,
                     tuition_min, tuition_max, cost_of_attendance, university_type,
                     scholarships_available, scholarship_info, programs,
                     admission_details, campus_facilities, established_year,
                     student_count, verified_faculty_count,
                     logo_url, banner_url, campus_image_url, campus_image_attribution,
                     website, is_featured, description, gallery_urls
              FROM universities
              $where
              ORDER BY CASE WHEN qs_rank IS NULL THEN 9999 ELSE qs_rank END ASC,
                       name ASC
              LIMIT $limit OFFSET $offset";

    $stmt = $pdo->prepare($query);
    $stmt->execute($params);
    $universities = $stmt->fetchAll(PDO::FETCH_ASSOC);

    foreach ($universities as &$uni) {
        if (isset($uni['programs']) && is_string($uni['programs'])) {
            $uni['programs'] = json_decode($uni['programs'], true);
        }
        if (isset($uni['gallery_urls']) && is_string($uni['gallery_urls'])) {
            $uni['gallery_urls'] = json_decode($uni['gallery_urls'], true);
        }
        if (isset($uni['campus_facilities']) && is_string($uni['campus_facilities'])) {
            $uni['campus_facilities'] = json_decode($uni['campus_facilities'], true);
        }
        $uni['qs_rank']            = $uni['qs_rank']            !== null ? (int)$uni['qs_rank']            : null;
        $uni['tuition_min']        = $uni['tuition_min']        !== null ? (int)$uni['tuition_min']        : null;
        $uni['cost_of_attendance'] = $uni['cost_of_attendance'] !== null ? (int)$uni['cost_of_attendance'] : null;
        $uni['student_count']      = $uni['student_count']      !== null ? (int)$uni['student_count']      : null;
        $uni['scholarships_available'] = (bool)$uni['scholarships_available'];
        $uni['is_featured']        = (bool)$uni['is_featured'];
    }

    http_response_code(200);
    echo json_encode([
        "data"  => $universities,
        "total" => $total,
        "page"  => $page,
        "limit" => $limit,
    ], JSON_UNESCAPED_UNICODE);

} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(["error" => "Failed to fetch universities: " . $e->getMessage()]);
}
