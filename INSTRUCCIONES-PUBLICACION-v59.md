# Publicación de v59 · ejecutar solo después de aprobar

Esta entrega no fue publicada.

## Orden recomendado

1. Descomprimí el ZIP en una carpeta nueva.
2. Ejecutá `node qa_v59.js`.
3. Revisá `VERSION.txt`: debe indicar v59.
4. Publicá primero `firestore.rules` e índices con Firebase Console o CLI.
5. Confirmá Authentication Email/Password y Anonymous.
6. Cambiá la contraseña mencionada en la reunión desde Firebase Authentication.
7. Subí el contenido completo de la carpeta a GitHub, sin incluir el ZIP dentro de sí mismo.
8. Desplegá ese commit en Render.
9. Verificá que el título, la portada, el índice y el panel indiquen Versión 59.

## Prueba mínima posterior

1. Creá una experiencia temporal y dos equipos.
2. Abrila e ingresá desde dos navegadores.
3. Iniciá y cerrá Hoja 2; verificá bloqueo y reapertura.
4. Cerrá Hoja 3; verificá presentación preparada antes de habilitar Hoja 4.
5. Registrá notas válidas e inválidas.
6. Publicá resultados y comprobá la actualización inmediata.
7. Probá una sesión adicional del mismo equipo.
8. Eliminá la experiencia temporal solo si decidís hacerlo expresamente.

## Reversión

La carpeta v58 permanece intacta y puede usarse como respaldo. Si la prueba posterior falla, restaurá el despliegue v58 y no reviertas las reglas sin evaluar la compatibilidad de los datos creados por v59.
