<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");

include "conexion.php";

$input = file_get_contents("php://input");
$data = json_decode($input, true);

if (!isset($data['accion']) || !isset($data['usuario']) || !isset($data['password'])) {
    echo json_encode(["status" => "error", "message" => "Datos incompletos"]);
    exit();
}

$accion = $data['accion'];
$usuario = $data['usuario'];
$password = $data['password'];

if ($accion === "register") {
    // Verifica si el usuario ya existe
    $sql_check = $conn->prepare("SELECT nombre_usuario FROM usuarios WHERE nombre_usuario = ?");
    $sql_check->bind_param("s", $usuario);
    $sql_check->execute();
    $result_check = $sql_check->get_result();

    if ($result_check->num_rows > 0) {
        echo json_encode(["status" => "error", "message" => "El usuario ya existe"]);
        exit();
    }

    // Inserta el nuevo usuario en la base de datos
    $sql_insert = $conn->prepare("INSERT INTO usuarios (nombre_usuario, password, rol) VALUES (?, ?, 'usuario')");
    $sql_insert->bind_param("ss", $usuario, $password);

    if ($sql_insert->execute()) {
        echo json_encode(["status" => "success", "message" => "Usuario registrado exitosamente"]);
    } else {
        echo json_encode(["status" => "error", "message" => "Error al registrar el usuario"]);
    }
} elseif ($accion === "login") {
    $sql = $conn->prepare("SELECT rol FROM usuarios WHERE nombre_usuario = ? AND password = ?");
    $sql->bind_param("ss", $usuario, $password);
    $sql->execute();
    $result = $sql->get_result();

    if ($row = $result->fetch_assoc()) {
        echo json_encode(["status" => "success", "rol" => $row['rol']]);
    } else {
        echo json_encode(["status" => "fail", "message" => "Usuario o contraseña incorrectos"]);
    }
}

$conn->close();
?>
