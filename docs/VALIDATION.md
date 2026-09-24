# Validación de la copia demo

Revisión local: 24 de septiembre de 2026. No se ha creado ni publicado un repositorio para esta edición.

## Pruebas ejecutadas

`node scripts/test-demo.js`: PASS. Servidor HTTP temporal, carga XML y ZIP, duplicados, importes esperados, cuatro periodos, 18 perfiles, columnas personalizadas y apertura de los Excel generados con ExcelJS.

Comparación diferencial independiente: PASS, 144 casos (18 configuraciones × 4 periodos × modo normal/personalizado). Con las mismas muestras sintéticas, las tablas, totales y demás resultados coinciden con la implementación de referencia al excluir únicamente los identificadores/nombres de configuración renombrados.

Los archivos `cfdiProcessor.js`, `excelReport.js`, `hotelProfile.js` y `hotelReport.js` son idénticos byte a byte a la implementación de referencia. Los 18 identificadores del selector coinciden con el catálogo demo.

## Entorno

Node.js local; dependencias ya instaladas en un entorno de verificación separado mediante NODE_PATH. No se copiaron dependencias ni archivos de ese entorno al paquete público y no se ejecutaron scripts de instalación. El lockfile mantiene las mismas versiones de dependencias. Esta ejecución no demuestra todavía una instalación nueva con `npm ci` de esta edición.

## Límites

Las pruebas usan tres XML sintéticos; no certifican exactitud fiscal universal, todos los casos de IEPS/retenciones/complementos, rendimiento, seguridad de producción o compatibilidad visual de Excel. Google Apps Script no se ejecutó contra Drive. No se realizó consulta al SAT. No se incorporaron capturas antiguas ni datos reales a la copia. Esta ronda no incluye una nueva prueba visual del navegador.

El servidor escucha solo en 127.0.0.1; la edición es para demostración local. No es un servicio de carga pública autenticado. Lya 2.0 permanece como roadmap.
