// Performance utilities for the application
import React from 'react';

// Measure performance of a function
export const measurePerformance = async <T>(
  fn: () => T | Promise<T>,
  label: string
): Promise<{ result: T; duration: number }> => {
  const start = performance.now();
  const result = await Promise.resolve(fn());
  const end = performance.now();
  const duration = end - start;

  console.log(`${label} took ${duration.toFixed(2)} milliseconds`);

  return { result, duration };
};

// Debounce function with performance tracking
export const perfDebounce = <T extends (...args: any[]) => any>(
  func: T,
  delay: number,
  label: string = 'Debounced function'
) => {
  let timeoutId: NodeJS.Timeout;
  return ((...args: Parameters<T>) => {
    const start = performance.now();
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => {
      const end = performance.now();
      console.log(`${label} executed after ${delay}ms delay, actual execution took ${(end - start).toFixed(2)}ms`);
      func.apply(null, args);
    }, delay);
  }) as T;
};

// Lazy load images with intersection observer
export const lazyLoadImage = (img: HTMLImageElement) => {
  if ('IntersectionObserver' in window) {
    const imageObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const imgElement = entry.target as HTMLImageElement;
          imgElement.src = imgElement.dataset.src || '';
          imgElement.classList.remove('lazy');
          observer.unobserve(imgElement);
        }
      });
    });

    imageObserver.observe(img);
  } else {
    // Fallback for browsers that don't support Intersection Observer
    img.src = img.dataset.src || '';
  }
};

// Virtual scroll helper
export interface VirtualScrollOptions {
  containerHeight: number;
  itemHeight: number;
  itemCount: number;
  overscan?: number;
}

export const calculateVirtualItems = ({
  containerHeight,
  itemHeight,
  itemCount,
  overscan = 5
}: VirtualScrollOptions) => {
  const visibleCount = Math.ceil(containerHeight / itemHeight);
  const startIndex = Math.max(0, Math.floor(window.scrollY / itemHeight) - overscan);
  const endIndex = Math.min(itemCount - 1, startIndex + visibleCount + overscan * 2);

  return {
    startIndex,
    endIndex,
    offsetTop: startIndex * itemHeight
  };
};

// Memoize function with performance tracking
export const memoizeWithStats = <T extends (...args: any[]) => any>(
  fn: T,
  resolver?: (...args: Parameters<T>) => string
) => {
  const cache = new Map<string, ReturnType<T>>();
  let hits = 0;
  let misses = 0;

  return ((...args: Parameters<T>): ReturnType<T> => {
    const key = resolver ? resolver(...args) : JSON.stringify(args);
    
    if (cache.has(key)) {
      hits++;
      console.log(`Cache hit: ${hits}/${hits + misses} (${((hits/(hits+misses))*100).toFixed(2)}%)`);
      return cache.get(key)!;
    }
    
    misses++;
    const result = fn.apply(this, args);
    cache.set(key, result);
    console.log(`Cache miss: ${misses}/${hits + misses} (${((misses/(hits+misses))*100).toFixed(2)}%)`);
    
    return result;
  }) as T;
};

// Performance monitoring hook
export const usePerformanceMonitor = (componentName: string) => {
  React.useEffect(() => {
    const start = performance.now();
    
    return () => {
      const end = performance.now();
      console.log(`${componentName} unmounted after ${end - start}ms`);
    };
  }, []);
};

// Track memory usage (when available)
export const trackMemoryUsage = () => {
  if ('memory' in performance) {
    const memory = (performance as any).memory;
    console.log({
      usedJSHeapSize: memory.usedJSHeapSize,
      totalJSHeapSize: memory.totalJSHeapSize,
      jsHeapSizeLimit: memory.jsHeapSizeLimit
    });
  }
};

// Optimize rendering with requestAnimationFrame
export const rafBatchUpdate = (callback: () => void) => {
  if ('requestAnimationFrame' in window) {
    requestAnimationFrame(() => {
      callback();
    });
  } else {
    // Fallback for older browsers
    setTimeout(callback, 0);
  }
};

// Lazy component loader
export const lazyWithPerf = <T extends React.ComponentType<any>>(
  factory: () => Promise<{ default: T }>
) => {
  return React.lazy(() => {
    return measurePerformance(factory, 'Lazy component load').then(result => ({
      default: result.result.default
    }));
  });
};