import React, { useState } from 'react';

function HomeAdmin() {
  const [file, setFile] = useState(null);

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
      } else {
        alert('Error al subir el archivo.');
      }
    } catch (error) {
      alert('Hubo un problema con la subida.');
    }
  };

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-4">Bienvenido, Administrador</h1>
      <input type="file" onChange={handleFileChange} className="mb-4" />
      <button onClick={handleUpload} className="bg-blue-500 text-white p-2 rounded">Subir Archivo</button>
    </div>
  );
}

export default HomeAdmin;
