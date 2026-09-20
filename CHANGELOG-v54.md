# Cambios y pruebas · v54

Fecha: 2026-09-17

## Contenido e identidad

- El caso adopta la identidad **Deportes Andina**, retail deportivo regional omnicanal.
- Se explicitan las categorías comercializadas: calzado, indumentaria, accesorios y equipamiento deportivo.
- Se incorpora una estructura de liderazgo sencilla y una breve descripción del Directorio.
- Los objetivos 2027 quedan enmarcados en una dirección estratégica de largo plazo sin sumar KPI.

## Dinámica

- Se incorpora una introducción reabrible a Hoshin Kanri, Catchball y el entregable esperado.
- El facilitador controla un temporizador por etapa guardado en el documento de la sesión.
- Las mesas reciben la etapa y el tiempo restante en tiempo real; llegar a cero no bloquea acciones.
- La hoja de proyectos A3 se retira del recorrido, ejemplos y reportes.

## Indicadores y evaluación

- El Índice de equilibrio no se muestra durante la selección.
- El índice aparece debajo del Score automático al preparar la presentación al Directorio.
- La ponderación final pasa a `50% Score automático + 50% Evaluación del Panel de Directores`.
- La defensa normaliza los cuatro criterios 0–5 a una escala 0–100.

## Ranking y podio

- Equipos sin presentación o evaluación cerrada aparecen como pendientes y no reciben posición.
- El panel permite filtrar equipos reales, ejemplos o todos.
- El ganador real se calcula únicamente con equipos reales.
- Desempate: total, defensa, Score automático. Un empate completo comparte posición.
- La tabla final muestra posición, equipo, tipo, score, defensa, total, equilibrio, estado y acciones.

## Compatibilidad

- Se conservan los datos históricos `a3` únicamente para que sesiones anteriores no fallen.
- No cambian consultas, variables, impactos, máximo de siete variables, 18 Story Points ni fórmula del Score automático.
- Se conserva `hoshin_v31_internal`, la memoria Firestore, el respaldo local y el aislamiento por equipo.

## Pruebas incluidas

- Sintaxis JavaScript de módulos remotos.
- IDs HTML duplicados.
- Identidad y metadato v54.
- Ausencia de la hoja A3.
- Ponderación 50/50 y desempates.
- Temporizador y controles del facilitador.
- Carga y orden de los tres ejemplos.
- Reglas Firestore de aislamiento y bloqueo.
