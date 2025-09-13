'use client';

import { Task } from '@/lib/taskStore';
import { DAYS_OF_WEEK, sortTasks, getDateForDay, formatDate } from '@/lib/taskUtils';
import { TaskCard } from './TaskCard';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface WeeklyViewProps {
  tasks: Task[];
  currentWeek: string;
  onToggleComplete: (taskId: string) => void;
  onUpdateTask: (taskId: string, updates: Partial<Task>) => void;
  onDeleteTask: (taskId: string) => void;
}

export function WeeklyView({
  tasks,
  currentWeek,
  onToggleComplete,
  onUpdateTask,
  onDeleteTask,
}: WeeklyViewProps) {
  const getTasksForDay = (dayOfWeek: number) => {
    const dayTasks = tasks.filter(task => task.dayOfWeek === dayOfWeek);
    return sortTasks(dayTasks);
  };

  const isToday = (dayOfWeek: number) => {
    const today = new Date();
    const dayDate = getDateForDay(currentWeek, dayOfWeek);
    return (
      today.getFullYear() === dayDate.getFullYear() &&
      today.getMonth() === dayDate.getMonth() &&
      today.getDate() === dayDate.getDate()
    );
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-7 gap-4">
      {DAYS_OF_WEEK.map((day) => {
        const dayTasks = getTasksForDay(day.index);
        const completedTasks = dayTasks.filter(t => t.completed).length;
        const totalTasks = dayTasks.length;
        const date = getDateForDay(currentWeek, day.index);

        return (
          <Card
            key={day.index}
            className={`min-h-[400px] border-0 shadow-lg transition-all duration-200 hover:shadow-xl ${
              isToday(day.index)
                ? 'bg-gradient-to-br from-blue-50 to-indigo-50 ring-2 ring-blue-200'
                : 'bg-white/80 backdrop-blur-sm'
            }`}
          >
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className={`text-lg font-semibold ${
                  isToday(day.index) ? 'text-blue-700' : 'text-slate-700'
                }`}>
                  {day.short}
                </CardTitle>
                {isToday(day.index) && (
                  <Badge variant="secondary" className="bg-blue-100 text-blue-700 text-xs">
                    Today
                  </Badge>
                )}
              </div>
              <p className="text-sm text-slate-500 font-medium">
                {formatDate(date)}
              </p>
              
              {totalTasks > 0 && (
                <div className="flex items-center gap-2 mt-2">
                  <div className={`h-2 bg-slate-200 rounded-full flex-1 overflow-hidden ${
                    isToday(day.index) ? 'bg-blue-100' : ''
                  }`}>
                    {completedTasks > 0 && (
                      <div
                        className={`h-full transition-all duration-300 rounded-full ${
                          isToday(day.index) ? 'bg-blue-500' : 'bg-green-500'
                        }`}
                        style={{
                          width: `${(completedTasks / totalTasks) * 100}%`,
                        }}
                      />
                    )}
                  </div>
                  <span className="text-xs font-medium text-slate-600">
                    {completedTasks}/{totalTasks}
                  </span>
                </div>
              )}
            </CardHeader>
            
            <CardContent className="pt-0 space-y-3">
              {dayTasks.length === 0 ? (
                <div className="flex items-center justify-center h-32 text-slate-400">
                  <div className="text-center">
                    <div className="text-2xl mb-2">📝</div>
                    <p className="text-sm">No tasks</p>
                  </div>
                </div>
              ) : (
                <div className="space-y-2">
                  {dayTasks.map((task) => (
                    <TaskCard
                      key={task.id}
                      task={task}
                      onToggleComplete={() => onToggleComplete(task.id)}
                      onUpdate={(updates) => onUpdateTask(task.id, updates)}
                      onDelete={() => onDeleteTask(task.id)}
                    />
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}