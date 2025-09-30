import React, { useState, useRef, useEffect, useMemo } from 'react';
import { cn } from '@/lib/utils';

interface VirtualizedTableProps {
  data: any[];
  columns: {
    key: string;
    header: string;
    width?: number;
    render?: (value: any, row: any, index: number) => React.ReactNode;
  }[];
  rowHeight?: number;
  containerHeight?: number;
  className?: string;
  onRowClick?: (row: any, index: number) => void;
  selectedRows?: string[];
  onRowSelect?: (rowId: string, selected: boolean) => void;
  selectable?: boolean;
}

export function VirtualizedTable({
  data,
  columns,
  rowHeight = 48,
  containerHeight = 400,
  className,
  onRowClick,
  selectedRows = [],
  onRowSelect,
  selectable = false
}: VirtualizedTableProps) {
  const [scrollTop, setScrollTop] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const [containerWidth, setContainerWidth] = useState(0);

  // Calculate visible rows
  const visibleRows = useMemo(() => {
    const startIndex = Math.floor(scrollTop / rowHeight);
    const endIndex = Math.min(
      startIndex + Math.ceil(containerHeight / rowHeight) + 1,
      data.length
    );
    
    return {
      startIndex,
      endIndex,
      visibleItems: data.slice(startIndex, endIndex),
      totalHeight: data.length * rowHeight,
      offsetY: startIndex * rowHeight
    };
  }, [scrollTop, rowHeight, containerHeight, data]);

  // Handle scroll
  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    setScrollTop(e.currentTarget.scrollTop);
  };

  // Handle container resize
  useEffect(() => {
    const handleResize = () => {
      if (containerRef.current) {
        setContainerWidth(containerRef.current.clientWidth);
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Calculate column widths
  const columnWidths = useMemo(() => {
    const totalWidth = containerWidth;
    const fixedWidthColumns = columns.filter(col => col.width);
    const fixedWidth = fixedWidthColumns.reduce((sum, col) => sum + (col.width || 0), 0);
    const remainingWidth = totalWidth - fixedWidth;
    const flexibleColumns = columns.filter(col => !col.width);
    const flexibleWidth = flexibleColumns.length > 0 ? remainingWidth / flexibleColumns.length : 0;

    return columns.map(col => col.width || flexibleWidth);
  }, [columns, containerWidth]);

  return (
    <div
      ref={containerRef}
      className={cn("relative overflow-auto", className)}
      style={{ height: containerHeight }}
      onScroll={handleScroll}
    >
      {/* Header */}
      <div className="sticky top-0 z-10 bg-background border-b border-border">
        <div className="flex" style={{ width: visibleRows.totalHeight > 0 ? containerWidth : 'auto' }}>
          {selectable && (
            <div className="flex items-center justify-center p-2 border-r border-border" style={{ width: 48 }}>
              <input
                type="checkbox"
                checked={selectedRows.length === data.length && data.length > 0}
                onChange={(e) => {
                  // Handle select all
                  if (onRowSelect) {
                    data.forEach(row => onRowSelect(row.id || row.key, e.target.checked));
                  }
                }}
                className="rounded border-border"
              />
            </div>
          )}
          {columns.map((column, index) => (
            <div
              key={column.key}
              className="flex items-center p-2 font-semibold text-sm text-foreground border-r border-border last:border-r-0"
              style={{ width: columnWidths[index] }}
            >
              {column.header}
            </div>
          ))}
        </div>
      </div>

      {/* Virtualized Content */}
      <div style={{ height: visibleRows.totalHeight, position: 'relative' }}>
        <div
          style={{
            transform: `translateY(${visibleRows.offsetY}px)`,
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0
          }}
        >
          {visibleRows.visibleItems.map((row, index) => {
            const actualIndex = visibleRows.startIndex + index;
            const isSelected = selectedRows.includes(row.id || row.key);
            
            return (
              <div
                key={row.id || row.key || actualIndex}
                className={cn(
                  "flex border-b border-border hover:bg-muted/20 transition-colors cursor-pointer",
                  isSelected && "bg-accent/20"
                )}
                style={{ height: rowHeight }}
                onClick={() => onRowClick?.(row, actualIndex)}
              >
                {selectable && (
                  <div className="flex items-center justify-center p-2 border-r border-border" style={{ width: 48 }}>
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={(e) => {
                        e.stopPropagation();
                        onRowSelect?.(row.id || row.key, e.target.checked);
                      }}
                      className="rounded border-border"
                    />
                  </div>
                )}
                {columns.map((column, colIndex) => (
                  <div
                    key={column.key}
                    className="flex items-center p-2 text-sm text-foreground border-r border-border last:border-r-0 overflow-hidden"
                    style={{ width: columnWidths[colIndex] }}
                  >
                    {column.render 
                      ? column.render(row[column.key], row, actualIndex)
                      : String(row[column.key] || '')
                    }
                  </div>
                ))}
              </div>
            );
          })}
        </div>
      </div>

      {/* Empty State */}
      {data.length === 0 && (
        <div className="flex items-center justify-center h-32 text-muted-foreground">
          No data available
        </div>
      )}
    </div>
  );
}
