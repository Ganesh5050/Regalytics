import React, { useState, useEffect, useRef } from 'react';
import { Search, X, Clock, Filter, ArrowRight } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from '@/components/ui/command';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { cn } from '@/lib/utils';

interface SearchResult {
  id: string;
  title: string;
  description: string;
  type: 'lead' | 'contact' | 'task' | 'deal' | 'document' | 'email' | 'client' | 'transaction' | 'alert';
  url: string;
  metadata?: Record<string, any>;
}

interface RecentSearch {
  query: string;
  timestamp: number;
}

const mockSearchResults: SearchResult[] = [
  {
    id: '1',
    title: 'John Smith',
    description: 'Lead - High Priority - $50,000 potential',
    type: 'lead',
    url: '/leads',
    metadata: { status: 'qualified', value: 50000 }
  },
  {
    id: '2',
    title: 'Acme Corporation',
    description: 'Client - Active - 15 transactions',
    type: 'client',
    url: '/clients',
    metadata: { status: 'active', transactions: 15 }
  },
  {
    id: '3',
    title: 'Follow up call',
    description: 'Task - Due tomorrow - High priority',
    type: 'task',
    url: '/tasks',
    metadata: { priority: 'high', dueDate: '2024-01-15' }
  },
  {
    id: '4',
    title: 'Q4 Sales Report',
    description: 'Document - PDF - 2.3 MB',
    type: 'document',
    url: '/documents',
    metadata: { size: '2.3 MB', type: 'PDF' }
  },
  {
    id: '5',
    title: 'Suspicious Transaction Alert',
    description: 'Alert - High Risk - $25,000',
    type: 'alert',
    url: '/alerts',
    metadata: { risk: 'high', amount: 25000 }
  }
];

const typeLabels = {
  lead: 'Lead',
  contact: 'Contact',
  task: 'Task',
  deal: 'Deal',
  document: 'Document',
  email: 'Email',
  client: 'Client',
  transaction: 'Transaction',
  alert: 'Alert'
};

const typeColors = {
  lead: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300',
  contact: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
  task: 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300',
  deal: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300',
  document: 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300',
  email: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300',
  client: 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-300',
  transaction: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300',
  alert: 'bg-pink-100 text-pink-800 dark:bg-pink-900 dark:text-pink-300'
};

export function GlobalSearch() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [recentSearches, setRecentSearches] = useState<RecentSearch[]>([]);
  const [selectedType, setSelectedType] = useState<string>('all');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    // Load recent searches from localStorage
    const saved = localStorage.getItem('regalytics-recent-searches');
    if (saved) {
      setRecentSearches(JSON.parse(saved));
    }
  }, []);

  useEffect(() => {
    if (query.length > 2) {
      // Simulate search
      const filtered = mockSearchResults.filter(result => {
        const matchesQuery = result.title.toLowerCase().includes(query.toLowerCase()) ||
                           result.description.toLowerCase().includes(query.toLowerCase());
        const matchesType = selectedType === 'all' || result.type === selectedType;
        return matchesQuery && matchesType;
      });
      setResults(filtered);
    } else {
      setResults([]);
    }
  }, [query, selectedType]);

  const handleSearch = (searchQuery: string) => {
    if (searchQuery.trim()) {
      // Add to recent searches
      const newRecent: RecentSearch = {
        query: searchQuery,
        timestamp: Date.now()
      };
      const updated = [newRecent, ...recentSearches.filter(r => r.query !== searchQuery)].slice(0, 5);
      setRecentSearches(updated);
      localStorage.setItem('regalytics-recent-searches', JSON.stringify(updated));
    }
  };

  const clearRecentSearches = () => {
    setRecentSearches([]);
    localStorage.removeItem('regalytics-recent-searches');
  };

  const handleResultClick = (result: SearchResult) => {
    handleSearch(query);
    setOpen(false);
    setQuery('');
    // Navigate to result (would use router in real app)
    console.log('Navigate to:', result.url);
  };

  const handleRecentClick = (recentQuery: string) => {
    setQuery(recentQuery);
    handleSearch(recentQuery);
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className={cn(
            "w-full justify-start text-sm text-muted-foreground sm:pr-12 md:w-40 lg:w-64",
            "hover:bg-accent hover:text-accent-foreground"
          )}
        >
          <Search className="mr-2 h-4 w-4" />
          <span className="hidden lg:inline-flex">Search everything...</span>
          <span className="lg:hidden">Search...</span>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-0" align="start">
        <Command>
          <div className="flex items-center border-b px-3">
            <Search className="mr-2 h-4 w-4 shrink-0 opacity-50" />
            <Input
              ref={inputRef}
              placeholder="Search leads, contacts, tasks..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="flex h-10 w-full rounded-md bg-transparent py-3 text-sm outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50 border-0 focus-visible:ring-0"
            />
            {query && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setQuery('')}
                className="h-6 w-6 p-0"
              >
                <X className="h-4 w-4" />
              </Button>
            )}
          </div>
          
          {/* Type Filter */}
          <div className="flex items-center gap-1 p-2 border-b">
            <Filter className="h-4 w-4 text-muted-foreground" />
            <div className="flex gap-1 overflow-x-auto">
              {['all', ...Object.keys(typeLabels)].map((type) => (
                <Button
                  key={type}
                  variant={selectedType === type ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setSelectedType(type)}
                  className="h-6 px-2 text-xs whitespace-nowrap"
                >
                  {type === 'all' ? 'All' : typeLabels[type as keyof typeof typeLabels]}
                </Button>
              ))}
            </div>
          </div>

          <CommandList>
            {query.length <= 2 && recentSearches.length > 0 && (
              <CommandGroup heading="Recent Searches">
                {recentSearches.map((recent, index) => (
                  <CommandItem
                    key={index}
                    onSelect={() => handleRecentClick(recent.query)}
                    className="flex items-center gap-2"
                  >
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    <span>{recent.query}</span>
                  </CommandItem>
                ))}
                <CommandItem onSelect={clearRecentSearches} className="text-muted-foreground">
                  <X className="h-4 w-4 mr-2" />
                  Clear recent searches
                </CommandItem>
              </CommandGroup>
            )}

            {query.length > 2 && results.length > 0 && (
              <CommandGroup heading="Search Results">
                {results.map((result) => (
                  <CommandItem
                    key={result.id}
                    onSelect={() => handleResultClick(result)}
                    className="flex items-center gap-3 p-3"
                  >
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <Badge className={cn("text-xs", typeColors[result.type])}>
                          {typeLabels[result.type]}
                        </Badge>
                        <span className="font-medium truncate">{result.title}</span>
                      </div>
                      <p className="text-sm text-muted-foreground truncate">
                        {result.description}
                      </p>
                    </div>
                    <ArrowRight className="h-4 w-4 text-muted-foreground" />
                  </CommandItem>
                ))}
              </CommandGroup>
            )}

            {query.length > 2 && results.length === 0 && (
              <CommandEmpty>No results found for "{query}"</CommandEmpty>
            )}

            {query.length <= 2 && recentSearches.length === 0 && (
              <CommandEmpty>
                <div className="text-center py-6">
                  <Search className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
                  <p className="text-sm text-muted-foreground">
                    Start typing to search across all modules
                  </p>
                </div>
              </CommandEmpty>
            )}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
