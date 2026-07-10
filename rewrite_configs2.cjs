const fs = require('fs');
const file = 'src/data/mockProjections.ts';
let code = fs.readFileSync(file, 'utf8');

// replace "}," with logic to inject fields
const lines = code.split('\n');
const newLines = lines.map(line => {
    if (line.includes('{ id:') && line.includes('name:')) {
        let calendarParams = `calendarType: 'lunes_viernes', countNormalHolidays: false, countIrrenunciableHolidays: false`;
        if (line.includes("'Booz") || line.includes("Booz ")) {
            calendarParams = `calendarType: 'lunes_domingo', countNormalHolidays: true, countIrrenunciableHolidays: false`;
        } else if (line.includes('Liga') || line.includes('Farmaloop') || line.includes('MarketCare') || line.includes('Sesfar')) {
            calendarParams = `calendarType: 'lunes_sabado', countNormalHolidays: false, countIrrenunciableHolidays: false`;
        }
        return line.replace(' }', `, ${calendarParams} }`);
    }
    return line;
});

fs.writeFileSync(file, newLines.join('\n'));
