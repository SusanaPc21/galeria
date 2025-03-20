<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");

include "conexion.php";

// Verificar si se ha enviado un archivo
if (!isset($_FILES['file'])) {
    echo json_encode(["success" => false, "message" => "No se recibió ningún archivo."]);
    exit;
}

if ($_FILES['file']['error'] !== UPLOAD_ERR_OK) {
    echo json_encode(["success" => false, "message" => "Error al recibir el archivo."]);
    exit;
}

// Variables del archivo
$nombreArchivo = basename($_FILES['file']['name']);
$rutaDestino = 'upload/' . $nombreArchivo;

// Crear carpeta 'uploads' si no existe
if (!is_dir('upload')) {
    mkdir('upload', 0777, true);
}

// Mover el archivo al directorio 'uploads'
if (move_uploaded_file($_FILES['file']['tmp_name'], $rutaDestino)) {
    $fecha = date('Y-m-d');
    $hora = date('H:i:s');

    // Guardar la ruta completa para la base de datos
    $rutaDB = 'upload/' . $rutaDestino;

    // Insertar en la base de datos
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

$conn->close();
?>
