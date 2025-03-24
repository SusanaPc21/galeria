<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Content-Type: application/json; charset=UTF-8");

// Mostrar errores para depurar
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

include 'conexion.php'; // Asegúrate de que este archivo hace return $conn

// Obtener los datos enviados desde el frontend
$input = json_decode(file_get_contents('php://input'), true);

if (!$input) {
    echo json_encode(["status" => "error", "message" => "No se recibieron datos"]);
    exit;
}

$accion = $input['accion'] ?? '';
$usuario = $input['usuario'] ?? '';
$password = $input['password'] ?? '';

$sql = $conn->prepare("SELECT id, rol FROM usuarios WHERE nombre_usuario = ? AND password = ?");
$sql->bind_param("ss", $usuario, $password);
$sql->execute();
$result = $sql->get_result();

if ($row = $result->fetch_assoc()) {
    echo json_encode(["status" => "success", "rol" => $row['rol'], 'id' => $row['id']]); // Retorna el rol
if ($accion === 'login') {
    // Consulta SQL para obtener el usuario
    $stmt = $conn->prepare("SELECT id, password, rol FROM usuarios WHERE nombre_usuario = ?");
    if (!$stmt) {
        echo json_encode(["status" => "error", "message" => "Error al preparar la consulta: " . $conn->error]);
        exit;
    }

    $stmt->bind_param("s", $usuario);
    if (!$stmt->execute()) {
        echo json_encode(["status" => "error", "message" => "Error al ejecutar la consulta: " . $stmt->error]);
        exit;
    }

    $result = $stmt->get_result();

    if ($result->num_rows > 0) {
        $user = $result->fetch_assoc();
        if (password_verify($password, $user['password'])) {
            session_start();
            $_SESSION['user_id'] = $user['id']; // Guardar el ID del usuario en la sesión
            echo json_encode(["status" => "success", "rol" => $user['rol']]);
        } else {
            echo json_encode(["status" => "error", "message" => "Usuario o contraseña incorrectos"]);
        }
    } else {
        echo json_encode(["status" => "error", "message" => "Usuario o contraseña incorrectos"]);
    }

    $stmt->close();

} elseif ($accion === 'register') {
    // Hash de la contraseña
    $hashed_password = password_hash($password, PASSWORD_DEFAULT);

    // Consulta SQL para insertar un nuevo usuario
    $stmt = $conn->prepare("INSERT INTO usuarios (nombre_usuario, password, rol) VALUES (?, ?, 'usuario')");
    if (!$stmt) {
        echo json_encode(["status" => "error", "message" => "Error al preparar la consulta: " . $conn->error]);
        exit;
    }

    $stmt->bind_param("ss", $usuario, $hashed_password);

    if ($stmt->execute()) {
        echo json_encode(["status" => "success", "message" => "Usuario registrado exitosamente"]);
    } else {
        echo json_encode(["status" => "error", "message" => "Error al registrar usuario: " . $stmt->error]);
    }

    $stmt->close();
} else {
    echo json_encode(["status" => "error", "message" => "Acción no válida"]);
}

$conn->close();
?>