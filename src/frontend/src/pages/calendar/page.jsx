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
  const [, dao] = useCanister();

  const [currentView, setCurrentView] = useState('month');
  const [currentDate, setCurrentDate] = useState(new Date());


  useEffect(() => {
    const fetchProposals = async () => {
      const response = await dao.get_all_proposals()
      if (response) {
        setProposals(response)
      }
    }
    if (!proposals[0]) { fetchProposals() }
  }, [])

  const parseProposals = (proposalArray) => {
    return proposalArray.map(pr => {

      const startMs = Number(pr.id) / 1000000 ;
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

  const dayPropGetter = (date) => {
    const today = new Date();

    const isToday =
      date.getFullYear() === today.getFullYear() &&
      date.getMonth() === today.getMonth() &&
      date.getDate() === today.getDate();

    if (isToday) {
      return {
        style: {
          backgroundColor: '#6f92a08a', 
          color: 'white',
          borderRadius: "10px",
        },
      };
    } else {
      return {  };
    }
  };

  return (
    <div className='h-[90vh] w-full flex flex-col items-center mb-10'>
      <Calendar
        className="w-full md:w-[90vw] mt-1 md:mt-4"
        localizer={localizer}
        events={parseProposals(proposals)}

        views={['month', 'week', 'day', 'agenda']}
        view={currentView}
        onView={setCurrentView}
        onSelectEvent={(e) => { navigate("/proposals/" + e.resourceId) }}

        defaultView="month"
        dayPropGetter={dayPropGetter}

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