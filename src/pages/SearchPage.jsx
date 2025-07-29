// src/pages/SearchPage.jsx
import { Box, Typography } from '@mui/material';
import { PageHeader, SearchInput } from '../components/common';

const SearchPage = () => {
  return (
    <Box>
      <PageHeader
        title="Search"
        subtitle="Find courses, quizzes, and learning materials"
      />
      <Box sx={{ mb: 3 }}>
        <SearchInput
          placeholder="Search for courses, topics, or instructors..."
          onSearch={(query) => console.log('Search:', query)}
        />
      </Box>
      <Typography variant="body1">
        Search results will be displayed here.
      </Typography>
    </Box>
  );
};

export default SearchPage;