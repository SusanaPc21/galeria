<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Content-Type: application/json; charset=UTF-8");

// Mostrar errores para depurar
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

include 'conexion.php'; // asegúrate que este archivo hace return $conn

// Obtener los datos enviados desde el frontend
$input = json_decode(file_get_contents('php://input'), true);

if (!$input) {
    echo json_encode(["status" => "error", "message" => "No se recibieron datos"]);
    exit;
}

$accion = $input['accion'] ?? '';
$usuario = $input['usuario'] ?? '';
$password = $input['password'] ?? '';

if ($accion === 'login') {
    // Ajusta el nombre del campo correcto en tu query
    $stmt = $conn->prepare("SELECT rol FROM usuarios WHERE nombre_usuario = ? AND password = ?");
    $stmt->bind_param("ss", $usuario, $password);
    $stmt->execute();

    $result = $stmt->get_result();

    if ($result->num_rows > 0) {
        $user = $result->fetch_assoc();
        echo json_encode(["status" => "success", "rol" => $user['rol']]);
    } else {
        echo json_encode(["status" => "error", "message" => "Usuario o contraseña incorrectos"]);
    }

    $stmt->close();

} elseif ($accion === 'register') {
    // Aquí también el nombre del campo debe coincidir
    $stmt = $conn->prepare("INSERT INTO usuarios (nombre_usuario, password, rol) VALUES (?, ?, 'usuario')");
    $stmt->bind_param("ss", $usuario, $password);

    if ($stmt->execute()) {
        echo json_encode(["status" => "success", "message" => "Usuario registrado exitosamente"]);
    } else {
        echo json_encode(["status" => "error", "message" => "Error al registrar usuario"]);
    }

    $stmt->close();
} else {
    echo json_encode(["status" => "error", "message" => "Acción no válida"]);
}

$conn->close();
?>
