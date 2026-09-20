# Conversaciones que Transforman · Hoshin Workshop

**Versión actual: v57 · Eliminación simple de experiencias**

Base de trabajo: paquete productivo completo de la **v46 · Indicadores complementarios legibles**.

Al abrir el tablero, la marca **Versión v57 · Deportes Andina** debe verse en la portada principal y **Hoshin Workshop · v57** en el índice lateral.

## v57 · Eliminación simple de experiencias

- El facilitador puede eliminar una experiencia con una sola confirmación.
- Ya no necesita escribir el código de la experiencia.
- El aviso muestra el nombre, el código y la cantidad de equipos antes de borrar.
- La eliminación continúa siendo completa: borra equipos, secretos de acceso, membresías anónimas, ranking público y documento principal.
- Se conservan la validación de propiedad, el bloqueo contra doble clic, el cierre preventivo y los lotes seguros para Firebase.
- No cambian las reglas, colecciones, fórmulas, evaluación, ranking ni experiencia de los participantes.

### Archivos principales de v57

- `facilitator.js`: confirmación única y borrado completo.
- `CHANGELOG-v57.md`: detalle funcional.
- `INSTRUCCIONES-PUBLICACION-v57.md`: publicación y prueba mínima.
- `qa_v57.js`: validaciones automáticas.

## v56 · Eliminación segura de experiencias

- El panel del facilitador incorpora el botón **Eliminar experiencia** dentro de la experiencia activa.
- Antes de borrar, muestra el nombre, código y cantidad de equipos afectados.
- Exige una segunda confirmación escribiendo el código de la experiencia.
- Elimina equipos, secretos de acceso, membresías anónimas, ranking público y documento principal.
- La operación solo se habilita para experiencias creadas por la cuenta facilitadora conectada.
- Los documentos se eliminan en lotes seguros para respetar el límite de Firebase.
- No cambian las reglas, colecciones, fórmulas, evaluación, ranking ni experiencia de los participantes.

### Archivos principales de v56

- `facilitator.html`: nuevo control de eliminación y versión visible.
- `facilitator.js`: confirmación, validación de propiedad y borrado completo.
- `CHANGELOG-v56.md`: detalle funcional.
- `INSTRUCCIONES-PUBLICACION-v56.md`: publicación y prueba mínima.
- `qa_v56.js`: validaciones automáticas.

## v55 · Nota única del Panel

- El facilitador asigna una sola nota final numérica de `1 a 10`; ya no califica cuatro componentes por separado.
- Fines–medios, interdependencias, Catchball y defensa se muestran como preguntas guía para sostener el diálogo del Panel.
- No es posible finalizar una evaluación sin una nota válida.
- El total conserva la ponderación `50% Score automático + 50% nota final del Panel`.
- El ranking, el podio y la vista publicada muestran la nota del Panel sobre 10.
- Las evaluaciones v54 se migran automáticamente: los cuatro puntajes anteriores se convierten a su equivalente integrado sobre 10.
- Los desempates se resuelven por total, nota del Panel y Score automático; los empates completos comparten posición.
- No cambian el modelo Firebase, las reglas, las colecciones ni el flujo de acceso.

### Archivos principales de v55

- `index.html`: experiencia de participantes, modo demostración y ranking actualizado.
- `facilitator.html` y `facilitator.js`: diálogo guiado, nota única y publicación del podio.
- `cloud-sync.js`: vista publicada compatible con rankings nuevos y anteriores.
- `CHANGELOG-v55.md`: detalle funcional y compatibilidad.
- `INSTRUCCIONES-PUBLICACION-v55.md`: actualización en GitHub y Render.
- `qa_v55.js`: verificación automatizada.

## v54 · Deportes Andina y dinámica final

