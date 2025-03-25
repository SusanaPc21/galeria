import React, { useState, useEffect } from 'react';
import './admin.css';

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

  const handleLogout = () => {
    localStorage.removeItem('id');
    window.location.href = '/';
  };

  const fetchData = async (url, setter) => {
    try {
      const response = await fetch(url);
      const data = await response.json();
      setter(data[Object.keys(data)[0]]);
    } catch (error) {
      console.error(`Error: ${error}`);
    }
  };

  const handleUpload = async () => {
    if (!file) return alert('Selecciona un archivo.');
    setUploading(true);
    const formData = new FormData();
    formData.append('file', file);
    try {
      const response = await fetch('http://localhost/galeria/api/upload.php', {
        method: 'POST',
        body: formData,
      });
      if (response.ok) {
        alert('Archivo subido');
        fetchData('http://localhost/galeria/api/files.php', setFiles);
        setFile(null);
      } else alert('Error al subir');
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setUploading(false);
    }
  };

  const handleAssignScreen = async () => {
    if (!selectedUser || !selectedScreen) return alert('Selecciona usuario y pantalla');
    const selectedFileIds = files.filter(f => f.isSelected).map(f => f.id);
    if (selectedFileIds.length === 0) return alert("Selecciona archivos");
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
        setFiles(files.map(f => ({ ...f, isSelected: false })));
      } else alert(result.message || "Error");
    } catch (error) {
      alert("Error al asignar");
    }
  };

  const handleCreateScreen = async () => {
    if (!screenName) return alert('Introduce nombre');
    try {
      const response = await fetch('http://localhost/galeria/api/create_screen.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nombre: screenName }),
      });
      if (response.ok) {
        alert('Pantalla creada');
        setScreenName('');
        fetchData('http://localhost/galeria/api/screens.php', setScreens);
      } else alert('Error al crear');
    } catch (error) {
      alert('Error');
    }
  };

  useEffect(() => {
    fetchData('http://localhost/galeria/api/files.php', setFiles);
    fetchData('http://localhost/galeria/api/screens.php', setScreens);
    fetchData('http://localhost/galeria/api/users.php', setUsers);
    fetchData('http://localhost/galeria/api/verFicheros.php', setFicheros);
  }, []);

  return (
    <div className="p-4">
      <button className="absolute top-4 right-4 bg-red-500 text-white px-4 py-2 rounded" onClick={handleLogout}>
        Salir
      </button>
      <h1 className="text-xl font-bold mb-4">Bienvenido, Administrador</h1>

      <input type="file" onChange={e => setFile(e.target.files[0])} className="mb-4" />
      <button onClick={handleUpload} disabled={uploading} className={`bg-blue-500 text-white p-2 rounded ${uploading ? 'opacity-50' : ''}`}>
        {uploading ? 'Subiendo...' : 'Subir Archivo'}
      </button>

      <h2 className="text-lg font-bold mt-8">Crear Pantalla</h2>
      <input type="text" value={screenName} onChange={e => setScreenName(e.target.value)} placeholder="Nombre" className="border p-2 mr-2" />
      <button onClick={handleCreateScreen} className="bg-purple-500 text-white p-2 rounded">Crear</button>

      <h2 className="text-lg font-bold mt-8">Asignar Pantalla</h2>
      <select value={selectedUser} onChange={e => setSelectedUser(e.target.value)} className="border p-2 mr-2">
        <option value="">Usuario</option>
        {users.map(user => <option key={user.id} value={user.id}>{user.nombre_usuario}</option>)}
      </select>

      <select value={selectedScreen} onChange={e => setSelectedScreen(e.target.value)} className="border p-2">
        <option value="">Pantalla</option>
        {screens.map(screen => <option key={screen.id_pantalla} value={screen.id_pantalla}>{screen.nombre}</option>)}
      </select>

      <button onClick={handleAssignScreen} className="bg-green-500 text-white p-2 rounded ml-2">Asignar</button>

      <h2 className="text-lg font-bold mt-8">Archivos</h2>
      <table className="min-w-full bg-white border-collapse border border-gray-300">
        <thead>
          <tr className="bg-gray-200">
            <th className="py-2 px-4 border">Sel.</th>
            <th className="py-2 px-4 border">Nombre</th>
            <th className="py-2 px-4 border">Fecha</th>
            <th className="py-2 px-4 border">Hora</th>
          </tr>
        </thead>
        <tbody>
          {files.map((file, i) => (
            <tr key={file.id || i} className="border-b">
              <td className="px-4 py-2 border">
                <input type="checkbox" checked={file.isSelected || false} onChange={() => setFiles(files.map((f, idx) => i === idx ? {...f, isSelected: !f.isSelected} : f))} />
              </td>
              <td className="px-4 py-2 border">{file.nombre}</td>
              <td className="px-4 py-2 border">{file.fecha}</td>
              <td className="px-4 py-2 border">{file.hora}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <h2 className="text-lg font-bold mt-8">Ficheros</h2>
      <table className="min-w-full bg-white border-collapse border border-gray-300">
        <thead>
          <tr className="bg-gray-200">
            <th className="py-2 px-4 border">Pantalla</th>
            <th className="py-2 px-4 border">Usuario</th>
            <th className="py-2 px-4 border">Imágenes</th>
          </tr>
        </thead>
        <tbody>
          {ficheros.length > 0 ? ficheros.map((f, i) => (
            <tr key={f.id_asignar || i} className="border-b">
              <td className="px-4 py-2 border">{f.nombre_pantalla}</td>
              <td className="px-4 py-2 border">{f.nombre_usuario}</td>
              <td className="px-4 py-2 border">{f.id_archivos}</td>
            </tr>
          )) : (
            <tr><td colSpan="3" className="text-center py-2 border">No hay archivos</td></tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

export default HomeAdmin;