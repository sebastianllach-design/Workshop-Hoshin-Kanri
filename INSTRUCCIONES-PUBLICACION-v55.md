# Publicación · v55

## Antes de subir a GitHub

1. Confirmar que `firebase-config.js` contiene la configuración web del proyecto correcto.
2. Confirmar que Authentication tiene habilitados **Correo/contraseña** y **Anónimo**.
3. Confirmar que el facilitador existe en Authentication y que `users/{UID}` tiene `role: facilitator`.
4. Confirmar que las reglas de `firestore.rules` están publicadas.
5. Confirmar que el dominio de Render figura en **Authentication > Settings > Authorized domains**.
6. Ejecutar `node qa_v55.js` y verificar `status: OK`.

Esta actualización no requiere crear colecciones, índices ni campos manualmente. Las evaluaciones v54 se convierten automáticamente cuando se leen.

## GitHub

Subir el contenido completo de esta carpeta al mismo repositorio del tablero. Reemplazar, como mínimo:

- `index.html`;
- `facilitator.html`;
- `facilitator.js`;
- `cloud-sync.js`;
- `README.md` y `VERSION.txt`.

Mantener también `firebase-config.js`, los logos, el favicon, las reglas y la documentación.

## Render

No cambiar el tipo de servicio: continúa siendo un sitio estático. Si Render está conectado al repositorio, el nuevo commit inicia el deploy automáticamente.

## Única prueba de humo recomendada

1. Abrir `/facilitator.html` en Render e ingresar.
2. Usar una experiencia y un equipo de prueba con presentación lista.
3. Abrir **Evaluación del Panel**.
4. Confirmar que aparecen cuatro preguntas y un solo campo de nota 1–10.
5. Ingresar una nota, finalizar y publicar el podio.
6. Abrir el equipo y confirmar que la nota aparece sobre 10 y que el total es correcto.

Si estos seis pasos funcionan, la versión está lista para la experiencia.