- El caso adquiere identidad de retail deportivo: calzado, indumentaria, accesorios y equipamiento para distintas disciplinas.
- Los objetivos 2027 se presentan como un escalón de una dirección estratégica de largo plazo, sin crear KPI adicionales.
- Una introducción reabrible explica Hoshin Kanri, Catchball y el entregable esperado.
- El facilitador controla un temporizador sincronizado por etapa; todas las mesas lo ven en tiempo real y el tiempo cumplido no bloquea la carga.
- El Índice de equilibrio permanece oculto durante la selección y se revela debajo del Score automático en la presentación al Directorio.
- La fórmula final es `50% Score automático + 50% Evaluación del Panel de Directores`.
- Se elimina la hoja de proyectos A3 y toda referencia visible; los campos históricos se toleran únicamente para migración.
- La evaluación final separa equipos reales, ejemplos y vista conjunta. Los ejemplos nunca definen el ganador real.
- Los equipos sin presentación o evaluación finalizada aparecen como pendientes, sin puesto definitivo.
- El podio ordena por total, defensa y Score automático; los empates completos comparten posición.
- Se conservan consultas, variables, impactos, 18 Story Points, máximo de siete variables, Score automático, roles, Catchball, Firebase, respaldo local y migración.

### Archivos principales de v54

- `index.html`: experiencia de participantes y modo demostración.
- `facilitator.html` y `facilitator.js`: seguimiento, temporizador, evaluación y podio.
- `cloud-sync.js`: acceso, memoria, temporizador remoto y ranking publicado.
- `firestore.rules`: aislamiento de datos y permisos.
- `ARQUITECTURA-MULTIEQUIPO-v54.md`: modelo técnico.
- `INSTRUCCIONES-PUBLICACION-v54.md`: publicación.
- `qa_v54.js`: validaciones automáticas.

## v53 · Prueba multiequipo con Firebase

- Se agrega acceso por código de experiencia, código de equipo y PIN, sin cuentas personales para participantes.
- Cada equipo trabaja sobre un documento privado y no puede ver el avance de las demás mesas.
- Firestore pasa a ser la memoria compartida; `localStorage` se conserva como respaldo y compatibilidad.
- El guardado remoto utiliza una demora controlada para reducir escrituras y mantener la cuota gratuita.
- Se incorpora `facilitator.html`, una vista privada para crear sesiones y equipos, observar avances, pausar la edición, evaluar y publicar el podio.
- La evaluación humana se guarda fuera del estado editable por los equipos.
- El ranking permanece oculto hasta que el facilitador decide publicarlo.
- Los tres ejemplos se mantienen en modo demostración separado mediante `index.html?demo=1`.
- Se incluyen reglas de seguridad, configuración Firebase, documentación de arquitectura y guía completa de puesta en marcha.
- No se modifican variables, impactos, máximo de siete variables, 18 Story Points ni fórmulas de Score.

### Archivos principales de v53

- `index.html`: experiencia de participantes y modo demostración.
- `facilitator.html`: panel privado del facilitador.
- `cloud-sync.js`: acceso de equipos, memoria remota, respaldo y ranking publicado.
- `facilitator.js`: administración de sesiones, equipos, evaluación y podio.
- `firebase-config.js`: datos del proyecto Firebase que deben completarse antes de publicar.
- `firestore.rules`: aislamiento de datos y permisos.
- `SETUP-FIREBASE.md`: configuración paso a paso.
- `ARQUITECTURA-MULTIEQUIPO-v53.md`: decisiones técnicas y modelo de datos de esa versión.
- `qa_v53.js`: validaciones automáticas de esa versión.

## v52 · Evaluación y podio

- La Hoja 6 pasa a ser la pantalla final de **Evaluación y podio**.
- El ranking y la evaluación se integran en una única tabla ordenada automáticamente por resultado total.
- El primer, segundo y tercer puesto reciben una jerarquía visual gradual de oro, plata y bronce, manteniendo todos los valores editables de la evaluación.
- Una cabecera identifica explícitamente al equipo ganador y resume su resultado, avance conjunto, equilibrio y Story Points.
- Se agrega en la misma hoja el botón **Cargar los 3 ejemplos**, que conserva las mesas reales existentes, descarta únicamente la mesa inicial intacta y muestra inmediatamente cómo queda el podio.
- Se mantiene sin cambios la fórmula del resultado total: 60% Score automático y 40% evaluación humana.
- Los desempates visuales se ordenan por Score automático, avance conjunto y nombre del equipo, sin modificar el resultado numérico.
- Se preservan el cierre oral en plenario, las fórmulas, la persistencia, el máximo de siete variables, los 18 Story Points y el resto del recorrido de la v51.

## v51 · Cierre oral en plenario

