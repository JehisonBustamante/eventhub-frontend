'use client';

import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { updateEvent } from '@/api/api.client';
import { toast } from 'react-hot-toast';

interface Event {
  id: string;
  title: string;
  description: string;
  date: string;
  location: string;
}

interface EditEventModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  event: Event;
}

export default function EditEventModal({ isOpen, onClose, onSuccess, event }: EditEventModalProps) {
  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm();

  // Resetear el formulario con los datos del evento cuando este cambia
  useEffect(() => {
    if (event) {
      // Formatear fecha para el input type="date" (YYYY-MM-DD)
      // Si ya viene en formato YYYY-MM-DD, lo usamos directamente para evitar desfases de zona horaria
      const formattedDate = event.date.includes('T') 
        ? event.date.split('T')[0] 
        : event.date;
      reset({
        title: event.title,
        description: event.description,
        date: formattedDate,
        location: event.location
      });
    }
  }, [event, reset]);

  if (!isOpen) return null;

  const onSubmit = async (data: any) => {
    try {
      await updateEvent(event.id, data);
      toast.success('Evento actualizado correctamente');
      onSuccess();
      onClose();
    } catch (error) {
      console.error('Error al actualizar el evento:', error);
      toast.error('Hubo un error al actualizar el evento');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/80 backdrop-blur-md"
        onClick={onClose}
      ></div>

      {/* Modal Content */}
      <div className="relative w-full max-w-lg bg-[#0a0a0a] border border-purple-500/30 rounded-3xl p-8 shadow-[0_0_50px_rgba(168,85,247,0.2)] animate-in fade-in zoom-in duration-300">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl font-black text-white uppercase tracking-tighter italic">
            EDITAR <span className="text-purple-500">EVENTO</span>
          </h2>
          <button 
            onClick={onClose}
            className="text-neutral-500 hover:text-white transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="space-y-1">
            <label className="text-[10px] font-bold text-purple-400 uppercase tracking-widest ml-1">Título del Evento</label>
            <input
              {...register('title', { required: 'El título es obligatorio' })}
              className={`w-full bg-[#080808] border ${errors.title ? 'border-red-500/50' : 'border-white/10'} rounded-2xl px-5 py-3.5 text-zinc-100 placeholder-neutral-600 focus:outline-none focus:ring-2 focus:ring-purple-500/50 transition-all`}
              placeholder="Ej. Hackathon Nocturna"
            />
            {errors.title && <p className="text-red-500 text-[10px] uppercase font-bold ml-1">{errors.title.message as string}</p>}
          </div>

          <div className="space-y-1">
            <label className="text-[10px] font-bold text-purple-400 uppercase tracking-widest ml-1">Descripción</label>
            <textarea
              {...register('description', { required: 'La descripción es obligatoria' })}
              rows={3}
              className={`w-full bg-[#080808] border ${errors.description ? 'border-red-500/50' : 'border-white/10'} rounded-2xl px-5 py-3.5 text-zinc-100 placeholder-neutral-600 focus:outline-none focus:ring-2 focus:ring-purple-500/50 transition-all`}
              placeholder="Cuéntanos más sobre el evento..."
            />
            {errors.description && <p className="text-red-500 text-[10px] uppercase font-bold ml-1">{errors.description.message as string}</p>}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-purple-400 uppercase tracking-widest ml-1">Fecha</label>
              <input
                {...register('date', { required: 'La fecha es obligatoria' })}
                type="date"
                className={`w-full bg-[#080808] border ${errors.date ? 'border-red-500/50' : 'border-white/10'} rounded-2xl px-5 py-3.5 text-zinc-100 focus:outline-none focus:ring-2 focus:ring-purple-500/50 transition-all appearance-none`}
              />
              {errors.date && <p className="text-red-500 text-[10px] uppercase font-bold ml-1">{errors.date.message as string}</p>}
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-purple-400 uppercase tracking-widest ml-1">Ubicación</label>
              <input
                {...register('location', { required: 'La ubicación es obligatoria' })}
                className={`w-full bg-[#080808] border ${errors.location ? 'border-red-500/50' : 'border-white/10'} rounded-2xl px-5 py-3.5 text-zinc-100 placeholder-neutral-600 focus:outline-none focus:ring-2 focus:ring-purple-500/50 transition-all`}
                placeholder="Ciudad / Virtual"
              />
              {errors.location && <p className="text-red-500 text-[10px] uppercase font-bold ml-1">{errors.location.message as string}</p>}
            </div>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-purple-600 hover:bg-purple-500 disabled:bg-purple-900/50 text-white font-black py-4 rounded-2xl shadow-[0_0_25px_rgba(168,85,247,0.4)] hover:shadow-[0_0_40px_rgba(168,85,247,0.6)] transition-all transform hover:scale-[1.02] active:scale-[0.98] uppercase tracking-tighter text-lg"
          >
            {isSubmitting ? 'ACTUALIZANDO...' : 'GUARDAR CAMBIOS'}
          </button>
        </form>
      </div>
    </div>
  );
}
