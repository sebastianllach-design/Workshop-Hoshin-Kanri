# Cambios y pruebas · v57

Fecha: 2026-09-20

## Panel del facilitador

- El botón **Eliminar experiencia** conserva su ubicación en la cabecera de la experiencia activa.
- La eliminación ahora requiere una sola confirmación.
- Ya no se solicita escribir el código de la experiencia.
- El aviso identifica nombre, código y cantidad de equipos, e informa que la acción no se puede deshacer.
- El botón queda bloqueado mientras se procesa la eliminación para evitar envíos duplicados.
- Solo se permite eliminar una experiencia cuyo `facilitatorUid` coincide con la cuenta conectada.
- Después de confirmar, la experiencia se cierra para impedir nuevas entradas o guardados mientras se realiza el borrado.

## Datos eliminados

La operación elimina, en este orden lógico:

- documentos de `teams`;
- documentos de `teamSecrets`;
- documentos de `members`;
- documentos de `public`, incluido el ranking;
- documento principal `workshops/{sessionId}`.

Los documentos se procesan en lotes de hasta 400 operaciones. El documento principal se ubica al final; si un lote previo falla, la experiencia continúa visible y la eliminación puede reintentarse.

## Elementos preservados

- Reglas e índices de Firestore.
- Configuración y métodos de Authentication.
- Nota única del Panel de 1 a 10.
- Fórmula 50/50, ranking y podio.
- Temporizador, equipos, accesos y respaldo local.
- Variables, impactos, Story Points, ejemplos y flujo de participantes.
