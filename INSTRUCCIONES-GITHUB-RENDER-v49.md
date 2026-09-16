# Publicación de la v49

## Archivos del paquete

- `index.html`: aplicación completa.
- `README.md`: historial y alcance.
- `VERSION.txt`: identificación de la versión.
- `qa_v49.js`: validaciones automáticas.
- `CAMBIOS-Y-PRUEBAS-v49.md`: resumen funcional y técnico.
- Recursos gráficos y favicon.

## Reemplazo en GitHub

1. Descomprimir el ZIP.
2. Abrir el repositorio utilizado por Render.
3. Reemplazar en la raíz los archivos de la versión anterior por todos los archivos del paquete.
4. Confirmar que `index.html` permanezca en la raíz del repositorio.
5. Ejecutar, si se dispone de Node.js, `node qa_v49.js`.
6. Confirmar los cambios mediante commit y push.

No es necesario localizar ni modificar líneas individuales: el paquete contiene los archivos completos.

## Actualización en Render

Si Render está conectado al repositorio, el nuevo push debería iniciar el despliegue automáticamente.

- Build command: vacío.
- Publish directory: la carpeta raíz que contiene `index.html`.

Si el despliegue automático está deshabilitado, utilizar **Manual Deploy → Deploy latest commit**.

## Verificación posterior

1. Abrir la URL productiva.
2. Confirmar que la portada indique **Versión v49 · Lecturas y síntesis ejecutiva**.
3. Confirmar que el índice muestre **Hoshin Workshop · v49**.
4. En Hoja 3, comprobar que las etiquetas verdes aparezcan debajo de la evidencia.
5. Seleccionar variables y asignar Story Points para visualizar **Lecturas para preparar la síntesis**.
6. Preparar la presentación al Directorio.
7. En Hoja 4, comprobar que la síntesis aparezca debajo de roles y antes de objetivos y Matriz.
8. Recargar la página y verificar la persistencia.

