import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Login.css'; 

function Login() {
  const [usuario, setUsuario] = useState('');
  const [password, setPassword] = useState('');
  const [mensaje, setMensaje] = useState('');
  const [isRegistering, setIsRegistering] = useState(false); // Estado para alternar entre login y registro
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch('http://localhost/galeria/api/login.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          accion: isRegistering ? 'register' : 'login',
          usuario,
          password
        })
      });

      const data = await response.json();

      if (data.status === 'success') {
        setMensaje('✅ Bienvenido, acceso concedido.');

        // Guardar rol en localStorage o estado global si lo deseas
        localStorage.setItem('rol', data.rol);
        localStorage.setItem('id', data.id);
        if (isRegistering) {
          setMensaje('✅ Usuario registrado exitosamente. Por favor, inicia sesión.');
          setIsRegistering(false);
        } else {
          setMensaje('✅ Bienvenido, acceso concedido.');
          localStorage.setItem('rol', data.rol);

        // Redirigir según el rol
        if (data.rol === 'admin') {
          navigate('/homeAdmin');
        } else {
          setMensaje('✅ Bienvenido, acceso concedido.');
          localStorage.setItem('rol', data.rol);

          if (data.rol === 'admin') {
            navigate('/homeAdmin');
          } else {
            navigate('/homeUsuario');
          }
        }
      } else {
        setMensaje(`❌ ${data.message || 'Usuario o contraseña incorrectos.'}`);
      }
    } catch (error) {
      console.error('Error en la conexión:', error);
      setMensaje(`❌ Error al conectar con el servidor: ${error.message}`);
    }
  };

  return (
    <div className="container">
      <div className="login-box">
        <h2>{isRegistering ? 'Registro' : 'Login'}</h2>
        <form onSubmit={handleSubmit}>
          <input type="text" placeholder="Usuario" value={usuario} onChange={(e) => setUsuario(e.target.value)} required />
          <input type="password" placeholder="Contraseña" value={password} onChange={(e) => setPassword(e.target.value)} required />
          <button type="submit">{isRegistering ? 'Registrarse' : 'Ingresar'}</button>
        </form>
        {mensaje && <p>{mensaje}</p>}
        <p>
          {isRegistering ? (
            <span>
              ¿Ya tienes una cuenta?{' '}
              <button onClick={() => setIsRegistering(false)}>Iniciar sesión</button>
            </span>
          ) : (
            <span>
              ¿No tienes una cuenta?{' '}
              <button onClick={() => setIsRegistering(true)}>Regístrate aquí</button>
            </span>
          )}
        </p>
      </div>
    </div>
  );
}

export default Login;
