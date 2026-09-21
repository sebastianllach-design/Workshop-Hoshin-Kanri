# Conversaciones que Transforman · Comercial Andina

Versión 59 — control seguro de etapas, reaperturas y publicación.

Aplicación web estática para conducir una experiencia multiequipo de Hoshin Kanri. Render sirve los archivos y Firebase aporta autenticación, persistencia y sincronización en tiempo real.

## Inicio rápido local

Desde esta carpeta:

```bash
python3 -m http.server 8000
```

Abrir:

- Participantes: `http://localhost:8000/`
- Facilitador: `http://localhost:8000/facilitator.html`
- Demo privada: `http://localhost:8000/?demo=1`

El acceso real necesita la configuración de `firebase-config.js`, Authentication activa y las reglas de `firestore.rules` publicadas. La guía completa está en `SETUP-FIREBASE.md`.

## Recorrido

1. Hoja 1 — Informe Directivo.
2. Hoja 2 — Equipo, roles y hasta tres consultas a Dirección.
3. Hoja 3 — Lectura compartida, variables, Story Points, síntesis estratégica y A3.
4. Hoja 4 — Presentación al Directorio.
5. Hoja 5 — Resultados publicados.

## Control de etapas

Cada hoja puede estar no habilitada, habilitada sin iniciar, en curso, con tiempo finalizado, cerrada o reabierta excepcionalmente. El facilitador controla el avance; consultar otra hoja desde el panel no cambia la etapa de los participantes.

- Solo la etapa en curso es editable.
- Las hojas anteriores quedan disponibles en modo lectura.
- Las futuras permanecen bloqueadas.
- El vencimiento bloquea y guarda, pero no avanza automáticamente.
- La Hoja 3 genera y confirma la presentación antes de que pueda habilitarse la Hoja 4.
- La Hoja 4 no depende de un cronómetro. El panel ofrece un cronómetro oral independiente.
- Una reapertura puede dirigirse a un equipo o a todos y no reinicia el cronómetro general.

## Evaluación y ranking

El Directorio conversa cuatro componentes y registra una sola nota consensuada de 1 a 10. La fórmula vigente se conserva:

```text
Resultado final = 50% Score automático + 50% nota del Directorio
```

Evaluar, calcular posiciones y publicar son acciones separadas. El ranking no se publica hasta que todos los equipos incluidos tengan presentación y evaluación. Un equipo puede marcarse como `No participa del ranking`.

## Datos y sincronización

- Firestore es la memoria central; `localStorage` mantiene un respaldo y compatibilidad con sesiones anteriores.
- Los cambios concurrentes se fusionan por campo para no reemplazar todo el estado con una copia antigua.
- La interfaz informa `Guardando…`, `Guardado`, `Sin conexión` o `Error al guardar`.
- Si el mismo equipo tiene otra sesión reciente, aparece una advertencia sin bloquear el segundo dispositivo.
- El enlace compartido incluye experiencia y equipo; el participante solo escribe el PIN.

## Parámetros preservados

- Objetivos: Ventas `+15%`, Costos `-10%` y Desempeño `+10%`.
- Máximo de siete variables.
- Capacidad base de 18 Story Points.
- Impactos de las variables existentes.
- Score automático, interdependencia, índice de equilibrio y cumplimiento de objetivos.
- Banco de consultas y respuestas del Directorio.
- Persistencia, migraciones, ejemplos y diseño responsive.

La valoración diagnóstica de 1 a 5 no modifica el Score Final y las variables propias no reciben bonos.

## Archivos principales

- `index.html`: recorrido participante y modo demo.
- `facilitator.html` / `facilitator.js`: conducción privada.
- `cloud-sync.js`: acceso, persistencia, concurrencia, bloqueos y ranking publicado.
- `firestore.rules`: aislamiento por propietario y equipo.
- `SETUP-FIREBASE.md`: preparación de Firebase.
- `GUIA-FACILITADOR-v59.md`: operación del encuentro.
- `CHANGELOG-v59.md`: cambios de la versión.
- `PRUEBAS-v59.md`: alcance y resultado de pruebas.
- `ARCHIVOS-MODIFICADOS-v59.md`: inventario de entrega.
- `VERSION.txt`: versión canónica.

## Verificación

```bash
node qa_v59.js
```

Esta entrega no publica ni modifica GitHub, Render o datos reales de Firebase.
