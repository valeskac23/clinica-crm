import React, { useState } from 'react';
import axios from 'axios';
import { UserPlus, Mail, Lock, UserCircle, Palette } from 'lucide-react';

const CreateUser = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'medico',
    color: '#3b82f6' // Azul por defecto
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('http://localhost:5000/api/users/create', formData);
      alert("Usuario creado: " + res.data.user.name);
    } catch (err) {
      alert("Error al crear usuario");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-100 p-6">
      <div className="w-full max-w-lg bg-white/80 backdrop-blur-lg p-8 rounded-2xl shadow-xl border border-white">
        <div className="flex items-center gap-3 mb-6 text-blue-600">
          <UserPlus size={28} />
          <h2 className="text-2xl font-bold text-slate-800">Registrar Personal Médico</h2>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Nombre Completo */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Nombre Completo</label>
            <div className="relative">
              <UserCircle className="absolute left-3 top-3 text-slate-400" size={18} />
              <input
                type="text"
                className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                placeholder="Dr. Juan Pérez"
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
              />
            </div>
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Correo Electrónico</label>
            <div className="relative">
              <Mail className="absolute left-3 top-3 text-slate-400" size={18} />
              <input
                type="email"
                className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                placeholder="medico@clinica.com"
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {/* Rol */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Rol</label>
              <select
                className="w-full p-2 border rounded-lg bg-white outline-none"
                onChange={(e) => setFormData({ ...formData, role: e.target.value })}
              >
                <option value="medico">Médico/a</option>
                <option value="enfermera">Enfermero/a</option>
                <option value="admin">Administrador</option>
              </select>
            </div>

            {/* Color de Guardia */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Color en Calendario</label>
              <div className="flex items-center gap-2 border p-1.5 rounded-lg bg-white">
                <Palette size={18} className="text-slate-400" />
                <input
                  type="color"
                  className="h-7 w-full cursor-pointer bg-transparent"
                  value={formData.color}
                  onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                />
              </div>
            </div>
          </div>

          {/* Contraseña */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Contraseña Temporal</label>
            <div className="relative">
              <Lock className="absolute left-3 top-3 text-slate-400" size={18} />
              <input
                type="password"
                className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                placeholder="••••••••"
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                required
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-xl transition shadow-lg shadow-blue-200"
          >
            Registrar Usuario
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreateUser;