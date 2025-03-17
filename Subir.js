import React, { useState, useEffect } from "react";
import axios from "axios";

const Subir = () => {
  const [file, setFile] = useState(null);
  const [message, setMessage] = useState("");
  const [files, setFiles] = useState([]);

  useEffect(() => {
    fetchFiles();
  }, []);

  const fetchFiles = async () => {
    try {
      const res = await axios.get("http://localhost:5000/files");
      setFiles(res.data);
    } catch (error) {
      console.error("Error al obtener archivos", error);
    }
  };

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleUpload = async () => {
    if (!file) {
      setMessage("Por favor selecciona un archivo.");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    try {
      await axios.post("http://localhost:5000/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" }
      });
      setMessage("Archivo subido con éxito");
      fetchFiles(); // Actualizar lista de archivos
    } catch (error) {
      setMessage("Error al subir el archivo.");
    }
  };

  return (
    <div style={{ textAlign: "center", marginTop: "50px" }}>
      <h2>Subir Archivo</h2>
      <input type="file" onChange={handleFileChange} />
      <button onClick={handleUpload}>Subir</button>
      {message && <p>{message}</p>}

      <h3>Archivos Subidos</h3>
      <ul>
        {files.map((file) => (
          <li key={file.id}>
            {file.filename} - {new Date(file.uploadedAt).toLocaleString()}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Subir;
