import React, { useState } from "react";

const images = []; // Vacío por ahora

const Galeria = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const prevImage = () => {
    setCurrentIndex((prevIndex) => (prevIndex === 0 ? images.length - 1 : prevIndex - 1));
  };

  const nextImage = () => {
    setCurrentIndex((prevIndex) => (prevIndex === images.length - 1 ? 0 : prevIndex + 1));
  };

  return (
    <div style={{ textAlign: "center", marginTop: "50px" }}>
      <h2>Galería de Imágenes</h2>
      {images.length > 0 ? (
        <div>
          <button onClick={prevImage}>⬅</button>
          <img
            src={images[currentIndex].src}
            alt="Gallery"
            style={{ width: "300px", height: "300px", margin: "0 20px" }}
          />
          <button onClick={nextImage}>➡</button>
          <p>Subida el: {images[currentIndex].uploadedAt}</p>
        </div>
      ) : (
        <p>No hay imágenes disponibles.</p>
      )}
    </div>
  );
};

export default Galeria;
