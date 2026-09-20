# Cambios y pruebas · v56

Fecha: 2026-09-20

## Panel del facilitador

- Se agrega el botón **Eliminar experiencia** en la cabecera de la experiencia activa.
- La primera confirmación informa nombre, código, cantidad de equipos y carácter irreversible de la acción.
- La segunda confirmación exige escribir el código de la experiencia.
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