- Se eliminan de la interfaz las antiguas Hojas 5 y 6: **Catchball con dirección** y **Replanteo final**.
- La navegación queda renumerada sin saltos: A3 pasa a la Hoja 5 y Evaluación y ranking a la Hoja 6.
- La Hoja 4 incorpora un cierre liviano para la **devolución del Directorio y el Catchball oral**, sin campos ni carga adicional para los equipos.
- El cierre propone una secuencia común: presentación, preguntas del Directorio, intercambio entre mesas y síntesis del facilitador.
- La propuesta congelada en la Hoja 4 pasa a ser la referencia para A3 y para la evaluación; ya no existe dependencia funcional de un replanteo posterior.
- La evaluación conserva el criterio de Catchball, ahora identificado como **Catchball oral**.
- Los ejemplos y los mensajes de navegación se ajustan al recorrido reducido.
- Se mantienen íntegros el Informe Directivo, las consultas, el banco de variables, la Matriz, el dashboard, las fórmulas, los 18 Story Points y el Score Final.

## v50 · Contador de consultas centrado

- En la Hoja 2, el texto **Consultas realizadas: 0/3** queda centrado horizontal y verticalmente dentro de su indicador.
- El ajuste se mantiene cuando el contador cambia de 0/3 a 3/3.
- No se modifica el banco de consultas, el máximo de tres selecciones ni ninguna lógica del tablero.
- Se preservan íntegramente los cambios de la v49.

## v49 · Lecturas y síntesis ejecutiva

- La etiqueta verde que identifica la procedencia de la información aparece siempre debajo del texto de conexión con evidencia.
- **Alertas y efectos cruzados** y **Preguntas que abre el portafolio** se integran en un bloque visible llamado **Lecturas para preparar la síntesis**.
- El bloque distingue **Efectos y condiciones para considerar** y **Preguntas para preparar la defensa**.
- Las ayudas utilizan una presentación neutral: no califican la propuesta, no funcionan como acierto o error y no modifican el Score.
- Únicamente el exceso de los 18 Story Points recibe un énfasis ámbar moderado, por tratarse de una condición objetiva de capacidad.
- En la Hoja 4, la **Síntesis del Equipo de Liderazgo** aparece inmediatamente después de integrantes y roles.
- La síntesis se amplía y organiza en cuatro bloques antes del cumplimiento de objetivos, los indicadores complementarios y la Matriz.
- Se mantienen el banco por temas de v48, las 24 variables, sus impactos, las fórmulas, el máximo de siete variables, los 18 Story Points y la persistencia.

## v48 · Variables organizadas por tema

- Se elimina el botón individual **Ver detalle**.
- Evidencia, riesgo y condiciones necesarias para el éxito se muestran directamente en la misma fila de cada variable.
- Las 24 variables quedan agrupadas en seis temas: Crecimiento y clientes; Inventario y supply; Operación y productividad; Personas y liderazgo; Tecnología y coordinación; Compras y costos.
- Dentro de cada tema, las variables se ordenan alfabéticamente para facilitar su comparación.
- El buscador y el filtro por tema se mantienen.
- El bloque completo continúa siendo plegable.
- Los impactos, la dificultad, la interdependencia y los Story Points siguen ocultos hasta llevar la variable a la Matriz.
- La Matriz, el dashboard, las fórmulas y las funcionalidades posteriores permanecen idénticos a v46 y v47.

## v47 · Banco cualitativo de variables

- La Hoja 3 comienza directamente con la exploración y selección de variables.
- Se eliminan de la interfaz visible la Matriz ERIC y el bloque adicional de entendimiento.
- El banco conserva las 24 variables de la v46 y las presenta en filas compactas.
- Antes de seleccionar, cada variable permite revisar: conexión con evidencia, riesgo principal y condiciones necesarias para tener éxito.
- La información de cada variable está cerrada por defecto y puede abrirse u ocultarse individualmente.
- El banco completo forma parte de un bloque plegable y ofrece controles para mostrar u ocultar todos los detalles.
- Impactos sobre objetivos, dificultad, interdependencia y Story Points solo aparecen cuando la variable se lleva a la Matriz.
- La Matriz de variables, el dashboard final de la Matriz, las alertas y la asignación de Story Points conservan la apariencia y el comportamiento de la v46.
- Se mantienen el máximo de 7 variables, los 18 Story Points, las fórmulas, las consultas, la persistencia, los ejemplos, los snapshots, el Directorio, el Catchball, A3, evaluación y ranking.

