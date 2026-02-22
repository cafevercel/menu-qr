# Next.js Menu Integration

*Automatically synced with your [v0.dev](https://v0.dev) deployments*

[![Deployed on Vercel](https://img.shields.io/badge/Deployed%20on-Vercel-black?style=for-the-badge&logo=vercel)](https://vercel.com/cafevercels-projects/v0-next-js-menu-integration)
[![Built with v0](https://img.shields.io/badge/Built%20with-v0.dev-black?style=for-the-badge)](https://v0.dev/chat/projects/LlG5rjYPJh8)

## Overview

This repository will stay in sync with your deployed chats on [v0.dev](https://v0.dev).
Any changes you make to your deployed app will be automatically pushed to this repository from [v0.dev](https://v0.dev).

## 📊 Monitoreo de Visitas

Este menú está integrado con un sistema de monitoreo de visitas. Cada vez que un usuario carga la página, se registra automáticamente una visita en la base de datos del backend.

### Características
- ✅ Registro automático de visitas al cargar la página
- ✅ Captura de URL, user agent y referrer
- ✅ IP capturada automáticamente por el servidor
- ✅ Sin impacto en el rendimiento del menú
- ✅ Errores silenciosos (no afectan la experiencia del usuario)

### Configuración

Si el backend tiene una URL diferente, configura la variable de entorno:

```env
NEXT_PUBLIC_API_URL_VISITAS=https://tu-backend-url.com
```

Crear archivo `.env.local` basado en `.env.local.example`.

### Ver más información

Consulta el archivo [`INSTRUCCIONES_INTEGRACION_VISITAS.md`](./INSTRUCCIONES_INTEGRACION_VISITAS.md) para:

- Guía completa de integración
- Instrucciones de prueba
- Troubleshooting
- Próximas mejoras

---

## Deployment

Your project is live at:

**[https://vercel.com/cafevercels-projects/v0-next-js-menu-integration](https://vercel.com/cafevercels-projects/v0-next-js-menu-integration)**

## Build your app

Continue building your app on:

**[https://v0.dev/chat/projects/LlG5rjYPJh8](https://v0.dev/chat/projects/LlG5rjYPJh8)**

## How It Works

1. Create and modify your project using [v0.dev](https://v0.dev)
2. Deploy your chats from the v0 interface
3. Changes are automatically pushed to this repository
4. Vercel deploys the latest version from this repository
