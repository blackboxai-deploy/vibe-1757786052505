'use client';

import { useState } from 'react';
import { Task, TASK_CATEGORIES, TASK_PRIORITIES } from '@/lib/taskStore';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { MoreVertical, Clock, Edit, Trash2 } from 'lucide-react';

interface TaskCardProps {
  task: Task;
  onToggleComplete: () => void;
  onUpdate: (updates: Partial<Task>) => void;
  onDelete: () => void;
}

export function TaskCard({ task, onToggleComplete, onUpdate, onDelete }: TaskCardProps) {
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  
  const categoryInfo = TASK_CATEGORIES[task.category];
  const priorityInfo = TASK_PRIORITIES[task.priority];

  const handleEdit = () => {
    // For now, we'll just focus on the core functionality
    // Edit functionality can be added later with a modal form
    console.log('Edit task:', task.id);
  };

  return (
    <>
      <Card className={`group transition-all duration-200 hover:shadow-md border ${
        task.completed 
          ? 'opacity-60 bg-slate-50/50 border-slate-200' 
          : 'bg-white border-slate-200 hover:border-slate-300'
      }`}>
        <CardContent className="p-3">
          <div className="flex items-start gap-3">
            <Checkbox
              checked={task.completed}
              onCheckedChange={onToggleComplete}
              className={`mt-0.5 ${
                task.completed ? 'data-[state=checked]:bg-green-600' : ''
              }`}
            />
            
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between gap-2">
                <div className="flex-1">
                  <h4 className={`font-medium text-sm leading-5 ${
                    task.completed 
                      ? 'line-through text-slate-500' 
                      : 'text-slate-700'
                  }`}>
                    {task.title}
                  </h4>
                  
                  {task.description && (
                    <p className={`text-xs mt-1 leading-4 ${
                      task.completed 
                        ? 'line-through text-slate-400' 
                        : 'text-slate-600'
                    }`}>
                      {task.description}
                    </p>
                  )}
                </div>

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-6 w-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <MoreVertical className="h-3 w-3" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-32">
                    <DropdownMenuItem onClick={handleEdit}>
                      <Edit className="h-3 w-3 mr-2" />
                      Edit
                    </DropdownMenuItem>
                    <DropdownMenuItem 
                      onClick={() => setShowDeleteDialog(true)}
                      className="text-red-600 focus:text-red-600"
                    >
                      <Trash2 className="h-3 w-3 mr-2" />
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>

              <div className="flex items-center gap-2 mt-2">
                <Badge
                  variant="secondary"
                  className={`text-xs px-2 py-0.5 ${categoryInfo.color} text-white`}
                >
                  {categoryInfo.label}
                </Badge>
                
                <Badge
                  variant="outline"
                  className={`text-xs px-2 py-0.5 border ${priorityInfo.color}`}
                >
                  {priorityInfo.label}
                </Badge>
                
                {task.time && (
                  <div className="flex items-center gap-1 text-xs text-slate-500">
                    <Clock className="h-3 w-3" />
                    <span>{task.time}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Task</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete "{task.title}"? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                onDelete();
                setShowDeleteDialog(false);
              }}
              className="bg-red-600 hover:bg-red-700"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}