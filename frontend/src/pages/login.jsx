import React, { useState } from 'react';
import { Mail, Lock } from 'lucide-react';
import clinicalBackground from '../assets/clinica2.png';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext'

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    username: '',
    password: '',
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };



  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('http://localhost:5000/api/users/login', {
        username: formData.username.trim(), // Limpiamos espacios
        password: formData.password
      });

      console.log("Respuesta servidor:", res.data);

      if (res.data.token) {
        localStorage.setItem('token', res.data.token);
        localStorage.setItem('user', JSON.stringify(res.data.user)); // Guardamos user para el refresh

        login(res.data.user);

        // Redirección
        if (res.data.user.role === 'admin') {
          navigate('/admin');
        } else {
          navigate('/dashboard');
        }
      }
    } catch (err) {
      // Esto te dirá exactamente qué dice el backend en la consola
      console.error("Detalle del error:", err.response?.data);
      alert(err.response?.data?.msg || "Error de conexión");
    }
  };


  return (
    // CONTENEDOR PRINCIPAL CON LA IMAGEN DE FONDO
    <div
      className="min-h-screen flex items-center justify-center bg-cover bg-center p-4 font-sans"
      style={{ backgroundImage: `url(${clinicalBackground})` }}
    >

      {/* CAPA TRASLÚCIDA (GLASS) */}
      <div className="w-full max-w-[360px] p-10 rounded-2xl border border-white/20 bg-white/40 shadow-xl backdrop-blur-md">

        {/* TÍTULO LOGIN */}
        <h2 className="text-center text-3xl font-normal text-slate-800 mb-8">
          Login
        </h2>

        {/* FORMULARIO */}
        <form onSubmit={handleSubmit} className="space-y-4">

          {/* CAMPO USERNAME */}
          <div className="relative">
            {/* Icono de usuario/correo (simulado de la imagen) */}
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
            <input
              name="username"
              type="text"
              placeholder="Username"
              onChange={handleChange}
              className="w-full pl-11 pr-4 py-2.5 rounded-lg border border-white/30 bg-white/70 placeholder:text-slate-500 text-slate-900 focus:outline-none focus:ring-1 focus:ring-blue-400 focus:border-blue-400 transition"
              required
            />
          </div>

          {/* CAMPO PASSWORD */}
          <div className="relative">
            {/* Icono de candado */}
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
            <input
              name="password"
              type="password"
              placeholder="Password"
              onChange={handleChange}
              className="w-full pl-11 pr-4 py-2.5 rounded-lg border border-white/30 bg-white/70 placeholder:text-slate-500 text-slate-900 focus:outline-none focus:ring-1 focus:ring-blue-400 focus:border-blue-400 transition"
              required
            />
          </div>

          {/* BOTÓN LOGIN (Color azul verdoso de la imagen) */}
          <button
            type="submit"
            className="w-full flex justify-center py-2.5 px-4 rounded-xl text-white font-medium bg-[#4986a7] hover:bg-[#3d708d] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#4986a7] transition-colors shadow-md mb-4"
          >
            Login
          </button>
        </form>

        {/* ENLACE "FORGOT PASSWORD?" */}
        <div className="text-center mt-6">
          <a href="#" className="text-sm font-medium text-[#4986a7] hover:text-[#3d708d]">
            Forgot password?
          </a>
        </div>
      </div>
    </div>
  );

};

export default Login;