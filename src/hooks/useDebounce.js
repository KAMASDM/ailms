// src/hooks/useDebounce.js
import { useState, useEffect } from 'react';

/**
 * Custom hook that debounces a value
 * @param {any} value - The value to debounce
 * @param {number} delay - The delay in milliseconds
 * @returns {any} - The debounced value
 */
export const useDebounce = (value, delay) => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    // Set up a timer to update the debounced value after the specified delay
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    // Clean up the timer if the value changes before the delay is reached
    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
};

/**
 * Custom hook that provides a debounced callback function
 * @param {Function} callback - The callback function to debounce
 * @param {number} delay - The delay in milliseconds
 * @param {Array} deps - Dependencies array (like useCallback)
 * @returns {Function} - The debounced callback function
 */
export const useDebouncedCallback = (callback, delay, deps = []) => {
  const [debouncedCallback, setDebouncedCallback] = useState(null);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedCallback(() => callback);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [...deps, delay]);

  return debouncedCallback;
};

/**
 * Custom hook for debounced search functionality
 * @param {string} searchTerm - The search term to debounce
 * @param {number} delay - The delay in milliseconds (default: 300)
 * @returns {object} - Object containing debouncedSearchTerm and isSearching
 */
export const useDebouncedSearch = (searchTerm, delay = 300) => {
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState(searchTerm);
  const [isSearching, setIsSearching] = useState(false);

  useEffect(() => {
    setIsSearching(true);
    
    const handler = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
      setIsSearching(false);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [searchTerm, delay]);

  return {
    debouncedSearchTerm,
    isSearching
  };
};

export default useDebounce;