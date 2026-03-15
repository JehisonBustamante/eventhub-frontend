import React from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { toast } from 'react-hot-toast';
import { joinEvent, leaveEvent } from '@/api/api.client';

interface Event {
  id: string;
  title: string;
  description: string;
  date: string;
  location: string;
  organizer: string;
  attendees: string[]; // IDs de los usuarios inscritos
}

interface EventCardProps {
  event: Event;
  onViewDetails: (event: Event) => void;
  onRefresh: () => void;
  onEdit: (event: Event) => void;
}

export default function EventCard({ event, onViewDetails, onRefresh, onEdit }: EventCardProps) {
  const { user, isAuthenticated } = useAuth();
  const router = useRouter();

  // Comprobar si el evento ya pasó
  // Extraemos solo la parte de la fecha (YYYY-MM-DD) para evitar problemas con ISO strings y zonas horarias
  const dateString = event.date.includes('T') ? event.date.split('T')[0] : event.date;
  const [year, month, day] = dateString.split('-').map(Number);
  const eventDate = new Date(year, month - 1, day);
  const isPast = eventDate < new Date(new Date().setHours(0,0,0,0));

  // Cantidad real de asistentes del backend
  const attendeeCount = event.attendees?.length || 0;
  
  // LOGS DE DEPURACIÓN CRÍTICOS
  const currentUserId = user?.id || user?._id || user?.sub;
  
  // Comprobación flexible: soporta array de strings o array de objetos
  const isJoined = isAuthenticated && currentUserId && event.attendees?.some((att: any) => {
    const attendeeId = typeof att === 'string' ? att : (att.id || att._id);
    return attendeeId === currentUserId;
  });

  const isCreator = isAuthenticated && user?.name === event.organizer;

  const handleDetails = () => {
    if (!isAuthenticated) {
      toast.error('Debes iniciar sesión para ver los detalles');
      router.push('/auth/login');
    } else {
      onViewDetails(event);
    }
  };

  const handleAction = async () => {
    if (!isAuthenticated) return;
    
    try {
      if (isJoined) {
        await leaveEvent(event.id);
        toast.success('Inscripción cancelada correctamente');
      } else {
        await joinEvent(event.id);
        toast.success('¡Listo! Ya tienes tu lugar asegurado', { icon: '🔥' });
      }
      onRefresh();
    } catch (error) {
      toast.error('Ocurrió un error al procesar tu solicitud');
      console.error(error);
    }
  };

  return (
    <div className={`bg-[#0c0c0c] border border-white/10 rounded-2xl p-6 transition-all group relative overflow-hidden flex flex-col h-full ${isPast ? 'opacity-70 grayscale-[0.5]' : 'hover:border-purple-500/50 hover:bg-[#121212]'}`}>
      {/* Glow Effect */}
      {!isPast && (
        <div className="absolute -top-10 -right-10 w-32 h-32 bg-purple-600/10 rounded-full blur-3xl group-hover:bg-purple-600/20 transition-all"></div>
      )}
      
      <div className="relative z-10 flex flex-col h-full">
        <div className="flex justify-between items-start mb-3">
          <h3 className={`text-xl font-black transition-colors tracking-tighter uppercase italic ${isPast ? 'text-neutral-500' : 'text-white group-hover:text-purple-400'}`}>
            {event.title}
          </h3>
          <span className={`text-[10px] font-mono px-2 py-1 rounded ${isPast ? 'text-neutral-500 bg-white/5' : 'text-purple-500 bg-purple-500/10'}`}>
            {event.location}
          </span>
        </div>

        <p className="text-neutral-400 text-sm mb-6 line-clamp-3 leading-relaxed flex-grow">
          {event.description}
        </p>

        <div className="flex items-center gap-2 mb-4">
          <div className="flex -space-x-2">
            {[1, 2, 3].map((i) => (
              <div key={i} className="w-6 h-6 rounded-full border-2 border-[#0a0a0a] bg-purple-900/50 flex items-center justify-center overflow-hidden">
                <div className="w-full h-full bg-gradient-to-br from-purple-500/30 to-purple-900/30"></div>
              </div>
            ))}
          </div>
          <span className="text-[10px] font-bold text-neutral-500 uppercase tracking-tight">
            <span className={isPast ? 'text-neutral-500' : 'text-purple-400'}>{attendeeCount}</span> personas inscritas
          </span>
        </div>

        <div className="space-y-4">
          <div className="flex justify-between items-center text-[10px] uppercase tracking-widest font-bold text-neutral-500 border-t border-white/5 pt-4">
            <div className="flex flex-col">
              <span className="text-neutral-600">Fecha</span>
              <span className={isPast ? 'text-neutral-500' : 'text-neutral-300'}>
                {eventDate.toLocaleDateString(undefined, { day: '2-digit', month: '2-digit', year: 'numeric' })}
              </span>
            </div>
            <div className="flex flex-col items-end">
              <span className="text-neutral-600">Organizador</span>
              <span className={isPast ? 'text-neutral-600' : 'text-purple-400/80'}>{event.organizer || 'Élite'}</span>
            </div>
          </div>

          <div className="flex gap-3 pt-2">
            {isPast ? (
              <div className="flex-1 py-3 rounded-xl border border-white/5 bg-white/5 flex items-center justify-center">
                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-neutral-600 italic">Evento Finalizado</span>
              </div>
            ) : (
              <>
                <button 
                  onClick={handleDetails}
                  className="flex-1 px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all text-[10px] font-black uppercase tracking-tighter text-white"
                >
                  Ver Detalles
                </button>
                
                {isAuthenticated && !isCreator && (
                  <button 
                    onClick={handleAction}
                    className={`flex-1 px-4 py-2.5 rounded-xl transition-all text-[10px] font-black uppercase tracking-tighter text-white shadow-lg ${
                      isJoined 
                        ? 'bg-neutral-800 hover:bg-red-900/40 border border-white/5 hover:border-red-500/30' 
                        : 'bg-purple-600 hover:bg-purple-500 shadow-[0_0_15px_rgba(168,85,247,0.3)] hover:shadow-[0_0_25px_rgba(168,85,247,0.5)]'
                    }`}
                  >
                    {isJoined ? 'Cancelar' : 'Inscribirse'}
                  </button>
                )}

                {isCreator && (
                  <button 
                    onClick={() => onEdit(event)}
                    className="flex-1 px-4 py-2.5 rounded-xl bg-purple-500/10 border border-purple-500/30 hover:bg-purple-500/20 transition-all text-[10px] font-black uppercase tracking-tighter text-purple-400 flex items-center justify-center gap-2 group/edit"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 transform group-hover/edit:rotate-12 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                    </svg>
                    Editar
                  </button>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
