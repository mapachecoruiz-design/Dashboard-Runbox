const fs = require('fs');
const file = 'src/pages/Imports.tsx';
let code = fs.readFileSync(file, 'utf8');

code = code.replace(
  `import { Order, addOrders, getOrders } from '../data/orders';`,
  `import { addOrders, getOrders } from '../data/orders';\nimport { Order } from '../types';\nimport { useAppContext } from '../context/AppContext';`
);

code = code.replace(
  `export const Imports = () => {`,
  `export const Imports = () => {\n  const { setOrders } = useAppContext();`
);

code = code.replace(
  `      const idPedidoCliente = stdToFile['idPedidoCliente'] ? row[stdToFile['idPedidoCliente']] : undefined;
      const clienteStr = stdToFile['cliente'] ? row[stdToFile['cliente']] : undefined;
      const fechaEntregaStr = stdToFile['fechaEntrega'] ? row[stdToFile['fechaEntrega']] : undefined;
      const comuna = stdToFile['comuna'] ? row[stdToFile['comuna']] : undefined;
      
      const isError = !idPedidoCliente || !clienteStr || !fechaEntregaStr || !comuna;
      let errorMsg = '';
      if (!idPedidoCliente) errorMsg += 'Falta ID Pedido. ';
      if (!clienteStr) errorMsg += 'Falta Cliente. ';
      if (!fechaEntregaStr) errorMsg += 'Falta Fecha. ';
      if (!comuna) errorMsg += 'Falta Comuna. ';

      const clientId = findClientId(clienteStr);
      const fechaEntrega = normalizeDate(fechaEntregaStr);

      const order: Order = {
        id: 'IMP-' + Date.now() + '-' + i,
        idPedidoCliente: String(idPedidoCliente || ''),
        cliente: String(clienteStr || ''),
        clientId,
        fechaEntrega,
        comuna: String(comuna || ''),
        direccion: stdToFile['direccion'] ? String(row[stdToFile['direccion']] || '') : undefined,
        estado: normalizeStatus(stdToFile['estado'] ? row[stdToFile['estado']] : ''),
        chofer: stdToFile['chofer'] ? String(row[stdToFile['chofer']] || '') : undefined,
        ruta: stdToFile['ruta'] ? String(row[stdToFile['ruta']] || '') : undefined,
        cantidadBultos: stdToFile['cantidadBultos'] ? Number(row[stdToFile['cantidadBultos']]) || 1 : 1,
        tarifaCobrada: stdToFile['tarifaCobrada'] ? Number(row[stdToFile['tarifaCobrada']]) || 0 : 0,
        costoEstimado: stdToFile['costoEstimado'] ? Number(row[stdToFile['costoEstimado']]) || 0 : 0,
      };`,
  `      const idPedidoCliente = stdToFile['clientOrderId'] ? row[stdToFile['clientOrderId']] : undefined;
      const clienteStr = stdToFile['cliente'] ? row[stdToFile['cliente']] : undefined;
      const fechaEntregaStr = stdToFile['deliveryDate'] ? row[stdToFile['deliveryDate']] : undefined;
      const comuna = stdToFile['commune'] ? row[stdToFile['commune']] : undefined;
      
      const isError = !idPedidoCliente || !clienteStr || !fechaEntregaStr || !comuna;
      let errorMsg = '';
      if (!idPedidoCliente) errorMsg += 'Falta ID Pedido. ';
      if (!clienteStr) errorMsg += 'Falta Cliente. ';
      if (!fechaEntregaStr) errorMsg += 'Falta Fecha. ';
      if (!comuna) errorMsg += 'Falta Comuna. ';

      const clientId = findClientId(clienteStr);
      const deliveryDate = normalizeDate(fechaEntregaStr);

      const order: Order = {
        id: 'IMP-' + Date.now() + '-' + i,
        clientOrderId: String(idPedidoCliente || ''),
        clientId,
        deliveryDate,
        createdAt: deliveryDate,
        pickupDate: deliveryDate,
        commune: String(comuna || ''),
        region: 'RM',
        address: stdToFile['address'] ? String(row[stdToFile['address']] || '') : '',
        status: normalizeStatus(stdToFile['status'] ? row[stdToFile['status']] : ''),
        serviceType: 'normal',
        driverId: stdToFile['chofer'] ? String(row[stdToFile['chofer']] || '') : null,
        routeId: stdToFile['ruta'] ? String(row[stdToFile['ruta']] || '') : null,
        packagesCount: stdToFile['packagesCount'] ? Number(row[stdToFile['packagesCount']]) || 1 : 1,
        weight: 1,
        chargedTariff: stdToFile['chargedTariff'] ? Number(row[stdToFile['chargedTariff']]) || 0 : 0,
        estimatedCost: stdToFile['estimatedCost'] ? Number(row[stdToFile['estimatedCost']]) || 0 : 0,
        estimatedMargin: 0
      };`
);

code = code.replace(
  `addOrders(validOrders);`,
  `const updated = addOrders(validOrders);\n    setOrders(updated);`
);

code = code.replace(
  `p.order.idPedidoCliente`,
  `p.order.clientOrderId`
);

code = code.replace(
  `p.order.cliente`,
  `clients.find(c => c.id === p.order.clientId)?.name || p.order.clientId`
);

code = code.replace(
  `p.order.fechaEntrega`,
  `p.order.deliveryDate`
);

code = code.replace(
  `p.order.comuna`,
  `p.order.commune`
);

code = code.replace(
  `p.order.estado.replace`,
  `p.order.status.replace`
);

// We need to import clients to render the name in preview
if (!code.includes("import { clients }")) {
  code = code.replace(
    `import { useAppContext } from '../context/AppContext';`,
    `import { useAppContext } from '../context/AppContext';\nimport { clients } from '../data/clients';`
  );
}

fs.writeFileSync(file, code);
