<?php

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

include 'conexion.php';

$data = json_decode(file_get_contents("php://input"), true);

if (!isset($data['user'], $data['screen'], $data['selectedFiles'])) {
    echo json_encode(["message" => "Datos incompletos"]);
    exit;
}

$id_usuario = intval($data['user']);
$id_pantalla = intval($data['screen']);
$id_archivos = !empty($data['selectedFiles']) ? implode(",", array_map('intval', $data['selectedFiles'])) : "";

// Verificar si id_pantalla e id_usuario son válidos
if ($id_pantalla === 0 || $id_usuario === 0) {
    echo json_encode(["message" => "ID de usuario o pantalla no válido"]);
    exit;
}

$stmt = $conn->prepare("INSERT INTO asignar_pantalla (id_pantalla, id_usuario, id_archivos) VALUES (?, ?, ?)");
$stmt->bind_param("iis", $id_pantalla, $id_usuario, $id_archivos);

if ($stmt->execute()) {
    echo json_encode(["message" => "Pantalla asignada con éxito", "id_pantalla" => $id_pantalla, "id_archivos" => $id_archivos]);
} else {
    echo json_encode(["message" => "Error al asignar la pantalla"]);
}


