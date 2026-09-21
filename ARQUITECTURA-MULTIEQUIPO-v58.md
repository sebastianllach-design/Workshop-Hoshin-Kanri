# Arquitectura multiequipo · Conversaciones que Transforman v58

La v58 conserva el modelo Firebase de v57 y amplía el objeto `timer` existente. No agrega colecciones ni requiere modificar reglas o índices.

## Estado de facilitación

El documento `workshops/{sessionId}` registra en `timer`:

- `sheetId`: hoja habilitada;
- `stageIndex`: posición dentro del recorrido;
- `stageLabel`: descripción visible;
- `durationSec` y `remainingSec`;
- `status`: `idle`, `running`, `paused` o `ended`;
- `startedAt` y `endAt`;
- `cycleId`: identificador único del ciclo.

La interfaz participante escucha ese documento en tiempo real. Con el índice de la hoja determina tres estados:

- hoja futura: no visible mediante la navegación;
- hoja activa: editable mientras haya tiempo;
- hoja finalizada: visible en modo lectura.

La Hoja 1 se conserva siempre disponible como documento de consulta.

## Vencimiento de la Hoja 3

Al detectar el primer vencimiento de un `cycleId`, el cliente:

1. recoge los últimos campos de síntesis;
2. calcula el snapshot con las fórmulas existentes;
3. lo guarda en `round1`;
4. registra el ciclo en `stageClosures.despliegue`;
5. sincroniza estado, progreso y métricas;
6. abre la Hoja 4.

El identificador de ciclo evita repetir el cierre por cada actualización del reloj. Reiniciar o agregar tiempo después de un vencimiento crea un nuevo ciclo y permite un nuevo cierre posterior.

## Bloqueos administrativos

Los bloqueos de experiencia y equipo siguen siendo independientes del cronómetro. Mientras uno de ellos está activo no se guardan cambios ni se ejecuta el cierre automático. Al reabrir, el cliente recupera el estado del cronómetro y aplica el cierre pendiente si corresponde.
