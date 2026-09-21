# Guía operativa del facilitador · v59

## Antes del encuentro

1. Abrí `facilitator.html` e ingresá con tu cuenta individual de Firebase Authentication.
2. Creá una experiencia o seleccioná una existente.
3. Creá equipos provisionales, por ejemplo `Equipo 1`, `Equipo 2` y `Equipo 3`.
4. Si conocés los nombres definitivos, usá **Renombrar**. El enlace, el código y los datos no cambian.
5. Para cada equipo, usá **Copiar acceso** y compartí el mensaje con enlace y PIN.
6. Si un equipo antiguo no tiene un PIN recuperable, usá **Nuevo PIN** y después **Copiar acceso**.
7. Verificá que la experiencia diga `Cerrada` mientras preparás todo.

## Abrir y conducir

1. Presioná **Abrir experiencia**. Desde ese momento los equipos pueden ingresar.
2. En la etapa habilitada, presioná **Iniciar etapa**. En etapas sin tiempo verás **Habilitar etapa**.
3. Durante una etapa temporizada, la acción principal es **Finalizar etapa ahora**.
4. Al llegar a cero, la hoja se bloquea y queda en `Tiempo finalizado`; los participantes no avanzan solos.
5. Revisá el mensaje de estado y presioná **Habilitar hoja siguiente** cuando estés listo.

Finalizar una etapa y habilitar la siguiente son dos decisiones distintas: la primera congela el trabajo actual; la segunda cambia la hoja disponible para todos.

## Estados de la experiencia

- `Cerrada`: nadie puede ingresar.
- `Abierta`: los equipos pueden ingresar y trabajar en la etapa habilitada.
- `Pausada`: conserva los datos y bloquea temporalmente la edición.
- `Finalizada`: todo queda en consulta; solo el facilitador puede reabrir.

El panel muestra una sola acción principal coherente con el estado: abrir, pausar, reanudar o reabrir.

## Consultar hojas sin mover a los equipos

Usá **Abrir Hoja 1**, **Abrir Hoja 2**, **Abrir Hoja 3** o **Abrir Hoja 4** dentro de `Consulta privada del facilitador`. Esa consulta no modifica la etapa, los cronómetros ni lo que ven los participantes. Para revisar los datos concretos de un equipo, usá **Ver detalle** en su tarjeta.

## Reabrir una etapa

1. Elegí la hoja.
2. Elegí un equipo o `Todos los equipos`.
3. Presioná **Reabrir etapa** y confirmá.
4. Si querés limitar la excepción, indicá minutos y presioná **Asignar tiempo**.
5. Al terminar la corrección, presioná **Volver a cerrar**.

La reapertura no borra datos, no reinicia el cronómetro general y no desbloquea las demás hojas.
Si se reabre la Hoja 3, su presentación queda pendiente mientras se corrige y se genera nuevamente al cerrar la excepción o vencer el tiempo adicional. El panel no permite continuar con una presentación desactualizada.

## Supervisar equipos

Cada tarjeta muestra avance, consultas, variables, Story Points, Score automático, estado de presentación y actividad reciente.

- **Pausar equipo** bloquea solo a ese equipo.
- **Ver detalle** abre la hipótesis, variables, síntesis, A3 y guía privada.
- Si aparece `otra sesión activa`, pedí que no editen el mismo campo al mismo tiempo.
- Los participantes ven `Guardando…`, `Guardado`, `Sin conexión` o `Error al guardar`.

## Hoja 2

Al finalizar el tiempo quedan bloqueados nombre, roles y nuevas consultas. Las respuestas realizadas permanecen visibles. Si se usaron menos de tres oportunidades, las restantes no se completan automáticamente. Para corregir, reabrí Hoja 2 para el equipo necesario.

## Hoja 3 y preparación de presentaciones

El cierre guarda diagnóstico, acuerdos causales, hipótesis, variables, Story Points, síntesis y A3. Después calcula los indicadores y prepara la Hoja 4.

No habilites Hoja 4 hasta que el panel confirme que todas las presentaciones están listas. Si un equipo informa un error, sus datos permanecen guardados y puede usar **Reintentar generación** desde Hoja 3.

## Orden y exposición

1. Antes de la primera presentación, presioná **Sortear orden de presentación**.
2. Revisá el resultado y confirmalo.
3. Si necesitás medir cada exposición, usá el **Cronómetro de exposición**. No bloquea ni cambia datos.
4. El sorteo deja de poder repetirse cuando se finaliza la primera evaluación.

## Evaluación del Directorio

Después de cada presentación, conversen oralmente:

- claridad de la lectura del problema;
- coherencia de la hipótesis y las decisiones;
- comprensión de interdependencias y trade-offs;
- calidad de la defensa ante el Directorio.

Ingresá una sola **Nota consensuada del Directorio**, entre 1 y 10, y presioná **Finalizar evaluación**. El panel confirma el registro. Para corregirla, presioná **Editar evaluación**.

## Publicar resultados

1. Revisá los estados de todos los equipos.
2. Si uno no participa, marcá **No participa del ranking**.
3. Cuando todos los equipos incluidos estén evaluados, presioná **Publicar resultados**.
4. Confirmá la publicación. Todas las pantallas se actualizan sin cambiar de hoja ni recargar.

## Conceptos en lenguaje simple

- **Variable:** algo del sistema que el equipo propone mover para cambiar los resultados.
- **Story Points:** capacidad organizacional comparativa. No son dinero, días ni calidad. Hay 18 disponibles.
- **Interdependencia:** cuánta coordinación entre áreas exige una variable. No es una nota.
- **Índice de equilibrio:** muestra si los tres objetivos avanzan de manera pareja.
- **Variables propias:** propuestas creadas por el equipo; reciben parámetros dentro de los mismos límites y ningún bono.
- **A3 prioritario:** problema que merece un ciclo posterior de investigación, aprendizaje y ejecución.
- **Evaluación del Directorio:** una conversación con cuatro criterios que termina en una única nota.

## Problemas de conexión o guardado

- `Sin conexión`: no cierres la pestaña; recuperá internet y esperá a que cambie a `Guardado`.
- `Error al guardar`: mantené la pantalla abierta; el sistema reintenta automáticamente.
- Hoja 3 sin presentación: usá **Reintentar generación** y verificá la conexión.
- Dos sesiones activas: una puede observar, pero evitá que ambas modifiquen el mismo campo.
- Equipo bloqueado: verificá pausa de experiencia, pausa individual, estado de etapa y reaperturas.

## Cierre

Publicá el ranking cuando corresponda, exportá un JSON de respaldo y presioná **Finalizar experiencia**. No elimines experiencias de ensayo salvo decisión expresa.

## Seguridad antes del evento

La contraseña mencionada durante la reunión debe cambiarse manualmente en Firebase Authentication antes del evento. Usá cuentas individuales para facilitadores. No escribas contraseñas en el código, README, ejemplos ni mensajes compartidos.
