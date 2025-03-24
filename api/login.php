<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");

include "conexion.php";

$input = file_get_contents("php://input");
$data = json_decode($input, true);

if (!isset($data['usuario']) || !isset($data['password'])) {
    echo json_encode(["status" => "error", "message" => "Datos incompletos"]);
    exit();
}

$usuario = $data['usuario'];
$password = $data['password'];

$sql = $conn->prepare("SELECT id, rol FROM usuarios WHERE nombre_usuario = ? AND password = ?");
$sql->bind_param("ss", $usuario, $password);
$sql->execute();
$result = $sql->get_result();

if ($row = $result->fetch_assoc()) {
    echo json_encode(["status" => "success", "rol" => $row['rol'], 'id' => $row['id']]); // Retorna el rol
} else {
    echo json_encode(["status" => "fail", "message" => "Usuario o contraseña incorrectos"]);
}

$conn->close();

