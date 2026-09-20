# Registro de pruebas · v57

Fecha: 2026-09-20

## Automatizadas

Ejecutar:

```bash
node qa_v57.js
```

Resultado esperado: `status: OK`.

La verificación incluye:

- versión v57 en portada, panel, navegador y metadatos;
- presencia y enlace del botón **Eliminar experiencia**;
- verificación de propiedad mediante `facilitatorUid`;
- una única confirmación y ausencia del pedido de código;
- cierre preventivo y lectura completa desde el servidor;
- inclusión de `teams`, `teamSecrets`, `members` y `public`;
- lotes por debajo del máximo de Firestore;
- documento principal colocado al final de la secuencia;
- sintaxis JavaScript;
- IDs HTML únicos;
- permanencia de la fórmula 50/50, nota única y ejemplos 94/67/28;
- reglas de lectura y eliminación para el facilitador.

## Prueba funcional segura

La eliminación real solo debe probarse después del despliegue y sobre una experiencia temporal. No utilizar una experiencia con información que deba conservarse.
