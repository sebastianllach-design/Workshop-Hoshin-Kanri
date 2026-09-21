# Configuración de Firebase · v59

La aplicación usa Firebase Authentication y Cloud Firestore. Render sirve los archivos estáticos. No requiere Cloud Functions ni Firebase Hosting.

## 1. Región

Si el uso principal será en Tokio, elegí **`asia-northeast1` (Tokyo)** al crear Firestore. Reduce latencia para los participantes y la ubicación no puede cambiarse después.

Si la base ya existe en otra región, no crees una segunda base solo por esta versión: probá la latencia y decidí la migración por separado.

## 2. Authentication

En **Authentication → Sign-in method** activá:

- Correo electrónico/contraseña para facilitadores.
- Anónimo para participantes.

Los usuarios anónimos aparecen en **Authentication → Users** solamente después de que un participante ingresa correctamente por primera vez. Activar el método no crea usuarios por sí solo.

## 3. Aplicación web

En **Configuración del proyecto → Tus apps**, registrá una aplicación web y copiá sus valores en `firebase-config.js`. Esa configuración identifica el proyecto y es pública por diseño; la protección real está en Authentication y `firestore.rules`.

## 4. Cuenta facilitadora

1. Creá una cuenta individual en **Authentication → Users**.
2. Copiá su UID.
3. En Firestore creá `users/{UID}` con:

| Campo | Tipo | Valor |
| --- | --- | --- |
| `role` | string | `facilitator` |
| `email` | string | correo individual |
| `name` | string | nombre visible |

El rol no puede asignarse desde el navegador.

## 5. Reglas e índices

La v59 cambia las reglas; deben publicarse antes de usar sus nuevas funciones.

Desde Firebase Console:

1. Abrí **Firestore Database → Rules**.
2. Copiá todo `firestore.rules`.
3. Publicá.

O con Firebase CLI:

```bash
npm install -g firebase-tools
firebase login
firebase use --add
firebase deploy --only firestore:rules,firestore:indexes
```

## 6. Dominios autorizados

En **Authentication → Settings → Authorized domains** agregá:

```text
workshop-hoshin-kanri.onrender.com
```

Para pruebas locales, verificá que `localhost` esté autorizado.

## 7. Prueba local corta

```bash
python3 -m http.server 8000
```

1. Abrí `http://localhost:8000/facilitator.html`.
2. Ingresá con la cuenta facilitadora.
3. Creá una experiencia cerrada y un equipo.
4. Copiá el acceso.
5. Abrí la experiencia.
6. En otra ventana, abrí el enlace y escribí el PIN.
7. Confirmá que el equipo aparece en el panel y que el guardado llega a `Guardado`.

No es necesario ejecutar todo el taller localmente; el archivo `PRUEBAS-v59.md` incluye una prueba de aceptación concentrada.

## 8. Antes del evento

- Cambiá desde Firebase Authentication la contraseña mencionada durante la reunión. No la guardes en archivos ni mensajes del proyecto.
- Usá una cuenta individual por facilitador.
- Publicá las reglas v59.
- Confirmá Email/Password y Anonymous.
- Confirmá el dominio de Render.
- Probá dos dispositivos con el mismo equipo y dos equipos distintos.
- Exportá un JSON de respaldo después del ensayo.

## Problemas frecuentes

**No aparecen usuarios anónimos**  
Todavía nadie ingresó correctamente. Abrí la experiencia, usá un enlace de equipo y completá el PIN.

**La cuenta no tiene rol de facilitador**  
Revisá `users/{UID}` y el valor exacto `facilitator`.

**Missing or insufficient permissions**  
Publicá `firestore.rules` v59 y verificá el UID propietario de la experiencia.

**El enlace pide experiencia y equipo**  
Compartí el mensaje generado por **Copiar acceso**; el enlace debe incluir `session` y `team`.

**Equipo antiguo sin PIN para copiar**  
Usá **Nuevo PIN** y después **Copiar acceso**. Los datos del equipo no cambian.

**La Hoja 4 no se habilita**  
Algún equipo todavía no confirmó la presentación. Revisá su estado y usá **Reintentar generación** desde Hoja 3 si corresponde.
