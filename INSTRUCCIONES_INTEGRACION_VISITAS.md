# Guía de Integración: Monitoreo de Visitas del Menú

## 📋 Resumen

Este proyecto ya está integrado con el sistema de monitoreo de visitas del backend `cafeteria-mitienda`. Cada vez que un usuario carga la página del menú, se registra automáticamente una visita en la base de datos.

---

## ✅ Cambios Implementados

### 1. Hook Personalizado
- **Archivo**: `hooks/use-registrar-visita.ts`
- **Función**: `useRegistrarVisita()`
- Se ejecuta automáticamente al montar el componente principal
- Envía la siguiente información al backend:
  - URL completa del menú
  - User agent del navegador
  - Referrer (página de origen)
  - IP (capturada automáticamente por el servidor)

### 2. Integración en Componente Principal
- **Archivo**: `app/page.tsx`
- El hook se llama al inicio del componente `MenuPage`
- No requiere cambios adicionales en la lógica del menú

### 3. Variables de Entorno
- **Archivo**: `.env.local` (crear desde `.env.local.example`)
- **Variable**: `NEXT_PUBLIC_API_URL_VISITAS`
- **Valor por defecto**: `https://cafeteria-mitienda.vercel.app`
- Si el backend tiene otra URL, configurar esta variable

---

## 🔧 Configuración

### Paso 1: Configurar Variable de Entorno (Opcional)

Si el backend de `cafeteria-mitienda` está en una URL diferente, crear un archivo `.env.local` en la raíz del proyecto:

```env
NEXT_PUBLIC_API_URL_VISITAS=https://tu-backend-url.com
```

Si no se configura, se usará la URL por defecto: `https://cafeteria-mitienda.vercel.app`

### Paso 2: Verificar Backend

Asegúrate de que el proyecto `cafeteria-mitienda` esté desplegado y tenga:

1. **Base de datos**: Tabla `visitas_menu` creada
   ```sql
   -- Ejecutar: src/sql/crear_tabla_visitas_menu.sql
   ```

2. **API endpoint activo**: `POST /api/menu/visitas`
   - Debe aceptar JSON con: `url`, `user_agent`, `referrer`
   - Debe tener CORS habilitado para este dominio

3. **API endpoint para estadísticas**: `GET /api/menu/visitas`
   - Usado por el panel de administrador

---

## 🧪 Probar la Integración

### 1. Ejecutar el proyecto localmente
```bash
npm run dev
```

### 2. Abrir el menú en el navegador
- Ir a `http://localhost:3000`
- La visita se registrará automáticamente al cargar la página

### 3. Verificar en el backend
En el proyecto `cafeteria-mitienda`, ejecutar:
```sql
SELECT * FROM visitas_menu ORDER BY fecha DESC LIMIT 10;
```

Deberías ver una nueva entrada con:
- `url`: `http://localhost:3000/` (o la URL que estés usando)
- `fecha`: fecha/hora actual
- `user_agent`: información del navegador
- `referrer`: (vacío o la página de origen)

### 4. Verificar en consola del navegador
Abrir DevTools (F12) → Console
- Si hay errores de conexión, se mostrarán: `Error registrando visita: ...`
- La visita se intenta registrar, pero no bloquea la carga del menú

---

## 📊 Cómo Funciona

1. **Al montar el componente** `MenuPage`:
   - Se ejecuta `useRegistrarVisita()`
   - Se obtiene la URL actual del menú
   - Se captura el user agent y referrer del navegador
   - Se envía una petición POST al backend

2. **El backend**:
   - Recibe los datos
   - Inserta un registro en la tabla `visitas_menu`
   - La IP se captura automáticamente en el servidor
   - Actualiza la tabla caché `visitas_menu_diarias`

3. **Estadísticas**:
   - El panel de administrador en `cafeteria-mitienda` muestra:
     - Visitas por día
     - Visitas por mes
     - Totales generales
   - Acceder: AlmacenPage → Menú → Pestaña "Visitas del Menú"

---

## 🐛 Troubleshooting

### Error: "Failed to fetch"
- Verificar que el backend esté corriendo
- Revisar que la URL del API sea correcta
- Verificar CORS en el backend

### No aparecen datos en el panel de administrador
- Verificar que la tabla `visitas_menu` exista en la base de datos
- Ejecutar el script SQL en el backend
- Revisar logs del servidor backend

### La visita no se registra en desarrollo
- En desarrollo, el backend podría rechazar conexiones de `localhost`
- Configurar CORS en el backend para permitir `http://localhost:3000`
- O usar un tunnel (ngrok) para tener una URL pública

---

## 📁 Archivos Modificados/Creados

### Nuevos Archivos
- `hooks/use-registrar-visita.ts` - Hook para registrar visitas
- `.env.local.example` - Ejemplo de variables de entorno
- `INSTRUCCIONES_INTEGRACION_VISITAS.md` - Esta guía

### Archivos Modificados
- `app/page.tsx` - Integración del hook de visitas

---

## 🔒 Consideraciones de Privacidad

- No se almacenan cookies ni datos personales identificables
- La IP se almacena solo para fines estadísticos y de seguridad
- El user agent se usa para identificar dispositivos/navegadores
- El referrer ayuda a entender de dónde vienen los visitantes
- Si se requiere cumplir con GDPR, agregar un banner de cookies

---

## 🎯 Próximos Mejoras (Opcional)

1. **Rate limiting**: Evitar spam de registros
2. **Unique visitors**: Contar visitantes únicos por IP/cookie
3. **Tiempo en página**: Registrar cuánto tiempo permanecen
4. **Eventos de clic**: Registrar interacciones con productos
5. **Offline support**: Cachear visitas cuando no hay conexión

---

## 📞 Soporte

Si tienes problemas:
1. Revisa la consola del navegador (F12)
2. Verifica logs del backend
3. Asegúrate de que ambos proyectos estén corriendo
4. Prueba con herramientas como Postman el endpoint POST

---

**Fecha de integración**: 2025-02-22
**Versión**: 1.0.0
**Autor**: Sistema de Gestión Cafetería Mitienda
