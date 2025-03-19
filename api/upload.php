<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
include "conexion.php";
// Verificar si se ha enviado un archivo
if ($_FILES['file']['error'] === UPLOAD_ERR_OK) {
    $nombreArchivo = $_FILES['file']['name'];
    $rutaDestino = 'uploads/' . $nombreArchivo;

    // Mueve el archivo al directorio 'uploads'
    if (move_uploaded_file($_FILES['file']['tmp_name'], $rutaDestino)) {
        $fecha = date('Y-m-d');
        $hora = date('H:i:s');

        // Insertar en la base de datos
        $rutaDB = '/uploads/';
        $stmt = $conn->prepare("INSERT INTO archivos (ruta, nombre, fecha, hora) VALUES (?, ?, ?, ?)");
        $stmt->bind_param("ssss", $rutaDB, $nombreArchivo, $fecha, $hora);

        if ($stmt->execute()) {
            echo json_encode(["success" => true, "message" => "Archivo subido y registrado con éxito."]);
        } else {
            echo json_encode(["success" => false, "message" => "Error al registrar el archivo en la base de datos."]);
        }

        $stmt->close();
    } else {
        echo json_encode(["success" => false, "message" => "Error al mover el archivo."]);
    }
} else {
    echo json_encode(["success" => false, "message" => "Error al recibir el archivo."]);
}

$conn->close();
?>
