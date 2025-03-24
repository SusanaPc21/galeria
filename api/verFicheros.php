<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Content-Type: application/json; charset=UTF-8");

// Mostrar errores para depurar
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

include 'conexion.php'; // Asegúrate de que este archivo hace return $conn

try {
    if ($conn->connect_error) {
        throw new Exception("Error de conexión a la base de datos: " . $conn->connect_error);
    }

    // Obtener el ID del usuario actual desde la sesión
    session_start();
    if (!isset($_SESSION['user_id'])) {
        throw new Exception("Usuario no autenticado");
    }
    $userId = $_SESSION['user_id'];

    // Consulta SQL con INNER JOIN para obtener nombre_pantalla y nombre_usuario
    $sql = "SELECT 
                a.id_asignar, 
                p.nombre_pantalla, 
                u.nombre_usuario, 
                f.ruta, 
                f.nombre, 
                f.fecha, 
                f.hora 
            FROM asignar_pantalla a
            INNER JOIN pantallas p ON a.id_pantalla = p.id_pantalla
            INNER JOIN usuarios u ON a.id_usuario = u.id
            INNER JOIN archivos f ON a.id_archivos = f.id
            WHERE a.id_usuario = ?";

    $stmt = $conn->prepare($sql);
    if (!$stmt) {
        throw new Exception("Error al preparar la consulta: " . $conn->error);
    }

    $stmt->bind_param("i", $userId);
    if (!$stmt->execute()) {
        throw new Exception("Error al ejecutar la consulta: " . $stmt->error);
    }

    $result = $stmt->get_result();
    $ficheros = [];

    if ($result->num_rows > 0) {
        while ($row = $result->fetch_assoc()) {
            $ficheros[] = [
                "id_asignar"      => $row["id_asignar"],
                "nombre_pantalla" => $row["nombre_pantalla"],
                "nombre_usuario"  => $row["nombre_usuario"],
                "ruta"           => $row["ruta"],
                "nombre"          => $row["nombre"],
                "fecha"           => $row["fecha"],
                "hora"           => $row["hora"]
            ];
        }
    }

    // Devolver los datos en formato JSON
    http_response_code(200);
    echo json_encode(["ficheros" => $ficheros]);

} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(["error" => $e->getMessage()]);
} finally {
    if (isset($stmt)) {
        $stmt->close();
    }
    if (isset($conn)) {
        $conn->close();
    }
}
?>