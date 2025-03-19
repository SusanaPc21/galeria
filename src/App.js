import { Routes, Route } from 'react-router-dom';
import Login from './Login';  
import HomeAdmin from './HomeAdmin';  
import HomeUsuario from './HomeUsuario';  

function App() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/homeAdmin" element={<HomeAdmin />} />
      <Route path="/homeUsuario" element={<HomeUsuario />} />
    </Routes>
  );
}

export default App;
