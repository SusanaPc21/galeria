<?php
$host = "localhost";
$user = "root";
$pass = "";
$db = "galeria";

// Crear conexión
$conn = new mysqli($host, $user, $pass, $db);

// Verificar la conexión
if ($conn->connect_error) {
    die("Conexión fallida: " . $conn->connect_error);
}

// Opcional: Confirmación de conexión exitosa
// echo "Conexión exitosa";
?>
