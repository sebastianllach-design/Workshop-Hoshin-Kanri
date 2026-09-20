# Arquitectura multiequipo · Conversaciones que Transforman v55

La arquitectura de acceso, seguridad, memoria y temporizador es la misma de v54. La v55 modifica únicamente el modelo de evaluación humana y su presentación.

## Evaluación v55

El documento privado de cada equipo guarda:

```json
{
  "evaluation": {
    "score": 8.5,
    "comment": "Síntesis opcional del diálogo del Panel",
    "completed": true
  }
}
```

- `score`: una nota final entre 1 y 10, con hasta un decimal.
- `comment`: síntesis opcional del diálogo.
- `completed`: habilita el cálculo final solamente cuando la evaluación fue cerrada.

Los cuatro criterios son contenido de apoyo en la interfaz y no crean cuatro puntajes separados.

## Fórmula

```text
panelScore100 = score × 10
total = redondear(scoreAutomático × 0,5 + panelScore100 × 0,5)
```

El total continúa expresado sobre 100.

## Compatibilidad con v54

Si el equipo todavía contiene `means`, `interdep`, `catchball` y `defense`, el lector calcula:

```text
score = (means + interdep + catchball + defense) / 2
```

Esto conserva exactamente la ponderación anterior. Al editar o finalizar la evaluación, se guarda el formato nuevo.

El ranking público escribe `panelScore` y mantiene `defenseScore = panelScore × 10` para que una publicación nueva siga siendo legible por clientes anteriores. Los clientes v55 también pueden mostrar rankings publicados antes de la actualización.

## Elementos sin cambios

- `users/{facilitatorUid}` y rol `facilitator`.
- `workshops/{sessionCode}` y sus subcolecciones.
- Authentication por correo/contraseña para facilitador.
- Authentication anónima para equipos.
- Reglas e índices de Firestore.
- PIN con prueba criptográfica, aislamiento por equipo y respaldo local.
- Temporizador, bloqueo de edición y publicación manual del podio.
