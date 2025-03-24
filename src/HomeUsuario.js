import React, { useState, useEffect } from 'react';
import  './Login.js';
import './carrusel.css';

function HomeUsuario() {
  const [carruseles, setCarruseles] = useState([]);

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
  }, []);

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Bienvenido, Usuario</h1>
      <h2 className="text-2xl font-bold mb-4">Galería</h2>

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
