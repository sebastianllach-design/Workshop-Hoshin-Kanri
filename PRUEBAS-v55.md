# Registro de pruebas · v55

Fecha: 2026-09-20

## Automatizadas

Ejecutar:

```bash
node qa_v55.js
```

Resultado esperado: `status: OK`.

Validaciones incluidas:

- metadato y constante v55;
- sintaxis JavaScript e IDs HTML únicos;
- campo único de nota 1–10 y ausencia de cuatro inputs numéricos;
- cuatro preguntas de diálogo presentes;
- validación obligatoria antes de finalizar;
- fórmula final 50/50;
- compatibilidad con evaluación v54;
- desempate total → nota del Panel → Score automático;
- ranking publicado sobre 10;
- ejemplos recalculados 94, 67 y 28;
- reglas Firestore y archivos de despliegue presentes.

## Prueba de humo después de Render

1. Ingresar al panel como facilitador.
2. Abrir la evaluación de un equipo con presentación lista.
3. Intentar finalizar sin nota: debe aparecer una advertencia.
4. Ingresar `8,5` o `8.5`, agregar una síntesis opcional y finalizar.
5. Confirmar que el ranking muestra `8,5/10`.
6. Publicar el podio y confirmar la misma nota desde la pantalla de un equipo.

No es necesario repetir toda la experiencia para validar esta actualización.
