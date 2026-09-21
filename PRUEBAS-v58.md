# Registro de pruebas · v58

Fecha: 2026-09-20

## Automatizadas

Ejecutar:

```bash
node qa_v58.js
```

Resultado esperado: `status: OK`.

La verificación incluye:

- versión v58 en portada, panel, navegador y metadatos;
- vínculo entre las cinco opciones del panel y las cinco hojas;
- publicación de `sheetId`, `stageIndex` y `cycleId`;
- bloqueo de hojas futuras y etapas vencidas;
- protección explícita de consultas, variables, Story Points y síntesis;
- snapshot automático al vencer la Hoja 3;
- persistencia de cierres por ciclo;
- visión actualizada y ubicada en el Perfil;
- bloques desplegables de la Hoja 2;
- corrección Mostrar/Ocultar de la guía de Matriz;
- ausencia del aviso de desplazamiento en la lectura estratégica;
- Índice de equilibrio independiente en el reporte;
- sintaxis JavaScript e IDs HTML únicos;
- fórmula 50/50, nota única y ejemplos 94/67/28;
- aislamiento y permisos Firebase existentes;
- eliminación completa de experiencias con confirmación simple.

## Prueba funcional con Firebase

El cierre automático real debe validarse después del despliegue con una experiencia temporal. La prueba automatizada no elimina ni modifica datos reales de Firebase.
