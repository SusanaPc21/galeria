<?php
// Habilitar CORS (si es necesario)
header("Access-Control-Allow-Origin: http://localhost:3000");
header("Access-Control-Allow-Methods: POST, GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");

// Permitir solicitudes preflight (OPTIONS)
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

include "conexion.php";

// Verificar la conexión
if ($conn->connect_error) {
    http_response_code(500); // Error del servidor
    echo json_encode(["message" => "Error de conexión a la base de datos: " . $conn->connect_error]);
    exit();
}

// Obtener los datos enviados desde el frontend
$data = json_decode(file_get_contents("php://input"), true);

// Validar que se haya enviado el campo "nombre"
if (empty($data['nombre'])) {
    http_response_code(400); // Solicitud incorrecta
    echo json_encode(["message" => "El campo 'nombre' es requerido."]);
    exit();
}

// Escapar el valor para evitar inyecciones SQL
$nombre_pantalla = $conn->real_escape_string($data['nombre']);

// Preparar la consulta SQL para insertar el nuevo registro
$sql = "INSERT INTO pantallas (nombre_pantalla) VALUES ('$nombre_pantalla')";

// Ejecutar la consulta
if ($conn->query($sql) === TRUE) {
    http_response_code(201); // Creado con éxito
    echo json_encode(["message" => "Pantalla creada con éxito."]);
} else {
    http_response_code(500); // Error del servidor
    echo json_encode(["message" => "Error al crear la pantalla: " . $conn->error]);
}

?>