const fs = require('fs');
const file = 'src/pages/Imports.tsx';
let code = fs.readFileSync(file, 'utf8');

code = code.replace(
  `        </div>
      )}
        </>
      ) : (`,
  `        </div>
      )}
        </>
      ) : (`
);

fs.writeFileSync(file, code);
