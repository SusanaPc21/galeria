<?php
// Habilitar CORS (si es necesario)
header("Access-Control-Allow-Origin: http://localhost:3000");
header("Content-Type: application/json; charset=UTF-8");

include "conexion.php";

// Consulta SQL para obtener usuarios con rol 'usuario'
$sql = "SELECT id, nombre_usuario FROM usuarios WHERE rol = 'usuario'";
$result = $conn->query($sql);

// Verificar si hay resultados
if ($result->num_rows > 0) {
    // Crear un array para almacenar los usuarios
    $users = [];

    // Recorrer los resultados y agregarlos al array
    while ($row = $result->fetch_assoc()) {
        $users[] = [
            "id" => $row["id"],
            "nombre_usuario" => $row["nombre_usuario"]
        ];
    }

    // Devolver los usuarios en formato JSON
    http_response_code(200); // OK
    echo json_encode(["users" => $users]);
} else {
    // Si no hay usuarios, devolver un array vacío
    http_response_code(200); // OK
    echo json_encode(["users" => []]);
}
