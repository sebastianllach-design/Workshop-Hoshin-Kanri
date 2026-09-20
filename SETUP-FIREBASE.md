# Configuración de Firebase · v55

Esta versión usa el plan gratuito **Firebase Spark** y no necesita Cloud Functions. Render continúa alojando los archivos estáticos; Firebase aporta autenticación, memoria compartida y actualización en tiempo real.

## 1. Crear el proyecto

1. Ingresar en `https://console.firebase.google.com/`.
2. Crear un proyecto nuevo, por ejemplo `conversaciones-transforman`.
3. Google Analytics no es necesario para esta prueba.
4. En **Compilación > Firestore Database**, crear una base en modo producción.
5. Si los participantes estarán en Tokio, elegir **`asia-northeast1` (Tokyo)**. La región de Firestore no puede cambiarse después de crear la base.

## 2. Activar los accesos

En **Compilación > Authentication > Sign-in method** activar:

- **Correo electrónico/contraseña**, para el facilitador.
- **Anónimo**, para los equipos.

Los participantes no crearán cuentas personales. Cada computadora recibe una identidad anónima y la vincula con el código y PIN del equipo.

## 3. Registrar la aplicación web

1. En **Configuración del proyecto > Tus apps**, elegir el icono Web `</>`.
2. Registrar la app. No es necesario activar Firebase Hosting.
3. Copiar los valores de `firebaseConfig`.
4. Abrir `firebase-config.js` y reemplazar todos los valores `REEMPLAZAR_*`.

La configuración web de Firebase es pública por diseño. La protección de los datos se realiza mediante Authentication y `firestore.rules`.

## 4. Crear al facilitador

1. En **Authentication > Users**, crear el usuario con el correo y contraseña que utilizará el facilitador.
2. Copiar su `User UID`.
3. En Firestore crear la colección `users`.
4. Crear un documento cuyo ID sea exactamente el UID copiado.
5. Agregar estos campos:

| Campo | Tipo | Valor |
|---|---|---|
| `role` | string | `facilitator` |
| `email` | string | correo del facilitador |
| `name` | string | nombre visible |

El tablero no permite que un usuario se asigne a sí mismo el rol de facilitador.

## 5. Publicar las reglas de seguridad

Opción simple:

1. Abrir **Firestore Database > Rules**.
2. Copiar el contenido completo de `firestore.rules`.
3. Presionar **Publish**.

Opción con Firebase CLI:

```bash
npm install -g firebase-tools
firebase login
firebase use --add
firebase deploy --only firestore:rules,firestore:indexes
```

## 6. Autorizar el dominio publicado

En **Authentication > Settings > Authorized domains**, agregar el dominio utilizado en Render, por ejemplo:

```text
workshop-hoshin-kanri.onrender.com
```

Para probar localmente, `localhost` suele estar autorizado por defecto.

## 7. Publicar en Render

Subir todos los archivos de esta carpeta al repositorio publicado. No excluir:

- `index.html`
- `facilitator.html`
- `cloud-sync.js`
- `facilitator.js`
- `firebase-config.js`
- logos y favicon

Los archivos `firestore.rules`, `firebase.json` y la documentación pueden permanecer en el repositorio aunque Render no los ejecute.

## 8. Preparar una prueba

1. Abrir `facilitator.html` en el dominio publicado.
2. Ingresar con el usuario facilitador.
3. Crear una experiencia y elegir un código.
4. Crear cada equipo con nombre, código y PIN.
5. Compartir el enlace generado y el PIN correspondiente.
6. Cambiar el estado de la experiencia a **Abierta**.
7. Observar el avance de las mesas en tiempo real.
8. Si es necesario, usar **Pausar edición** por equipo o pausar toda la experiencia.
9. Después de cada presentación, conversar sobre fines–medios, interdependencias, Catchball y defensa; luego ingresar una única nota final del Panel de 1 a 10 y finalizar la evaluación.
10. Presionar **Publicar / actualizar podio**.

## 9. Prueba técnica mínima antes del encuentro

- Abrir dos navegadores distintos o una ventana normal y otra de incógnito.
- Ingresar como dos equipos diferentes.
- Completar roles y una consulta en ambos.
- Confirmar que el panel muestra avances independientes.
- Recargar un equipo y comprobar que recupera su información.
- Desconectar internet, editar un campo, reconectar y comprobar la sincronización.
- Pausar un equipo desde el panel y confirmar que no puede guardar nuevos cambios.
- Publicar el podio y confirmar que aparece en ambos equipos.
- Ocultar el podio y comprobar que deja de estar disponible.

## 10. Recuperación y respaldo

- Firestore es la memoria central de la experiencia.
- Cada equipo mantiene además un respaldo local en su navegador.
- El panel permite exportar la experiencia completa como JSON.
- Se recomienda exportar una copia al terminar cada ensayo.

## Problemas frecuentes

**“Firebase todavía no está configurado”**  
Revisar que `firebase-config.js` ya no contenga valores `REEMPLAZAR_*`.

**“La cuenta no tiene rol de facilitador”**  
Revisar que exista `users/{UID}` y que el campo `role` sea exactamente `facilitator`.

**“Missing or insufficient permissions”**  
Publicar nuevamente `firestore.rules` y verificar que Anonymous y Email/Password estén habilitados.

**El equipo no aparece activo**  
La actividad se calcula con la última señal recibida. Esperar hasta 90 segundos y verificar conexión.
