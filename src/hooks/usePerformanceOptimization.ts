import { useCallback, useMemo, useRef, useEffect } from 'react';

/**
 * Custom hook for performance optimization utilities
 */
export function usePerformanceOptimization() {
  const performanceMetrics = useRef({
    renderCount: 0,
    lastRenderTime: 0,
    averageRenderTime: 0
  });

  // Track render performance
  useEffect(() => {
    const startTime = performance.now();
    
    return () => {
      const endTime = performance.now();
      const renderTime = endTime - startTime;
      
      performanceMetrics.current.renderCount++;
      performanceMetrics.current.lastRenderTime = renderTime;
      performanceMetrics.current.averageRenderTime = 
        (performanceMetrics.current.averageRenderTime + renderTime) / 2;
    };
  });

  // Debounce function for search inputs
  const useDebounce = useCallback((callback: Function, delay: number) => {
    const timeoutRef = useRef<NodeJS.Timeout>();
    
    return useCallback((...args: any[]) => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      
      timeoutRef.current = setTimeout(() => {
        callback(...args);
      }, delay);
    }, [callback, delay]);
  }, []);

  // Throttle function for scroll events
  const useThrottle = useCallback((callback: Function, delay: number) => {
    const lastCall = useRef(0);
    
    return useCallback((...args: any[]) => {
      const now = Date.now();
      
      if (now - lastCall.current >= delay) {
        lastCall.current = now;
        callback(...args);
      }
    }, [callback, delay]);
  }, []);

  // Memoized search function
  const createMemoizedSearch = useCallback((data: any[], searchFields: string[]) => {
    return useMemo(() => {
      return (searchTerm: string) => {
        if (!searchTerm.trim()) return data;
        
        const term = searchTerm.toLowerCase();
        return data.filter(item => 
          searchFields.some(field => 
            String(item[field]).toLowerCase().includes(term)
          )
        );
      };
    }, [data, searchFields]);
  }, []);

  // Memoized filter function
  const createMemoizedFilter = useCallback((data: any[]) => {
    return useMemo(() => {
      return (filters: Record<string, any>) => {
        return data.filter(item => {
          return Object.entries(filters).every(([key, value]) => {
            if (!value || (Array.isArray(value) && value.length === 0)) {
              return true;
            }
            
            if (Array.isArray(value)) {
              return value.includes(item[key]);
            }
            
            if (typeof value === 'object' && value.min !== undefined && value.max !== undefined) {
              return item[key] >= value.min && item[key] <= value.max;
            }
            
            return item[key] === value;
          });
        });
      };
    }, [data]);
  }, []);

  // Virtual scrolling helper
  const useVirtualScroll = useCallback((itemHeight: number, containerHeight: number) => {
    return useMemo(() => {
      return (scrollTop: number, totalItems: number) => {
        const startIndex = Math.floor(scrollTop / itemHeight);
        const endIndex = Math.min(
          startIndex + Math.ceil(containerHeight / itemHeight) + 1,
          totalItems
        );
        
        return {
          startIndex,
          endIndex,
          visibleItems: endIndex - startIndex,
          totalHeight: totalItems * itemHeight,
          offsetY: startIndex * itemHeight
        };
      };
    }, [itemHeight, containerHeight]);
  }, []);

  // Lazy loading helper
  const useLazyLoad = useCallback((threshold: number = 0.1) => {
    const observerRef = useRef<IntersectionObserver>();
    
    const observe = useCallback((element: HTMLElement, callback: () => void) => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
      
      observerRef.current = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            callback();
          }
        },
        { threshold }
      );
      
      observerRef.current.observe(element);
    }, [threshold]);

    const unobserve = useCallback(() => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    }, []);

    return { observe, unobserve };
  }, []);

  // Performance monitoring
  const getPerformanceMetrics = useCallback(() => {
    return {
      ...performanceMetrics.current,
      memoryUsage: (performance as any).memory ? {
        used: (performance as any).memory.usedJSHeapSize,
        total: (performance as any).memory.totalJSHeapSize,
        limit: (performance as any).memory.jsHeapSizeLimit
      } : null
    };
  }, []);

  // Cleanup function
  const cleanup = useCallback(() => {
    performanceMetrics.current = {
      renderCount: 0,
      lastRenderTime: 0,
      averageRenderTime: 0
    };
  }, []);

  return {
    useDebounce,
    useThrottle,
    createMemoizedSearch,
    createMemoizedFilter,
    useVirtualScroll,
    useLazyLoad,
    getPerformanceMetrics,
    cleanup
  };
}
