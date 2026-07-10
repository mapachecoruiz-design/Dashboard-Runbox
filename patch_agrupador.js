const fs = require('fs');
const file = 'src/pages/Projections.tsx';
let code = fs.readFileSync(file, 'utf8');

const oldLogic = `  const calculated = useMemo(() => {
    return configs.map(c => calculateProjection(c, accumulatedData[c.id] || 0));
  }, [configs, accumulatedData]);`;

const newLogic = `  const calculated = useMemo(() => {
    const normal = configs.filter(c => c.tipoTarifa !== 'agrupador').map(c => calculateProjection(c, accumulatedData[c.id] || 0));
    const grouped = configs.filter(c => c.tipoTarifa === 'agrupador').map(c => {
       const subs = normal.filter(n => c.subClients?.includes(n.id));
       const accumulated = subs.reduce((sum, s) => sum + s.accumulated, 0);
       const proyectados = subs.reduce((sum, s) => sum + s.proyectados, 0);
       const sinIva = subs.reduce((sum, s) => sum + s.sinIva, 0);
       const iva = subs.reduce((sum, s) => sum + s.iva, 0);
       const conIva = subs.reduce((sum, s) => sum + s.conIva, 0);
       return { ...c, accumulated, valid: true, promDiario: 0, proyectados, sinIva, iva, conIva } as CalculatedProjection;
    });
    return configs.map(c => c.tipoTarifa === 'agrupador' ? grouped.find(g => g.id === c.id)! : normal.find(n => n.id === c.id)!);
  }, [configs, accumulatedData]);`;

code = code.replace(oldLogic, newLogic);

const oldAgrupadorCard = `{row.tipoTarifa !== 'agrupador' ? (
                <>
                  <div className="grid grid-cols-3 gap-2 mb-4 border-b border-slate-100 pb-4">`;

const newAgrupadorCard = `{row.tipoTarifa !== 'agrupador' ? (
                <>
                  <div className="grid grid-cols-3 gap-2 mb-4 border-b border-slate-100 pb-4">`;

fs.writeFileSync(file, code);
console.log('patched');
