import React, { useState, useMemo } from 'react';
import { 
  ChevronDown, 
  ChevronUp, 
  MoreHorizontal,
  ArrowUpDown,
  Filter,
  Download
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { BulkActions } from './BulkActions';

export interface Column<T> {
  key: keyof T | string;
  label: string;
  sortable?: boolean;
  filterable?: boolean;
  render?: (value: any, row: T) => React.ReactNode;
  width?: string;
  align?: 'left' | 'center' | 'right';
}

interface DataTableProps<T> {
  data: T[];
  columns: Column<T>[];
  onRowClick?: (row: T) => void;
  onRowSelect?: (row: T, selected: boolean) => void;
  onBulkDelete?: (items: T[]) => void;
  onBulkUpdate?: (items: T[], updates: Record<string, any>) => void;
  onBulkExport?: (items: T[]) => void;
  onBulkEmail?: (items: T[]) => void;
  onBulkTag?: (items: T[], tag: string) => void;
  onBulkArchive?: (items: T[]) => void;
  itemType: 'leads' | 'contacts' | 'tasks' | 'deals' | 'documents' | 'emails';
  searchable?: boolean;
  searchPlaceholder?: string;
  className?: string;
  getRowId: (row: T) => string;
}

export function DataTable<T>({
  data,
  columns,
  onRowClick,
  onRowSelect,
  onBulkDelete,
  onBulkUpdate,
  onBulkExport,
  onBulkEmail,
  onBulkTag,
  onBulkArchive,
  itemType,
  searchable = true,
  searchPlaceholder = "Search...",
  className,
  getRowId
}: DataTableProps<T>) {
  const [selectedRows, setSelectedRows] = useState<Set<string>>(new Set());
  const [sortConfig, setSortConfig] = useState<{ key: string; direction: 'asc' | 'desc' } | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState<Record<string, string>>({});

  const filteredAndSortedData = useMemo(() => {
    let filtered = data;

    // Apply search
    if (searchTerm) {
      filtered = filtered.filter(row => {
        return columns.some(column => {
          const value = column.key === 'id' ? getRowId(row) : (row as any)[column.key];
          return String(value).toLowerCase().includes(searchTerm.toLowerCase());
        });
      });
    }

    // Apply filters
    Object.entries(filters).forEach(([key, value]) => {
      if (value) {
        filtered = filtered.filter(row => {
          const rowValue = (row as any)[key];
          return String(rowValue).toLowerCase().includes(value.toLowerCase());
        });
      }
    });

    // Apply sorting
    if (sortConfig) {
      filtered.sort((a, b) => {
        const aValue = (a as any)[sortConfig.key];
        const bValue = (b as any)[sortConfig.key];
        
        if (aValue < bValue) {
          return sortConfig.direction === 'asc' ? -1 : 1;
        }
        if (aValue > bValue) {
          return sortConfig.direction === 'asc' ? 1 : -1;
        }
        return 0;
      });
    }

    return filtered;
  }, [data, searchTerm, filters, sortConfig, columns, getRowId]);

  const handleSort = (key: string) => {
    setSortConfig(prev => {
      if (prev?.key === key) {
        return prev.direction === 'asc' 
          ? { key, direction: 'desc' }
          : null;
      }
      return { key, direction: 'asc' };
    });
  };

  const handleSelectRow = (row: T, selected: boolean) => {
    const rowId = getRowId(row);
    setSelectedRows(prev => {
      const newSet = new Set(prev);
      if (selected) {
        newSet.add(rowId);
      } else {
        newSet.delete(rowId);
      }
      return newSet;
    });
    onRowSelect?.(row, selected);
  };

  const handleSelectAll = () => {
    if (selectedRows.size === filteredAndSortedData.length) {
      setSelectedRows(new Set());
    } else {
      setSelectedRows(new Set(filteredAndSortedData.map(getRowId)));
    }
  };

  const handleClearSelection = () => {
    setSelectedRows(new Set());
  };

  const selectedItems = filteredAndSortedData.filter(row => 
    selectedRows.has(getRowId(row))
  );

  const handleBulkAction = (action: string, ...args: any[]) => {
    switch (action) {
      case 'delete':
        onBulkDelete?.(selectedItems);
        break;
      case 'update':
        onBulkUpdate?.(selectedItems, args[0]);
        break;
      case 'export':
        onBulkExport?.(selectedItems);
        break;
      case 'email':
        onBulkEmail?.(selectedItems);
        break;
      case 'tag':
        onBulkTag?.(selectedItems, args[0]);
        break;
      case 'archive':
        onBulkArchive?.(selectedItems);
        break;
    }
    handleClearSelection();
  };

  const getSortIcon = (key: string) => {
    if (sortConfig?.key !== key) {
      return <ArrowUpDown className="h-4 w-4 text-muted-foreground" />;
    }
    return sortConfig.direction === 'asc' 
      ? <ChevronUp className="h-4 w-4" />
      : <ChevronDown className="h-4 w-4" />;
  };

  return (
    <div className={cn("space-y-4", className)}>
      {/* Search and Filters */}
      {searchable && (
        <div className="flex items-center gap-4">
          <div className="relative flex-1 max-w-sm">
            <Input
              placeholder={searchPlaceholder}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-8"
            />
            <Filter className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          </div>
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>
      )}

      {/* Bulk Actions */}
      {(onBulkDelete || onBulkUpdate || onBulkExport || onBulkEmail || onBulkTag || onBulkArchive) && (
        <BulkActions
          selectedItems={Array.from(selectedRows)}
          totalItems={filteredAndSortedData.length}
          onSelectAll={handleSelectAll}
          onClearSelection={handleClearSelection}
          onBulkDelete={(items) => handleBulkAction('delete')}
          onBulkUpdate={(items, updates) => handleBulkAction('update', updates)}
          onBulkExport={(items) => handleBulkAction('export')}
          onBulkEmail={(items) => handleBulkAction('email')}
          onBulkTag={(items, tag) => handleBulkAction('tag', tag)}
          onBulkArchive={(items) => handleBulkAction('archive')}
          itemType={itemType}
        />
      )}

      {/* Table */}
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              {onRowSelect && (
                <TableHead className="w-12">
                  <Checkbox
                    checked={selectedRows.size === filteredAndSortedData.length && filteredAndSortedData.length > 0}
                    onCheckedChange={handleSelectAll}
                  />
                </TableHead>
              )}
              {columns.map((column) => (
                <TableHead 
                  key={String(column.key)}
                  className={cn(
                    column.sortable && "cursor-pointer hover:bg-muted/50",
                    column.align === 'center' && "text-center",
                    column.align === 'right' && "text-right"
                  )}
                  style={{ width: column.width }}
                  onClick={() => column.sortable && handleSort(String(column.key))}
                >
                  <div className="flex items-center gap-2">
                    {column.label}
                    {column.sortable && getSortIcon(String(column.key))}
                  </div>
                </TableHead>
              ))}
              <TableHead className="w-12"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredAndSortedData.map((row) => {
              const rowId = getRowId(row);
              const isSelected = selectedRows.has(rowId);
              
              return (
                <TableRow
                  key={rowId}
                  className={cn(
                    "cursor-pointer hover:bg-muted/50",
                    isSelected && "bg-muted/50"
                  )}
                  onClick={() => onRowClick?.(row)}
                >
                  {onRowSelect && (
                    <TableCell onClick={(e) => e.stopPropagation()}>
                      <Checkbox
                        checked={isSelected}
                        onCheckedChange={(checked) => handleSelectRow(row, checked as boolean)}
                      />
                    </TableCell>
                  )}
                  {columns.map((column) => {
                    const value = column.key === 'id' ? rowId : (row as any)[column.key];
                    return (
                      <TableCell 
                        key={String(column.key)}
                        className={cn(
                          column.align === 'center' && "text-center",
                          column.align === 'right' && "text-right"
                        )}
                      >
                        {column.render ? column.render(value, row) : String(value)}
                      </TableCell>
                    );
                  })}
                  <TableCell onClick={(e) => e.stopPropagation()}>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>View Details</DropdownMenuItem>
                        <DropdownMenuItem>Edit</DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="text-destructive">Delete</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>

      {/* Results Summary */}
      <div className="flex items-center justify-between text-sm text-muted-foreground">
        <span>
          Showing {filteredAndSortedData.length} of {data.length} {itemType}
        </span>
        {selectedRows.size > 0 && (
          <span>
            {selectedRows.size} selected
          </span>
        )}
      </div>
    </div>
  );
}