## v20 · Catchball interno simplificado
- Se eliminó el bloque **“¿Qué ve cada uno?”**.
- Su reflexión se integró al Catchball interno para reducir carga de registro durante el workshop.
- El nuevo bloque 2 es **“Catchball interno y construcción de variables”**.
- La tabla queda con seis columnas:
  1. Rol
  2. Posición y prioridades
  3. Variable propuesta 1
  4. Variable propuesta 2
  5. Por qué puede mover el sistema
  6. Objeción a otras propuestas
- Se eliminó el campo obligatorio **“Qué negociaría / Concesión”**.
- **Variables candidatas** pasa a ser el bloque 3.
- Matriz y Síntesis conservan numeración 4 y 5.

## v21 · Introducción del Catchball reordenada
- Se eliminó el bloque independiente **“Una pregunta clave para este objetivo”**.
- Su lógica se integró en una introducción general: **“Antes de proponer variables”**.
- Productividad aparece solo como ejemplo para distinguir un resultado de una variable causal.
- **Preguntas útiles para la conversación** ahora está inmediatamente debajo del título, junto a la introducción metodológica.
- La tabla de Catchball queda debajo de ambas ayudas.
- El botón **“+ Proponer nueva variable”** queda al final de la tabla.
- Se actualizaron las preguntas guía para reforzar evidencia, causalidad, efectos cruzados, interdependencia y visión sistémica.

## v22 · Tres ramas de demo
- El botón **Cargar demo** fue reemplazado por **Cargar ejemplos**.
- Se incorporan tres patrones:
  1. **Mirada funcional**: cada área defiende su agenda; hay contradicciones y bajo resultado.
  2. **Sistema en tensión**: existe pensamiento sistémico, pero quedan trade-offs sin resolver.
  3. **Sistema alineado**: las variables forman una hipótesis causal común y las renuncias son explícitas.
- Cada demo incluye posiciones por rol, variables iniciales, objeciones, Matriz, Story Points, síntesis del Gerente, preguntas del Directorio y evaluación.
- Puede cargarse una sola demo o las tres simultáneamente.
- Cargar demos conserva las mesas reales existentes.
- Las tres demos pueden compararse desde **Evaluación y Ranking**.

## v23 · Referencias de interdependencia
- Se explica explícitamente que **Interdependencia** mide exigencia de coordinación, no calidad de la variable.
- Escala visible:
  - 1/5 Prácticamente autónoma
  - 2/5 Coordinación baja
  - 3/5 Coordinación moderada
  - 4/5 Coordinación alta
  - 5/5 Coordinación transversal crítica
- La Matriz muestra el nivel semántico junto al número.
- La interdependencia media del portafolio muestra también su lectura cualitativa.
- Reporte y Síntesis del Gerente incorporan la misma referencia.
- En Evaluación, el criterio se renombra **Gestión de interdependencias** para distinguirlo de la propiedad de una variable.
- Se aclara que la Gestión de interdependencias sí se evalúa 0–5 y un valor alto representa mejor gestión.

## v24 · Referencias de los cuatro indicadores
- **Índice de equilibrio**: qué tan parejo es el avance entre Ventas, Costos y Desempeño. Alto no implica avance suficiente.
- **Story Points**: capacidad organizacional requerida. 18 SP disponibles; no representan costo monetario ni calidad.
- **Interdependencia**: exigencia de coordinación transversal. Un valor alto no significa una mejor variable.
- **Score automático**: 45% avance conjunto + 35% equilibrio + 20% disciplina de capacidad. No reemplaza la evaluación humana del Catchball, causalidad o defensa.

## v25 · Cuadro unificado de guía en bloque 4
- Se unifican los dos cuadros explicativos del bloque 4 en un solo cuadro desplegable e independiente.
- El nuevo cuadro explica: Lectura de la matriz, Impacto, Índice de equilibrio, Story Points, Interdependencia y Score automático.
- Incluye además un criterio general de lectura y la escala resumida de interdependencia.

