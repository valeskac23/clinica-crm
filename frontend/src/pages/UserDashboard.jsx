//dashboard de usuario medico / enfermero
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import GuardiaCalendar from '../components/GuardiaCalendar';
import clinicalBackground from '../assets/clinica2.png';
import {
  LogOut,
  RefreshCw,
  Play,
  Square,
  Calendar as CalendarIcon,
  User
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import ChangeShiftModal from '../components/ChangeShiftModal';
import NotificationBell from '../components/NotificationBell';

const UserDashboard = () => {
  const { logout, user } = useAuth();
  const [isGuardiaActive, setIsGuardiaActive] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [isChangeModalOpen, setIsChangeModalOpen] = useState(false);




  // Reloj en tiempo real para el header
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const handleGuardiaToggle = () => {
    const action = isGuardiaActive ? 'finalizar' : 'iniciar';
    if (window.confirm(`¿Desea ${action} su guardia ahora?`)) {
      setIsGuardiaActive(!isGuardiaActive);
      // Aquí podrías disparar una petición al backend para registrar la hora exacta
      console.log(`Guardia ${action} registrada a las: ${new Date().toLocaleTimeString()}`);
    }
  };

  const handleRequestChange = () => {
    alert("Función para solicitar cambio de guardia enviada al supervisor.");
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#4986a7]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-white"></div>
      </div>
    );
  }

  return (
    <div
      className="min-h-screen bg-cover bg-center flex flex-col font-sans"
      style={{ backgroundImage: `url(${clinicalBackground})`, backgroundAttachment: 'fixed' }}
    >
      {/* NAVBAR TRASLÚCIDO SUPERIOR */}
      <nav className="bg-white/30 z-10 backdrop-blur-md border-b border-white/20 p-4 shadow-lg">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-4">
            <div className="bg-[#4986a7] p-2 rounded-lg text-white">
              <User size={24} />
            </div>
            <div>
              <h1 className="text-lg font-bold text-slate-800 leading-tight">
                {user?.name || 'Usuario'}
              </h1>
              <p className="text-xs font-semibold text-slate-600 uppercase tracking-wider">
                {user?.role || 'Personal Clínico'}
              </p>
            </div>
          </div>


          <div className="flex items-center gap-3">
            {/* BOTÓN DINÁMICO INICIO/FIN GUARDIA */}
            <button
              onClick={handleGuardiaToggle}
              className={`flex items-center gap-2 px-6 py-2.5 rounded-xl font-bold transition-all shadow-md active:scale-95 ${isGuardiaActive
                ? 'bg-red-500 hover:bg-red-600 text-white'
                : 'bg-emerald-500 hover:bg-emerald-600 text-white'
                }`}
            >
              {isGuardiaActive ? (
                <><Square size={18} fill="currentColor" /> Finalizar Guardia</>
              ) : (
                <><Play size={18} fill="currentColor" /> Inicio de Guardia</>
              )}
            </button>

            <button
              onClick={() => setIsChangeModalOpen(true)} // Cambiamos el alert por abrir modal
              className="flex items-center gap-2 bg-white/50 hover:bg-white/80 text-slate-700 px-4 py-2.5 rounded-xl font-semibold transition-all border border-white/40"
            >
              <RefreshCw size={18} />
              <span className="hidden md:inline">Cambiar Guardia</span>
            </button>
            <div className="flex items-center gap-3">
              {/* NUEVO: Icono de notificaciones */}
              <NotificationBell user={user} />

              <button onClick={logout} className="p-2.5 text-slate-700 hover:bg-red-500/20 hover:text-red-700 rounded-xl transition-all"
                title="Cerrar Sesión"
              >
                <LogOut size={22} />
              </button>
            </div>

          </div>
        </div>
      </nav>

      {/* CONTENIDO PRINCIPAL */}
      <main className="flex-1 p-6 z-0 md:p-8 overflow-y-auto">
        <div className="max-w-7xl mx-auto space-y-6">

          {/* BANNER DE ESTADO */}
          <div className="bg-white/40 backdrop-blur-sm p-6 rounded-2xl border border-white/30 shadow-sm flex flex-col md:flex-row justify-between items-center gap-4">
            <div>
              <h2 className="text-2xl font-bold text-slate-800">Mi Cronograma</h2>
              <p className="text-slate-600 font-medium">Visualiza tus turnos asignados</p>
            </div>
            <div className="text-right">
              <p className="text-3xl font-mono font-bold text-[#4986a7]">
                {currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </p>
              <p className="text-slate-500 text-sm font-semibold uppercase">
                {currentTime.toLocaleDateString('es-ES', { weekday: 'long', day: 'numeric', month: 'long' })}
              </p>
            </div>
          </div>

          {/* CALENDARIO DE GUARDIAS */}
          <section className="bg-white/60 backdrop-blur-md p-4 md:p-6 rounded-3xl shadow-2xl border border-white/40">
            <GuardiaCalendar />
          </section>
        </div>
      </main>
      <ChangeShiftModal
        isOpen={isChangeModalOpen}
        onClose={() => setIsChangeModalOpen(false)}
        currentUser={user} // Pasamos el usuario del AuthContext
      />
    </div>
  );
};

export default UserDashboard;