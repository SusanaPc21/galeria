<?php
// Habilitar CORS (si es necesario)
header("Access-Control-Allow-Origin: http://localhost:3000");
header("Content-Type: application/json; charset=UTF-8");

include "conexion.php";

// Verificar la conexión
if ($conn->connect_error) {
    http_response_code(500); // Error del servidor
    echo json_encode(["message" => "Error de conexión a la base de datos: " . $conn->connect_error]);
    exit();
}

// Consulta SQL para obtener todas las pantallas
$sql = "SELECT id_pantalla, nombre_pantalla FROM pantallas";
$result = $conn->query($sql);

// Verificar si hay resultados
if ($result->num_rows > 0) {
    // Crear un array para almacenar las pantallas
    $screens = [];

    // Recorrer los resultados y agregarlos al array
    while ($row = $result->fetch_assoc()) {
        $screens[] = [
            "id_pantalla" => $row["id_pantalla"],
            "nombre" => $row["nombre_pantalla"]
        ];
    }

    // Devolver las pantallas en formato JSON
    http_response_code(200); // OK
    echo json_encode(["screens" => $screens]);
} else {
    // Si no hay pantallas, devolver un array vacío
    http_response_code(200); // OK
    echo json_encode(["screens" => []]);
}

// Cerrar la conexión
$conn->close();
?>