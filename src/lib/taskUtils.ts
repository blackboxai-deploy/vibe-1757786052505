import { Task, TaskCategory, TaskPriority } from './taskStore';

export const DAYS_OF_WEEK = [
  { index: 1, short: 'Mon', full: 'Monday' },
  { index: 2, short: 'Tue', full: 'Tuesday' },
  { index: 3, short: 'Wed', full: 'Wednesday' },
  { index: 4, short: 'Thu', full: 'Thursday' },
  { index: 5, short: 'Fri', full: 'Friday' },
  { index: 6, short: 'Sat', full: 'Saturday' },
  { index: 0, short: 'Sun', full: 'Sunday' },
];

export function getCurrentWeekYear(): string {
  const now = new Date();
  const year = now.getFullYear();
  const weekNumber = getWeekNumber(now);
  return `${year}-W${weekNumber.toString().padStart(2, '0')}`;
}

export function getWeekNumber(date: Date): number {
  const target = new Date(date.valueOf());
  const dayNumber = (date.getDay() + 6) % 7;
  target.setDate(target.getDate() - dayNumber + 3);
  const firstThursday = target.valueOf();
  target.setMonth(0, 1);
  if (target.getDay() !== 4) {
    target.setMonth(0, 1 + ((4 - target.getDay()) + 7) % 7);
  }
  return 1 + Math.ceil((firstThursday - target.valueOf()) / 604800000);
}

export function parseWeekYear(weekYear: string): { year: number; week: number } {
  const [year, week] = weekYear.split('-W').map(Number);
  return { year, week };
}

export function getWeekStartDate(weekYear: string): Date {
  const { year, week } = parseWeekYear(weekYear);
  const jan4 = new Date(year, 0, 4);
  const jan4DayOfWeek = (jan4.getDay() + 6) % 7; // Monday = 0
  const weekStart = new Date(jan4);
  weekStart.setDate(jan4.getDate() - jan4DayOfWeek + (week - 1) * 7);
  return weekStart;
}

export function getWeekEndDate(weekYear: string): Date {
  const startDate = getWeekStartDate(weekYear);
  const endDate = new Date(startDate);
  endDate.setDate(startDate.getDate() + 6);
  return endDate;
}

export function getDateForDay(weekYear: string, dayOfWeek: number): Date {
  const weekStart = getWeekStartDate(weekYear);
  const date = new Date(weekStart);
  
  // Adjust for Sunday being 0 in our system
  const adjustedDay = dayOfWeek === 0 ? 6 : dayOfWeek - 1;
  date.setDate(weekStart.getDate() + adjustedDay);
  
  return date;
}

export function formatDate(date: Date): string {
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
  });
}

export function formatWeekRange(weekYear: string): string {
  const startDate = getWeekStartDate(weekYear);
  const endDate = getWeekEndDate(weekYear);
  
  return `${formatDate(startDate)} - ${formatDate(endDate)}`;
}

export function getNextWeek(weekYear: string): string {
  const { year, week } = parseWeekYear(weekYear);
  const weeksInYear = getWeeksInYear(year);
  
  if (week < weeksInYear) {
    return `${year}-W${(week + 1).toString().padStart(2, '0')}`;
  } else {
    return `${year + 1}-W01`;
  }
}

export function getPrevWeek(weekYear: string): string {
  const { year, week } = parseWeekYear(weekYear);
  
  if (week > 1) {
    return `${year}-W${(week - 1).toString().padStart(2, '0')}`;
  } else {
    const prevYear = year - 1;
    const weeksInPrevYear = getWeeksInYear(prevYear);
    return `${prevYear}-W${weeksInPrevYear.toString().padStart(2, '0')}`;
  }
}

function getWeeksInYear(year: number): number {
  const dec28 = new Date(year, 11, 28);
  return getWeekNumber(dec28);
}

export function sortTasks(tasks: Task[]): Task[] {
  const priorityOrder = { high: 3, medium: 2, low: 1 };
  
  return [...tasks].sort((a, b) => {
    // Completed tasks go to bottom
    if (a.completed !== b.completed) {
      return a.completed ? 1 : -1;
    }
    
    // Sort by priority (high to low)
    const priorityDiff = priorityOrder[b.priority] - priorityOrder[a.priority];
    if (priorityDiff !== 0) return priorityDiff;
    
    // Sort by time if available
    if (a.time && b.time) {
      return a.time.localeCompare(b.time);
    }
    if (a.time && !b.time) return -1;
    if (!a.time && b.time) return 1;
    
    // Finally sort by creation date
    return a.createdAt.getTime() - b.createdAt.getTime();
  });
}

export function filterTasks(
  tasks: Task[],
  filters: {
    category?: TaskCategory;
    priority?: TaskPriority;
    search?: string;
    completed?: boolean;
  }
): Task[] {
  return tasks.filter(task => {
    if (filters.category && task.category !== filters.category) return false;
    if (filters.priority && task.priority !== filters.priority) return false;
    if (filters.completed !== undefined && task.completed !== filters.completed) return false;
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      return (
        task.title.toLowerCase().includes(searchLower) ||
        task.description?.toLowerCase().includes(searchLower)
      );
    }
    return true;
  });
}

export function getTaskStats(tasks: Task[]): {
  total: number;
  completed: number;
  completionRate: number;
  byCategory: Record<TaskCategory, number>;
  byPriority: Record<TaskPriority, number>;
} {
  const total = tasks.length;
  const completed = tasks.filter(t => t.completed).length;
  const completionRate = total > 0 ? Math.round((completed / total) * 100) : 0;
  
  const byCategory = {} as Record<TaskCategory, number>;
  const byPriority = {} as Record<TaskPriority, number>;
  
  tasks.forEach(task => {
    byCategory[task.category] = (byCategory[task.category] || 0) + 1;
    byPriority[task.priority] = (byPriority[task.priority] || 0) + 1;
  });
  
  return {
    total,
    completed,
    completionRate,
    byCategory,
    byPriority,
  };
}