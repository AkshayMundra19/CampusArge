<?php
require_once __DIR__ . '/jwt.php';

function authenticate($requiredRole = null) {
    $headers = getallheaders();
    $authHeader = isset($headers['Authorization']) ? $headers['Authorization'] : '';
    
    if (empty($authHeader) && isset($_SERVER['HTTP_AUTHORIZATION'])) {
        $authHeader = $_SERVER['HTTP_AUTHORIZATION'];
    }

    if (empty($authHeader) || !preg_match('/Bearer\s(\S+)/', $authHeader, $matches)) {
        http_response_code(401);
        echo json_encode(["error" => "Unauthorized"]);
        exit;
    }

    $jwt = $matches[1];
    $payload = verifyJWT($jwt);

    if (!$payload) {
        http_response_code(401);
        echo json_encode(["error" => "Invalid or expired token"]);
        exit;
    }

    if ($requiredRole && (!isset($payload['role']) || $payload['role'] !== $requiredRole)) {
        http_response_code(403);
        echo json_encode(["error" => "Forbidden: Insufficient role permissions"]);
        exit;
    }

    return $payload;
}
