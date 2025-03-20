import React, { useState, useEffect } from 'react';

function HomeAdmin() {
  const [file, setFile] = useState(null);
  const [files, setFiles] = useState([]);
  const [screens, setScreens] = useState([]);
  const [users, setUsers] = useState([]);
  const [selectedScreen, setSelectedScreen] = useState('');
  const [selectedUser, setSelectedUser] = useState('');
  const [screenName, setScreenName] = useState('');
  const [uploading, setUploading] = useState(false); // Add a state to handle upload status

  // PARTE SUBIR ARCHIVOS

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleUpload = async () => {
    if (!file) {
      alert('Por favor, selecciona un archivo.');
      return;
    }

    setUploading(true); // Indicate that upload is in progress

    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await fetch('http://localhost/galeria/api/upload.php', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        alert('Archivo subido con éxito.');
        fetchFiles(); // Refresh file list after successful upload
        setFile(null); // Clear the selected file after upload
      } else {
        const errorData = await response.json(); // Try to get error details from the server
        alert(`Error al subir el archivo: ${errorData?.message || 'Error desconocido'}`);
      }
    } catch (error) {
      console.error('Error durante la subida:', error);
      alert('Hubo un problema con la subida. Por favor, revisa la consola.');
    } finally {
      setUploading(false); // Indicate that upload has finished (success or failure)
    }
  };

  // PARTE MOSTRAR ARCHIVOS

  const fetchFiles = async () => {
    try {
      const response = await fetch('http://localhost/galeria/api/files.php');
      const data = await response.json();
      setFiles(data.files);
    } catch (error) {
      console.error('Error al obtener la lista de archivos:', error);
    }
  };

  // PARTE MOSTRAR PANTALLAS

  const fetchScreens = async () => {
    try {
      const response = await fetch('http://localhost/galeria/api/screens.php');
      const data = await response.json();
      setScreens(data.screens); // Actualiza el estado con las pantallas
    } catch (error) {
      console.error('Error al obtener las pantallas:', error);
    }
  };

  // PARTE MOSTRAR USUARIOS

  const fetchUsers = async () => {
    try {
      const response = await fetch('http://localhost/galeria/api/users.php');
      const data = await response.json();
      setUsers(data.users); // Actualiza el estado con los usuarios
    } catch (error) {
      console.error('Error al obtener los usuarios:', error);
    }
  };

  // PARTE ASIGNAR PANTALLA A USUARIOS

  const handleAssignScreen = async () => {
    if (!selectedUser || !selectedScreen) {
      alert('Selecciona un usuario y una pantalla.');
      return;
    }

    // Obtener los IDs de los archivos seleccionados
    const selectedFileIds = files
      .filter((file) => file.isSelected) // Solo los archivos marcados
      .map((file) => file.id); // Usar el ID del archivo

    if (selectedFileIds.length === 0) {
      alert("Selecciona al menos un archivo.");
      return;
    }

    console.log("Enviando:", {
      user: selectedUser,
      screen: selectedScreen,
      selectedFiles: selectedFileIds
    });

    try {
      const response = await fetch('http://localhost/galeria/api/assign_screen.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          user: selectedUser,
          screen: selectedScreen,
          selectedFiles: selectedFileIds
        }),
      });

      const result = await response.json();

      if (response.ok) {
        alert(result.message);

        // Limpiar selects
        setSelectedUser('');
        setSelectedScreen('');

        // Desmarcar todos los archivos seleccionados
        setFiles((prevFiles) =>
          prevFiles.map((file) => ({ ...file, isSelected: false }))
        );
      } else {
        alert(result.message || "Error al asignar la pantalla.");
      }
    } catch (error) {
      alert("Hubo un problema al asignar la pantalla.");
    }
  };



  // PARTE CREAR PANTALLA

  const handleCreateScreen = async () => {
    if (!screenName) {
      alert('Introduce un nombre para la pantalla.');
      return;
    }

    try {
      const response = await fetch('http://localhost/galeria/api/create_screen.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nombre: screenName }),
      });

      if (response.ok) {
        alert('Pantalla creada con éxito.');
        setScreenName('');
        fetchScreens();
      } else {
        alert('Error al crear la pantalla.');
      }
    } catch (error) {
      alert('Hubo un problema al crear la pantalla.');
    }
  };

  useEffect(() => {
    fetchFiles();
    fetchScreens();
    fetchUsers();
  }, []);

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-4">Bienvenido, Administrador</h1>

      <input type="file" onChange={handleFileChange} className="mb-4" />
      <button
        onClick={handleUpload}
        className={`bg-blue-500 text-white p-2 rounded ${uploading ? 'opacity-50 cursor-not-allowed' : ''}`}
        disabled={uploading}
      >
        {uploading ? 'Subiendo...' : 'Subir Archivo'}
      </button>

      <h2 className="text-lg font-bold mt-8">Crear Nueva Pantalla</h2>
      <input type="text" value={screenName} onChange={(e) => setScreenName(e.target.value)} placeholder="Nombre de la pantalla" className="border p-2 mr-2" />
      <button onClick={handleCreateScreen} className="bg-purple-500 text-white p-2 rounded">Crear Pantalla</button>

      <h2 className="text-lg font-bold mt-8">Asignar Pantalla a Usuario</h2>
      <select value={selectedUser} onChange={(e) => setSelectedUser(e.target.value)} className="border p-2 mr-2">
        <option value="">Selecciona un usuario</option>
        {users.map((user) => (
          <option key={user.id} value={user.id}>{user.usuario}</option>
        ))}
      </select>

      <select value={selectedScreen} onChange={(e) => setSelectedScreen(e.target.value)} className="border p-2">
        <option value="">Selecciona una pantalla</option>
        {screens.map((screen) => (
          <option key={screen.id_pantalla} value={screen.id_pantalla}>{screen.nombre}</option>
        ))}
      </select>


      <button onClick={handleAssignScreen} className="bg-green-500 text-white p-2 rounded ml-2">Asignar</button>

      <h2 className="text-lg font-bold mt-8">Archivos Subidos</h2>
      <table className="min-w-full bg-white border-collapse border border-gray-300">
        <thead>
          <tr className="bg-gray-200">
            <th className="py-2 px-4 border">Seleccionar</th>
            <th className="py-2 px-4 border">Nombre</th>
            <th className="py-2 px-4 border">Fecha</th>
            <th className="py-2 px-4 border">Hora</th>
          </tr>
        </thead>
        <tbody>
          {files.map((file, index) => (
            <tr key={file.id || index} className="border-b">
              <td className="px-4 py-2 border">
                <input
                  type="checkbox"
                  checked={file.isSelected || false}
                  onChange={() => {
                    setFiles((prevFiles) =>
                      prevFiles.map((f, i) =>
                        i === index ? { ...f, isSelected: !f.isSelected } : f
                      )
                    );
                  }}
                />
              </td>
              <td className="px-4 py-2 border">{file.nombre}</td>
              <td className="px-4 py-2 border">{file.fecha}</td>
              <td className="px-4 py-2 border">{file.hora}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default HomeAdmin;