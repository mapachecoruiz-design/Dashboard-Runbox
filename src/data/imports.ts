export interface ImportHistoryItem {
  id: string;
  fileName: string;
  dataSource: string;
  date: string;
  user: string;
  rowsRead: number;
  rowsImported: number;
  errorsCount: number;
  duplicatesCount: number;
  status: 'procesado' | 'procesado_con_errores' | 'fallido';
  errorDetails?: string[];
}

const STORAGE_KEY = 'runbox_imports_history';

export const getImportHistory = (): ImportHistoryItem[] => {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  } catch (e) {
    return [];
  }
};

export const addImportHistory = (item: ImportHistoryItem) => {
  const history = getImportHistory();
  history.push(item);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(history));
};
