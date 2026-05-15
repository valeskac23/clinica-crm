import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Calendar, User, Send, X } from 'lucide-react';

const ChangeShiftModal = ({ isOpen, onClose, currentUser }) => {
  const [colleagues, setColleagues] = useState([]);
  const [formData, setFormData] = useState({
    targetUserId: '',
    desiredDate: '',
    reason: ''
  });

  useEffect(() => {
    if (isOpen) {
      fetchColleagues();
    }
  }, [isOpen]);

  const fetchColleagues = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/users/get');
      // FILTRO CRÍTICO: Solo usuarios con el mismo rol, excluyendo al usuario actual
      const filtered = res.data.filter(u => u.role === currentUser.role && u._id !== currentUser._id);
      setColleagues(filtered);
    } catch (err) {
      console.error("Error cargando colegas");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const userId = currentUser?._id || currentUser?.id;

    try {
      // CAMBIO DE URL: de /api/shifts a /api/requests
      await axios.post('http://localhost:5000/api/requests/request-change', {
        requesterId: userId,
        targetUserId: formData.targetUserId,
        desiredDate: formData.desiredDate,
        reason: formData.reason
      });

      alert("Solicitud enviada al colega y al supervisor.");
      onClose();
    } catch (err) {
      console.error("Detalle del error:", err.response?.data);
      alert(err.response?.data?.msg || "Error al enviar la solicitud");
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center z-[60] p-4">
      <div className="bg-white/90 backdrop-blur-xl rounded-3xl p-8 max-w-md w-full shadow-2xl border border-white">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-2xl font-bold text-slate-800">Solicitar Cambio</h3>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600">
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* SELECCIÓN DE COLEGA */}
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2 flex items-center gap-2">
              <User size={16} /> Cambiar con:
            </label>
            <select
              required
              className="w-full bg-white/50 border border-slate-200 rounded-xl p-3 outline-none focus:ring-2 focus:ring-blue-400"
              value={formData.targetUserId}
              onChange={e => setFormData({ ...formData, targetUserId: e.target.value })}
            >
              <option value="">Selecciona un compañero ({currentUser.role})...</option>
              {colleagues.map(col => (
                <option key={col._id} value={col._id}>{col.name}</option>
              ))}
            </select>
          </div>

          {/* FECHA que quiero cambiar */}
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2 flex items-center gap-2">
              <Calendar size={16} /> Fecha que quiero cambiar:
            </label>
            <input
              type="date"
              required
              className="w-full bg-white/50 border border-slate-200 rounded-xl p-3 outline-none focus:ring-2 focus:ring-blue-400"
              onChange={e => setFormData({ ...formData, desiredDate: e.target.value })}
            />
          </div>

          {/* FECHA DESEADA */}
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2 flex items-center gap-2">
              <Calendar size={16} /> Fecha deseada del cambio:
            </label>
            <input
              type="date"
              required
              className="w-full bg-white/50 border border-slate-200 rounded-xl p-3 outline-none focus:ring-2 focus:ring-blue-400"
              onChange={e => setFormData({ ...formData, desiredDate: e.target.value })}
            />
          </div>

          <button
            type="submit"
            className="w-full bg-[#4986a7] text-white py-3 rounded-xl font-bold shadow-lg hover:bg-[#3d708d] flex items-center justify-center gap-2 transition-all"
          >
            <Send size={18} /> Enviar Solicitud
          </button>
        </form>
      </div>
    </div>
  );
};

export default ChangeShiftModal;