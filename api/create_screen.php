<?php 
include 'conexion.php';

header('Content-Type: application/json');

// Capturar datos enviados en JSON
$data = json_decode(file_get_contents('php://input'), true);

// Verificar si 'nombre' está presente y no vacío
if (!isset($data['nombre']) || empty(trim($data['nombre']))) {
    echo json_encode(['success' => false, 'message' => 'Nombre de pantalla es requerido.']);
    exit;
}

$nombrePantalla = trim($data['nombre']);

// Preparar y ejecutar la consulta
$stmt = $conn->prepare("INSERT INTO pantallas (nombre) VALUES (?)");

if (!$stmt) {
    echo json_encode(['success' => false, 'message' => 'Error en la preparación: ' . $conn->error]);
    exit;
}

$stmt->bind_param("s", $nombrePantalla);

if ($stmt->execute()) {
    echo json_encode(['success' => true, 'message' => 'Pantalla creada con éxito.']);
} else {
    echo json_encode(['success' => false, 'message' => 'Error al ejecutar la consulta: ' . $stmt->error]);
}

// Cerrar conexión
$stmt->close();
$conn->close();
?>
