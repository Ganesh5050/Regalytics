import React from 'react';
import { cn } from '@/lib/utils';

interface LoadingSkeletonProps {
  className?: string;
  variant?: 'text' | 'rectangular' | 'circular';
  width?: string | number;
  height?: string | number;
  animation?: 'pulse' | 'wave' | 'none';
}

export function LoadingSkeleton({
  className,
  variant = 'rectangular',
  width,
  height,
  animation = 'pulse'
}: LoadingSkeletonProps) {
  const baseClasses = 'bg-muted/50 rounded';
  
  const variantClasses = {
    text: 'h-4 w-full',
    rectangular: 'w-full h-4',
    circular: 'rounded-full w-4 h-4'
  };

  const animationClasses = {
    pulse: 'animate-pulse',
    wave: 'animate-pulse bg-gradient-to-r from-muted/50 via-muted/30 to-muted/50 bg-[length:200%_100%] animate-[shimmer_2s_infinite]',
    none: ''
  };

  const style = {
    width: width || undefined,
    height: height || undefined
  };

  return (
    <div
      className={cn(
        baseClasses,
        variantClasses[variant],
        animationClasses[animation],
        className
      )}
      style={style}
    />
  );
}

// Pre-built skeleton components
export function TableSkeleton({ rows = 5, columns = 4 }: { rows?: number; columns?: number }) {
  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex space-x-4">
        {Array.from({ length: columns }).map((_, i) => (
          <LoadingSkeleton key={i} variant="text" className="h-6" />
        ))}
      </div>
      
      {/* Rows */}
      {Array.from({ length: rows }).map((_, rowIndex) => (
        <div key={rowIndex} className="flex space-x-4">
          {Array.from({ length: columns }).map((_, colIndex) => (
            <LoadingSkeleton key={colIndex} variant="text" className="h-4" />
          ))}
        </div>
      ))}
    </div>
  );
}

export function CardSkeleton() {
  return (
    <div className="space-y-4 p-6 border border-border rounded-lg">
      <div className="flex items-center space-x-4">
        <LoadingSkeleton variant="circular" width={40} height={40} />
        <div className="space-y-2 flex-1">
          <LoadingSkeleton variant="text" className="h-4 w-3/4" />
          <LoadingSkeleton variant="text" className="h-3 w-1/2" />
        </div>
      </div>
      <div className="space-y-2">
        <LoadingSkeleton variant="text" className="h-3 w-full" />
        <LoadingSkeleton variant="text" className="h-3 w-5/6" />
        <LoadingSkeleton variant="text" className="h-3 w-4/6" />
      </div>
    </div>
  );
}

export function DashboardSkeleton() {
  return (
    <div className="space-y-8 p-8">
      {/* Header */}
      <div className="space-y-4">
        <LoadingSkeleton variant="text" className="h-8 w-1/3" />
        <LoadingSkeleton variant="text" className="h-4 w-1/2" />
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="p-6 border border-border rounded-lg space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-2">
                <LoadingSkeleton variant="text" className="h-3 w-20" />
                <LoadingSkeleton variant="text" className="h-6 w-16" />
              </div>
              <LoadingSkeleton variant="circular" width={32} height={32} />
            </div>
          </div>
        ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {Array.from({ length: 2 }).map((_, i) => (
          <div key={i} className="p-6 border border-border rounded-lg space-y-4">
            <LoadingSkeleton variant="text" className="h-6 w-1/3" />
            <LoadingSkeleton variant="rectangular" className="h-64 w-full" />
          </div>
        ))}
      </div>
    </div>
  );
}

export function ListSkeleton({ items = 5 }: { items?: number }) {
  return (
    <div className="space-y-4">
      {Array.from({ length: items }).map((_, i) => (
        <div key={i} className="flex items-center space-x-4 p-4 border border-border rounded-lg">
          <LoadingSkeleton variant="circular" width={40} height={40} />
          <div className="space-y-2 flex-1">
            <LoadingSkeleton variant="text" className="h-4 w-1/3" />
            <LoadingSkeleton variant="text" className="h-3 w-1/2" />
          </div>
          <LoadingSkeleton variant="text" className="h-6 w-16" />
        </div>
      ))}
    </div>
  );
}
