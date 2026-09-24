# Lya · CFDI Automation — Portfolio Demo

**De XML sintéticos a cédulas de trabajo y reportes Excel.**

Demostración local de una herramienta construida a partir de necesidades de operación contable: organizar comprobantes emitidos y recibidos, aplicar reglas de presentación y preparar cédulas. Esta edición usa exclusivamente perfiles demo y muestras inventadas; no representa a clientes concretos.

## Problema y solución

La preparación manual de cédulas combina clasificación de comprobantes, filtros de periodo, desglose de impuestos y consolidación de datos. Lya reúne esas operaciones en un flujo revisable: cargar XML/ZIP → seleccionar configuración → revisar tablas → exportar Excel. No se atribuyen porcentajes de ahorro ni resultados de negocio sin mediciones.

## Funcionalidades actuales

- XML individuales y ZIP separados en emitidas y recibidas.
- Periodos automático, mensual, trimestral y anual; detección de duplicados.
- 18 perfiles demo y selección personalizada de columnas.
- Procesamiento de IVA, exentos, IEPS y retenciones según los datos y reglas implementadas.
- Variantes generales y de hotelería; tablas en navegador y exportación Excel.
- Variante separada en Google Apps Script para Sheets (`auto.js`), con configuración de Drive vacía mediante marcadores. No se ejecuta como parte del servidor web.

Los perfiles son configuraciones de presentación; varios comparten reglas. No equivalen a 18 algoritmos ni acreditan 18 clientes. Las pruebas incluidas no cubren todos los supuestos fiscales.

## Arquitectura

```text
Navegador: HTML / CSS / JavaScript
                |
       Express: procesar / exportar
                |
        XML / ZIP → cfdiProcessor
                         |
              hotelProfile (cuando aplica)
                         |
                   clientProfiles
                         |
               excelReport / hotelReport
                         |
                    Archivo Excel
```

El motor de cálculo y las reglas son código determinístico. No hay agentes de IA, integración bancaria ni escritura automática en CONTPAQi en esta demo.

## Tecnologías

JavaScript, Node.js, Express, fast-xml-parser, JSZip, ExcelJS, HTML y CSS. Google Apps Script/Sheets en la variante independiente. El código actual no utiliza Python ni frameworks de agentes.

## Ejecución local

Requiere Node.js 22 o posterior y npm. Desde la carpeta de esta edición:

```sh
npm ci --ignore-scripts
npm run demo
npm test
npm start
```

Abre **http://127.0.0.1:3000**. El servidor de esta copia escucha únicamente en loopback. No es un despliegue público ni una aplicación con autenticación y aislamiento de usuarios.

## Demostración reproducible

1. Elige **Perfil demo 08** y periodo **Automático**.
2. Carga `examples/emitidas/E001.xml` en Emitidas.
3. Carga `examples/recibidas/R001.xml` y `R002.xml` en Recibidas.
4. Procesa, revisa y exporta a Excel.

| Resultado sintético | Importe MXN |
| --- | ---: |
| Base emitida | 1,000.00 |
| IVA emitida | 160.00 |
| Total emitida | 1,160.00 |
| Base recibidas | 700.00 |
| IVA 8% recibidas | 16.00 |
| IVA 16% recibidas | 80.00 |
| Total recibidas | 796.00 |

Los XML se regeneran con `npm run demo`, no tienen sellos/certificados ni validez fiscal. No se incluyen capturas heredadas; las tablas se pueden reproducir con estas muestras.

## Estructura

```text
public/                 Interfaz web
src/                    Procesamiento, perfiles y reportes
scripts/create-demo.js  Generador de XML sintéticos
scripts/test-demo.js    Prueba HTTP y lectura de Excel
examples/               Solo muestras generadas
docs/VALIDATION.md      Evidencia y límites de validación
server.js               Servidor local
auto.js                 Variante de Apps Script
package*.json           Dependencias y comandos
```

## Privacidad y alcance

No incorpores archivos de clientes a esta edición. `.gitignore` excluye credenciales, respaldos privados, reportes y archivos fiscales, salvo los XML sintéticos enumerados en examples. Es una ayuda preventiva, no un sustituto de revisión antes de publicar.

Esta demo no verifica vigencia de CFDI contra el SAT ni valida sellos o certificados. Los resultados y estados proceden de la lógica local; requieren revisión humana. No debe utilizarse como servicio público de carga de documentos privados. [Pruebas y límites](docs/VALIDATION.md).

## Roadmap: Lya 2.0

**Diseño y desarrollo inicial, no capacidades terminadas.** Primer MVP previsto: propuestas de conciliación entre movimientos bancarios sintéticos y CFDI, con evidencia y revisión humana.

1. Reforzar importación, esquema de datos, SQL y pruebas de conciliación determinística.
2. Medir propuestas contra un conjunto de referencia separado del desarrollo.
3. Experimentar con una API de modelos y herramientas de lectura; registrar evidencia y decisiones.
4. Evaluar Agents SDK y agentes especializados solo si aportan mejoras verificables.
5. Considerar integraciones bancarias y contables en una etapa posterior.

Los cálculos fiscales críticos permanecerán en código determinístico verificable. No se presenta OpenAI API/Agents SDK como tecnología ya implementada.
