import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './Login.js';
import './carrusel.css';

function HomeUsuario() {
  const [carruseles, setCarruseles] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const id = localStorage.getItem('id');
    if (!id) return;
    
    fetch(`http://localhost/galeria/api/carrusel.php?usuario_id=${id}`)
      .then(res => res.json())
      .then(data => setCarruseles(data.carruseles || []))
      .catch(err => console.error('Error:', err));
  }, []);

  return (
    <div className="p-4 relative">
      <button className="absolute top-4 right-4 bg-red-500 text-white px-4 py-2 rounded" 
        onClick={() => { localStorage.removeItem('id'); navigate('/'); }}>
        Salir
      </button>
      <h1 className="text-2xl font-bold mb-4">Bienvenido, Usuario</h1>
      <h2 className="text-2xl font-bold mb-4">Galería</h2>
      {!carruseles.length ? <p>No hay carruseles asignados.</p> : 
        carruseles.map((c, i) => (
          <div key={i} className="mb-6">
            <h3 className="text-xl font-semibold">{c.nombre_pantalla}</h3>
            <Carrusel imagenes={c.imagenes} />
          </div>
        ))
      }
    </div>
  );
}

function Carrusel({ imagenes }) {
  const [current, setCurrent] = useState(0);
  if (!imagenes?.length) return <p>No hay imágenes disponibles.</p>;
  const img = imagenes[current];

  return (
    <div className="carrusel-container">
      <button className="carrusel-btn" onClick={() => setCurrent(p => (p - 1 + imagenes.length) % imagenes.length)}>
        &#10094;
      </button>
      <div className="carrusel-image-container">
        <img src={img.ruta.startsWith('http') ? img.ruta : `http://localhost/galeria/api/${img.ruta}`}
             alt={img.nombre} className="carrusel-image" />
        <div className="carrusel-info">
          <p>Fecha: {img.fecha} | Hora: {img.hora}</p>
        </div>
      </div>
      <button className="carrusel-btn" onClick={() => setCurrent(p => (p + 1) % imagenes.length)}>
        &#10095;
      </button>
      <select onChange={e => setCurrent(Number(e.target.value))} className="carrusel-select" value={current}>
        {imagenes.map((img, i) => <option key={i} value={i}>{img.nombre}</option>)}
      </select>
    </div>
  );
}

export default HomeUsuario;