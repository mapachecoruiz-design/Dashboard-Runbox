import fs from 'fs';

let content = fs.readFileSync('src/pages/Imports.tsx', 'utf8');

// Replace state definition to add dataSource
content = content.replace(
  "const [step, setStep] = useState<ImportStep>('select');",
  "const [step, setStep] = useState<ImportStep>('select');\n  const [dataSource, setDataSource] = useState<string>('Plantilla RunBox');"
);

// Update generatePreview to parse all requested fields
const oldGeneratePreview = `    rawData.forEach((row, i) => {
      // Extract mapped fields
      const colClientOrderId = stdToFile['clientOrderId'];
      const colCliente = stdToFile['cliente'];
      const colDeliveryDate = stdToFile['deliveryDate'];
      const colCommune = stdToFile['commune'];
      const colStatus = stdToFile['status'];

      const idPedidoCliente = colClientOrderId ? row[colClientOrderId] : undefined;
      const clienteStr = colCliente ? row[colCliente] : undefined;
      const fechaEntregaStr = colDeliveryDate ? row[colDeliveryDate] : undefined;
      const comuna = colCommune ? row[colCommune] : undefined;
      
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
      };

      const isDup = isDuplicate(order, existingOrders);
      
      if (isError) errCount++;
      else if (isDup) dupCount++;
      else validCount++;

      generated.push({ order, isError, errorMsg, isDuplicate: isDup });
    });`;

const newGeneratePreview = `    rawData.forEach((row, i) => {
      const getVal = (field: string) => stdToFile[field] ? row[stdToFile[field]] : undefined;
      
      const idPedidoCliente = getVal('clientOrderId');
      const clienteStr = getVal('clientId');
      const fechaEntregaStr = getVal('deliveryDate');
      const comuna = getVal('commune');
      
      const isError = !idPedidoCliente || !clienteStr || !fechaEntregaStr || !comuna;
      let errorMsg = '';
      if (!idPedidoCliente) errorMsg += 'Falta ID Pedido. ';
      if (!clienteStr) errorMsg += 'Falta Cliente. ';
      if (!fechaEntregaStr) errorMsg += 'Falta Fecha. ';
      if (!comuna) errorMsg += 'Falta Comuna. ';

      const clientId = findClientId(clienteStr);
      const deliveryDate = normalizeDate(fechaEntregaStr);
      const createdAt = getVal('createdAt') ? normalizeDate(getVal('createdAt')) : deliveryDate;
      const pickupDate = getVal('pickupDate') ? normalizeDate(getVal('pickupDate')) : deliveryDate;

      const order: Order = {
        id: 'IMP-' + Date.now() + '-' + i,
        clientOrderId: String(idPedidoCliente || ''),
        clientId,
        deliveryDate,
        createdAt,
        pickupDate,
        commune: String(comuna || ''),
        region: getVal('region') ? String(getVal('region')) : 'RM',
        address: getVal('address') ? String(getVal('address')) : '',
        status: normalizeStatus(getVal('status')),
        serviceType: getVal('serviceType') ? String(getVal('serviceType')) : 'normal',
        driverId: getVal('driverId') ? String(getVal('driverId')) : null,
        routeId: getVal('routeId') ? String(getVal('routeId')) : null,
        packagesCount: getVal('packagesCount') ? Number(getVal('packagesCount')) || 1 : 1,
        weight: getVal('weight') ? Number(getVal('weight')) || 1 : 1,
        chargedTariff: getVal('chargedTariff') ? Number(getVal('chargedTariff')) || 0 : 0,
        estimatedCost: getVal('estimatedCost') ? Number(getVal('estimatedCost')) || 0 : 0,
        estimatedMargin: getVal('estimatedMargin') ? Number(getVal('estimatedMargin')) || 0 : 0,
        failureReason: getVal('failureReason') ? String(getVal('failureReason')) : undefined,
        notes: getVal('notes') ? String(getVal('notes')) : undefined,
        podLink: getVal('podLink') ? String(getVal('podLink')) : undefined
      };

      const isDup = isDuplicate(order, existingOrders);
      
      if (isError) errCount++;
      else if (isDup) dupCount++;
      else validCount++;

      generated.push({ order, isError, errorMsg, isDuplicate: isDup });
    });`;

content = content.replace(oldGeneratePreview, newGeneratePreview);

const selectStepStart = `<div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex flex-col items-center justify-center py-20">`;
const newSelectStepStart = `<div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex flex-col items-center justify-center py-12">
               <div className="w-full max-w-md mb-8">
                 <label className="block text-sm font-bold text-slate-700 mb-2">Origen de los datos</label>
                 <select 
                   className="w-full p-3 border border-slate-300 rounded-lg bg-slate-50 focus:ring-2 focus:ring-indigo-500"
                   value={dataSource}
                   onChange={(e) => setDataSource(e.target.value)}
                 >
                   <option value="Plantilla RunBox">Plantilla RunBox</option>
                   <option value="Booz">Booz</option>
                   <option value="TrackPod">TrackPod</option>
                   <option value="Cliente genérico">Cliente genérico</option>
                   <option value="Costos">Costos</option>
                   <option value="Rutas">Rutas</option>
                   <option value="Pagos choferes">Pagos choferes</option>
                 </select>
               </div>`;

