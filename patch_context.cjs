const fs = require('fs');
const file = 'src/context/AppContext.tsx';
let code = fs.readFileSync(file, 'utf8');

if (!code.includes('ufValue')) {
    code = code.replace(
        `import React, { createContext, useContext, useState, ReactNode } from 'react';`,
        `import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';`
    );

    code = code.replace(
        `  tariffs: TariffRule[];\n  setTariffs: React.Dispatch<React.SetStateAction<TariffRule[]>>;\n}`,
        `  tariffs: TariffRule[];\n  setTariffs: React.Dispatch<React.SetStateAction<TariffRule[]>>;\n  ufValue: number;\n  setUfValue: React.Dispatch<React.SetStateAction<number>>;\n}`
    );

    code = code.replace(
        `  const [tariffs, setTariffs] = useState<TariffRule[]>(mockTariffs);`,
        `  const [tariffs, setTariffs] = useState<TariffRule[]>(mockTariffs);\n  const [ufValue, setUfValue] = useState<number>(37000);\n\n  useEffect(() => {\n    fetch('https://mindicador.cl/api/uf')\n      .then(res => res.json())\n      .then(data => {\n        if (data && data.serie && data.serie.length > 0) {\n          setUfValue(data.serie[0].valor);\n        }\n      })\n      .catch(err => console.error("Error fetching UF", err));\n  }, []);`
    );

    code = code.replace(
        `        tariffs, setTariffs\n      }}`,
        `        tariffs, setTariffs,\n        ufValue, setUfValue\n      }}`
    );
    
    fs.writeFileSync(file, code);
}
