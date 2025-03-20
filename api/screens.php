<?php
include 'conexion.php';

header('Content-Type: application/json');

try {
    $query = "SELECT id, nombre FROM pantallas";
    $result = $conn->query($query);

    $pantallas = [];
    while ($row = $result->fetch_assoc()) {
        $pantallas[] = $row;
    }

    echo json_encode(['success' => true, 'screens' => $pantallas]);
} catch (Exception $e) {
    echo json_encode(['success' => false, 'message' => 'Error al obtener pantallas.']);
}

$conn->close();
?>
