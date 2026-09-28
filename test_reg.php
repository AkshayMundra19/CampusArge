<?php
$data = json_encode([
    "email" => "hacker2@test.com",
    "password" => "password123",
    "full_name" => "Hacker Man",
    "role" => "admin"
]);
$ch = curl_init("http://localhost:8000/api/auth/register.php");
curl_setopt($ch, CURLOPT_POSTFIELDS, $data);
curl_setopt($ch, CURLOPT_HTTPHEADER, ["Content-Type: application/json"]);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
$res = curl_exec($ch);
echo "API response: " . $res . "\n";
