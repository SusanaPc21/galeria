<?php
header("Access-Control-Allow-Origin: *"); // Permite que React acceda
header("Content-Type: application/json");
header("Access-Control-Allow-Methods: POST");

include("conexion.php");

// Recibimos los datos enviados por React
$data = json_decode(file_get_contents("php://input"));

// Variables recibidas
$usuario = $data->usuario;
$password = $data->password;

// CONSULTA a la tabla 'usuarios' (que ya tienes en tu BD)
$sql = "SELECT * FROM usuarios WHERE usuario = '$usuario' AND password = '$password'";
$result = $conn->query($sql);

// Validamos si encontró un usuario
if ($result->num_rows > 0) {
    echo json_encode(["status" => "success", "message" => "Login exitoso"]);
} else {
    echo json_encode(["status" => "error", "message" => "Usuario o contraseña incorrectos"]);
}

$conn->close();
?>
