
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
