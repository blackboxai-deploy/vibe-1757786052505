'use client';

import { useState } from 'react';
import { Task, TaskCategory, TaskPriority, TASK_CATEGORIES, TASK_PRIORITIES } from '@/lib/taskStore';
import { DAYS_OF_WEEK } from '@/lib/taskUtils';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { toast } from 'sonner';

interface AddTaskDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAddTask: (task: Omit<Task, 'id' | 'createdAt'>) => void;
}

export function AddTaskDialog({ open, onOpenChange, onAddTask }: AddTaskDialogProps) {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'personal' as TaskCategory,
    priority: 'medium' as TaskPriority,
    dayOfWeek: 1, // Monday
    time: '',
    recurring: false,
    completed: false,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title.trim()) {
      toast.error('Please enter a task title');
      return;
    }

    const taskData: Omit<Task, 'id' | 'createdAt'> = {
      title: formData.title.trim(),
      description: formData.description.trim() || undefined,
      category: formData.category,
      priority: formData.priority,
      dayOfWeek: formData.dayOfWeek,
      time: formData.time || undefined,
      recurring: formData.recurring,
      completed: formData.completed,
      weekYear: '', // Will be set by the parent component
    };

    onAddTask(taskData);
    
    // Reset form
    setFormData({
      title: '',
      description: '',
      category: 'personal',
      priority: 'medium',
      dayOfWeek: 1,
      time: '',
      recurring: false,
      completed: false,
    });

    onOpenChange(false);
    toast.success('Task added successfully!');
  };

  const handleCancel = () => {
    setFormData({
      title: '',
      description: '',
      category: 'personal',
      priority: 'medium',
      dayOfWeek: 1,
      time: '',
      recurring: false,
      completed: false,
    });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">Add New Task</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="title" className="text-sm font-medium">
              Task Title *
            </Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
              placeholder="Enter your task..."
              className="w-full"
              autoFocus
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description" className="text-sm font-medium">
              Description
            </Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              placeholder="Additional details (optional)"
              rows={3}
              className="w-full resize-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-sm font-medium">Category</Label>
              <Select
                value={formData.category}
                onValueChange={(value: TaskCategory) => 
                  setFormData(prev => ({ ...prev, category: value }))
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(TASK_CATEGORIES).map(([key, info]) => (
                    <SelectItem key={key} value={key}>
                      <div className="flex items-center gap-2">
                        <div className={`w-3 h-3 rounded-full ${(info as any).color}`} />
                        {(info as any).label}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-medium">Priority</Label>
              <Select
                value={formData.priority}
                onValueChange={(value: TaskPriority) => 
                  setFormData(prev => ({ ...prev, priority: value }))
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(TASK_PRIORITIES).map(([key, info]) => (
                    <SelectItem key={key} value={key}>
                      {(info as any).label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-sm font-medium">Day</Label>
              <Select
                value={formData.dayOfWeek.toString()}
                onValueChange={(value) => 
                  setFormData(prev => ({ ...prev, dayOfWeek: parseInt(value) }))
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {DAYS_OF_WEEK.map((day) => (
                    <SelectItem key={day.index} value={day.index.toString()}>
                      {day.full}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="time" className="text-sm font-medium">
                Time (optional)
              </Label>
              <Input
                id="time"
                type="time"
                value={formData.time}
                onChange={(e) => setFormData(prev => ({ ...prev, time: e.target.value }))}
                className="w-full"
              />
            </div>
          </div>

          <div className="flex items-center justify-between py-2">
            <Label htmlFor="recurring" className="text-sm font-medium">
              Recurring weekly
            </Label>
            <Switch
              id="recurring"
              checked={formData.recurring}
              onCheckedChange={(checked) => 
                setFormData(prev => ({ ...prev, recurring: checked }))
              }
            />
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={handleCancel}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
            >
              Add Task
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}