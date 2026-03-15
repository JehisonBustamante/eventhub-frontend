'use client';

import React from 'react';
import { useAuth } from '@/context/AuthContext';
import { toast } from 'react-hot-toast';

interface Event {
  id: string;
  title: string;
  description: string;
  date: string;
  location: string;
  organizer: string;
}

interface EventDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  event: Event;
}

export default function EventDetailsModal({ isOpen, onClose, event }: EventDetailsModalProps) {
  const { user, isAuthenticated } = useAuth();
  
  if (!isOpen) return null;

  const isCreator = isAuthenticated && user?.name === event.organizer;

  const handleJoin = () => {
    toast.success('¡Listo! Ya tienes tu lugar asegurado en este evento de élite.', {
      duration: 4000,
      icon: '🔥',
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/90 backdrop-blur-xl"
        onClick={onClose}
      ></div>

      {/* Modal Content */}
      <div className="relative w-full max-w-2xl bg-[#0a0a0a] border border-purple-500/30 rounded-[2.5rem] p-10 shadow-[0_0_60px_rgba(168,85,247,0.25)] animate-in fade-in zoom-in duration-300 overflow-hidden">
        {/* Decorative Light */}
        <div className="absolute -top-20 -right-20 w-64 h-64 bg-purple-600/10 rounded-full blur-[100px]"></div>

        <div className="relative z-10 flex justify-between items-start mb-8">
          <div className="space-y-1">
            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-purple-500 italic block mb-2">Detalles del Evento</span>
            <h2 className="text-4xl font-black text-white italic tracking-tighter uppercase leading-none">
              {event.title}
            </h2>
          </div>
          <button 
            onClick={onClose}
            className="p-2 rounded-full bg-white/5 hover:bg-white/10 text-neutral-500 hover:text-white transition-all border border-white/5"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="relative z-10 space-y-8">
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <div className="bg-white/5 border border-white/5 p-4 rounded-2xl">
              <span className="text-[9px] font-bold text-neutral-600 uppercase tracking-widest block mb-1">Fecha</span>
              <span className="text-white font-bold text-sm">{new Date(event.date).toLocaleDateString()}</span>
            </div>
            <div className="bg-white/5 border border-white/5 p-4 rounded-2xl">
              <span className="text-[9px] font-bold text-neutral-600 uppercase tracking-widest block mb-1">Ubicación</span>
              <span className="text-white font-bold text-sm">{event.location}</span>
            </div>
            <div className="bg-white/5 border border-white/5 p-4 rounded-2xl col-span-2 md:col-span-1">
              <span className="text-[9px] font-bold text-neutral-600 uppercase tracking-widest block mb-1">Organizado por</span>
              <span className="text-purple-400 font-black text-sm uppercase tracking-tighter">{event.organizer || 'Élite'}</span>
            </div>
          </div>

          <div className="space-y-3">
            <h3 className="text-xs font-black text-white uppercase tracking-widest border-b border-white/5 pb-2">Descripción del objetivo</h3>
            <p className="text-neutral-400 text-lg leading-relaxed font-medium">
              {event.description}
            </p>
          </div>

          <div className="pt-4 flex gap-4">
            <button 
              onClick={onClose}
              className="px-8 py-4 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 transition-all text-sm font-black uppercase tracking-tighter text-white"
            >
              Cerrar
            </button>
            
            {isAuthenticated && !isCreator && (
              <button 
                onClick={handleJoin}
                className="flex-1 px-8 py-4 rounded-2xl bg-purple-600 hover:bg-purple-500 transition-all text-sm font-black uppercase tracking-tighter text-white shadow-[0_0_30px_rgba(168,85,247,0.4)] hover:shadow-[0_0_50px_rgba(168,85,247,0.6)] transform hover:scale-[1.02] active:scale-98"
              >
                Inscribirse al Evento
              </button>
            )}

            {isCreator && (
              <div className="flex-1 flex items-center justify-center border border-purple-500/20 bg-purple-500/5 rounded-2xl">
                <span className="text-xs font-black text-purple-400 uppercase tracking-[0.2em] italic">Gestión de Propietario</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
