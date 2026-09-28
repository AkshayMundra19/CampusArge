<?php
require_once 'api/lib/db.php';
$pdo = getDB();
$stmt = $pdo->query("SELECT * FROM universities WHERE name LIKE '%Saybrook%'");
print_r($stmt->fetchAll());
