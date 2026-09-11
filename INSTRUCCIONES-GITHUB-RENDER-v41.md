# Entrega v41 · GitHub y Render

## Contenido

- `Workshop-Hoshin-Kanri-v41-GitHub-Render/`: carpeta completa lista para publicar.
- `Conversaciones-que-Transforman-v41-Entrega-Completa.zip`: paquete integral de respaldo.
- `Workshop-Hoshin-Kanri-v41-GitHub-Render.zip`: paquete limpio para GitHub/Render.

## Publicación

1. Descomprimir `Workshop-Hoshin-Kanri-v41-GitHub-Render.zip`.
2. Reemplazar en el repositorio los archivos correspondientes por los incluidos en la carpeta.
3. Confirmar y subir los cambios a la rama utilizada por Render.
4. Esperar la finalización del despliegue y recargar el sitio sin caché.

## Verificación visible

Al abrir el tablero deben verse estas dos referencias:

- En la portada: **Versión v41 · Ejemplos integrados y Score al Directorio**.
- En el índice lateral: **Hoshin Workshop · v41**.

## Comprobación funcional

Desde la carpeta del proyecto ejecutar:

```bash
node qa_v41.js
```

Resultado esperado: **56 validaciones superadas**.

Para verificar el cambio principal en la interfaz:

1. Cargar uno de los tres ejemplos.
2. Recorrer la Hoja 3 y confirmar que `Lectura del portafolio` no muestra el Score automático.
3. Presionar **Preparar presentación al Directorio**.
4. Abrir la Hoja 4 y confirmar que el Score aparece en la esquina superior derecha del resumen.
5. Continuar con feedback, replanteo, propuesta final, A3, evaluación y ranking.
