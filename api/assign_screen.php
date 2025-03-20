<?php
include 'conexion.php';

header('Content-Type: application/json');

$data = json_decode(file_get_contents('php://input'), true);

$idUsuario = $data['user'] ?? null;
$idPantalla = $data['screen'] ?? null;

// Validar que los datos existan
if (!$idUsuario || !$idPantalla) {
    echo json_encode(['success' => false, 'message' => 'Usuario y pantalla son requeridos.']);
    exit;
}

try {
    // Verificar si la asignación ya existe (opcional pero recomendable)
    $stmt = $conn->prepare("SELECT * FROM pantallas_usuarios WHERE id_usuario = ? AND id_pantalla = ?");
    $stmt->execute([$idUsuario, $idPantalla]);
    if ($stmt->fetch()) {
        echo json_encode(['success' => false, 'message' => 'Esta pantalla ya está asignada al usuario.']);
        exit;
    }

    // Insertar nueva asignación
    $stmt = $conn->prepare("INSERT INTO pantallas_usuarios (id_usuario, id_pantalla) VALUES (?, ?)");
    $stmt->execute([$idUsuario, $idPantalla]);

    echo json_encode(['success' => true, 'message' => 'Pantalla asignada correctamente.']);
} catch (Exception $e) {
    echo json_encode(['success' => false, 'message' => 'Error al asignar la pantalla.']);
}

$conn = null;
?>
