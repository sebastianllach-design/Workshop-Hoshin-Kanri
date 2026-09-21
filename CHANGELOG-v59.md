# Registro de cambios · v59

Fecha: 2026-09-21

## Base verificada

- Última entrega local encontrada: v58.
- Versión publicada en Render verificada antes de modificar: v58.
- Base utilizada: proyecto completo v58. No se recuperaron archivos funcionales desde versiones anteriores.

## Control de etapas y cronómetros

- Modelo de seis estados visible en el panel: no habilitada, habilitada sin iniciar, en curso, tiempo finalizado, cerrada y reabierta excepcionalmente.
- Una única acción principal cambia según el estado.
- El vencimiento bloquea y conserva datos sin avanzar de hoja.
- La Hoja 4 y Resultados no tienen cronómetro de bloqueo.
- Se incorporó un cronómetro de exposición independiente.

## Navegación y reapertura

- La vista privada del facilitador se separó de la hoja habilitada a participantes.
- El panel muestra permanentemente la etapa activa.
- Se agregaron vistas privadas de las Hojas 1 a 4 que no cambian el recorrido.
- El facilitador puede reabrir una hoja para un equipo o para todos, cerrarla nuevamente y asignar tiempo extra sin reiniciar el reloj general.
- Al cerrar una reapertura de Hoja 3 se invalida la presentación anterior y se genera un snapshot actualizado antes de continuar.

## Hojas 2, 3 y 4

- Hoja 2 bloquea nombre, roles y consultas al finalizar; conserva respuestas y el máximo de tres.
- Hoja 3 bloquea diagnóstico, variables, Story Points, síntesis y A3 al finalizar.
- El cierre de Hoja 3 toma un snapshot, calcula indicadores, prepara la presentación, confirma el guardado y permite reintentar ante error.
- Hoja 4 solo puede habilitarse cuando todas las presentaciones incluidas están preparadas.
- Se incorporó una Lectura compartida de cuatro caminos causales y 16 dimensiones, sin impacto en el Score.
- Se incorporó un puente visible entre diagnóstico y variables y hasta tres problemas para investigar mediante A3.

## Evaluación, ranking y orden de presentación

- Los cuatro criterios quedan como guía oral; se registra una sola nota de 1 a 10.
- La interfaz confirma el guardado y permite editar la nota.
- Equipos pendientes siguen visibles y pueden excluirse explícitamente del ranking.
- La publicación es una acción confirmada e independiente del cronómetro.
- El ranking público contiene solo posición, equipo, Score automático, nota del Directorio y resultado final.
- Se agregó sorteo persistente del orden, repetible solo antes de la primera evaluación.

## Acceso, equipos y experiencias

- Portada simplificada: ingreso principal del equipo y acceso secundario del facilitador.
- Código de equipo no secuencial y PIN de seis dígitos generados automáticamente.
- Renombrado, regeneración de PIN y copia del mensaje completo de acceso.
- Eliminación de experiencias con una confirmación, sin volver a escribir el código.
- Como no hay papelera, el diálogo declara que el borrado es irreversible.

## Sincronización y seguridad

- Guardado transaccional con fusión recursiva de campos modificados.
- Revisión de estado por número de versión y presencia por dispositivo.
- Estados visibles de guardado y aviso de otra sesión activa.
- Reglas Firestore limitan experiencias y subcolecciones al facilitador propietario; cada participante solo lee y modifica su equipo.
- Ninguna contraseña real fue agregada al proyecto.

## Variables propias

- Nombre y descripción obligatorios.
- Vista previa de significado, área, dificultad, interdependencia, impactos y Story Points.
- Parámetros determinísticos, acotados a los rangos vigentes y guardados al confirmar.
- No existe bono por variable propia ni recomendación de una combinación correcta.

## Limpieza visual

- Se retiraron de la portada pública el acceso a ejemplos y mensajes de desarrollo.
- La versión queda visible de forma discreta.
- Se quitó la impresión del recorrido participante y se conservaron herramientas privadas.
- Se mantuvo la eliminación visible de la Matriz ERIC.

## Sin cambios

No se modificaron objetivos, impactos existentes, límite de siete variables, capacidad de 18 Story Points, fórmulas, ponderación 50/50, consultas, respuestas, estado demo, migraciones ni diseño responsive.
