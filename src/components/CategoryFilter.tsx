'use client';

import { TASK_CATEGORIES, TaskCategory } from '@/lib/taskStore';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface CategoryFilterProps {
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
}

export function CategoryFilter({ selectedCategory, onCategoryChange }: CategoryFilterProps) {
  return (
    <div className="space-y-3">
      <h3 className="text-sm font-medium text-slate-700">Filter by Category</h3>
      
      <div className="flex flex-wrap gap-2">
        <Button
          variant={selectedCategory === '' ? 'default' : 'outline'}
          size="sm"
          onClick={() => onCategoryChange('')}
          className="h-7 text-xs"
        >
          All Categories
        </Button>
        
        {Object.entries(TASK_CATEGORIES).map(([key, info]) => (
          <Button
            key={key}
            variant={selectedCategory === key ? 'default' : 'outline'}
            size="sm"
            onClick={() => onCategoryChange(key)}
            className="h-7 text-xs"
          >
            <div className={`w-2 h-2 rounded-full ${(info as any).color} mr-1.5`} />
            {(info as any).label}
          </Button>
        ))}
      </div>
      
      {selectedCategory && (
        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-500">Active filter:</span>
          <Badge variant="secondary" className="text-xs">
            <div className={`w-2 h-2 rounded-full ${(TASK_CATEGORIES[selectedCategory as TaskCategory] as any).color} mr-1.5`} />
            {(TASK_CATEGORIES[selectedCategory as TaskCategory] as any).label}
          </Badge>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onCategoryChange('')}
            className="h-5 px-2 text-xs hover:bg-slate-100"
          >
            Clear
          </Button>
        </div>
      )}
    </div>
  );
}