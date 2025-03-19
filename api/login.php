<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json");

include "conexion.php";

$data = json_decode(file_get_contents("php://input"));

$usuario = $data->usuario;
$password = $data->password;

$sql = "SELECT * FROM usuarios WHERE usuario = '$usuario' AND password = '$password'";
$result = $conn->query($sql);

if ($result->num_rows > 0) {
    echo json_encode(["status" => "success"]);
} else {
    echo json_encode(["status" => "fail"]);
}

$conn->close();
