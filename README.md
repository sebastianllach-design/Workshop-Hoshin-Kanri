# Conversaciones que Transforman · Hoshin Workshop

**Versión actual: v37 · Guía breve de roles**

Base verificada: último `main` disponible al iniciar el cambio, commit `eb28dec` del 8 de septiembre de 2026.

Al abrir el tablero publicado, la marca **Versión v37 · Guía breve de roles** debe verse en la portada principal y **Hoshin Workshop · v37** en el índice lateral.

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
- La Hoja 1 se presenta como el **Informe Directivo para la Planificación 2027** de Comercial Andina.
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

### Base verificada

- Repositorio: `sebastianllach-design/Workshop-Hoshin-Kanri`
- Rama: `main`
- Commit utilizado como base: `eb28dec0760219f78d12fd1820eac28acd9b7b2f`
- Fecha de la entrega: 9 de septiembre de 2026.
