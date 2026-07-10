import { startOfMonth, endOfMonth, isWeekend, isSaturday, isSunday, isBefore, isSameDay, startOfDay } from 'date-fns';
import { ClientProjectionConfig } from '../data/mockProjections';

export interface Holiday {
  date: string; // YYYY-MM-DD
  name: string;
  irrenunciable: boolean;
}

// Mock holidays for 2026 Chile
export const CHILE_HOLIDAYS_2026: Holiday[] = [
  { date: '2026-01-01', name: 'Año Nuevo', irrenunciable: true },
  { date: '2026-04-03', name: 'Viernes Santo', irrenunciable: false },
  { date: '2026-04-04', name: 'Sábado Santo', irrenunciable: false },
  { date: '2026-05-01', name: 'Día Nacional del Trabajo', irrenunciable: true },
  { date: '2026-05-21', name: 'Día de las Glorias Navales', irrenunciable: false },
  { date: '2026-06-21', name: 'Día Nacional de los Pueblos Indígenas', irrenunciable: false },
  { date: '2026-06-29', name: 'San Pedro y San Pablo', irrenunciable: false },
  { date: '2026-07-16', name: 'Día de la Virgen del Carmen', irrenunciable: false },
  { date: '2026-08-15', name: 'Asunción de la Virgen', irrenunciable: false },
  { date: '2026-09-18', name: 'Independencia Nacional', irrenunciable: true },
  { date: '2026-09-19', name: 'Día de las Glorias del Ejército', irrenunciable: true },
  { date: '2026-10-12', name: 'Encuentro de Dos Mundos', irrenunciable: false },
  { date: '2026-10-31', name: 'Día de las Iglesias Evangélicas', irrenunciable: false },
  { date: '2026-11-01', name: 'Día de Todos los Santos', irrenunciable: false },
  { date: '2026-12-08', name: 'Inmaculada Concepción', irrenunciable: false },
  { date: '2026-12-25', name: 'Navidad', irrenunciable: true },
];

export function calculateWorkingDays(
  year: number,
  month: number, // 0-11
  config: ClientProjectionConfig,
  currentDate: Date = new Date()
) {
  // Extract UTC date to avoid timezone issues when converting to YYYY-MM-DD
  const monthStart = startOfMonth(new Date(year, month));
  const monthEnd = endOfMonth(monthStart);
  
  let totalDaysInMonth = 0;
  let workedDaysUntilToday = 0;
  
  const today = startOfDay(currentDate);

  for (let d = 1; d <= monthEnd.getDate(); d++) {
    const currentIterDate = new Date(year, month, d);
    // Add timezone offset to ensure we don't jump days backward on formatting
    const localDate = new Date(currentIterDate.getTime() - (currentIterDate.getTimezoneOffset() * 60000));
    const dateStr = localDate.toISOString().split('T')[0];
    
    let isWorkingDay = true;
    
    // Check week days based on calendarType
    if (config.calendarType === 'lunes_viernes') {
      if (isWeekend(currentIterDate)) isWorkingDay = false;
    } else if (config.calendarType === 'lunes_sabado') {
      if (isSunday(currentIterDate)) isWorkingDay = false;
    }
    
    // Check holidays
    const holiday = CHILE_HOLIDAYS_2026.find(h => h.date === dateStr);
    
    if (holiday) {
      if (holiday.irrenunciable && !config.countIrrenunciableHolidays) {
        isWorkingDay = false;
      }
      if (!holiday.irrenunciable && !config.countNormalHolidays) {
        isWorkingDay = false;
      }
    }
    
    if (isWorkingDay) {
      totalDaysInMonth++;
      
      // Calculate days until today
      if (isBefore(currentIterDate, today) || isSameDay(currentIterDate, today)) {
        workedDaysUntilToday++;
      }
    }
  }

  return {
    autoDiasMes: totalDaysInMonth,
    autoDiasTrabajados: workedDaysUntilToday,
  };
}
