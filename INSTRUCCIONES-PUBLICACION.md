# Publicación en GitHub, Render y Firebase · v55

Esta versión reemplaza los cuatro puntajes separados del Panel por una sola nota final de 1 a 10, conservando la evaluación final 50/50. No requiere nuevas colecciones, índices ni cambios en las reglas de Firestore.

La publicación requiere dos pasos:

1. Configurar Firebase siguiendo `SETUP-FIREBASE.md`.
2. Publicar los archivos estáticos en GitHub y Render siguiendo `INSTRUCCIONES-PUBLICACION-v55.md`.

No publicar la versión como prueba real mientras `firebase-config.js` conserve valores `REEMPLAZAR_*`. El modo de ejemplos sí puede utilizarse sin Firebase mediante `index.html?demo=1`.
