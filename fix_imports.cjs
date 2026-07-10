const fs = require('fs');
const file = 'src/pages/Projections.tsx';
let code = fs.readFileSync(file, 'utf8');

if (!code.includes("calculateWorkingDays")) {
  // Try alternative replace
}
