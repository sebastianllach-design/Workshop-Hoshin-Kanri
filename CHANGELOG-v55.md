# Cambios y pruebas · v55

Fecha: 2026-09-20

## Evaluación del Panel

- Se reemplazan los cuatro campos numéricos 0–5 por una única nota final numérica de 1 a 10.
- La nota admite un decimal y es obligatoria para finalizar la evaluación.
- Los cuatro componentes siguen presentes como preguntas para el diálogo:
  - conexión entre fines y medios;
  - gestión de interdependencias;
  - Catchball oral;
  - claridad de la defensa.
- El comentario pasa a funcionar como síntesis opcional de la conversación del Panel.

## Cálculo y ranking

- El resultado conserva la fórmula `50% Score automático + 50% nota del Panel`.
- La nota 1–10 se normaliza internamente a 10–100 para mantener la escala total sobre 100.
- El ranking muestra la nota del Panel sobre 10.
- El desempate utiliza total, nota del Panel y Score automático, en ese orden.
- El ranking publicado incorpora `panelScore` y conserva `defenseScore` para compatibilidad.

## Compatibilidad

- Una evaluación anterior se convierte automáticamente mediante `(fines-medios + interdependencias + Catchball + defensa) / 2`.
- Ejemplo: cuatro valores que sumaban 13 sobre 20 se leen ahora como `6,5/10`.
- No cambian las colecciones, las reglas de seguridad ni los índices de Firebase.
- No cambian el acceso del facilitador, el acceso anónimo de equipos, el temporizador ni la memoria compartida.

## Referencias actualizadas

- Los ejemplos conservan sus resultados totales: 28, 67 y 94.
- La portada, el panel y los metadatos muestran v55.
- La documentación de despliegue y el control automatizado se actualizan a v55.