## v26 · Signos de impacto respecto de cada objetivo
- Se aclara que los valores -4 a +4 son ratings de impacto y no porcentajes directos.
- El signo se interpreta siempre respecto del cumplimiento del objetivo: + ayuda y − perjudica.
- Para Costos -10%, un valor positivo significa que la variable ayuda a reducir costos; un valor negativo dificulta la reducción.
- Encabezados de Matriz y Reporte pasan a hablar de contribución a cada objetivo.
- Se añade una leyenda visible y se actualiza la guía desplegable y el modal de ayuda.

## v27 · Índice lateral colapsable
- Se agrega un botón fijo para ocultar / mostrar la barra índice de hojas.
- Al ocultarse el índice, la página gana ancho completo para trabajar sin desplazarse horizontalmente entre izquierda y derecha.
- El estado del índice queda recordado en el navegador.

## v28 · Favicon Experiencia Japón
- Se agrega favicon del proyecto usando el logo de Experiencia Japón.
- Archivos incluidos: `public/favicon-experiencia-japon.png` y `public/favicon.ico`.

## v29 · Revisión integral de ancho y legibilidad
- Se revisó la estructura de las 8 hojas y sus bloques.
- Texto y tarjetas ahora responden al ancho real del área de trabajo mediante container queries.
- Las grillas de 3, 4 y 5 columnas se reorganizan antes de que el contenido quede comprimido o cortado.
- Toda tabla ancha queda contenida en su propio bloque con scroll horizontal.
- Las tablas con scroll muestran la indicación **“Desplazá horizontalmente →”**.
- En tablas críticas, la primera columna queda fija al desplazarse horizontalmente.
- Se evita que un bloque ancho genere scroll horizontal de toda la página.
- Se mantiene el tamaño tipográfico y se prioriza legibilidad sobre compresión.

## v30 · Objetivos sin condición de Dirección
- En Hoja 1, bloque **Objetivos definidos por Dirección**, se eliminaron los tres recuadros **Condición de dirección**.
- Dirección comunica únicamente los resultados esperados.
- Las restricciones, tensiones y criterios de decisión deben ser deducidos por el equipo a partir del caso y el Catchball.

## v31 · Índice fijo durante la navegación
- Mantiene el cambio anterior: Hoja 1 sin los recuadros **Condición de dirección**.
- En escritorio, el índice lateral queda fijo al viewport mientras se navega verticalmente por cualquier hoja.
- El usuario puede cambiar de hoja desde cualquier punto de la página sin volver hacia arriba.
- El índice sigue siendo ocultable / visible mediante el botón superior.
- Al ocultarlo, el contenido recupera todo el ancho disponible.
- En pantallas menores a 1100 px se conserva el comportamiento responsive previo.

## v32 · Hoja 1 convertida en Informe Directivo
- La Hoja 1 se presenta como el **Informe Directivo para la Planificación 2027** de Deportes Andina.
- Se incorpora identidad institucional propia, encabezado ejecutivo e índice de seis secciones.
- El contenido se reorganiza en Perfil, Evolución, Lectura estratégica, Áreas, Desempeño y Prioridades 2027.
- Se diferencia conceptualmente Retrospectiva, Introspectiva, Expectativa y Prospectiva.
- Se eliminan de la Hoja 1 las referencias a juego, pistas, información faltante y tensiones explícitamente formuladas.
- Los hechos que originan esas tensiones se preservan e integran en la historia, la matriz y los indicadores.
- Se conserva el acuerdo de la v30: Dirección comunica los resultados esperados sin exponer condiciones o respuestas de decisión.
- Se mantienen las mejoras responsive de la v29, el índice fijo de la v31 y toda la lógica funcional del tablero.

