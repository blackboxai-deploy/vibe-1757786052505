'use client';

import { useState, useEffect } from 'react';
import { Task, TaskStore } from '@/lib/taskStore';
import { getCurrentWeekYear, getNextWeek, getPrevWeek, formatWeekRange } from '@/lib/taskUtils';
import { WeeklyView } from '@/components/WeeklyView';
import { AddTaskDialog } from '@/components/AddTaskDialog';
import { WeeklyStats } from '@/components/WeeklyStats';
import { CategoryFilter } from '@/components/CategoryFilter';
import { TaskSearch } from '@/components/TaskSearch';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ChevronLeft, ChevronRight, Plus, Calendar } from 'lucide-react';

export default function HomePage() {
  const [currentWeek, setCurrentWeek] = useState(getCurrentWeekYear());
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('');
  const [priorityFilter, setPriorityFilter] = useState<string>('');

  useEffect(() => {
    loadTasks();
  }, [currentWeek]);

  const loadTasks = () => {
    const weekTasks = TaskStore.getTasksForWeek(currentWeek);
    setTasks(weekTasks);
  };

  const handleAddTask = (taskData: Omit<Task, 'id' | 'createdAt'>) => {
    TaskStore.addTask({ ...taskData, weekYear: currentWeek });
    loadTasks();
  };

  const handleUpdateTask = (taskId: string, updates: Partial<Task>) => {
    TaskStore.updateTask(taskId, updates);
    loadTasks();
  };

  const handleDeleteTask = (taskId: string) => {
    TaskStore.deleteTask(taskId);
    loadTasks();
  };

  const handleToggleComplete = (taskId: string) => {
    TaskStore.toggleTaskCompletion(taskId);
    loadTasks();
  };

  const goToPrevWeek = () => {
    setCurrentWeek(getPrevWeek(currentWeek));
  };

  const goToNextWeek = () => {
    setCurrentWeek(getNextWeek(currentWeek));
  };

  const goToCurrentWeek = () => {
    setCurrentWeek(getCurrentWeekYear());
  };

  const filteredTasks = tasks.filter(task => {
    const matchesSearch = !searchQuery || 
      task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      task.description?.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesCategory = !categoryFilter || task.category === categoryFilter;
    const matchesPriority = !priorityFilter || task.priority === priorityFilter;
    
    return matchesSearch && matchesCategory && matchesPriority;
  });

  const isCurrentWeek = currentWeek === getCurrentWeekYear();

  return (
    <div className="min-h-screen p-4 md:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
          <CardHeader className="pb-4">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
              <div>
                <CardTitle className="text-3xl font-bold bg-gradient-to-r from-slate-700 to-slate-900 bg-clip-text text-transparent">
                  Weekly To-Do List
                </CardTitle>
                <p className="text-slate-600 mt-1">
                  Stay organized with your weekly tasks and reminders
                </p>
              </div>
              
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={goToPrevWeek}
                  className="hover:bg-slate-100"
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                
                <Button
                  variant={isCurrentWeek ? "default" : "outline"}
                  onClick={goToCurrentWeek}
                  className="min-w-[200px] font-medium"
                >
                  <Calendar className="h-4 w-4 mr-2" />
                  {formatWeekRange(currentWeek)}
                </Button>
                
                <Button
                  variant="outline"
                  size="sm"
                  onClick={goToNextWeek}
                  className="hover:bg-slate-100"
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardHeader>
        </Card>

        {/* Controls */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <Card className="border-0 shadow-md bg-white/70 backdrop-blur-sm">
            <CardContent className="p-4">
              <TaskSearch
                searchQuery={searchQuery}
                onSearchChange={setSearchQuery}
                priorityFilter={priorityFilter}
                onPriorityFilterChange={setPriorityFilter}
              />
            </CardContent>
          </Card>

          <Card className="border-0 shadow-md bg-white/70 backdrop-blur-sm">
            <CardContent className="p-4">
              <CategoryFilter
                selectedCategory={categoryFilter}
                onCategoryChange={setCategoryFilter}
              />
            </CardContent>
          </Card>

          <Card className="border-0 shadow-md bg-white/70 backdrop-blur-sm">
            <CardContent className="p-4 flex items-center justify-center">
              <Button
                onClick={() => setIsAddDialogOpen(true)}
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-medium"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add New Task
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Statistics */}
        <WeeklyStats tasks={filteredTasks} />

        {/* Weekly View */}
        <WeeklyView
          tasks={filteredTasks}
          currentWeek={currentWeek}
          onToggleComplete={handleToggleComplete}
          onUpdateTask={handleUpdateTask}
          onDeleteTask={handleDeleteTask}
        />

        {/* Add Task Dialog */}
        <AddTaskDialog
          open={isAddDialogOpen}
          onOpenChange={setIsAddDialogOpen}
          onAddTask={handleAddTask}
        />
      </div>
    </div>
  );
}