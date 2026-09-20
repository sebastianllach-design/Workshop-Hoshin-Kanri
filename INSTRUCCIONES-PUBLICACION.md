# Publicación en GitHub, Render y Firebase · v57

Esta versión simplifica la eliminación completa de experiencias desde el panel del facilitador: alcanza con aceptar un único aviso y ya no es necesario escribir el código. Conserva la nota única del Panel y no requiere nuevas colecciones, índices ni cambios en las reglas de Firestore.

La publicación requiere dos pasos:

1. Configurar Firebase siguiendo `SETUP-FIREBASE.md`.
2. Publicar los archivos estáticos en GitHub y Render siguiendo `INSTRUCCIONES-PUBLICACION-v57.md`.

No publicar la versión como prueba real mientras `firebase-config.js` conserve valores `REEMPLAZAR_*`. El modo de ejemplos sí puede utilizarse sin Firebase mediante `index.html?demo=1`.
