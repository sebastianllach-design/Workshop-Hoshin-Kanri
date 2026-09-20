# Publicación · v54

## Antes de subir a GitHub

1. Completar `firebase-config.js` con la configuración web del proyecto.
2. Crear el usuario facilitador y su documento `users/{UID}`.
3. Publicar `firestore.rules`.
4. Activar Authentication por correo/contraseña y anónimo.
5. Agregar el dominio de Render en Authorized domains.

La explicación detallada está en `SETUP-FIREBASE.md`.

## Archivos que deben reemplazarse o agregarse

Subir el contenido completo de esta carpeta al repositorio del tablero. En particular:

- reemplazar `index.html`;
- agregar `facilitator.html`;
- agregar `cloud-sync.js` y `facilitator.js`;
- agregar `firebase-config.js` ya configurado;
- mantener los logos y favicon;
- subir `VERSION.txt`, `README.md` y la documentación.

## Render

No se requiere cambiar el tipo de servicio: continúa siendo un sitio estático. Después del commit, esperar el deploy automático y verificar:

- `/index.html` muestra el acceso de equipos;
- `/facilitator.html` muestra el acceso privado;
- `/index.html?demo=1` abre los ejemplos.

## Prueba de humo

1. Crear una experiencia desde el panel.
2. Crear dos equipos.
3. Ingresar desde dos navegadores.
4. Confirmar que los avances aparecen por separado.
5. Completar evaluaciones desde el panel.
6. Publicar el podio.
7. Confirmar que ambos equipos ven el mismo resultado.

