import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Login.css'; 

function Login() {
  const [usuario, setUsuario] = useState('');
  const [password, setPassword] = useState('');
  const [mensaje, setMensaje] = useState('');
  const navigate = useNavigate(); // Hook para redirigir

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch('http://localhost/galeria/api/login.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ usuario, password })
      });

      const data = await response.json();

      if (data.status === 'success') {
        setMensaje('✅ Bienvenido, acceso concedido.');

        // Guardar rol en localStorage o estado global si lo deseas
        localStorage.setItem('rol', data.rol);

        // Redirigir según el rol
        if (data.rol === 'admin') {
          navigate('/homeAdmin');
        } else {
          navigate('/homeUsuario');
        }
      } else {
        setMensaje('❌ Usuario o contraseña incorrectos.');
      }
    } catch (error) {
      console.error('Error en la conexión:', error);
      setMensaje(`❌ Error al conectar con el servidor: ${error.message}`);
    }
  };

  return (
    <div className="container">
      <div className="login-box">
        <h2>Login</h2>
        <form onSubmit={handleSubmit}>
          <input type="text" value={usuario} onChange={(e) => setUsuario(e.target.value)} required />
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
          <button type="submit">Ingresar</button>
        </form>
        {mensaje && <p>{mensaje}</p>}
      </div>
    </div>
  );
}

export default Login;
