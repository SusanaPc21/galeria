<?php
error_reporting(0);
ini_set('display_errors', 0);

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Content-Type: application/json; charset=UTF-8");

include "conexion.php";

$response = ["files" => []];

try {
    if ($conn->connect_error) {
        throw new Exception("Error de conexión a la base de datos: " . $conn->connect_error);
    }

    $sql = "SELECT id, ruta, nombre, fecha, hora FROM archivos ORDER BY fecha DESC, hora DESC";
    $result = $conn->query($sql);

    if (!$result) {
        throw new Exception("Error en la consulta: " . $conn->error);
    }

    if ($result->num_rows > 0) {
        while ($row = $result->fetch_assoc()) {
            $response["files"][] = [
                "id" => $row["id"],
                "ruta" => "/galeria/uploads/" . $row["ruta"], // Asegúrate de que la ruta sea correcta
                "nombre" => $row["nombre"],
                "fecha" => $row["fecha"],
                "hora" => $row["hora"],
                "isSelected" => false
            ];
        }
    }

    http_response_code(200);
    echo json_encode($response);

} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(["error" => $e->getMessage()]);
}

$conn->close();
