<?php
include 'conexion.php';
header('Content-Type: application/json');

$idUsuario = $_GET['user'] ?? null;

if (!$idUsuario) {
    echo json_encode(['success' => false, 'message' => 'Usuario es requerido.']);
    exit;
}

try {
    $stmt = $conn->prepare("
        SELECT p.id, p.nombre
        FROM pantallas_usuarios pu
        JOIN pantallas p ON pu.id_pantalla = p.id
        WHERE pu.id_usuario = ?
    ");
    $stmt->bind_param("i", $idUsuario);
    $stmt->execute();
    $result = $stmt->get_result();

    $pantallas = [];
    while ($row = $result->fetch_assoc()) {
        $pantallas[] = $row;
    }

    echo json_encode(['success' => true, 'screens' => $pantallas]);
} catch (Exception $e) {
    echo json_encode(['success' => false, 'message' => 'Error al obtener pantallas asignadas.']);
}

$stmt->close();
$conn->close();
?>