## v33 · Consultas a Dirección seleccionables
- La Hoja 2 pasa de **Preguntas al caso** a **Consultas a Dirección**.
- Se elimina el campo de texto libre y el análisis por palabras clave.
- Se incorpora un banco determinístico de 10 consultas sobre crecimiento, rentabilidad, inventario, desempeño, horas extra, capacidades, adopción digital, logística, compras, experiencia omnicanal y criterios del Directorio.
- Cada mesa puede confirmar hasta 3 consultas, una por vez, y utilizar cada respuesta para decidir su siguiente elección.
- Las consultas realizadas quedan bloqueadas, se registran en orden y mantienen la conexión con la información desbloqueada y las variables de la Matriz.
- Se conserva la clave de almacenamiento y la compatibilidad con preguntas abiertas guardadas por versiones anteriores.
- Se actualizan los equipos demo sin modificar sus decisiones, variables, Story Points ni evaluaciones.
- La interfaz utiliza tarjetas accesibles y responsive: 3 columnas en escritorio, 2 en tablet y 1 en móvil.

## v34 · Secciones reparadas y banco de consultas ampliado
- Se corrige el control **Ocultar secciones / Ver secciones** de la Hoja 1. El problema estaba en que los seis bloques se encontraban dentro del contenedor del Informe Directivo y la función anterior solo buscaba bloques hijos directos de la hoja.
- La detección de bloques desplegables ahora funciona tanto en la Hoja 1 como en la Hoja 3 y evita incorporar bloques pertenecientes a otras hojas.
- El banco de la Hoja 2 aumenta de 10 a 20 consultas, manteniendo el límite de 3 elecciones por mesa.
- La calibración interna del banco es:
  - **12 consultas (60%)**: entregan información, relaciones o restricciones relevantes del caso.
  - **4 consultas (20%)**: devuelven la decisión al Equipo de Liderazgo porque forman parte de su trabajo estratégico.
  - **4 consultas (20%)**: corresponden a un área funcional o a una definición táctica que el Directorio no debe resolver.
- Los tipos de respuesta no se muestran antes de seleccionar. Todas las tarjetas conservan una apariencia equivalente para que la mesa deba evaluar el valor potencial de cada consulta.
- Las nuevas opciones cubren, entre otros temas, tráfico y conversión, fragmentación de información, selección del portafolio, prioridad entre objetivos, trade-offs, A3, proveedores, dotación, campañas y herramientas digitales.
- Se mantienen el límite de tres, la persistencia, la compatibilidad con sesiones v33 y anteriores, y la conexión entre respuestas informativas y variables estratégicas.

## v35 · Roles privados y recorrido directo a la Matriz

- Los perfiles detallados de Gerente General, Comercial / Marketing, Finanzas, Operaciones / Supply y Personas / RRHH dejan de formar parte del tablero público.
- La Hoja 3 registra únicamente la asignación de participantes a roles; la responsabilidad, intereses, sesgos, preguntas y posición inicial se trabajan en tarjetas privadas impresas.
- El Gerente General recibe, fuera del tablero, un mapa adicional de perspectivas para integrar el sistema completo.
- Se eliminan de la interfaz los registros redundantes de posición inicial, Catchball por rol y variables candidatas.
- La conversación ocurre oralmente y las variables acordadas se incorporan directamente desde el banco completo a la Matriz.
- La Hoja 3 queda organizada en tres bloques: Equipo asignado, Conversación y Matriz de variables, y Síntesis del Gerente General.
- El modo facilitador se traslada a los controles de la Matriz y conserva la clave y el comportamiento previos.
- Los datos `internal` de versiones anteriores se preservan en el estado para mantener compatibilidad, pero ya no se muestran ni se requieren.
- Se mantienen sin cambios las variables, impactos, Story Points, fórmulas, límite de 7 variables, capacidad de 18 SP, consultas de la Hoja 2, demos, snapshots, Directorio, replanteo, A3 y evaluación.

## v36 · Roles antes de las consultas

- La versión queda identificada de forma visible como **v36** en el título del navegador, el encabezado lateral y un sello dentro de la portada principal.
- La Hoja 1 elimina el bloque **Áreas que intervienen en la planificación** y queda organizada en cinco secciones institucionales.
- El nombre del equipo y la asignación de los cinco roles se trasladan al comienzo de la Hoja 2, antes del banco de consultas.
- El tablero público continúa mostrando únicamente el rol y el nombre del participante; las perspectivas detalladas permanecen en materiales privados.
- La Hoja 3 elimina el bloque redundante **Equipo asignado** y comienza directamente con Conversación y Matriz de variables.
- Las secciones de la Hoja 3 se renumeran como **1. Conversación y Matriz de variables** y **2. Síntesis del Gerente General**.
- El banco común de 20 consultas conserva el límite de tres elecciones y la distribución interna 60% información, 20% decisión del equipo y 20% consulta funcional.
- Se preservan la clave `hoshin_v31_internal`, las sesiones anteriores, demos, snapshots, reportes, evaluación, modo facilitador, máximo de 7 variables, 18 Story Points, impactos y fórmulas.

