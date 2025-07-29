// src/components/certificates/CertificateGenerator.jsx
import { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  Grid,
  Paper,
  Avatar,
  Divider,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions
} from '@mui/material';
import {
  Download as DownloadIcon,
  Share as ShareIcon,
  Print as PrintIcon,
  Verified as VerifiedIcon,
  School as SchoolIcon,
  EmojiEvents as TrophyIcon
} from '@mui/icons-material';
import { PageHeader } from '../common';
import { formatDate } from '../../utils/helpers';
import { useAuth } from '../../hooks/useAuth';

const CertificateGenerator = ({ course, completionData }) => {
  const { user } = useAuth();
  const [previewOpen, setPreviewOpen] = useState(false);

  const certificateData = {
    studentName: user?.displayName || 'Student Name',
    courseName: course?.title || 'Course Title',
    completionDate: completionData?.completedAt || new Date(),
    instructorName: course?.instructor?.name || 'Instructor Name',
    duration: course?.duration || 0,
    score: completionData?.finalScore || 0,
    certificateId: `CERT-${Date.now()}`,
    skills: course?.skills || ['AI', 'Machine Learning']
  };

  const handleDownload = () => {
    // Implementation for PDF generation
    console.log('Downloading certificate...');
  };

  const handleShare = () => {
    // Implementation for sharing certificate
    const shareData = {
      title: `Certificate of Completion - ${certificateData.courseName}`,
      text: `I've successfully completed ${certificateData.courseName} and earned my certificate!`,
      url: window.location.href
    };

    if (navigator.share) {
      navigator.share(shareData);
    } else {
      navigator.clipboard.writeText(shareData.text + ' ' + shareData.url);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const renderCertificate = () => (
    <Paper
      sx={{
        p: 6,
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        color: 'white',
        textAlign: 'center',
        minHeight: '600px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        position: 'relative',
        overflow: 'hidden',
        '@media print': {
          backgroundColor: 'white !important',
          color: 'black !important'
        }
      }}
    >
      {/* Decorative Elements */}
      <Box
        sx={{
          position: 'absolute',
          top: -50,
          left: -50,
          width: 200,
          height: 200,
          borderRadius: '50%',
          background: 'rgba(255,255,255,0.1)',
          zIndex: 0
        }}
      />
      <Box
        sx={{
          position: 'absolute',
          bottom: -50,
          right: -50,
          width: 300,
          height: 300,
          borderRadius: '50%',
          background: 'rgba(255,255,255,0.1)',
          zIndex: 0
        }}
      />

      {/* Certificate Content */}
      <Box sx={{ position: 'relative', zIndex: 1 }}>
        {/* Header */}
        <Box sx={{ mb: 4 }}>
          <TrophyIcon sx={{ fontSize: 80, mb: 2 }} />
          <Typography variant="h3" fontWeight="bold" gutterBottom>
            Certificate of Completion
          </Typography>
          <Typography variant="h6" sx={{ opacity: 0.9 }}>
            AI Learning Platform
          </Typography>
        </Box>

        {/* Main Content */}
        <Box sx={{ mb: 4 }}>
          <Typography variant="h6" gutterBottom>
            This is to certify that
          </Typography>
          <Typography variant="h3" fontWeight="bold" sx={{ mb: 3, textDecoration: 'underline' }}>
            {certificateData.studentName}
          </Typography>
          <Typography variant="h6" gutterBottom>
            has successfully completed the course
          </Typography>
          <Typography variant="h4" fontWeight="bold" sx={{ mb: 3 }}>
            {certificateData.courseName}
          </Typography>
          <Typography variant="body1" sx={{ mb: 2 }}>
            with a final score of <strong>{certificateData.score}%</strong>
          </Typography>
          <Typography variant="body1">
            on {formatDate(certificateData.completionDate)}
          </Typography>
        </Box>

        {/* Footer */}
        <Box sx={{ mt: 6, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Box sx={{ textAlign: 'left' }}>
            <Typography variant="body2" gutterBottom>
              Instructor
            </Typography>
            <Typography variant="h6" fontWeight="bold">
              {certificateData.instructorName}
            </Typography>
          </Box>
          
          <Box sx={{ textAlign: 'center' }}>
            <VerifiedIcon sx={{ fontSize: 40, mb: 1 }} />
            <Typography variant="caption" display="block">
              Certificate ID: {certificateData.certificateId}
            </Typography>
          </Box>
          
          <Box sx={{ textAlign: 'right' }}>
            <Typography variant="body2" gutterBottom>
              Platform
            </Typography>
            <Typography variant="h6" fontWeight="bold">
              AI Learn
            </Typography>
          </Box>
        </Box>
      </Box>
    </Paper>
  );

  return (
    <Box>
      <PageHeader
        title="Course Certificate"
        subtitle="Download and share your achievement"
        actions={[
          {
            label: 'Preview',
            onClick: () => setPreviewOpen(true),
            variant: 'outlined'
          },
          {
            label: 'Download PDF',
            icon: <DownloadIcon />,
            onClick: handleDownload,
            variant: 'contained'
          }
        ]}
      />

      <Grid container spacing={3}>
        {/* Certificate Preview */}
        <Grid item xs={12} md={8}>
          <Card>
            <CardContent sx={{ p: 0 }}>
              {renderCertificate()}
            </CardContent>
          </Card>
        </Grid>

        {/* Certificate Details */}
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Certificate Details
              </Typography>
              
              <Box sx={{ mb: 3 }}>
                <Typography variant="subtitle2" color="text.secondary">
                  Course
                </Typography>
                <Typography variant="body1" fontWeight="medium">
                  {certificateData.courseName}
                </Typography>
              </Box>

              <Box sx={{ mb: 3 }}>
                <Typography variant="subtitle2" color="text.secondary">
                  Completion Date
                </Typography>
                <Typography variant="body1">
                  {formatDate(certificateData.completionDate)}
                </Typography>
              </Box>

              <Box sx={{ mb: 3 }}>
                <Typography variant="subtitle2" color="text.secondary">
                  Final Score
                </Typography>
                <Typography variant="body1" fontWeight="bold" color="success.main">
                  {certificateData.score}%
                </Typography>
              </Box>

              <Box sx={{ mb: 3 }}>
                <Typography variant="subtitle2" color="text.secondary">
                  Skills Acquired
                </Typography>
                <Box sx={{ mt: 1 }}>
                  {certificateData.skills.map((skill, index) => (
                    <Box key={index} sx={{ display: 'inline-block', mr: 1, mb: 1 }}>
                      <Typography variant="body2" sx={{ 
                        bgcolor: 'primary.light', 
                        color: 'primary.main',
                        px: 1,
                        py: 0.5,
                        borderRadius: 1,
                        display: 'inline-block'
                      }}>
                        {skill}
                      </Typography>
                    </Box>
                  ))}
                </Box>
              </Box>

              <Box sx={{ mb: 3 }}>
                <Typography variant="subtitle2" color="text.secondary">
                  Certificate ID
                </Typography>
                <Typography variant="body2" fontFamily="monospace">
                  {certificateData.certificateId}
                </Typography>
              </Box>

              <Divider sx={{ my: 2 }} />

              <Box sx={{ display: 'flex', gap: 1 }}>
                <Button
                  variant="contained"
                  startIcon={<DownloadIcon />}
                  onClick={handleDownload}
                  fullWidth
                >
                  Download
                </Button>
                <IconButton onClick={handleShare}>
                  <ShareIcon />
                </IconButton>
                <IconButton onClick={handlePrint}>
                  <PrintIcon />
                </IconButton>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Preview Dialog */}
      <Dialog
        open={previewOpen}
        onClose={() => setPreviewOpen(false)}
        maxWidth="lg"
        fullWidth
      >
        <DialogTitle>Certificate Preview</DialogTitle>
        <DialogContent>
          {renderCertificate()}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setPreviewOpen(false)}>Close</Button>
          <Button variant="contained" onClick={handleDownload}>
            Download PDF
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default CertificateGenerator;