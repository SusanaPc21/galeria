<?php
$host = "localhost";
$user = "root";
$pass = "";
$db = "galeria";

// Crear una nueva conexión a la base de datos
$conn = new mysqli($host, $user, $pass, $db);

// Verificar la conexión
if ($conn->connect_error) {
    // Registrar el error en un archivo de log en lugar de mostrarlo directamente
    error_log("Error de conexión a la base de datos: " . $conn->connect_error);
    // Puedes lanzar una excepción o manejar el error de otra manera
    die("Error de conexión a la base de datos. Por favor, inténtalo de nuevo más tarde.");
}

// Establecer la codificación de caracteres a UTF-8
if (!$conn->set_charset("utf8")) {
    error_log("Error al establecer la codificación de caracteres: " . $conn->error);
    die("Error de configuración de la base de datos. Por favor, inténtalo de nuevo más tarde.");
}

// No es necesario mostrar nada más. La conexión está lista para ser usada.
?>