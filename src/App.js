import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./login";
import Galeria from "./galeria";
import Subir from "./Subir";
import Asociar from "./Asociar";  // Nueva pantalla

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/galeria" element={<Galeria />} />
        <Route path="/subir" element={<Subir />} />
        <Route path="/asociar" element={<Asociar />} /> {/* Nueva ruta */}
      </Routes>
    </Router>
  );
}

export default App;
