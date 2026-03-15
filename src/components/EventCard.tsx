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
}

export default function EventCard({ event, onViewDetails, onRefresh }: EventCardProps) {
  const { user, isAuthenticated } = useAuth();
  const router = useRouter();

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
      // Refrescar la lista de eventos para actualizar el estado del botón y contador
      onRefresh();
    } catch (error) {
      toast.error('Ocurrió un error al procesar tu solicitud');
      console.error(error);
    }
  };

  return (
    <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-6 hover:border-purple-500/50 transition-all group relative overflow-hidden flex flex-col h-full">
      {/* Glow Effect */}
      <div className="absolute -top-10 -right-10 w-32 h-32 bg-purple-600/10 rounded-full blur-3xl group-hover:bg-purple-600/20 transition-all"></div>
      
      <div className="relative z-10 flex flex-col h-full">
        <div className="flex justify-between items-start mb-3">
          <h3 className="text-xl font-black text-white group-hover:text-purple-400 transition-colors tracking-tighter uppercase italic">
            {event.title}
          </h3>
          <span className="text-[10px] font-mono text-purple-500 bg-purple-500/10 px-2 py-1 rounded">
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
            <span className="text-purple-400">{attendeeCount}</span> personas inscritas
          </span>
        </div>

        <div className="space-y-4">
          <div className="flex justify-between items-center text-[10px] uppercase tracking-widest font-bold text-neutral-500 border-t border-white/5 pt-4">
            <div className="flex flex-col">
              <span className="text-neutral-600">Fecha</span>
              <span className="text-neutral-300">{new Date(event.date).toLocaleDateString()}</span>
            </div>
            <div className="flex flex-col items-end">
              <span className="text-neutral-600">Organizador</span>
              <span className="text-purple-400/80">{event.organizer || 'Élite'}</span>
            </div>
          </div>

          <div className="flex gap-3 pt-2">
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
                {isJoined ? 'Cancelar Inscripción' : 'Inscribirse'}
              </button>
            )}

            {isCreator && (
              <div className="flex-1 flex items-center justify-center border border-purple-500/20 bg-purple-500/5 rounded-xl">
                <span className="text-[8px] font-black text-purple-400 uppercase tracking-widest">Tu Evento</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
