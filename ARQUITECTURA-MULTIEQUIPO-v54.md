# Arquitectura multiequipo · Conversaciones que Transforman v54

## Extensiones v54

- El documento `workshops/{sessionId}` incorpora `timer` con `stageLabel`, `durationSec`, `remainingSec`, `status`, `startedAt` y `endAt`.
- El facilitador es el único que escribe el temporizador; los equipos leen el documento de sesión y calculan la cuenta regresiva desde `endAt`.
- El estado `ended` es informativo: no bloquea formularios ni envía automáticamente la propuesta.
- `evaluation.completed` distingue una evaluación cerrada de los valores todavía parciales.
- El resultado final se calcula como `auto * 0.5 + defenseScore * 0.5`.
- El ranking público contiene únicamente equipos reales con presentación y evaluación finalizadas.
- Los ejemplos son referencias locales del panel y no se publican como ganador de una sesión real.

## Decisión de diseño

La plataforma conserva Render como alojamiento del tablero y utiliza Firebase Spark para compartir la información entre computadoras. La solución evita Cloud Functions y servicios pagos durante la prueba.

## Modos de uso

### Equipo participante

- Ingresa con código de experiencia, código de equipo y PIN.
- No necesita correo ni cuenta personal.
- Solo puede leer y modificar su propio equipo.
- Conserva una copia local ante interrupciones de conectividad.
- No ve avances de otras mesas.
- No ve la evaluación ni el ranking hasta su publicación.

### Facilitador

- Ingresa con correo y contraseña.
- Crea experiencias y equipos.
- Observa avance, hoja actual, consultas, variables, Story Points y preparación de la presentación.
- Puede pausar la edición de un equipo.
- Completa la evaluación humana.
- Publica u oculta el podio para todos simultáneamente.
- Exporta un respaldo JSON.

### Demostración

- Se abre desde `index.html?demo=1`.
- Mantiene los tres ejemplos: Mirada funcional, Sistema en tensión y Sistema alineado.
- Trabaja localmente y no contamina experiencias reales.

## Flujo de acceso

1. El facilitador crea una experiencia.
2. Crea un equipo y define un PIN.
3. El sistema guarda solamente una prueba criptográfica del PIN.
4. La computadora del equipo inicia una sesión anónima en Firebase.
5. Las reglas validan código y PIN contra el registro privado.
6. Se crea una membresía vinculada a esa computadora.
7. La membresía permite leer y modificar únicamente el documento del equipo.

## Modelo de datos

```text
users/{facilitatorUid}
workshops/{sessionCode}
workshops/{sessionCode}/teams/{teamCode}
workshops/{sessionCode}/teamSecrets/{teamCode}
workshops/{sessionCode}/members/{anonymousUid}
workshops/{sessionCode}/public/ranking
```

### Documento de experiencia

- Nombre y código.
- Estado: borrador, abierta, pausada o cerrada.
- UID del facilitador.
- Estado de publicación del ranking.

### Documento de equipo

- Estado completo del tablero.
- Progreso resumido.
- Métricas automáticas.
- Evaluación humana protegida.
- Última actividad.
- Estado de bloqueo.

### Ranking público

Contiene solamente la tabla final sanitizada. No entrega respuestas, hipótesis ni decisiones privadas de otros equipos.

## Estrategia de memoria

### Memoria central

Firestore conserva la versión compartida y habilita el seguimiento en tiempo real.

### Respaldo local

`localStorage` mantiene una copia independiente por experiencia y equipo. El guardado remoto se ejecuta aproximadamente 1,6 segundos después del último cambio para evitar una escritura por tecla.

### Recuperación

- Al recargar, se intenta recuperar primero la identidad anónima y el equipo vinculado.
- Si la sesión sigue vigente, el ingreso se restablece automáticamente.
- Si no hay conexión, se conserva el estado local y se reintenta el envío.

## Criterios de seguridad

- El PIN nunca se guarda como texto visible en Firestore.
- La colección de secretos solo puede ser leída por un facilitador.
- Los participantes no pueden consultar la colección completa de equipos.
- La evaluación humana no forma parte de los campos modificables por un equipo.
- El ranking solo puede ser escrito por un facilitador.
- El rol del facilitador debe crearse manualmente en Firestore.

Esta seguridad es adecuada para una experiencia de capacitación. No pretende resolver amenazas propias de una plataforma financiera o de información sensible.

## Consumo estimado para una prueba

Con 10 equipos, 400 guardados relevantes por equipo y un panel conectado durante el encuentro:

- Aproximadamente 4.000 escrituras de avance.
- Lecturas asociadas a actualizaciones y recargas muy por debajo de 50.000 diarias.
- Un volumen de almacenamiento pequeño porque cada equipo conserva principalmente texto y selecciones.

El cálculo presupone guardado con demora controlada y no una escritura por cada tecla.

## Evolución futura

La lógica remota está separada en `cloud-sync.js` y `facilitator.js`. La dinámica, las fórmulas y el contenido siguen en `index.html`. Esto permite migrar a Supabase, Cloudflare o un backend propio sin rediseñar nuevamente todas las hojas.
