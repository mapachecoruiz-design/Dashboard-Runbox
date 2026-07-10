const fs = require('fs');
const file = 'src/pages/Projections.tsx';
let code = fs.readFileSync(file, 'utf8');

if (!code.includes("import { calculateWorkingDays }")) {
  code = code.replace(
    "import { cn } from '../lib/utils';",
    "import { cn } from '../lib/utils';\nimport { calculateWorkingDays } from '../utils/calendar';\nimport { useAppContext } from '../context/AppContext';"
  );
}

// Fix line 583: `calculateProjection(preview, ...)` only passes 2 arguments!
// Let's find it.
code = code.replace(
  /const preview = \{ \.\.\.editForm \};\s*return calculateProjection\(preview, editForm\.accumulated \|\| 0\);/,
  "const preview = { ...editForm };\n      return calculateProjection(preview, editForm.accumulated || 0, ufValue, currentDate);"
);

fs.writeFileSync(file, code);
