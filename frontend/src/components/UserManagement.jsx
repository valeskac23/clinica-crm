import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { UserPlus, Trash2, ShieldCheck } from 'lucide-react';

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [formData, setFormData] = useState({
    name: '', email: '', password: '', role: 'medico', color: '#3b82f6'
  });



  useEffect(() => { fetchUsers(); }, []);

  const fetchUsers = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/users/get');
      setUsers(res.data);
    } catch (err) { console.error("Error al cargar usuarios", err); }
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:5000/api/users/create', formData);
      alert("Usuario creado con éxito");
      setFormData({ name: '', email: '', password: '', role: 'medico', color: '#3b82f6' });
      fetchUsers();
    } catch (err) { alert("Error al crear usuario"); }
  };

  const handleDelete = async (id, name) => {
    // Confirmación nativa del navegador
    const confirmDelete = window.confirm(`¿Está seguro de que desea eliminar a ${name}? Esta acción no se puede deshacer.`);

    if (confirmDelete) {
      try {
        await axios.delete(`http://localhost:5000/api/users/delete/${id}`);
        setUsers(users.filter(user => user.id !== id)); // Actualiza la lista visualmente
        alert("Usuario eliminado");
      } catch (err) {
        alert("Error al eliminar usuario");
      }
    }
  };

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-8">
      {/* FORMULARIO DE CREACIÓN */}
      <section className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
        <div className="flex items-center gap-2 mb-6">
          <UserPlus className="text-blue-600" />
          <h2 className="text-xl font-bold">Registrar Nuevo Personal</h2>
        </div>
        <form onSubmit={handleCreate} className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <input type="text" placeholder="Nombre" className="p-2 border rounded"
            value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} required />

          <input type="email" placeholder="Correo" className="p-2 border rounded"
            value={formData.email} onChange={e => setFormData({ ...formData, email: e.target.value })} required />

          <input type="password" placeholder="Contraseña" className="p-2 border rounded"
            value={formData.password} onChange={e => setFormData({ ...formData, password: e.target.value })} required />

          <select className="p-2 border rounded" value={formData.role}
            onChange={e => setFormData({ ...formData, role: e.target.value })}>
            <option value="medico">Médico</option>
            <option value="enfermera">Enfermera</option>
            <option value="supervisor">Supervisor</option> {/* Nuevo Rol */}
          </select>

          <input type="color" className="w-full h-10 border rounded cursor-pointer"
            value={formData.color} onChange={e => setFormData({ ...formData, color: e.target.value })} />

          <button type="submit" className="bg-blue-600 text-white rounded hover:bg-blue-700 transition">
            Crear Usuario
          </button>
        </form>
      </section>

      {/* LISTA DE PERSONAL */}
      <section className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead className="bg-slate-50 border-b">
            <tr>
              <th className="p-4 font-semibold text-slate-700">Nombre</th>
              <th className="p-4 font-semibold text-slate-700">Rol</th>
              <th className="p-4 font-semibold text-slate-700">Email</th>
              <th className="p-4 text-right">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {users.map(user => (
              <tr key={user.id} className="border-b hover:bg-slate-50 transition">
                <td className="p-4 flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: user.color }}></div>
                  {user.name}
                </td>
                <td className="p-4 capitalize">
                  <span className={`px-2 py-1 rounded-md text-xs ${user.role === 'supervisor' ? 'bg-purple-100 text-purple-700' : 'bg-slate-100 text-slate-700'}`}>
                    {user.role}
                  </span>
                </td>
                <td className="p-4 text-slate-500 text-sm">{user.email}</td>
                <td className="p-4 text-right">
                  {user.role !== 'admin' && ( // Evitar borrar al admin a sí mismo
                    <button
                      onClick={() => handleDelete(user.id, user.name)}
                      className="text-red-500 hover:bg-red-50 p-2 rounded-lg transition"
                      title="Eliminar usuario"
                    >
                      <Trash2 size={18} />
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </div>
  );
};

export default UserManagement;