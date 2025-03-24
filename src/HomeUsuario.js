import React, { useState, useEffect } from 'react';
import  './Login.js';
import './carrusel.css';

function HomeUsuario() {
  const [carruseles, setCarruseles] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [archivos, setArchivos] = useState([]); // Imágenes cargadas desde el servidor
  const [isPlaying, setIsPlaying] = useState(true); // Controla si el carrusel se reproduce automáticamente

  // Cargar las imágenes desde la API al montar el componente
  useEffect(() => {
    // Obtener el ID del usuario desde localStorage
    const id = localStorage.getItem('id');
    console.log('ID del usuario:', id);

    // Validar que el ID exista
    if (!id) {
      console.error('No se encontró el ID del usuario en localStorage');
      return;
    }

    // Llamada al backend con el ID dinámico
    fetch(`http://localhost/galeria/api/carrusel.php?usuario_id=${id}`)
      .then((response) => response.json())
      .then((data) => {
        setCarruseles(data.carruseles || []);
      })
      .catch((error) => console.error('Error al cargar las imágenes:', error));
    const fetchImages = async () => {
      try {
        const response = await fetch('http://localhost/galeria/api/verFicheros.php');
        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(`Error al cargar las imágenes: ${errorText}`);
        }

        const data = await response.json();
        if (Array.isArray(data.ficheros)) {
          setArchivos(data.ficheros);
        } else {
          console.error('El formato de respuesta no es válido:', data);
        }
      } catch (error) {
        console.error('Error al cargar las imágenes:', error);
        alert('Error al cargar las imágenes. Por favor, inténtalo de nuevo más tarde.');
      }
    };

    fetchImages();
  }, []);

  return (
    <div className="p-4 flex flex-col items-center">
      <h1 className="text-3xl font-bold mb-2">Bienvenido, Usuario</h1>
      <h2 className="text-2xl font-semibold mb-4">Galería de Imágenes</h2>

      {carruseles.length === 0 ? (
        <p>No hay carruseles asignados.</p>
      ) : (
        carruseles.map((carrusel, index) => (
          <div key={index} className="mb-6">
            <h3 className="text-xl font-semibold">{carrusel.nombre_pantalla}</h3>
            <Carrusel imagenes={carrusel.imagenes} />
          </div>
        ))
      )}
    </div>
  );
}

function Carrusel({ imagenes }) {
  const [currentIndex, setCurrentIndex] = useState(0);

  if (!imagenes || imagenes.length === 0) {
    return <p>No hay imágenes disponibles.</p>;
  }

  const nextImage = () => setCurrentIndex((prev) => (prev + 1) % imagenes.length);
  const prevImage = () => setCurrentIndex((prev) => (prev - 1 + imagenes.length) % imagenes.length);
  const selectImage = (index) => setCurrentIndex(index);

  return (
    <div className="carrusel-container">
      <button className="carrusel-btn" onClick={prevImage}>
        &#10094;
      </button>

      <div className="carrusel-image-container">
        <img
          src={
            imagenes[currentIndex].ruta.startsWith('http')
              ? imagenes[currentIndex].ruta
              : `http://localhost/galeria/api/${imagenes[currentIndex].ruta}`
          }
          alt={imagenes[currentIndex].nombre}
          className="carrusel-image"
        />
        <div className="carrusel-info">
          <p>
            Fecha: {imagenes[currentIndex].fecha} | Hora: {imagenes[currentIndex].hora}
          </p>
        </div>
      </div>

      <button className="carrusel-btn" onClick={nextImage}>
        &#10095;
      </button>

      <select
        onChange={(e) => selectImage(Number(e.target.value))}
        className="carrusel-select"
        value={currentIndex}
      >
        {imagenes.map((img, idx) => (
          <option key={idx} value={idx}>
            {img.nombre}
          </option>
        ))}
      </select>
    </div>
  );
}

export default HomeUsuario;