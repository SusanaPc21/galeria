<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");

include "conexion.php";

// Leer la entrada JSON
$input = file_get_contents("php://input");
$data = json_decode($input, true); // `true` para obtener un array asociativo

if (!isset($data['usuario']) || !isset($data['password'])) {
    echo json_encode(["status" => "error", "message" => "Datos incompletos"]);
    exit();
}

$usuario = $data['usuario'];
$password = $data['password'];

// Usar consultas preparadas para evitar SQL Injection
$sql = $conn->prepare("SELECT * FROM usuarios WHERE usuario = ? AND password = ?");
$sql->bind_param("ss", $usuario, $password);
$sql->execute();
$result = $sql->get_result();

if ($result->num_rows > 0) {
    echo json_encode(["status" => "success"]);
} else {
    echo json_encode(["status" => "fail", "message" => "Usuario o contraseña incorrectos"]);
}

$conn->close();
