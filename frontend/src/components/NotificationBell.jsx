//componente para la campana de notificaciones
import React, { useState, useEffect } from 'react';
import { Bell, Check, X } from 'lucide-react';
import axios from 'axios';

const NotificationBell = ({ user }) => {
  const [notifications, setNotifications] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);

  // Dentro de NotificationBell.jsx
  const fetchNotifications = async () => {
    // 1. Extraer el ID de forma segura
    const userId = user?._id || user?.id;

    // 2. Si no hay ID, no hacer nada para evitar el error 404/undefined
    if (!userId) return;

    try {
      const res = await axios.get(`http://localhost:5000/api/requests/my-notifications/${userId}`);
      setNotifications(res.data);
    } catch (err) {
      console.error("Error al obtener notificaciones:", err);
    }
  };

  /*   const fetchNotifications = async () => {
      const res = await axios.get(`http://localhost:5000/api/requests/my-notifications/${user._id}`);
      setNotifications(res.data);
    }; */

  useEffect(() => { fetchNotifications(); }, []);

  const handleAction = async (requestId, action) => {
    // action: 'accept' o 'reject'
    await axios.post(`http://localhost:5000/api/requests/respond`, {
      requestId,
      action,
      userRole: user.role
    });
    fetchNotifications(); // Refrescar lista
  };

  return (
    <div className="relative">
      <button onClick={() => setShowDropdown(!showDropdown)} className="relative p-2 text-slate-700 hover:bg-white/50 rounded-xl transition-all">
        <Bell size={22} />
        {notifications.length > 0 && (
          <span className="absolute top-1 right-1 bg-red-500 text-white text-[10px] w-4 h-4 flex items-center justify-center rounded-full animate-pulse">
            {notifications.length}
          </span>
        )}
      </button>

      {showDropdown && (
        <div className="absolute right-0 mt-2 w-80 bg-white/90 backdrop-blur-xl border border-white shadow-2xl rounded-2xl z-50 p-4">
          <h4 className="font-bold text-slate-800 mb-3 border-b pb-2">Notificaciones</h4>
          {notifications.length === 0 ? (
            <p className="text-sm text-slate-500 text-center py-4">No hay solicitudes pendientes</p>
          ) : (
            notifications.map(n => (
              <div key={n._id} className="p-3 bg-slate-50/50 rounded-xl mb-2 border border-slate-100">
                <p className="text-sm text-slate-700">
                  <span className="font-bold">{n.requesterId.name}</span> solicita cambio para el {n.desiredDate}
                </p>
                <div className="flex gap-2 mt-3">
                  <button onClick={() => handleAction(n._id, 'accept')} className="flex-1 bg-emerald-500 text-white py-1 rounded-lg text-xs font-bold hover:bg-emerald-600 flex items-center justify-center gap-1">
                    <Check size={14} /> {user.role === 'admin' ? 'Aprobar' : 'Aceptar'}
                  </button>
                  <button onClick={() => handleAction(n._id, 'reject')} className="flex-1 bg-slate-200 text-slate-600 py-1 rounded-lg text-xs font-bold hover:bg-slate-300 flex items-center justify-center gap-1">
                    <X size={14} /> Rechazar
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default NotificationBell;