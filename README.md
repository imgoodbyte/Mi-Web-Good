# Mi-Web-Good
Portafolio de Antony Hurtado Good

## Formulario de contacto

El formulario utiliza una API propia en `backend/` y entrega los mensajes por SMTP.

### Configuración local

1. Instala las dependencias:

   ```bash
   cd backend
   npm install
   ```

2. Copia `backend/.env.example` como `backend/.env` y completa las credenciales SMTP. Para Gmail, activa la verificación en dos pasos y utiliza una contraseña de aplicación; no uses la contraseña normal de la cuenta.

3. Inicia la API:

   ```bash
   npm run dev
   ```

4. Sirve el portafolio con un servidor local en `http://localhost:5500` o `http://127.0.0.1:5500`. El archivo `src/js/config.js` ya apunta a la API local en el puerto `3000`.

### Despliegue

- Despliega `backend/` como un servicio Node.js y configura las variables de `backend/.env.example` en el proveedor.
- Define `FRONTEND_ORIGINS` con la URL pública exacta del portafolio. Se pueden indicar varios orígenes separados por comas.
- Cambia `contactApiUrl` en `src/js/config.js` por la URL HTTPS pública del endpoint `/api/contact`.
- Verifica la API mediante `GET /api/health` antes de probar el formulario.

La contraseña SMTP nunca debe agregarse al repositorio ni al código del navegador.
