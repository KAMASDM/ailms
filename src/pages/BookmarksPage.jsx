// src/pages/BookmarksPage.jsx
import { Box, Typography } from '@mui/material';
import { PageHeader } from '../components/common';

const BookmarksPage = () => {
  return (
    <Box>
      <PageHeader
        title="Bookmarks"
        subtitle="Access your saved courses and lessons"
      />
      <Typography variant="body1">
        Bookmarks functionality will be implemented here.
      </Typography>
    </Box>
  );
};

export default BookmarksPage;