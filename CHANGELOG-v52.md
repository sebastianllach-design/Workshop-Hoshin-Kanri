# Registro de cambios · v52

## Evaluación final y podio

- Se unificaron evaluación y ranking en una única tabla ordenada por resultado total.
- Se agregó la columna **Puesto**.
- Se incorporó una jerarquía visual gradual para 1.º, 2.º y 3.º.
- Se agregó una cabecera que identifica al equipo ganador y resume sus principales indicadores.
- Se incorporó el botón **Cargar los 3 ejemplos** dentro de la Hoja 6.
- Los ejemplos se agregan sin eliminar equipos reales existentes; solo se descarta la mesa inicial si continúa completamente intacta.
- Se explicita la fórmula vigente: 60% Score automático y 40% evaluación humana.
- Se agregó un criterio estable de desempate visual sin alterar el resultado total.

## Elementos preservados

- Fórmula del Score automático.
- Fórmula del resultado total.
- Evaluaciones humanas de 0 a 5.
- Persistencia y compatibilidad con sesiones anteriores.
- Máximo de siete variables y capacidad de 18 Story Points.
- Informe, consultas, Matriz, presentación al Directorio, cierre oral y A3.

## Validación

Ejecutar desde la carpeta del proyecto:

```bash
node qa_v52.js
```
