import React, { useState, useEffect } from 'react';

function HomeAdmin() {
  const [file, setFile] = useState(null);
  const [files, setFiles] = useState([]);
  const [screens, setScreens] = useState([]);
  const [users, setUsers] = useState([]);
  const [ficheros, setFicheros] = useState([]);
  const [selectedScreen, setSelectedScreen] = useState('');
  const [selectedUser, setSelectedUser] = useState('');
  const [screenName, setScreenName] = useState('');
  const [uploading, setUploading] = useState(false);

  const handleFileChange = (e) => setFile(e.target.files[0]);

  const handleUpload = async () => {
    if (!file) return alert('Por favor, selecciona un archivo.');
    setUploading(true);
    const formData = new FormData();
    formData.append('file', file);
    try {
      const response = await fetch('http://localhost/galeria/api/upload.php', { method: 'POST', body: formData });
      if (response.ok) {
        alert('Archivo subido con éxito.');
        setFile(null);
        fetchFiles();
        fetchFicheros();
      } else {
        const errorData = await response.json();
        alert(`Error al subir el archivo: ${errorData?.message || 'Error desconocido'}`);
      }
    } catch (error) {
      console.error('Error durante la subida:', error);
      alert('Hubo un problema con la subida. Por favor, revisa la consola.');
    } finally {
      setUploading(false);
    }
  };

  const fetchFiles = async () => {
    try {
      const response = await fetch('http://localhost/galeria/api/files.php');
      const data = await response.json();
      setFiles(data.files.map((f) => ({ ...f, isSelected: false })));
    } catch (error) {
      console.error('Error al obtener la lista de archivos:', error);
    }
  };

  const fetchScreens = async () => {
    try {
      const response = await fetch('http://localhost/galeria/api/screens.php');
      const data = await response.json();
      setScreens(data.screens);
    } catch (error) {
      console.error('Error al obtener las pantallas:', error);
    }
  };

  const fetchUsers = async () => {
    try {
      const response = await fetch('http://localhost/galeria/api/users.php');
      const data = await response.json();
      setUsers(data.users);
    } catch (error) {
      console.error('Error al obtener los usuarios:', error);
    }
  };

  const fetchFicheros = async () => {
    try {
      const response = await fetch("http://localhost/galeria/api/verFicheros.php");
      const data = await response.json();
      setFicheros(data.ficheros);
    } catch (error) {
      console.error("Error al obtener los archivos:", error);
    }
  };

  const handleAssignScreen = async () => {
    if (!selectedUser || !selectedScreen) return alert('Selecciona un usuario y una pantalla.');
    const selectedFileIds = files.filter((file) => file.isSelected).map((file) => file.id);
    if (selectedFileIds.length === 0) return alert("Selecciona al menos un archivo.");
    try {
      const response = await fetch('http://localhost/galeria/api/assign_screen.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user: selectedUser, screen: selectedScreen, selectedFiles: selectedFileIds }),
      });
      const result = await response.json();
      if (response.ok) {
        alert(result.message);
        setSelectedUser('');
        setSelectedScreen('');
        setFiles((prevFiles) => prevFiles.map((file) => ({ ...file, isSelected: false })));
        fetchFicheros();
      } else {
        alert(result.message || "Error al asignar la pantalla.");
      }
    } catch (error) {
      alert("Hubo un problema al asignar la pantalla.");
    }
  };

  const handleCreateScreen = async () => {
    if (!screenName) return alert('Introduce un nombre para la pantalla.');
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

  useEffect(() => { fetchFiles(); fetchScreens(); fetchUsers(); fetchFicheros(); }, []);

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-4">Bienvenido, Administrador</h1>
      <input type="file" onChange={handleFileChange} className="mb-4" />
      <button onClick={handleUpload} className={`bg-blue-500 text-white p-2 rounded ${uploading ? 'opacity-50 cursor-not-allowed' : ''}`} disabled={uploading}>
        {uploading ? 'Subiendo...' : 'Subir Archivo'}
      </button>

      <h2 className="text-lg font-bold mt-8">Crear Nueva Pantalla</h2>
      <input type="text" value={screenName} onChange={(e) => setScreenName(e.target.value)} placeholder="Nombre de la pantalla" className="border p-2 mr-2" />
      <button onClick={handleCreateScreen} className="bg-purple-500 text-white p-2 rounded">Crear Pantalla</button>

      <h2 className="text-lg font-bold mt-8">Asignar Pantalla a Usuario</h2>
      <select value={selectedUser} onChange={(e) => setSelectedUser(e.target.value)} className="border p-2 mr-2">
        <option value="">Selecciona un usuario</option>
        {users.map((user) => <option key={user.id} value={user.id}>{user.nombre_usuario}</option>)}
      </select>
      <select value={selectedScreen} onChange={(e) => setSelectedScreen(e.target.value)} className="border p-2">
        <option value="">Selecciona una pantalla</option>
        {screens.map((screen) => <option key={screen.id_pantalla} value={screen.id_pantalla}>{screen.nombre}</option>)}
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
                <input type="checkbox" checked={file.isSelected || false} onChange={() => setFiles((prevFiles) => prevFiles.map((f, i) => i === index ? { ...f, isSelected: !f.isSelected } : f))} />
              </td>
              <td className="px-4 py-2 border">{file.nombre}</td>
              <td className="px-4 py-2 border">{file.fecha}</td>
              <td className="px-4 py-2 border">{file.hora}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <h2 className="text-lg font-bold mt-8">Ficheros asignados</h2>
      <table className="min-w-full bg-white border-collapse border border-gray-300">
        <thead>
          <tr className="bg-gray-200">
            <th className="py-2 px-4 border">Pantalla</th>
            <th className="py-2 px-4 border">Usuario</th>
            <th className="py-2 px-4 border">Imágenes</th>
          </tr>
        </thead>
        <tbody>
          {ficheros.length > 0 ? ficheros.map((fichero, index) => (
            <tr key={fichero.id_asignar || index} className="border-b">
              <td className="px-4 py-2 border">{fichero.nombre_pantalla}</td>
              <td className="px-4 py-2 border">{fichero.nombre_usuario}</td>
              <td className="px-4 py-2 border">{fichero.id_archivos}</td>
            </tr>
          )) : (
            <tr>
              <td colSpan="3" className="text-center py-2 border">No hay archivos asignados</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

export default HomeAdmin;