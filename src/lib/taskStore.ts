'use client';

export interface Task {
  id: string;
  title: string;
  description?: string;
  category: TaskCategory;
  priority: TaskPriority;
  dayOfWeek: number; // 0-6 (Sunday-Saturday)
  time?: string; // HH:MM format
  completed: boolean;
  recurring?: boolean;
  createdAt: Date;
  weekYear: string; // "2024-W01" format
}

export type TaskCategory = 'personal' | 'work' | 'health' | 'shopping' | 'household' | 'learning';
export type TaskPriority = 'high' | 'medium' | 'low';

export const TASK_CATEGORIES: { [key in TaskCategory]: { label: string; color: string } } = {
  personal: { label: 'Personal', color: 'bg-blue-500' },
  work: { label: 'Work', color: 'bg-purple-500' },
  health: { label: 'Health', color: 'bg-green-500' },
  shopping: { label: 'Shopping', color: 'bg-orange-500' },
  household: { label: 'Household', color: 'bg-yellow-500' },
  learning: { label: 'Learning', color: 'bg-pink-500' },
};

export const TASK_PRIORITIES: { [key in TaskPriority]: { label: string; color: string } } = {
  high: { label: 'High', color: 'border-red-500 text-red-600' },
  medium: { label: 'Medium', color: 'border-yellow-500 text-yellow-600' },
  low: { label: 'Low', color: 'border-green-500 text-green-600' },
};

export class TaskStore {
  private static STORAGE_KEY = 'weekly-todo-tasks';

  static getTasks(): Task[] {
    if (typeof window === 'undefined') return [];
    
    try {
      const stored = localStorage.getItem(this.STORAGE_KEY);
      if (!stored) return [];
      
      const tasks = JSON.parse(stored);
      return tasks.map((task: any) => ({
        ...task,
        createdAt: new Date(task.createdAt),
      }));
    } catch (error) {
      console.error('Error loading tasks:', error);
      return [];
    }
  }

  static saveTasks(tasks: Task[]): void {
    if (typeof window === 'undefined') return;
    
    try {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(tasks));
    } catch (error) {
      console.error('Error saving tasks:', error);
    }
  }

  static addTask(task: Omit<Task, 'id' | 'createdAt'>): Task {
    const newTask: Task = {
      ...task,
      id: crypto.randomUUID(),
      createdAt: new Date(),
    };
    
    const tasks = this.getTasks();
    tasks.push(newTask);
    this.saveTasks(tasks);
    
    return newTask;
  }

  static updateTask(taskId: string, updates: Partial<Task>): Task | null {
    const tasks = this.getTasks();
    const taskIndex = tasks.findIndex(t => t.id === taskId);
    
    if (taskIndex === -1) return null;
    
    tasks[taskIndex] = { ...tasks[taskIndex], ...updates };
    this.saveTasks(tasks);
    
    return tasks[taskIndex];
  }

  static deleteTask(taskId: string): boolean {
    const tasks = this.getTasks();
    const filteredTasks = tasks.filter(t => t.id !== taskId);
    
    if (filteredTasks.length === tasks.length) return false;
    
    this.saveTasks(filteredTasks);
    return true;
  }

  static getTasksForWeek(weekYear: string): Task[] {
    const allTasks = this.getTasks();
    return allTasks.filter(task => task.weekYear === weekYear);
  }

  static toggleTaskCompletion(taskId: string): Task | null {
    const task = this.getTasks().find(t => t.id === taskId);
    if (!task) return null;
    
    return this.updateTask(taskId, { completed: !task.completed });
  }
}