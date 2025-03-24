<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");

$mysqli = new mysqli("localhost", "root", "", "galeria");

// Verificar conexión
if ($mysqli->connect_error) {
    die(json_encode(["error" => "Error de conexión a la base de datos"]));
}

// Obtener el ID del usuario desde la URL (Ejemplo: carrusel.php?usuario_id=1)
$usuario_id = isset($_GET['usuario_id']) ? intval($_GET['usuario_id']) : 0;

$usuario_id = isset($_GET['usuario_id']) ? intval($_GET['usuario_id']) : 0;

// Consulta para obtener las pantallas asignadas al usuario
$sql = "SELECT ap.id_pantalla, p.nombre_pantalla, ap.id_archivos
        FROM asignar_pantalla ap
        JOIN pantallas p ON p.id_pantalla = ap.id_pantalla
        WHERE ap.id_usuario = ?";

$stmt = $mysqli->prepare($sql);
$stmt->bind_param("i", $usuario_id);
$stmt->execute();
$result = $stmt->get_result();

$carruseles = [];

while ($row = $result->fetch_assoc()) {
    $imagenes = [];

    // Separar los IDs de imágenes
    $id_archivos = explode(",", $row['id_archivos']);
    $id_archivos = array_filter($id_archivos, 'is_numeric'); // Filtra valores no numéricos

    if (!empty($id_archivos)) {
        $placeholders = implode(",", array_fill(0, count($id_archivos), "?"));
        $sql_img = "SELECT id, ruta, nombre, fecha, hora FROM archivos WHERE id IN ($placeholders)";
        
        $stmt_img = $mysqli->prepare($sql_img);
        $stmt_img->bind_param(str_repeat("i", count($id_archivos)), ...array_map('intval', $id_archivos));
        $stmt_img->execute();
        $result_img = $stmt_img->get_result();

        while ($img = $result_img->fetch_assoc()) {
            $imagenes[] = $img;
        }
    }

    // Cada pantalla tendrá su propio carrusel
    $carruseles[] = [
        "id_pantalla" => $row['id_pantalla'],
        "nombre_pantalla" => $row['nombre_pantalla'],
        "imagenes" => $imagenes
    ];
}

echo json_encode(["carruseles" => $carruseles]);

