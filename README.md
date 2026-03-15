# EventHub Frontend

EventHub es una plataforma moderna para la gestion y descubrimiento de eventos, diseñada con una estetica minimalista y de alto rendimiento. La aplicacion permite a los usuarios interactuar con una comunidad activa, organizar sus propios eventos y participar en otros de su interés.

## Tecnologias Utilizadas

- Next.js 15 (App Router)
- React 19
- Tailwind CSS
- Axios para comunicacion con la API
- React Hook Form para gestion de formularios
- React Hot Toast para notificaciones en tiempo real
- Lucide React para iconografia

## Características Principales

- Autenticación Completa: Sistema de registro e inicio de sesión con persistencia de sesión mediante JWT.
- Gestión de Eventos: Los usuarios pueden crear, editar y visualizar detalles de eventos de forma intuitiva.
- Sistema de Inscripción: Logica dinámica para unirse o cancelar la inscripción en eventos con actualización en tiempo real de asistentes.
- Ciclo de Vida: Detección automática de eventos finalizados segun la fecha actual, deshabilitando acciones de inscripción y ajustando la interfaz visual.
- Filtros Avanzados: Posibilidad de filtrar entre todos los eventos disponibles o solo aquellos creados por el usuario autenticado.
- Rendimiento Optimizado: Interfaz de usuario de alta velocidad con fondos estáticos de baja carga y controles nativos personalizados para una respuesta instantánea.
- Diseño Glassmorphism: Estética premium basada en transparencia, desenfoque sutil y acentos purpura neon.

## Configuración del Proyecto

### Requisitos Previos

- Node.js (Version LTS recomendada)
- NPM o PNPM

### Instalacion

1. Clonar el repositorio
2. Instalar las dependencias:
   ```bash
   npm install
   ```
3. Configurar las variables de entorno en un archivo .env.local:
   ```env
   NEXT_PUBLIC_API_URL=http://localhost:3001
   ```

### Ejecucion en Desarrollo

```bash
npm run dev
```

La aplicacion estara disponible en http://localhost:3000

## Autor

Este proyecto ha sido creado por Jehison Bustamante.
