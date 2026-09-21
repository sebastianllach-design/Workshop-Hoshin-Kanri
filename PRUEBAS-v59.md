# Registro de pruebas · v59

Fecha: 2026-09-21

## Automatización ejecutable

```bash
node qa_v59.js
```

Resultado de la ejecución final: **OK · 58 controles**. Se confirmaron generación de reporte, tres transiciones de etapa simuladas, reapertura dirigida, fusión concurrente, resultados demo `94 / 67 / 28` y preservación del modelo v58.

También se sirvió el proyecto por HTTP local y se obtuvo respuesta correcta para `index.html`, `facilitator.html` y `cloud-sync.js`.

La suite verifica:

- versión en archivo, metadatos, título, interfaz y panel;
- presencia de todos los entregables;
- sintaxis de los tres módulos JavaScript;
- IDs HTML únicos;
- preservación exacta contra v58 de objetivos, escalas, banco de variables, impactos, Story Points, consultas, respuestas y fórmula del Score automático;
- seis estados de etapa y acción principal contextual;
- bloqueo de hoja anterior, actual vencida y futura;
- reapertura específica y prioridad de la pausa global;
- cierre de Hoja 2 y preparación/reintento de Hoja 3;
- regeneración de Hoja 3 después de cerrar una reapertura;
- Hoja 4 sin cronómetro de bloqueo;
- evaluación única 1–10, migración histórica y desempate;
- equipos pendientes, exclusión y publicación explícita;
- acceso automático, renombrado, PIN, copia y eliminación simple;
- fusión de cambios concurrentes por campo y presencia multidispositivo;
- equivalencia de dos formulaciones de una variable propia;
- límites de impactos y Story Points propios;
- reglas Firestore de propiedad y aislamiento;
- ausencia de contraseñas literales;
- resultados demo esperados `94 / 67 / 28`;
- borrado de 805 referencias en lotes `400 / 400 / 5`.

## Matriz funcional cubierta por lógica automatizada

| Área | Escenarios verificados |
| --- | --- |
| Etapas | habilitada, iniciada, finalizada, hoja anterior, hoja futura, reapertura y pausa |
| Hoja 2 | máximo de tres, acciones protegidas y mensaje de consulta al vencer |
| Hoja 3 | campos protegidos, snapshot, estado de reporte, reintento y barrera antes de Hoja 4 |
| Hoja 4 | etapa no temporizada y cronómetro oral independiente |
| Evaluación | nota decimal válida, límites 1–10, edición y migración de cuatro notas antiguas |
| Ranking | pendientes visibles, exclusión explícita, desempate, payload público mínimo |
| Equipos | código/PIN aleatorios, enlace precompletado, renombrado y regeneración |
| Concurrencia | cambio local + cambio remoto en campos distintos sin sobrescritura completa |
| Variables propias | análisis previo, parámetros persistentes, límites y equivalencia semántica probada |

## Verificaciones estáticas responsive

- Reglas específicas para 1120, 900, 720 y 620 px.
- `max-width:100%` y `overflow-x:hidden` a nivel de página.
- Las tablas extensas mantienen desplazamiento dentro de su contenedor.
- La matriz estratégica de Hoja 1 no muestra el aviso pequeño de desplazamiento.

## Pruebas diferidas hasta el despliegue controlado

No se escribieron datos reales ni se publicaron reglas, porque la entrega prohíbe publicar en Firebase, GitHub o Render. El entorno de construcción tampoco incluye un ejecutable Chromium. Por eso quedan para la prueba de aceptación posterior a la aprobación:

- login real del facilitador;
- acceso anónimo y validación del PIN contra Firebase;
- propagación entre dos dispositivos físicos;
- vencimiento real esperando el reloj;
- consola del navegador con Firebase productivo;
- inspección visual en navegadores de escritorio, tablet y móvil;
- publicación y recepción real del ranking.

La suite informa esta limitación como `browser.status: diferido`; no la oculta como prueba aprobada.

## Guion de aceptación breve

1. Publicar primero `firestore.rules` v59 en el proyecto de ensayo.
2. Crear una experiencia temporal y dos equipos.
3. Abrir Hoja 2 por un minuto; hacer menos de tres consultas y esperar el vencimiento.
4. Confirmar bloqueo, reabrir un equipo, editar y volver a cerrar.
5. Completar Hoja 3, probar cierre natural y manual en equipos distintos, y confirmar presentación preparada.
6. Habilitar Hoja 4 y usar el cronómetro oral sin afectar datos.
7. Probar notas vacía, 0, 11, 7 y 7,5; editar una válida.
8. Marcar o evaluar todos los pendientes, publicar y observar actualización sin recarga.
9. Ingresar al mismo equipo desde otro dispositivo y comprobar el aviso y la conservación de cambios en campos diferentes.
10. Recargar, cambiar entre equipos, revisar consola y probar 1440 px, 768 px y 390 px.
11. Eliminar la experiencia temporal solamente con autorización expresa.
