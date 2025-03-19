import React, { useState, useEffect } from 'react';

function HomeAdmin() {
  const [file, setFile] = useState(null);
  const [files, setFiles] = useState([]);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleUpload = async () => {
    if (!file) {
      alert('Por favor, selecciona un archivo.');
      return;
    }

    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await fetch('http://localhost/galeria/api/upload.php', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        alert('Archivo subido con éxito.');
        fetchFiles(); // Actualizar la lista de archivos después de subir
      } else {
        alert('Error al subir el archivo.');
      }
    } catch (error) {
      alert('Hubo un problema con la subida.');
    }
  };

  const fetchFiles = async () => {
    try {
      const response = await fetch('http://localhost/galeria/api/files.php'); // Endpoint para obtener la lista de archivos
      const data = await response.json();
      setFiles(data.files);
    } catch (error) {
      console.error('Error al obtener la lista de archivos:', error);
    }
  };

  useEffect(() => {
    fetchFiles(); // Obtener la lista de archivos cuando el componente se monte
  }, []);

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-4">Bienvenido, Administrador</h1>
      
      <input type="file" onChange={handleFileChange} className="mb-4" />
      <button onClick={handleUpload} className="bg-blue-500 text-white p-2 rounded">Subir Archivo</button>

      <h2 className="text-lg font-bold mt-8">Archivos Subidos</h2>
      <table className="min-w-full bg-white border-collapse border border-gray-300">
        <thead>
          <tr className="bg-gray-200">
            {/* <th className="py-2 px-4 border">Nombre</th> */}
            <th className="py-2 px-4 border">Ruta</th>
            <th className="py-2 px-4 border">Fecha</th>
            <th className="py-2 px-4 border">Hora</th>
            <th className="py-2 px-4 border">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {files.map((file, index) => (
            <tr key={index} className="border-b">
              {/* <td className="px-4 py-2 border">{file.nombre}</td> */}
              <td className="px-4 py-2 border">{file.ruta}{file.nombre} </td>
              <td className="px-4 py-2 border">{file.fecha}</td>
              <td className="px-4 py-2 border">{file.hora}</td>
              <td className="px-4 py-2 border">
                <a href={`http://localhost/galeria/api/uploads/${file.nombre}`} target="_blank" rel="noopener noreferrer" className="text-blue-500">Ver</a>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default HomeAdmin;
