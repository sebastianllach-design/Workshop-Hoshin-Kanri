# Cambios y pruebas · v58

Fecha: 2026-09-20

## Control de la experiencia

- El selector del panel se organiza por las cinco hojas del recorrido.
- Al iniciar una etapa, todas las mesas reciben la hoja habilitada y avanzan automáticamente a ella.
- Las hojas futuras quedan bloqueadas para los participantes.
- Las hojas anteriores permanecen disponibles como consulta, pero sus controles quedan deshabilitados.
- El vencimiento funciona tanto por llegada natural a `00:00` como por el botón **Finalizar ahora**.
- **Reiniciar** abre un nuevo ciclo de trabajo y **+5 min** reabre una etapa vencida con un nuevo ciclo.
- La pausa del cronómetro detiene la cuenta sin cerrar la edición; la pausa de experiencia o equipo bloquea la edición completa.

## Cierres automáticos

- Hoja 2: al vencer, se bloquean nombre, roles y consultas. Las consultas no utilizadas no se completan automáticamente.
- Hoja 3: al vencer, se bloquean altas, bajas y asignaciones de variables, Story Points, variables propias y campos de síntesis.
- En ese mismo evento se toma un snapshot, se guarda la propuesta y se abre la Hoja 4.
- Cada ciclo tiene un identificador para evitar cierres duplicados en una misma computadora o al recibir actualizaciones repetidas.
- Si una mesa recarga después del vencimiento, recupera la propuesta guardada y conserva el estado cerrado.

## Ajustes de visualización

- **Dirección estratégica de largo plazo** pasa a llamarse **Visión de la empresa** y queda al final del Perfil.
- La visión incorpora el posicionamiento de cinco nuevas sucursales para 2029.
- Se elimina el aviso **Desplazá horizontalmente** de la matriz estratégica de la Hoja 1, sin quitar su desplazamiento táctil o con trackpad.
- **Equipo y roles** y **Consultas a Dirección** son desplegables independientes.
- La guía interna de la Matriz cambia correctamente entre **Mostrar** y **Ocultar**.
- El **Índice de equilibrio** se separa del Score y se presenta junto a Story Points e Interdependencia dentro del dashboard de resultados.

## Elementos preservados

- Objetivos `+15%`, `-10%` y `+10%`.
- Banco y límite de tres consultas.
- Variables, impactos, máximo de siete variables y 18 Story Points.
- Fórmulas de Score, equilibrio e interdependencia.
- Nota única del Panel, ranking y podio.
- Acceso Firebase, aislamiento de equipos, respaldo local y eliminación simple de experiencias.
