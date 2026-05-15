import React, { useEffect, useState } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import axios from 'axios';

const GuardiaCalendar = () => {
  const [events, setEvents] = useState([]);

  // Función para obtener datos (la sacamos para poder reutilizarla)
  const fetchShifts = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/shifts');
      if (Array.isArray(res.data)) {
        const eventosFormateados = res.data.map(shift => ({
          id: shift.id || shift._id, // Usamos el ID transformado
          title: shift.userId ? `${shift.userId.name}` : 'Sin nombre',
          start: shift.start,
          end: shift.end,
          backgroundColor: shift.userId?.color || '#3b82f6',
          borderColor: 'transparent',
          textColor: '#ffffff', // Asegura que el texto se lea bien
        }));
        setEvents(eventosFormateados);
      }
    } catch (err) {
      console.error("Error cargando guardias", err);
    }
  };

  useEffect(() => {
    fetchShifts(); // Ahora sí se ejecuta al cargar el componente
  }, []); // El array vacío indica que solo se ejecuta una vez al montar

  return (
    <div className="calendar-container bg-white p-4 rounded-xl shadow-inner">
      <FullCalendar
        plugins={[dayGridPlugin, timeGridPlugin]}
        initialView="dayGridMonth"
        headerToolbar={{
          left: 'prev,next today',
          center: 'title',
          right: 'dayGridMonth,timeGridWeek,timeGridDay'
        }}
        events={events}
        locale="es"
        // --- CONFIGURACIÓN PARA MOSTRAR HORAS ---
        eventTimeFormat={{
          hour: '2-digit',
          minute: '2-digit',
          meridiem: false,
          hour12: false // Formato 24h
        }}
        displayEventTime={true} // Obliga a mostrar la hora
        slotLabelFormat={{ // Formato de hora en vista semanal/diaria
          hour: '2-digit',
          minute: '2-digit',
          hour12: false
        }}
        // Hace que el nombre y la hora se vean más claros
        eventContent={(eventInfo) => (
          <div className="p-1 overflow-hidden">
            <b className="mr-1">{eventInfo.timeText}</b>
            <i>{eventInfo.event.title}</i>
          </div>
        )}
      />
    </div>
  );
};

export default GuardiaCalendar;