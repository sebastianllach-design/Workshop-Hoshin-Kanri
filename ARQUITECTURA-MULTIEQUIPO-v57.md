# Arquitectura multiequipo · Conversaciones que Transforman v57

La v57 conserva la arquitectura de v56 y simplifica la confirmación de la operación administrativa de eliminación completa.

## Alcance de la eliminación

Firestore no elimina automáticamente las subcolecciones cuando se borra un documento padre. Por eso el panel consulta explícitamente las subcolecciones conocidas de la experiencia:

```text
workshops/{sessionId}/teams
workshops/{sessionId}/teamSecrets
workshops/{sessionId}/members
workshops/{sessionId}/public
```

Después elimina `workshops/{sessionId}`.

## Controles de seguridad

- La función solo existe en el panel autenticado del facilitador.
- Verifica que `facilitatorUid` coincida con el usuario conectado.
- Solicita una única confirmación que identifica la experiencia y advierte que el borrado es definitivo.
- Impide iniciar dos eliminaciones simultáneas.
- Cierra la experiencia antes de consultar sus datos, evitando nuevas membresías y guardados de participantes.
- Fuerza la lectura desde el servidor para no basar una eliminación en una caché incompleta.
- Utiliza lotes de 400 operaciones, por debajo del máximo de 500 de Firestore.
- El documento principal es la última referencia de la secuencia, de modo que un fallo intermedio permite volver a intentar.

## Reglas

No se requieren cambios en `firestore.rules`: la versión anterior ya permite al facilitador leer y eliminar las colecciones involucradas. La interfaz limita la operación a las experiencias creadas por la cuenta conectada.
