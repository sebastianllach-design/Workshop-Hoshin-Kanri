# Registro de pruebas · v54

Fecha: 2026-09-17

## Automatizadas

Ejecutar:

```bash
node qa_v54.js
```

Resultado esperado: `status: OK`.

Validaciones incluidas:

- Metadato y constante de versión v54.
- Archivos obligatorios presentes.
- Identidad Deportes Andina.
- Introducción metodológica y Catchball.
- Temporizador visible en equipos y controles en facilitador.
- Ausencia de hoja A3 en el recorrido activo.
- Fórmula final 50/50.
- Desempate total → defensa → Score automático.
- IDs HTML únicos.
- Sintaxis de `cloud-sync.js` y `facilitator.js`.
- Aislamiento de equipos y bloqueo en reglas Firestore.
- Ejemplos recalculados: Sistema alineado 94, Sistema en tensión 67, Mirada funcional 28.

## Funcionales a realizar con Firebase configurado

1. Crear una experiencia desde `facilitator.html`.
2. Crear al menos dos equipos y abrir la sesión.
3. Ingresar desde dos navegadores con códigos y PIN diferentes.
4. Iniciar, pausar, reanudar, ampliar, reiniciar, avanzar y finalizar el temporizador.
5. Confirmar que ambos equipos muestran la misma etapa y cuenta regresiva.
6. Recargar y acceder tarde para verificar reconstrucción desde `endAt`.
7. Completar una presentación y confirmar que aparece “Pendiente de evaluación”.
8. Completar los cuatro criterios y presionar “Finalizar evaluación”.
9. Confirmar actualización inmediata de total y posición.
10. Verificar filtros Equipos reales, Ejemplos y Todos.
11. Publicar el podio y confirmar que las mesas reciben únicamente equipos reales evaluados.
12. Probar empate completo y comprobar posición compartida.

## Responsive

Revisar en 1440 px, 1024 px y 390 px:

- Introducción metodológica sin desplazamiento horizontal.
- Temporizador legible.
- Matriz contenida en su scroll horizontal propio.
- Tabla final accesible mediante scroll interno.
- Podio, ganador y estados pendientes legibles.

Nota: la validación automatizada de navegador se omite si Playwright no dispone de un ejecutable Chromium local; las comprobaciones estáticas y de lógica continúan ejecutándose.
