# Arquitectura multiequipo · v59

## Modelo de datos

```text
users/{facilitatorUid}
workshops/{workshopId}
workshops/{workshopId}/teams/{teamId}
workshops/{workshopId}/teamSecrets/{teamId}
workshops/{workshopId}/members/{anonymousUid}
workshops/{workshopId}/public/ranking
```

El documento de experiencia conserva estado general, etapa, cronómetro, orden de presentación y publicación. Cada equipo mantiene estado de trabajo, progreso, métricas, evaluación, exclusión del ranking, reaperturas y presencia por dispositivo.

## Máquina de etapas

`timer.sheetId` identifica la hoja activa y `timer.status` usa `ready`, `running` o `ended`.

| Estado visible | Condición técnica | Edición participante |
| --- | --- | --- |
| No habilitada | Hoja posterior a `sheetId` | No |
| Habilitada, sin iniciar | Hoja activa + `ready` | No |
| En curso | Hoja activa + `running` | Sí |
| Tiempo finalizado | Hoja temporizada + `ended` | No |
| Cerrada | Hoja anterior o no temporizada finalizada | No |
| Reabierta excepcionalmente | `stageOverrides.{sheetId}.open` | Sí, solo alcance indicado |

Las Hojas 2 y 3 son temporizadas. Las Hojas 1, 4 y 5 se conducen sin reloj de bloqueo. El cronómetro oral del panel es local e independiente.

## Cierre de Hoja 3

1. El cliente participante detecta el cierre por `cycleId`.
2. Captura los últimos campos.
3. Crea un snapshot completo en `round1`.
4. Marca `reportStatus: prepared`.
5. Guarda el estado y espera confirmación remota.
6. Publica `progress.presentationReady: true`.

El panel impide habilitar Hoja 4 si algún equipo no está listo. Un error deja `reportStatus: error`, conserva los datos y habilita reintento.

Una reapertura de Hoja 3 marca la presentación como pendiente. Su cierre manual o el vencimiento del tiempo excepcional emite un `closeCycle`; el cliente conserva la etapa global vigente, crea un nuevo snapshot y vuelve a publicar `presentationReady` solo después del guardado confirmado.

## Sincronización concurrente

Cada escritura usa una transacción:

1. lee el último estado remoto;
2. compara estado base y estado local;
3. fusiona recursivamente solo los campos cambiados localmente;
4. incrementa `stateRevision`;
5. actualiza progreso, métricas y presencia.

Los objetos se fusionan por campo. Los arrays se consideran unidades atómicas; ante ediciones simultáneas del mismo array prevalece la última transacción confirmada. La interfaz advierte si hay otro dispositivo activo para reducir ese conflicto.

## Acceso

- Facilitador: Firebase Email/Password y documento `users/{uid}` con `role: facilitator`.
- Participante: Firebase Anonymous, enlace con experiencia/equipo y PIN.
- La membresía liga el UID anónimo con un único equipo.
- El PIN se transforma en SHA-256 para validar la incorporación. El PIN generado recuperable queda en `teamSecrets`, subcolección restringida al facilitador propietario, para permitir **Copiar acceso**.

## Seguridad

- Un facilitador solo lista y administra experiencias cuyo `facilitatorUid` coincide con su UID.
- Un participante solo puede leer y modificar el equipo asociado a su membresía.
- Los participantes no pueden alterar evaluaciones, exclusión del ranking, bloqueos ni reaperturas.
- El ranking público se escribe únicamente desde el panel propietario y contiene los cinco campos visibles.
- No se registran contraseñas ni PIN en la consola del navegador.

Las reglas nuevas deben publicarse antes de usar v59 en producción.

## Compatibilidad

- Se conserva `hoshin_v31_internal` para datos locales históricos.
- La migración normaliza evaluaciones anteriores, síntesis, ERIC histórico no visible, diagnóstico, A3 y snapshots.
- Los equipos existentes sin PIN recuperable siguen funcionando con membresías ya creadas; para volver a compartir acceso se genera un PIN nuevo.