## v37 · Guía breve de roles dentro de la Hoja 2

- Se elimina el título **Paso previo a las consultas**.
- Se elimina el aviso sobre la entrega de tarjetas privadas por parte del facilitador.
- Cada rol incorpora una guía breve con responsabilidad central, resultado que tiende a custodiar, qué mira/cuidar y errores a evitar, y preguntas para la conversación.
- El Gerente General se presenta como integrador del sistema completo; los otros cuatro roles mantienen sus perspectivas funcionales.
- El bloque utiliza dos columnas en escritorio y una columna en pantallas pequeñas para preservar la legibilidad.
- Se conservan la asignación de participantes, la persistencia, las 20 consultas, el máximo de tres respuestas, la Matriz, los 18 Story Points y toda la lógica posterior.

## v38 · Cierre limpio del bloque de roles

- Se elimina el bloque redundante **Seleccionen las tres consultas que el equipo realizará al Directorio** ubicado al final de las fichas de roles.
- También se eliminan su texto explicativo, separador y estilos asociados.
- El bloque **Equipo y roles** termina inmediatamente después de las cinco fichas.
- La tarjeta siguiente, **Consultas a Dirección**, conserva toda la orientación necesaria para seleccionar las tres consultas.
- No se modifica ninguna lógica, dato ni componente interactivo.

## v39 · Claridad estratégica y Matriz ERIC

- La Hoja 3 se reorganiza en cuatro pasos: ordenar indicios con ERIC, seleccionar variables, asignar capacidad y revisar impactos, y construir la síntesis del equipo.
- Se incorporan 15 indicios factuales del caso, inicialmente sin clasificar, que pueden moverse y reordenarse entre Eliminar, Reducir, Incrementar y Crear.
- Cada tarjeta puede operarse mediante arrastre o con un selector accesible, y siempre ocupa una única ubicación.
- ERIC no tiene respuesta precargada, validación, puntaje, exigencia de completitud ni efecto sobre el dashboard.
- La lectura del problema y el movimiento estratégico se guardan automáticamente por equipo.
- El banco de variables, la Matriz de impactos y el dashboard se separan visualmente para distinguir interpretación, decisión, capacidad y resultado.
- La guía de indicadores queda cerrada por defecto y concentra en un solo lugar las explicaciones de contribución, signos, equilibrio, Story Points, interdependencia y Score.
- Se eliminan las preguntas generales repetidas, la leyenda duplicada de signos y el bloque independiente de principio pedagógico.
- La síntesis se reduce de nueve preguntas a cuatro campos: lectura del problema, hipótesis de resolución, lógica del portafolio y acuerdos y condiciones críticas.
- Se conservan la clave `hoshin_v31_internal`, las 20 consultas, el máximo de tres, el banco e impactos de variables, el límite de siete, los 18 Story Points, fórmulas, modo facilitador, demos, snapshots, evaluación, ranking y A3.
- La migración inicializa ERIC de forma segura en sesiones anteriores y conserva los campos históricos de síntesis aunque ya no se muestren.

## v40 · ERIC por arrastre

- Se elimina de todas las tarjetas ERIC el texto **Ubicar en**, la casilla desplegable y cualquier instrucción asociada al selector.
- La única forma visible de clasificación es arrastrar la tarjeta completa al cuadrante elegido.
- Las tarjetas pueden moverse entre Eliminar, Reducir, Incrementar, Crear e Indicios sin clasificar, y reordenarse dentro de una zona.
- Se incorpora soporte táctil para arrastrar en tablet y móvil, con una copia flotante de la tarjeta y realce visual del destino.
- Se agrega un indicador visual de agarre en cada tarjeta y se actualizan las instrucciones y estados vacíos para describir una única interacción.
- Se mantienen la persistencia por equipo, la ausencia de evaluación o resultado ERIC, y toda la lógica de variables, impactos, Story Points, Score, demos y Directorio.

