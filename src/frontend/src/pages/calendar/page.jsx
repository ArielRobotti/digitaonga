import { Calendar, dayjsLocalizer } from 'react-big-calendar';
import dayjs from 'dayjs';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import useProposalStore from '../../store/useProposalStore';
import useCanister from '../../hooks/useCanister';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';

// Opcional: Si quieres soporte en español (necesitas instalar dayjs con locale)
import 'dayjs/locale/es';
dayjs.locale('es'); 

const DaoCalendar = () => {
  // Inicialización del localizer de Dayjs
  const localizer = dayjsLocalizer(dayjs);
  const navigate = useNavigate()

  const { proposals, setProposals } = useProposalStore()
  const [ , dao] = useCanister();

  const [currentView, setCurrentView] = useState('month');
  const [currentDate, setCurrentDate] = useState(new Date()); 


  useEffect(() => {
    const fetchProposals = async () => {
      const response = await dao.get_all_proposals()
      if (response) {
        setProposals(response)
      }
    }
    if(!proposals[0]){ fetchProposals() }
  }, [])

  const parseProposals = (proposalArray) => {  
    return proposalArray.map(pr => {
      
      const startMs = Number(pr.created_at) / 1000000;
      const endMs = Number(pr.deadline) / 1000000;
      return { 
        start: new Date(startMs),
        end: new Date(endMs),
        title: pr.title,
        description: pr.description,
        resourceId: pr.id,
      };
    });
};

  // const proposals = [
  //   {
  //     start: dayjs('2025-09-30T12:00:00').toDate(),
  //     end: dayjs('2025-09-30T15:00:00').toDate(),
  //     title: "Propuesta Proyecto Alpha (Deadline)",
  //   },
  //   {
  //     start: dayjs('2025-10-05T00:00:00').toDate(),
  //     end: dayjs('2025-10-08T23:59:59').toDate(),
  //     title: "Propuesta Marketing (Rango)",
  //     allDay: true // Usar allDay para que se muestre en la parte superior del mes
  //   }
  // ];

  return ( 
  // Usa una altura fija. Tu clase h-{50vh} no es válida en Tailwind. 
  // Usa una sintaxis de CSS correcta o una clase de utilidad válida (como h-[50vh]).
  <div style={{ height: '90vh' }} className='w-full'>
    <Calendar
      localizer={localizer}
      events={parseProposals(proposals)}
      // **¡Aquí está la clave!** Define las vistas y la vista inicial.
      views={['month', 'week', 'day', 'agenda']}
      view={currentView}
      onView={setCurrentView}
      onSelectEvent={(e) => {navigate("/proposals/" + e.resourceId)}}
      
      defaultView="month" 
      
      // Opcional: Define el día que aparecerá al cargar
      date={currentDate} 
      defaultDate={currentDate}
      onNavigate={setCurrentDate}

      // Opcional: Habilita el arrastre y redimensionamiento (necesitas importar el componente con el wrapper)
      // selectable={true}
      
      // Para mostrar eventos de un día completo en la parte superior (como en la vista de mes)
      allDayAccessor="allDay" 
    />
  </div>
  );
}

export default DaoCalendar;