content = content.replace(selectStepStart, newSelectStepStart);

content = content.replace("dataSource: 'General',", "dataSource,");

// Update duplicate imports handling in confirmImport to allow skipping/updating
// The prompt says:
// Si hay duplicado, permitir:
// * Omitir
// * Actualizar existente

// We'll add a state for this.
const stateAdd = `const [duplicateAction, setDuplicateAction] = useState<'skip' | 'update'>('skip');`;
content = content.replace("const [summary, setSummary] = useState({ total: 0, valid: 0, errors: 0, duplicates: 0 });", "const [summary, setSummary] = useState({ total: 0, valid: 0, errors: 0, duplicates: 0 });\n  const [duplicateAction, setDuplicateAction] = useState<'skip' | 'update'>('skip');");

// In confirmImport:
const confirmImportCode = `  const confirmImport = () => {
    setIsProcessing(true);
    
    // Solo importamos los validos y no duplicados (por defecto, omitir duplicados)
    const validOrders = previewOrders.filter(p => !p.isError && !p.isDuplicate).map(p => p.order);
    
    const updated = addOrders(validOrders);
    setOrders(updated);
    
    addImportHistory({
      id: 'HIST-' + Date.now(),
      fileName: file?.name || 'desconocido',
      dataSource,
      date: new Date().toISOString(),
      user: 'Usuario Local',
      rowsRead: summary.total,
      rowsImported: validOrders.length,
      errorsCount: summary.errors,
      duplicatesCount: summary.duplicates,
      status: summary.errors > 0 ? 'procesado_con_errores' : 'procesado'
    });

    setStep('result');
    setIsProcessing(false);
  };`;

const newConfirmImportCode = `  const confirmImport = () => {
    setIsProcessing(true);
    
    let ordersToImport = previewOrders.filter(p => !p.isError && !p.isDuplicate).map(p => p.order);
    let ordersToUpdate = previewOrders.filter(p => !p.isError && p.isDuplicate).map(p => p.order);
    
    if (duplicateAction === 'update') {
      const existingOrders = getOrders();
      const newOrdersList = [...existingOrders];
      
      ordersToUpdate.forEach(updatedOrder => {
        const idx = newOrdersList.findIndex(o => 
          o.clientId === updatedOrder.clientId && 
          o.clientOrderId === updatedOrder.clientOrderId && 
          o.deliveryDate === updatedOrder.deliveryDate
        );
        if (idx !== -1) {
          newOrdersList[idx] = { ...newOrdersList[idx], ...updatedOrder };
        }
      });
      
      // Add new ones
      const updated = [...newOrdersList, ...ordersToImport];
      setOrders(updated);
      localStorage.setItem('runbox_orders', JSON.stringify(updated));
    } else {
      const updated = addOrders(ordersToImport);
      setOrders(updated);
    }
    
    addImportHistory({
      id: 'HIST-' + Date.now(),
      fileName: file?.name || 'desconocido',
      dataSource,
      date: new Date().toISOString(),
      user: 'Usuario Local',
      rowsRead: summary.total,
      rowsImported: ordersToImport.length + (duplicateAction === 'update' ? ordersToUpdate.length : 0),
      errorsCount: summary.errors,
      duplicatesCount: summary.duplicates,
      status: summary.errors > 0 ? 'procesado_con_errores' : 'procesado'
    });

    setStep('result');
    setIsProcessing(false);
  };`;

content = content.replace(confirmImportCode, newConfirmImportCode);

// Add radio buttons to preview screen for duplicate action
const duplicateUI = `<div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                 <div className="flex justify-between items-center mb-6">`;

const newDuplicateUI = `<div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                 <div className="flex justify-between items-center mb-6">
                   <div className="flex flex-col">
                     <h2 className="text-lg font-bold text-slate-800">Vista Previa (primeros 20)</h2>
                     {summary.duplicates > 0 && (
                       <div className="flex gap-4 mt-2">
                         <label className="flex items-center gap-2 text-sm text-slate-700">
                           <input type="radio" name="dupAction" checked={duplicateAction === 'skip'} onChange={() => setDuplicateAction('skip')} className="text-indigo-600 focus:ring-indigo-500" />
                           Omitir duplicados
                         </label>
                         <label className="flex items-center gap-2 text-sm text-slate-700">
                           <input type="radio" name="dupAction" checked={duplicateAction === 'update'} onChange={() => setDuplicateAction('update')} className="text-indigo-600 focus:ring-indigo-500" />
                           Actualizar duplicados
                         </label>
                       </div>
                     )}
                   </div>
`;

content = content.replace(duplicateUI, newDuplicateUI);


fs.writeFileSync('src/pages/Imports.tsx', content);

