<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With");
header("Content-Type: application/json; charset=UTF-8");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

$statusFile = __DIR__ . '/../maintenance_status.json';

// Default state if file does not exist
$defaultData = [
    'maintenance' => false,
    'updated_at' => date('c'),
    'reason' => 'Sistem beroperasi normal',
    'estimated_completion' => 'Selesai',
    'updated_by' => 'System Administrator'
];

if (!file_exists($statusFile)) {
    file_put_contents($statusFile, json_encode($defaultData, JSON_PRETTY_PRINT));
}

$inputData = json_decode(file_get_contents('php://input'), true);
$action = $_GET['action'] ?? ($inputData['action'] ?? null);

if ($_SERVER['REQUEST_METHOD'] === 'POST' || $action === 'set') {
    $current = json_decode(file_get_contents($statusFile), true) ?: $defaultData;
    
    $status = false;
    if (isset($inputData['status'])) {
        $status = (bool)$inputData['status'];
    } elseif (isset($_GET['status'])) {
        $status = in_array($_GET['status'], ['1', 'true', 'on', 'yes'], true);
    }

    $reason = $inputData['reason'] ?? ($_GET['reason'] ?? ($status ? 'Pemeliharaan rutin server & migrasi database' : 'Sistem beroperasi normal'));
    $estimated = $inputData['estimated_completion'] ?? ($_GET['estimated_completion'] ?? ($status ? '15 - 30 Menit' : 'Selesai'));
    $updatedBy = $inputData['updated_by'] ?? ($_GET['updated_by'] ?? 'Master DevOps Administrator');

    $newData = [
        'maintenance' => $status,
        'updated_at' => date('c'),
        'reason' => $reason,
        'estimated_completion' => $estimated,
        'updated_by' => $updatedBy
    ];

    if (file_put_contents($statusFile, json_encode($newData, JSON_PRETTY_PRINT))) {
        echo json_encode([
            'success' => true,
            'message' => 'Status pemeliharaan berhasil diperbarui',
            'data' => $newData
        ]);
    } else {
        http_response_code(500);
        echo json_encode([
            'success' => false,
            'message' => 'Gagal menulis berkas konfigurasi maintenance di server'
        ]);
    }
    exit;
}

// Default GET: Return current maintenance status
$data = json_decode(file_get_contents($statusFile), true) ?: $defaultData;
echo json_encode([
    'success' => true,
    'data' => $data
]);
