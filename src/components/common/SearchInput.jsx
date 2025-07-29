// src/components/common/SearchInput.jsx
import React, { useState, useCallback } from 'react';
import {
  TextField,
  InputAdornment,
  IconButton,
  Box,
  Chip,
  Autocomplete,
  Paper,
  Typography
} from '@mui/material';
import {
  Search as SearchIcon,
  Clear as ClearIcon,
  FilterList as FilterIcon
} from '@mui/icons-material';
import { useDebounce } from '../../hooks/useDebounce';

const SearchInput = ({
  value = '',
  onChange,
  onSearch,
  placeholder = 'Search...',
  suggestions = [],
  filters = [],
  onFilterChange,
  debounceDelay = 300,
  showFilters = false,
  fullWidth = true,
  size = 'medium',
  variant = 'outlined'
}) => {
  const [searchValue, setSearchValue] = useState(value);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [selectedFilters, setSelectedFilters] = useState([]);

  const debouncedSearch = useDebounce(searchValue, debounceDelay);

  // Call search function when debounced value changes
  React.useEffect(() => {
    if (onSearch && debouncedSearch !== value) {
      onSearch(debouncedSearch);
    }
  }, [debouncedSearch, onSearch, value]);

  const handleInputChange = (event, newValue) => {
    const inputValue = typeof newValue === 'string' ? newValue : event.target.value;
    setSearchValue(inputValue);
    
    if (onChange) {
      onChange(inputValue);
    }
  };

  const handleClear = () => {
    setSearchValue('');
    if (onChange) {
      onChange('');
    }
    if (onSearch) {
      onSearch('');
    }
  };

  const handleFilterToggle = (filter) => {
    const newFilters = selectedFilters.includes(filter)
      ? selectedFilters.filter(f => f !== filter)
      : [...selectedFilters, filter];
    
    setSelectedFilters(newFilters);
    if (onFilterChange) {
      onFilterChange(newFilters);
    }
  };

  const handleKeyPress = (event) => {
    if (event.key === 'Enter' && onSearch) {
      onSearch(searchValue);
    }
  };

  return (
    <Box sx={{ width: fullWidth ? '100%' : 'auto' }}>
      {suggestions.length > 0 ? (
        <Autocomplete
          freeSolo
          options={suggestions}
          value={searchValue}
          onChange={handleInputChange}
          onInputChange={handleInputChange}
          renderInput={(params) => (
            <TextField
              {...params}
              placeholder={placeholder}
              variant={variant}
              size={size}
              fullWidth={fullWidth}
              onKeyPress={handleKeyPress}
              InputProps={{
                ...params.InputProps,
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon color="action" />
                  </InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment position="end">
                    {searchValue && (
                      <IconButton size="small" onClick={handleClear}>
                        <ClearIcon />
                      </IconButton>
                    )}
                    {showFilters && (
                      <IconButton size="small">
                        <FilterIcon />
                      </IconButton>
                    )}
                  </InputAdornment>
                )
              }}
            />
          )}
          renderOption={(props, option) => (
            <Box component="li" {...props}>
              <SearchIcon sx={{ mr: 2, color: 'action.active' }} />
              {option}
            </Box>
          )}
          PaperComponent={({ children, ...props }) => (
            <Paper {...props} sx={{ mt: 1 }}>
              {children}
            </Paper>
          )}
        />
      ) : (
        <TextField
          value={searchValue}
          onChange={handleInputChange}
          onKeyPress={handleKeyPress}
          placeholder={placeholder}
          variant={variant}
          size={size}
          fullWidth={fullWidth}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon color="action" />
              </InputAdornment>
            ),
            endAdornment: (
              <InputAdornment position="end">
                {searchValue && (
                  <IconButton size="small" onClick={handleClear}>
                    <ClearIcon />
                  </IconButton>
                )}
                {showFilters && (
                  <IconButton size="small">
                    <FilterIcon />
                  </IconButton>
                )}
              </InputAdornment>
            )
          }}
        />
      )}

      {/* Filters */}
      {showFilters && filters.length > 0 && (
        <Box sx={{ mt: 2, display: 'flex', flexWrap: 'wrap', gap: 1 }}>
          <Typography variant="body2" sx={{ mr: 1, alignSelf: 'center' }}>
            Filters:
          </Typography>
          {filters.map((filter) => (
            <Chip
              key={filter}
              label={filter}
              onClick={() => handleFilterToggle(filter)}
              variant={selectedFilters.includes(filter) ? 'filled' : 'outlined'}
              size="small"
              clickable
            />
          ))}
        </Box>
      )}
    </Box>
  );
};

export default SearchInput;