## v41 · Ejemplos integrados y Score al Directorio

- Los tres ejemplos recorren la estructura actual completa: roles, tres consultas, ERIC, lectura del problema, variables, Ronda 1, feedback, replanteo, propuesta final, A3, evaluación y ranking.
- Cada ejemplo muestra un nivel diferente de madurez: mirada funcional, sistema en tensión y sistema alineado.
- Los ejemplos utilizan exclusivamente consultas existentes del banco y los cuatro campos actuales de síntesis.
- La Ronda 1 y la propuesta final quedan congeladas por separado para visualizar el efecto del Catchball.
- Se incorporan proyectos A3 consistentes con la calidad de razonamiento de cada mesa.
- El Score automático deja de mostrarse durante la construcción de la Hoja 3.
- El Score se revela en la esquina superior derecha del resumen de la Hoja 4 después de usar **Preparar presentación al Directorio**.
- El Índice de equilibrio se conserva dentro del detalle de indicadores de la Hoja 4.
- Se mantienen sin cambios la fórmula del Score, los impactos, Story Points, capacidad, variables, persistencia, evaluación humana y cálculo del ranking.

## v42 · Identidad Deportes Andina

- Se incorpora el logo aprobado de Deportes Andina, basado en el monograma **CA** y una silueta de montaña.
- En la Hoja 1, el logo reemplaza al marcador tipográfico temporal y aparece antes del nombre de la empresa.
- En la Hoja 4, el logo aparece en la esquina superior izquierda del reporte al Directorio.
- Se optimiza el recorte del recurso para conservar legibilidad en tamaños reducidos sin deformar la imagen original.
- Se mantiene la posición del Score automático en la esquina superior derecha del reporte.
- No se modifican contenido, fórmulas, variables, Story Points, ejemplos, persistencia, evaluación ni ranking.

## v43 · Logo Deportes Andina optimizado

- Se elimina completamente el fondo negro del logo incorporado en v42.
- La marca se reconstruye como SVG transparente para conservar nitidez y legibilidad en cualquier resolución.
- La Hoja 1 utiliza una variante con iniciales claras y montaña turquesa, diseñada para la portada azul petróleo.
- La Hoja 4 utiliza una variante con iniciales azul petróleo y montaña turquesa, diseñada para el reporte blanco.
- Se eliminan bordes, sombras y cajas visuales alrededor de la marca.
- Se conservan sin cambios el contenido y toda la lógica funcional del tablero.

## v44 · Score Final jerarquizado

- El indicador superior derecho de la Hoja 4 pasa a titularse **Score Final**.
- El valor, por ejemplo `92/100`, se presenta en una línea independiente debajo del título.
- La explicación del cálculo permanece debajo del valor con menor jerarquía tipográfica.
- Se conservan sin cambios la fórmula, el momento de revelación y la ubicación del indicador.

## v45 · Cumplimiento de objetivos destacado

- La Hoja 4 incorpora un bloque destacado de **Cumplimiento de los objetivos propuestos**.
- Ventas, Costos y Desempeño muestran en primer plano su porcentaje de cumplimiento.
- Cada tarjeta conserva la meta definida por Dirección y el resultado proyectado por el portafolio.
- Una barra de avance permite comparar rápidamente los tres objetivos.
- Story Points, Interdependencia e Índice de equilibrio permanecen como indicadores complementarios debajo del bloque.
- El Score Final conserva su ubicación superior derecha y su fórmula original.

## v46 · Indicadores complementarios legibles

- Se resaltan moderadamente los resultados numéricos de Story Points, Interdependencia e Índice de equilibrio en la Hoja 4.
- El cambio se limita al tamaño, peso y color de la línea de resultado.
- Los títulos y textos explicativos mantienen su jerarquía anterior.
- El tratamiento sigue siendo deliberadamente menor que el utilizado para el cumplimiento de objetivos y el Score Final.

### Base verificada

- Repositorio: `sebastianllach-design/Workshop-Hoshin-Kanri`
- Rama: `main`
- Commit verificado en `main`: `021a97d6fa5dd8632cea7c9b27f6e9b9b5cce5fa`
- Fecha de la entrega: 11 de septiembre de 2026.
