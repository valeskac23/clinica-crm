import React, { useState, useEffect } from 'react';
import axios from 'axios';
import GuardiaCalendar from '../components/GuardiaCalendar';
import clinicalBackground from '../assets/clinica2.png';
import {
  Calendar,
  Users,
  BarChart3,
  ChevronLeft,
  ChevronRight,
  PlusCircle,
  LogOut,
  Trash2,
  UserPlus
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const AdminPanel = () => {
  const { logout } = useAuth();
  const [activeView, setActiveView] = useState('calendario'); // 'calendario' o 'personal'
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [showModal, setShowModal] = useState(false);

  // Estados para Personal
  const [users, setUsers] = useState([]);
  const [doctors, setDoctors] = useState([]); // Para el select de guardias
  const [newUser, setNewUser] = useState({
    name: '', email: '', password: '', role: 'medico', color: '#3b82f6'
  });

  // Estado para Guardias
  const [newShift, setNewShift] = useState({
    title: 'Guardia 24h', userId: '', start: '', end: ''
  });

  useEffect(() => {
    fetchUsers();
    fetchDoctors();
  }, []);

  const fetchUsers = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/users/get');
      setUsers(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error("Error cargando usuarios", err);
    }
  };

  const fetchDoctors = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/users/doctors');
      setDoctors(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error("Error cargando médicos", err);
    }
  };

  const handleCreateUser = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:5000/api/users/create', newUser);
      alert("Usuario creado con éxito");
      setNewUser({ name: '', email: '', password: '', role: 'medico', color: '#3b82f6' });
      fetchUsers();
      fetchDoctors();
    } catch (err) {
      alert("Error al crear usuario");
    }
  };

  const handleDeleteUser = async (id, name) => {
    if (window.confirm(`¿Está seguro de eliminar a ${name}?`)) {
      try {
        await axios.delete(`http://localhost:5000/api/users/delete/${id}`);
        fetchUsers();
        fetchDoctors();
      } catch (err) {
        alert("Error al eliminar");
      }
    }
  };

  const handleShiftSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:5000/api/shifts', newShift);
      alert("Guardia asignada con éxito");
      setShowModal(false);
      window.location.reload();
    } catch (err) {
      alert("Error al crear guardia");
    }
  };

  return (
    <div
      className="min-h-screen bg-cover bg-center flex font-sans"
      style={{ backgroundImage: `url(${clinicalBackground})`, backgroundAttachment: 'fixed' }}
    >
      {/* SIDEBAR */}
      <aside className={`${isCollapsed ? 'w-20' : 'w-64'} transition-all duration-300 bg-white/30 backdrop-blur-md border-r border-white/20 flex flex-col shadow-xl`}>
        <div className="p-6 flex items-center justify-between">
          {!isCollapsed && <h1 className="text-xl font-bold text-slate-800">Clínica Admin</h1>}
          <button onClick={() => setIsCollapsed(!isCollapsed)} className="p-1.5 rounded-lg bg-white/50 hover:bg-white/80 text-slate-700">
            {isCollapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
          </button>
        </div>

        <nav className="flex-1 px-4 space-y-2 mt-4">
          <NavItem
            icon={<Calendar size={22} />}
            label="Calendario"
            active={activeView === 'calendario'}
            collapsed={isCollapsed}
            onClick={() => setActiveView('calendario')}
          />
          <NavItem
            icon={<Users size={22} />}
            label="Personal"
            active={activeView === 'personal'}
            collapsed={isCollapsed}
            onClick={() => setActiveView('personal')}
          />
          <NavItem icon={<BarChart3 size={22} />} label="Reportes" collapsed={isCollapsed} />
        </nav>

        <div className="p-4 border-t border-white/10">
          <button onClick={logout} className="w-full flex items-center gap-3 p-3 text-slate-700 hover:bg-red-500/20 hover:text-red-700 rounded-xl transition-all">
            <LogOut size={22} />
            {!isCollapsed && <span className="font-medium">Cerrar Sesión</span>}
          </button>
        </div>
      </aside>

      {/* CONTENIDO PRINCIPAL */}
      <main className="flex-1 p-8 overflow-y-auto">
        <div className="max-w-6xl mx-auto">

          {/* VISTA CALENDARIO */}
          {activeView === 'calendario' && (
            <>
              <header className="flex justify-between items-center mb-8 bg-white/40 backdrop-blur-sm p-6 rounded-2xl border border-white/30 shadow-lg">
                <div>
                  <h2 className="text-3xl font-bold text-slate-800">Gestión de Guardias</h2>
                  <p className="text-slate-600">Asignación y monitoreo de turnos médicos</p>
                </div>
                <button onClick={() => setShowModal(true)} className="flex items-center gap-2 bg-[#4986a7] hover:bg-[#3d708d] text-white px-6 py-3 rounded-xl font-bold transition-all shadow-lg active:scale-95">
                  <PlusCircle size={20} /> Asignar Guardia
                </button>
              </header>
              <section className="bg-white/60 backdrop-blur-md p-6 rounded-3xl shadow-2xl border border-white/40">
                <GuardiaCalendar />
              </section>
            </>
          )}

          {/* VISTA PERSONAL */}
          {activeView === 'personal' && (
            <div className="space-y-8">
              <header className="bg-white/40 backdrop-blur-sm p-6 rounded-2xl border border-white/30 shadow-lg">
                <h2 className="text-3xl font-bold text-slate-800">Gestión de Personal</h2>
                <p className="text-slate-600">Administre los usuarios y sus roles dentro del sistema</p>
              </header>

              {/* Formulario de Creación */}
              <section className="bg-white/50 backdrop-blur-md p-8 rounded-3xl shadow-xl border border-white/40">
                <div className="flex items-center gap-3 mb-6 text-slate-800">
                  <UserPlus size={24} className="text-[#4986a7]" />
                  <h3 className="text-xl font-bold">Registrar Nuevo Usuario</h3>
                </div>
                <form onSubmit={handleCreateUser} className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <input type="text" placeholder="Nombre completo" className="p-3 rounded-xl bg-white/60 border border-white outline-none focus:ring-2 focus:ring-blue-400" value={newUser.name} onChange={e => setNewUser({ ...newUser, name: e.target.value })} required />
                  <input type="email" placeholder="Correo electrónico" className="p-3 rounded-xl bg-white/60 border border-white outline-none focus:ring-2 focus:ring-blue-400" value={newUser.email} onChange={e => setNewUser({ ...newUser, email: e.target.value })} required />
                  <input type="password" placeholder="Contraseña" className="p-3 rounded-xl bg-white/60 border border-white outline-none focus:ring-2 focus:ring-blue-400" value={newUser.password} onChange={e => setNewUser({ ...newUser, password: e.target.value })} required />
                  <select className="p-3 rounded-xl bg-white/60 border border-white outline-none" value={newUser.role} onChange={e => setNewUser({ ...newUser, role: e.target.value })}>
                    <option value="medico">Médico</option>
                    <option value="enfermera">Enfermera</option>
                    <option value="supervisor">Supervisor</option>
                  </select>
                  <div className="flex items-center gap-3 p-3 rounded-xl bg-white/60 border border-white">
                    <span className="text-sm font-semibold text-slate-600">Color:</span>
                    <input type="color" className="w-full h-8 cursor-pointer rounded" value={newUser.color} onChange={e => setNewUser({ ...newUser, color: e.target.value })} />
                  </div>
                  <button type="submit" className="bg-[#4986a7] text-white rounded-xl font-bold hover:bg-[#3d708d] transition-all shadow-md">
                    Crear Usuario
                  </button>
                </form>
              </section>

              {/* Tabla de Usuarios */}
              <section className="bg-white/60 backdrop-blur-md rounded-3xl shadow-2xl border border-white/40 overflow-hidden">
                <table className="w-full text-left border-collapse">
                  <thead className="bg-[#4986a7]/20 border-b border-white/30">
                    <tr>
                      <th className="p-4 font-bold text-slate-800">Nombre</th>
                      <th className="p-4 font-bold text-slate-800">Rol</th>
                      <th className="p-4 font-bold text-slate-800">Email</th>
                      <th className="p-4 text-center font-bold text-slate-800">Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map(user => (
                      <tr key={user._id} className="border-b border-white/20 hover:bg-white/30 transition-colors">
                        <td className="p-4 flex items-center gap-3">
                          <div className="w-3 h-3 rounded-full shadow-sm" style={{ backgroundColor: user.color }}></div>
                          <span className="font-medium text-slate-700">{user.name}</span>
                        </td>
                        <td className="p-4">
                          <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase ${user.role === 'supervisor' ? 'bg-purple-100 text-purple-700' : 'bg-blue-100 text-blue-700'
                            }`}>
                            {user.role}
                          </span>
                        </td>
                        <td className="p-4 text-slate-600">{user.email}</td>
                        <td className="p-4 text-center">
                          {user.role !== 'admin' && (
                            <button onClick={() => handleDeleteUser(user._id, user.name)} className="text-red-500 hover:bg-red-50 p-2 rounded-lg transition-colors">
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
          )}
        </div>

        {/* MODAL ASIGNAR GUARDIA */}
        {showModal && (
          <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <div className="bg-white/90 backdrop-blur-lg rounded-3xl p-8 max-w-md w-full shadow-2xl border border-white">
              <h3 className="text-2xl font-bold text-slate-800 mb-6">Nueva Asignación</h3>
              <form onSubmit={handleShiftSubmit} className="space-y-5">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Médico / Enfermera</label>
                  <select className="w-full bg-white/50 border border-slate-200 rounded-xl p-3 outline-none focus:ring-2 focus:ring-blue-400"
                    onChange={(e) => setNewShift({ ...newShift, userId: e.target.value })} required>
                    <option value="">Seleccionar personal...</option>
                    {doctors.map(doc => (
                      <option key={doc._id} value={doc._id}>{doc.name} ({doc.role})</option>
                    ))}
                  </select>
                </div>
                <div className="grid grid-cols-1 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">Inicio</label>
                    <input type="datetime-local" className="w-full bg-white/50 border border-slate-200 rounded-xl p-3 outline-none focus:ring-2 focus:ring-blue-400"
                      onChange={(e) => setNewShift({ ...newShift, start: e.target.value })} required />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">Fin</label>
                    <input type="datetime-local" className="w-full bg-white/50 border border-slate-200 rounded-xl p-3 outline-none focus:ring-2 focus:ring-blue-400"
                      onChange={(e) => setNewShift({ ...newShift, end: e.target.value })} required />
                  </div>
                </div>
                <div className="flex gap-3 mt-8">
                  <button type="button" onClick={() => setShowModal(false)} className="flex-1 py-3 text-slate-600 font-semibold hover:bg-slate-100 rounded-xl">Cancelar</button>
                  <button type="submit" className="flex-1 bg-[#4986a7] text-white py-3 rounded-xl font-bold shadow-lg hover:bg-[#3d708d]">Guardar</button>
                </div>
              </form>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

const NavItem = ({ icon, label, active = false, collapsed, onClick }) => (
  <div
    onClick={onClick}
    className={`
      flex items-center gap-4 p-3 rounded-xl cursor-pointer transition-all duration-200
      ${active
        ? 'bg-[#4986a7] text-white shadow-md shadow-blue-900/20'
        : 'text-slate-700 hover:bg-white/40 hover:text-slate-900'}
  `}>
    <div className="flex-shrink-0">{icon}</div>
    {!collapsed && <span className="font-medium whitespace-nowrap">{label}</span>}
  </div>
);

export default AdminPanel;