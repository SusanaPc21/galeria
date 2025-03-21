import React, { useState, useEffect } from 'react';

function HomeUsuario() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [archivos, setArchivos] = useState([]); // Para almacenar las imágenes

  useEffect(() => {
    // Realiza la solicitud al backend para obtener las imágenes
    fetch("http://localhost/galeria/api/files.php") // Cambia esto por la ruta correcta de tu archivo PHP
      .then((response) => response.json())
      .then((data) => {
        setArchivos(data.files); // Almacena los archivos en el estado
      })
      .catch((error) => console.error("Error al cargar las imágenes:", error));
  }, []);

  const nextImage = () => setCurrentIndex((prev) => (prev + 1) % archivos.length); // Esto garantiza que vuelva al principio
  const prevImage = () => setCurrentIndex((prev) => (prev - 1 + archivos.length) % archivos.length); // Lo mismo para el botón de atrás
  const selectImage = (index) => setCurrentIndex(index);

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Bienvenido, Usuario</h1>
      <h2 className="text-2xl font-bold mb-4">Galería</h2>

      <div className="flex items-center space-x-4">
        <button onClick={prevImage}>&larr;</button>
        <div className="w-[400px] h-[300px] flex flex-col items-center justify-center">
          {archivos.length > 0 && (
            <div>
              <img
                src={`http://localhost/${archivos[currentIndex].ruta.replace(/\\/g, "/")}`}
               alt={archivos[currentIndex].nombre}
               className="w-full h-64 object-cover"
                />

              <p className="mt-2">Fecha: {archivos[currentIndex].fecha} | Hora: {archivos[currentIndex].hora}</p>
            </div>
          )}
        </div>
        <button onClick={nextImage}>&rarr;</button>
      </div>

      {/* Selector de imágenes */}
      <select onChange={(e) => selectImage(Number(e.target.value))} className="mt-4">
        {archivos.map((archivo, index) => (
          <option key={index} value={index}>
            {archivo.nombre}
          </option>
        ))}
      </select>
    </div>
  );
}

export default HomeUsuario;
