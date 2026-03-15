'use client';

import React, { useEffect, useState } from "react";
import { getEvents } from "@/api/api.client";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import CreateEventModal from "@/components/CreateEventModal";
import EventCard from "@/components/EventCard";
import EventDetailsModal from "@/components/EventDetailsModal";

export default function Home() {
  const [events, setEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<any>(null);
  const [filterOwnEvents, setFilterOwnEvents] = useState(false);
  const { user, isAuthenticated, logout } = useAuth();

  const fetchEvents = async () => {
    try {
      const data = await getEvents();
      console.log("¡Conexión exitosa!", data);
      setEvents(data);
    } catch (error) {
      console.error("El puente se rompió:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  const displayedEvents = filterOwnEvents 
    ? events.filter(e => e.organizer === user?.name)
    : events;

  const handleViewDetails = (event: any) => {
    setSelectedEvent(event);
    setIsDetailsOpen(true);
  };

  return (
    <div className="min-h-screen bg-transparent text-white font-sans p-8">
      <header className="max-w-6xl mx-auto flex justify-between items-center mb-12">
        <h1 className="text-3xl font-bold tracking-tight">
          Event<span className="text-purple-500 drop-shadow-[0_0_15px_rgba(168,85,247,0.6)]">Hub</span>
        </h1>
        <div className="flex items-center gap-6">
          {isAuthenticated ? (
            <div className="flex items-center gap-4">
              <div className="flex flex-col items-end">
                <span className="text-sm font-bold text-white uppercase tracking-tighter">
                  {user?.name || 'Agente'}
                </span>
                <span className="text-[10px] text-purple-500 font-mono">ONLINE</span>
              </div>
              <button 
                onClick={logout}
                className="px-4 py-2 rounded-xl bg-white/5 border border-white/10 hover:bg-red-500/10 hover:border-red-500/30 transition-all text-xs font-bold uppercase tracking-wider"
              >
                Cerrar Sesión
              </button>
            </div>
          ) : (
            <Link 
              href="/auth/login"
              className="px-5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 transition-all text-sm font-black uppercase tracking-tighter shadow-[0_0_20px_rgba(168,85,247,0.4)]"
            >
              Iniciar Sesión
            </Link>
          )}
        </div>
      </header>

      <main className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-6">
          <div className="space-y-1">
            <h2 className="text-4xl font-black italic tracking-tighter uppercase">Eventos <span className="text-purple-500 underline underline-offset-8 decoration-white/10">Próximos</span></h2>
            <p className="text-neutral-500 text-xs font-bold uppercase tracking-widest italic ml-1 select-none">Conexión con la Élite</p>
          </div>
          
          <div className="flex items-center gap-4 w-full md:w-auto">
            {isAuthenticated && (
              <div className="flex items-center gap-3 bg-white/5 border border-white/10 px-4 py-2.5 rounded-2xl">
                <span className="text-[10px] font-black uppercase tracking-tighter text-neutral-400">Mis Eventos</span>
                <button 
                  onClick={() => setFilterOwnEvents(!filterOwnEvents)}
                  className={`w-10 h-5 rounded-full relative transition-all duration-300 ${filterOwnEvents ? 'bg-purple-600' : 'bg-neutral-800'}`}
                >
                  <div className={`absolute top-1 w-3 h-3 rounded-full bg-white transition-all duration-300 ${filterOwnEvents ? 'left-6' : 'left-1'}`}></div>
                </button>
              </div>
            )}
            
            {isAuthenticated && (
              <button 
                onClick={() => setIsModalOpen(true)}
                className="bg-purple-600 hover:bg-purple-500 px-6 py-3 rounded-2xl text-xs font-black uppercase tracking-tighter transition-all shadow-[0_0_30px_rgba(168,85,247,0.4)] hover:scale-110 active:scale-90 border-t border-purple-400/30"
              >
                + Crear Nuevo Evento
              </button>
            )}
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
          </div>
        ) : displayedEvents.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {displayedEvents.map((event: any) => (
              <EventCard 
                key={event.id} 
                event={event} 
                onViewDetails={handleViewDetails}
                onRefresh={fetchEvents}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-white/5 border border-dashed border-white/10 rounded-2xl">
            <p className="text-neutral-400 mb-4 text-lg">No hay eventos disponibles, ¡crea el primero!</p>
            {isAuthenticated ? (
              <button 
                onClick={() => setIsModalOpen(true)}
                className="text-purple-400 hover:text-purple-300 font-bold uppercase tracking-widest text-sm underline underline-offset-8 decoration-purple-500/30 hover:decoration-purple-500 transition-all"
              >
                Comenzar ahora
              </button>
            ) : (
              <Link href="/auth/login" className="text-purple-400 hover:text-purple-300 font-medium underline underline-offset-4 decoration-purple-500/30 hover:decoration-purple-500 transition-all">
                Inicia sesión para crear eventos
              </Link>
            )}
          </div>
        )}
      </main>

      {/* Modal de Creación */}
      <CreateEventModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onSuccess={fetchEvents} 
      />

      {/* Modal de Detalles Global */}
      {selectedEvent && (
        <EventDetailsModal
          isOpen={isDetailsOpen}
          onClose={() => setIsDetailsOpen(false)}
          event={selectedEvent}
          onRefresh={fetchEvents}
        />
      )}
    </div>
  );
}
