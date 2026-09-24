const fs = require('node:fs');
const path = require('node:path');

// Datos inventados para demostrar el procesamiento. No son comprobantes fiscales válidos.
const cases = [
  ['emitidas', 'E001', 1000, 0.16, '2026-01-15', 'Empresa Demostración', 'Cliente Ejemplo'],
  ['recibidas', 'R001', 500, 0.16, '2026-01-16', 'Proveedor Ejemplo', 'Empresa Demostración'],
  ['recibidas', 'R002', 200, 0.08, '2026-01-17', 'Proveedor Frontera Demo', 'Empresa Demostración']
];
for (const [type, folio, base, rate, date, issuer, receiver] of cases) {
  const tax = (base * rate).toFixed(2);
  const issuerRfc = type === 'emitidas' ? 'XAXX010101000' : 'XEXX010101000';
  const receiverRfc = type === 'emitidas' ? 'XEXX010101000' : 'XAXX010101000';
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<!-- DEMOSTRACIÓN: datos ficticios, sin sello ni certificado; sin validez fiscal. -->
<cfdi:Comprobante xmlns:cfdi="http://www.sat.gob.mx/cfd/4" Version="4.0" Serie="DEMO" Folio="${folio}" Fecha="${date}T12:00:00" SubTotal="${base.toFixed(2)}" Moneda="MXN" Total="${(base + Number(tax)).toFixed(2)}" TipoDeComprobante="I" MetodoPago="PUE" FormaPago="03" LugarExpedicion="00000">
  <cfdi:Emisor Rfc="${issuerRfc}" Nombre="${issuer}" RegimenFiscal="601"/>
  <cfdi:Receptor Rfc="${receiverRfc}" Nombre="${receiver}" DomicilioFiscalReceptor="00000" RegimenFiscalReceptor="616" UsoCFDI="S01"/>
  <cfdi:Conceptos><cfdi:Concepto ClaveProdServ="01010101" Cantidad="1" ClaveUnidad="ACT" Descripcion="Servicio ficticio de demostración" ValorUnitario="${base.toFixed(2)}" Importe="${base.toFixed(2)}" ObjetoImp="02">
    <cfdi:Impuestos><cfdi:Traslados><cfdi:Traslado Base="${base.toFixed(2)}" Impuesto="002" TipoFactor="Tasa" TasaOCuota="${rate.toFixed(6)}" Importe="${tax}"/></cfdi:Traslados></cfdi:Impuestos>
  </cfdi:Concepto></cfdi:Conceptos>
  <cfdi:Impuestos TotalImpuestosTrasladados="${tax}"><cfdi:Traslados><cfdi:Traslado Base="${base.toFixed(2)}" Impuesto="002" TipoFactor="Tasa" TasaOCuota="${rate.toFixed(6)}" Importe="${tax}"/></cfdi:Traslados></cfdi:Impuestos>
</cfdi:Comprobante>
`;
  const dir = path.join(__dirname, '..', 'examples', type);
  fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(path.join(dir, `${folio}.xml`), xml);
}
console.log('Tres XML ficticios creados en examples/.');
