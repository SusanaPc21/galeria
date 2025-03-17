import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const users = [
  { username: "admin", password: "admin123", role: "admin" },
  { username: "user", password: "user123", role: "user" }
];

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    const user = users.find((u) => u.username === username && u.password === password);

    if (user) {
      if (user.role === "user") {
        navigate("/galeria"); // Si es usuario, lo manda a galería
      } else if (user.role === "admin") {
        navigate("/subir"); // Si es admin, lo manda a subir archivos
      }
    } else {
      setMessage("Credenciales incorrectas.");
    }
  };

  return (
    <div style={{ textAlign: "center", marginTop: "50px" }}>
      <h2>Login</h2>
      <form onSubmit={handleLogin}>
        <input
          type="text"
          placeholder="Usuario"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <input
          type="password"
          placeholder="Contraseña"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button type="submit">Ingresar</button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
};

export default Login;
