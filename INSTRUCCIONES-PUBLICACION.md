# Publicación en GitHub, Render y Firebase · v58

Esta versión incorpora control del recorrido por hojas, bloqueo automático al vencer el tiempo y generación automática de la presentación de la Hoja 3. También incluye los ajustes visuales solicitados en las Hojas 1 a 4. Conserva la eliminación simple y la nota única del Panel; no requiere nuevas colecciones, índices ni cambios en las reglas de Firestore.

La publicación requiere dos pasos:

1. Configurar Firebase siguiendo `SETUP-FIREBASE.md`.
2. Publicar los archivos estáticos en GitHub y Render siguiendo `INSTRUCCIONES-PUBLICACION-v58.md`.

No publicar la versión como prueba real mientras `firebase-config.js` conserve valores `REEMPLAZAR_*`. El modo de ejemplos sí puede utilizarse sin Firebase mediante `index.html?demo=1`.
