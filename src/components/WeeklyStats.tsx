'use client';

import { Task, TASK_CATEGORIES } from '@/lib/taskStore';
import { getTaskStats } from '@/lib/taskUtils';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';

interface WeeklyStatsProps {
  tasks: Task[];
}

export function WeeklyStats({ tasks }: WeeklyStatsProps) {
  const stats = getTaskStats(tasks);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {/* Overview Stats */}
      <Card className="border-0 shadow-md bg-gradient-to-br from-blue-50 to-indigo-50">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-blue-700">
            Weekly Progress
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-2xl font-bold text-blue-900">
                {stats.completionRate}%
              </span>
              <span className="text-sm text-blue-600">
                {stats.completed}/{stats.total}
              </span>
            </div>
            <Progress 
              value={stats.completionRate} 
              className="h-2 bg-blue-100"
            />
          </div>
        </CardContent>
      </Card>

      {/* Total Tasks */}
      <Card className="border-0 shadow-md bg-gradient-to-br from-green-50 to-emerald-50">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-green-700">
            Total Tasks
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="text-2xl font-bold text-green-900">
              {stats.total}
            </div>
            <div className="flex gap-2">
              <Badge variant="secondary" className="bg-green-100 text-green-700 text-xs">
                Active: {stats.total - stats.completed}
              </Badge>
              <Badge variant="secondary" className="bg-emerald-100 text-emerald-700 text-xs">
                Done: {stats.completed}
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Priority Breakdown */}
      <Card className="border-0 shadow-md bg-gradient-to-br from-orange-50 to-amber-50">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-orange-700">
            By Priority
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="flex justify-between text-xs">
              <span className="text-red-600">High: {stats.byPriority.high || 0}</span>
              <span className="text-yellow-600">Med: {stats.byPriority.medium || 0}</span>
              <span className="text-green-600">Low: {stats.byPriority.low || 0}</span>
            </div>
            <div className="flex h-2 bg-slate-200 rounded-full overflow-hidden">
              {stats.byPriority.high > 0 && (
                <div 
                  className="bg-red-500"
                  style={{ width: `${(stats.byPriority.high / stats.total) * 100}%` }}
                />
              )}
              {stats.byPriority.medium > 0 && (
                <div 
                  className="bg-yellow-500"
                  style={{ width: `${(stats.byPriority.medium / stats.total) * 100}%` }}
                />
              )}
              {stats.byPriority.low > 0 && (
                <div 
                  className="bg-green-500"
                  style={{ width: `${(stats.byPriority.low / stats.total) * 100}%` }}
                />
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Category Distribution */}
      <Card className="border-0 shadow-md bg-gradient-to-br from-purple-50 to-pink-50">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-purple-700">
            Categories
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-1">
            {Object.entries(stats.byCategory).map(([category, count]) => {
              const categoryInfo = TASK_CATEGORIES[category as keyof typeof TASK_CATEGORIES];
              if (count === 0) return null;
              
              return (
                <div key={category} className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-1">
                    <div className={`w-2 h-2 rounded-full ${categoryInfo.color}`} />
                    <span className="text-slate-600">{categoryInfo.label}</span>
                  </div>
                  <span className="font-medium text-slate-700">{count}</span>
                </div>
              );
            })}
            
            {stats.total === 0 && (
              <div className="text-xs text-slate-500 text-center py-2">
                No tasks this week
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}