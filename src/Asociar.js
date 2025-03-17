import React, { useState } from "react";

const archivosDisponibles = [
  { id: 1, nombre: "AB.jpg", fecha: "2025-01-01" },
  { id: 2, nombre: "ABC.jpg", fecha: "2025-01-15" },
  { id: 3, nombre: "ABC2.jpg", fecha: "2025-02-10" }
];

const pantallasDisponibles = [
  { id: 1, nombre: "Frente" },
  { id: 2, nombre: "Sala" }
];

const Asociar = () => {
  const [archivosSeleccionados, setArchivosSeleccionados] = useState([]);
  const [pantallasSeleccionadas, setPantallasSeleccionadas] = useState([]);

  const toggleArchivo = (archivo) => {
    setArchivosSeleccionados((prev) =>
      prev.includes(archivo) ? prev.filter((a) => a !== archivo) : [...prev, archivo]
    );
  };

  const togglePantalla = (pantalla) => {
    setPantallasSeleccionadas((prev) =>
      prev.includes(pantalla) ? prev.filter((p) => p !== pantalla) : [...prev, pantalla]
    );
  };

  const handleAsociar = () => {
    if (archivosSeleccionados.length > 0 && pantallasSeleccionadas.length > 0) {
      alert("Archivos asociados con éxito.");
      setArchivosSeleccionados([]);
      setPantallasSeleccionadas([]);
    } else {
      alert("Selecciona al menos un archivo y una pantalla.");
    }
  };

  const handleEliminar = () => {
    setArchivosSeleccionados([]);
    setPantallasSeleccionadas([]);
    alert("Asociaciones eliminadas.");
  };

  return (
    <div style={{
      textAlign: "center", marginTop: "50px",
      display: "flex", flexDirection: "column", alignItems: "center"
    }}>
      <h2>Asociar Archivos a Pantallas</h2>
      <div style={{
        display: "flex", justifyContent: "center", gap: "30px",
        border: "2px solid #ddd", padding: "20px", borderRadius: "10px"
      }}>
        {/* Lista de Pantallas */}
        <div style={{ textAlign: "left" }}>
          <h3>Pantallas</h3>
          {pantallasDisponibles.map((pantalla) => (
            <label key={pantalla.id} style={{ display: "block", marginBottom: "5px" }}>
              <input
                type="checkbox"
                checked={pantallasSeleccionadas.includes(pantalla)}
                onChange={() => togglePantalla(pantalla)}
              />{" "}
              {pantalla.nombre}
            </label>
          ))}
        </div>

        {/* Lista de Archivos */}
        <div style={{ textAlign: "left" }}>
          <h3>Archivos</h3>
          {archivosDisponibles.map((archivo) => (
            <label key={archivo.id} style={{ display: "block", marginBottom: "5px" }}>
              <input
                type="checkbox"
                checked={archivosSeleccionados.includes(archivo)}
                onChange={() => toggleArchivo(archivo)}
              />{" "}
              {archivo.nombre} (Subido: {archivo.fecha})
            </label>
          ))}
        </div>
      </div>

      {/* Botones */}
      <div style={{ marginTop: "20px" }}>
        <button
          onClick={handleAsociar}
          style={{
            backgroundColor: "#4CAF50", color: "white", padding: "10px 15px",
            border: "none", borderRadius: "5px", cursor: "pointer", marginRight: "10px"
          }}
        >
          Agregar
        </button>
        <button
          onClick={handleEliminar}
          style={{
            backgroundColor: "#f44336", color: "white", padding: "10px 15px",
            border: "none", borderRadius: "5px", cursor: "pointer"
          }}
        >
          Borrar
        </button>
      </div>
    </div>
  );
};

export default Asociar;
