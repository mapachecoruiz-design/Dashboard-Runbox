const fs = require('fs');
const file = 'src/components/layout/Sidebar.tsx';
let code = fs.readFileSync(file, 'utf8');

if (!code.includes("label: 'Consolidado Mensual'")) {
  code = code.replace(
    `import { \n  LayoutDashboard,`,
    `import { \n  LayoutDashboard,\n  PieChart,`
  );
  
  // also handle flat import if it is flat
  code = code.replace(
    `import { NavLink } from 'react-router-dom';\nimport { \n  LayoutDashboard, \n  Package,`,
    `import { NavLink } from 'react-router-dom';\nimport { \n  LayoutDashboard, \n  Package,\n  PieChart,`
  );
  
  if (!code.includes('PieChart')) {
      code = code.replace(
          /import \{\s*LayoutDashboard,/,
          `import { LayoutDashboard, PieChart,`
      );
  }

  code = code.replace(
    `{ to: '/projections', icon: TrendingUp, label: 'Proyecciones' },`,
    `{ to: '/projections', icon: TrendingUp, label: 'Proyecciones' },\n  { to: '/consolidado', icon: PieChart, label: 'Consolidado Mensual' },`
  );
  fs.writeFileSync(file, code);
}
