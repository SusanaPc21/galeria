import React, { useState, useEffect } from 'react';

function HomeUsuario() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [archivos, setArchivos] = useState([]); // Imágenes cargadas desde el servidor
  const [isPlaying, setIsPlaying] = useState(true); // Controla si el carrusel se reproduce automáticamente

  // Cargar las imágenes desde la API al montar el componente
  useEffect(() => {
    const fetchImages = async () => {
      try {
        const response = await fetch('http://localhost/galeria/api/files.php');
        if (!response.ok) throw new Error('Error al cargar las imágenes');

        const data = await response.json();
        if (Array.isArray(data.files)) {
          setArchivos(data.files);
        } else {
          console.error('El formato de respuesta no es válido:', data);
        }
      } catch (error) {
        console.error('Error al cargar las imágenes:', error);
      }
    };

    fetchImages();
  }, []);

  // Control de la reproducción automática del carrusel
  useEffect(() => {
    if (isPlaying && archivos.length > 0) {
      const interval = setInterval(() => {
        setCurrentIndex((prev) => (prev + 1) % archivos.length);
      }, 3000); // Avanza cada 3 segundos

      return () => clearInterval(interval); // Limpia el intervalo cuando cambia el estado
    }
  }, [isPlaying, archivos]);

  // Navegar a la siguiente imagen
  const nextImage = () => {
    setIsPlaying(false); // Pausa el carrusel al cambiar manualmente
    setCurrentIndex((prev) => (prev + 1) % archivos.length);
  };

  // Navegar a la imagen anterior
  const prevImage = () => {
    setIsPlaying(false);
    setCurrentIndex((prev) => (prev - 1 + archivos.length) % archivos.length);
  };

  // Seleccionar una imagen específica desde el menú desplegable
  const selectImage = (index) => {
    setIsPlaying(false);
    if (index >= 0 && index < archivos.length) {
      setCurrentIndex(index);
    }
  };

  // Alternar el estado de reproducción automática
  const togglePlay = () => {
    if (archivos.length === 0) return;
    setIsPlaying((prev) => !prev);
  };

  return (
    <div className="p-4 flex flex-col items-center">
      <h1 className="text-3xl font-bold mb-2">Bienvenido, Usuario</h1>
      <h2 className="text-2xl font-semibold mb-4">Galería de Imágenes</h2>

      {/* Controles y vista de la imagen actual */}
      <div className="flex items-center space-x-4">
        <button
          onClick={prevImage}
          disabled={archivos.length === 0}
          className={`px-3 py-2 rounded bg-gray-300 hover:bg-gray-400 transition ${archivos.length === 0 ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
          &larr;
        </button>

        <div className="w-[400px] h-[300px] flex flex-col items-center justify-center border rounded-lg shadow-md bg-white">
          {archivos.length > 0 ? (
            <div className="flex flex-col items-center">
              <img
                src={`http://localhost${archivos[currentIndex].ruta.replace(/\\/g, '/')}`}
                alt={archivos[currentIndex].nombre}
                className="w-full h-64 object-cover rounded-lg"
              />
              <p className="mt-2 text-sm text-gray-600">
                Fecha: {archivos[currentIndex].fecha} | Hora: {archivos[currentIndex].hora}
              </p>
            </div>
          ) : (
            <p className="text-gray-500">No hay imágenes disponibles.</p>
          )}
        </div>

        <button
          onClick={nextImage}
          disabled={archivos.length === 0}
          className={`px-3 py-2 rounded bg-gray-300 hover:bg-gray-400 transition ${archivos.length === 0 ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
          &rarr;
        </button>
      </div>

      {/* Selector de imágenes si hay imágenes cargadas */}
      {archivos.length > 0 && (
        <select
          onChange={(e) => selectImage(Number(e.target.value))}
          value={currentIndex}
          className="mt-4 p-2 border rounded"
        >
          {archivos.map((archivo, index) => (
            <option key={index} value={index}>
              {archivo.nombre}
            </option>
          ))}
        </select>
      )}

      {/* Botón para pausar/reproducir el carrusel */}
      <button
        onClick={togglePlay}
        disabled={archivos.length === 0}
        className={`mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition ${archivos.length === 0 ? 'opacity-50 cursor-not-allowed' : ''}`}
      >
        {isPlaying ? 'Pausar' : 'Reproducir'}
      </button>
    </div>
  );
}

export default HomeUsuario;
