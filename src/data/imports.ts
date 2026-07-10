import { loadFromStorage, saveToStorage } from '../lib/storage';

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
  return loadFromStorage(STORAGE_KEY, []);
};

export const addImportHistory = (item: ImportHistoryItem) => {
  const history = getImportHistory();
  history.push(item);
  saveToStorage(STORAGE_KEY, history);
};
