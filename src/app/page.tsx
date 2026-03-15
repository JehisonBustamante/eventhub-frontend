'use client';

import React, { useEffect, useState } from "react";
import { getEvents } from "@/api/api.client";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import CreateEventModal from "@/components/CreateEventModal";

export default function Home() {
  const [events, setEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
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

  return (
    <div className="min-h-screen bg-[#050505] text-white font-sans p-8">
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
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl font-semibold">Eventos Próximos</h2>
          {isAuthenticated && (
            <button 
              onClick={() => setIsModalOpen(true)}
              className="bg-purple-600 hover:bg-purple-500 px-5 py-2.5 rounded-xl text-sm font-black uppercase tracking-tighter transition-all shadow-[0_0_20px_rgba(168,85,247,0.4)] hover:scale-105 active:scale-95"
            >
              + Crear Nuevo Evento
            </button>
          )}
        </div>

        {loading ? (
          <div className="flex justify-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
          </div>
        ) : events.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {events.map((event: any) => (
              <div 
                key={event.id} 
                className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6 hover:border-purple-500/50 transition-all group"
              >
                <h3 className="text-xl font-bold mb-2 group-hover:text-purple-400 transition-colors">{event.title}</h3>
                <p className="text-neutral-400 text-sm mb-4 line-clamp-2">{event.description}</p>
                <div className="flex justify-between items-center text-xs text-neutral-500">
                  <span>{new Date(event.date).toLocaleDateString()}</span>
                  <span className="bg-purple-500/10 text-purple-400 px-2 py-1 rounded-md">{event.location}</span>
                </div>
              </div>
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
    </div>
  );
}
