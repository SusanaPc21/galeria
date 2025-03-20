<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Content-Type: application/json; charset=UTF-8");

include "conexion.php";

// Consulta SQL con INNER JOIN para obtener nombre_pantalla y nombre_usuario
$sql = "SELECT 
            a.id_asignar, 
            p.nombre_pantalla, 
            u.nombre_usuario, 
            a.id_archivos 
        FROM asignar_pantalla a
        INNER JOIN pantallas p ON a.id_pantalla = p.id_pantalla
        INNER JOIN usuarios u ON a.id_usuario = u.id";

$result = $conn->query($sql);

$ficheros = [];

if ($result->num_rows > 0) {
    while ($row = $result->fetch_assoc()) {
        $ficheros[] = [
            "id_asignar"      => $row["id_asignar"],
            "nombre_pantalla" => $row["nombre_pantalla"], // Se cambia id_pantalla por nombre_pantalla
            "nombre_usuario"  => $row["nombre_usuario"],  // Se cambia id_usuario por nombre_usuario
            "id_archivos"     => $row["id_archivos"]
        ];
    }
}

// Cerrar conexión
$conn->close();

// Devolver los datos en formato JSON
http_response_code(200);
echo json_encode(["ficheros" => $ficheros]);
