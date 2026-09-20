# Cambios y pruebas · v53

## Accesos

- Nueva portada de ingreso para equipos.
- Identificación mediante experiencia, equipo y PIN.
- Identidad anónima persistente por navegador.
- Acceso privado independiente para el facilitador.
- Modo demostración separado de las sesiones reales.

## Memoria y sincronización

- Firestore incorporado como memoria central.
- Respaldo local diferenciado por experiencia y equipo.
- Guardado automático con `debounce` de 1,6 segundos.
- Reintento después de una interrupción de red.
- Indicador visible de estado: guardando, guardado, sin conexión o edición pausada.
- Última actividad y hoja actual disponibles para el facilitador.

## Panel del facilitador

- Alta de experiencias.
- Alta de equipos con códigos y PIN.
- Enlaces de acceso listos para compartir.
- Monitoreo en tiempo real.
- Apertura, pausa y cierre de la experiencia.
- Pausa y reapertura de edición por equipo.
- Cambio de PIN.
- Evaluación humana de cuatro criterios.
- Tabla ordenada y podio.
- Publicación y ocultamiento del ranking.
- Exportación JSON.

## Seguridad

- Reglas Firestore incluidas.
- Los equipos solo pueden leer y modificar su documento.
- Los secretos de acceso son exclusivos del facilitador.
- La evaluación humana no puede ser modificada por participantes.
- El ranking público solo expone resultados finales.

## Elementos preservados

- Tres ejemplos completos.
- Banco de consultas y límite de tres.
- Banco de variables y sus impactos.
- Máximo de siete variables.
- Capacidad total de 18 Story Points.
- Fórmulas de avance, equilibrio y Score automático.
- Presentación al Directorio, A3, evaluación 60/40 y podio.
- Cierre oral de Directorio y Catchball.

## Validaciones previstas

- Consistencia de versión en HTML, metadatos y archivos.
- Sintaxis JavaScript de los tres módulos.
- Presencia de reglas de aislamiento.
- Preservación de la fórmula 60/40.
- Resultados de los ejemplos: 93, 67 y 29.
- Ausencia de identificadores HTML duplicados.
- Integridad de archivos requeridos para Render y Firebase.

