'use client';

import { TASK_PRIORITIES, TaskPriority } from '@/lib/taskStore';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Search, X } from 'lucide-react';

interface TaskSearchProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  priorityFilter: string;
  onPriorityFilterChange: (priority: string) => void;
}

export function TaskSearch({
  searchQuery,
  onSearchChange,
  priorityFilter,
  onPriorityFilterChange,
}: TaskSearchProps) {
  return (
    <div className="space-y-3">
      <h3 className="text-sm font-medium text-slate-700">Search & Filter</h3>
      
      <div className="space-y-3">
        {/* Search Input */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
          <Input
            placeholder="Search tasks..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-9 h-9"
          />
          {searchQuery && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onSearchChange('')}
              className="absolute right-1 top-1/2 transform -translate-y-1/2 h-7 w-7 p-0 hover:bg-slate-100"
            >
              <X className="h-3 w-3" />
            </Button>
          )}
        </div>

        {/* Priority Filter */}
        <div className="space-y-1">
          <label className="text-xs text-slate-600">Priority Filter</label>
          <Select value={priorityFilter} onValueChange={onPriorityFilterChange}>
            <SelectTrigger className="h-9 text-sm">
              <SelectValue placeholder="All priorities" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">All Priorities</SelectItem>
              {Object.entries(TASK_PRIORITIES).map(([key, info]) => (
                <SelectItem key={key} value={key}>
                  <div className={`inline-flex items-center gap-2 ${(info as any).color}`}>
                    <div className={`w-2 h-2 rounded-full border-current`} />
                    {(info as any).label}
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Active Filters */}
        {(searchQuery || priorityFilter) && (
          <div className="flex items-center gap-2 text-xs">
            <span className="text-slate-500">Active filters:</span>
            {searchQuery && (
              <div className="bg-blue-50 text-blue-700 px-2 py-1 rounded border">
                Search: "{searchQuery}"
              </div>
            )}
            {priorityFilter && (
              <div className="bg-orange-50 text-orange-700 px-2 py-1 rounded border">
                Priority: {(TASK_PRIORITIES[priorityFilter as TaskPriority] as any).label}
              </div>
            )}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                onSearchChange('');
                onPriorityFilterChange('');
              }}
              className="h-6 px-2 text-xs hover:bg-slate-100"
            >
              Clear All
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}