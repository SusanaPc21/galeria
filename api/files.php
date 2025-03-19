<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");

include "conexion.php"; // Archivo de conexión a la base de datos

$sql = "SELECT ruta, nombre, fecha, hora FROM archivos ORDER BY fecha DESC, hora DESC";
$result = $conn->query($sql);

$archivos = [];

if ($result->num_rows > 0) {
    while ($row = $result->fetch_assoc()) {
        $archivos[] = [
            "ruta" => $row["ruta"],
            "nombre" => $row["nombre"],
            "fecha" => $row["fecha"],
            "hora" => $row["hora"]
        ];
    }
}

echo json_encode(["files" => $archivos]);

$conn->close();
?>
