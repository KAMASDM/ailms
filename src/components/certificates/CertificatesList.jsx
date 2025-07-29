// src/components/certificates/CertificatesList.jsx
import { useState, useEffect } from 'react';
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  Button,
  Avatar,
  Chip,
  IconButton,
  Menu,
  MenuItem,
  Alert,
  LinearProgress
} from '@mui/material';
import {
  Download as DownloadIcon,
  Share as ShareIcon,
  Visibility as ViewIcon,
  MoreVert as MoreIcon,
  Verified as VerifiedIcon,
  School as SchoolIcon
} from '@mui/icons-material';
import { PageHeader } from '../common';
import { formatDate } from '../../utils/helpers';
import { useAuth } from '../../hooks/useAuth';
import { useNavigate } from 'react-router-dom';

const CertificatesList = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [certificates, setCertificates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [menuAnchor, setMenuAnchor] = useState(null);
  const [selectedCertificate, setSelectedCertificate] = useState(null);

  useEffect(() => {
    loadCertificates();
  }, []);

  const loadCertificates = async () => {
    setLoading(true);
    try {
      // Mock certificates data - replace with actual API call
      const mockCertificates = [
        {
          id: 1,
          courseId: 1,
          courseName: 'Deep Learning Fundamentals',
          instructor: {
            name: 'Dr. Sarah Chen',
            avatar: '/api/placeholder/40/40'
          },
          completedAt: new Date('2024-01-20'),
          finalScore: 92,
          certificateId: 'CERT-DL-2024-001',
          status: 'issued',
          category: 'Deep Learning',
          duration: 480, // minutes
          skills: ['Neural Networks', 'Backpropagation', 'Deep Learning']
        },
        {
          id: 2,
          courseId: 2,
          courseName: 'Computer Vision Basics',
          instructor: {
            name: 'Prof. Mike Johnson',
            avatar: '/api/placeholder/40/40'
          },
          completedAt: new Date('2024-01-15'),
          finalScore: 88,
          certificateId: 'CERT-CV-2024-002',
          status: 'issued',
          category: 'Computer Vision',
          duration: 360,
          skills: ['Image Processing', 'CNNs', 'Object Detection']
        },
        {
          id: 3,
          courseId: 3,
          courseName: 'Machine Learning Ethics',
          instructor: {
            name: 'Dr. Emily Davis',
            avatar: '/api/placeholder/40/40'
          },
          completedAt: new Date('2024-01-10'),
          finalScore: 95,
          certificateId: 'CERT-ETH-2024-003',
          status: 'issued',
          category: 'AI Ethics',
          duration: 240,
          skills: ['Ethics', 'Bias Detection', 'Responsible AI']
        }
      ];

      setCertificates(mockCertificates);
    } catch (error) {
      console.error('Error loading certificates:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleMenuClick = (event, certificate) => {
    setMenuAnchor(event.currentTarget);
    setSelectedCertificate(certificate);
  };

  const handleMenuClose = () => {
    setMenuAnchor(null);
    setSelectedCertificate(null);
  };

  const handleView = (certificate) => {
    navigate(`/certificates/${certificate.id}`);
    handleMenuClose();
  };

  const handleDownload = (certificate) => {
    // Implementation for downloading certificate
    console.log('Downloading certificate:', certificate.certificateId);
    handleMenuClose();
  };

  const handleShare = (certificate) => {
    const shareData = {
      title: `Certificate - ${certificate.courseName}`,
      text: `I've earned a certificate in ${certificate.courseName}!`,
      url: `${window.location.origin}/certificates/${certificate.id}`
    };

    if (navigator.share) {
      navigator.share(shareData);
    } else {
      navigator.clipboard.writeText(shareData.text + ' ' + shareData.url);
    }
    handleMenuClose();
  };

  const getScoreColor = (score) => {
    if (score >= 90) return 'success';
    if (score >= 80) return 'warning';
    return 'default';
  };

  const renderCertificateCard = (certificate) => (
    <Card
      key={certificate.id}
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        position: 'relative',
        '&:hover': {
          boxShadow: 3
        }
      }}
    >
      <CardContent sx={{ flex: 1, p: 3 }}>
        {/* Header */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <VerifiedIcon sx={{ color: 'success.main', mr: 1 }} />
            <Typography variant="h6" fontWeight="bold">
              Certificate
            </Typography>
          </Box>
          <IconButton
            size="small"
            onClick={(e) => handleMenuClick(e, certificate)}
          >
            <MoreIcon />
          </IconButton>
        </Box>

        {/* Course Info */}
        <Box sx={{ mb: 3 }}>
          <Typography variant="h6" gutterBottom>
            {certificate.courseName}
          </Typography>
          <Chip
            label={certificate.category}
            size="small"
            variant="outlined"
            sx={{ mb: 2 }}
          />
          
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <Avatar
              src={certificate.instructor.avatar}
              sx={{ width: 32, height: 32, mr: 1 }}
            />
            <Typography variant="body2" color="text.secondary">
              {certificate.instructor.name}
            </Typography>
          </Box>
        </Box>

        {/* Certificate Details */}
        <Box sx={{ mb: 3 }}>
          <Typography variant="body2" color="text.secondary" gutterBottom>
            Completion Date
          </Typography>
          <Typography variant="body1" fontWeight="medium">
            {formatDate(certificate.completedAt)}
          </Typography>
        </Box>

        <Box sx={{ mb: 3 }}>
          <Typography variant="body2" color="text.secondary" gutterBottom>
            Final Score
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Typography variant="h6" fontWeight="bold" color={`${getScoreColor(certificate.finalScore)}.main`}>
              {certificate.finalScore}%
            </Typography>
            <Chip
              label={certificate.finalScore >= 90 ? 'Excellent' : certificate.finalScore >= 80 ? 'Good' : 'Pass'}
              size="small"
              color={getScoreColor(certificate.finalScore)}
            />
          </Box>
        </Box>

        {/* Skills */}
        <Box sx={{ mb: 3 }}>
          <Typography variant="body2" color="text.secondary" gutterBottom>
            Skills Acquired
          </Typography>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
            {certificate.skills.slice(0, 3).map((skill, index) => (
              <Chip
                key={index}
                label={skill}
                size="small"
                variant="outlined"
              />
            ))}
            {certificate.skills.length > 3 && (
              <Chip
                label={`+${certificate.skills.length - 3} more`}
                size="small"
                variant="outlined"
                color="primary"
              />
            )}
          </Box>
        </Box>

        {/* Certificate ID */}
        <Box sx={{ mb: 3 }}>
          <Typography variant="body2" color="text.secondary" gutterBottom>
            Certificate ID
          </Typography>
          <Typography variant="caption" fontFamily="monospace" sx={{ 
            bgcolor: 'grey.100', 
            p: 0.5, 
            borderRadius: 0.5,
            display: 'inline-block'
          }}>
            {certificate.certificateId}
          </Typography>
        </Box>

        {/* Actions */}
        <Box sx={{ display: 'flex', gap: 1, mt: 'auto' }}>
          <Button
            variant="contained"
            startIcon={<ViewIcon />}
            onClick={() => handleView(certificate)}
            size="small"
            fullWidth
          >
            View
          </Button>
          <Button
            variant="outlined"
            startIcon={<DownloadIcon />}
            onClick={() => handleDownload(certificate)}
            size="small"
          >
            Download
          </Button>
        </Box>
      </CardContent>
    </Card>
  );

  if (loading) {
    return (
      <Box>
        <PageHeader
          title="My Certificates"
          subtitle="View and download your course completion certificates"
        />
        <LinearProgress />
      </Box>
    );
  }

  return (
    <Box>
      <PageHeader
        title="My Certificates"
        subtitle="View and download your course completion certificates"
      />

      {certificates.length === 0 ? (
        <Alert severity="info" sx={{ mb: 3 }}>
          <Typography variant="body1" gutterBottom>
            You haven't earned any certificates yet.
          </Typography>
          <Typography variant="body2">
            Complete courses to earn certificates and showcase your achievements!
          </Typography>
          <Button
            variant="contained"
            onClick={() => navigate('/courses')}
            sx={{ mt: 2 }}
          >
            Browse Courses
          </Button>
        </Alert>
      ) : (
        <>
          {/* Stats */}
          <Grid container spacing={3} sx={{ mb: 4 }}>
            <Grid item xs={12} sm={4}>
              <Card>
                <CardContent sx={{ textAlign: 'center' }}>
                  <SchoolIcon sx={{ fontSize: 40, color: 'primary.main', mb: 1 }} />
                  <Typography variant="h4" fontWeight="bold" color="primary">
                    {certificates.length}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Certificates Earned
                  </Typography>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} sm={4}>
              <Card>
                <CardContent sx={{ textAlign: 'center' }}>
                  <VerifiedIcon sx={{ fontSize: 40, color: 'success.main', mb: 1 }} />
                  <Typography variant="h4" fontWeight="bold" color="success.main">
                    {Math.round(certificates.reduce((sum, cert) => sum + cert.finalScore, 0) / certificates.length)}%
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Average Score
                  </Typography>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} sm={4}>
              <Card>
                <CardContent sx={{ textAlign: 'center' }}>
                  <Typography variant="h4" sx={{ mb: 1 }}>🏆</Typography>
                  <Typography variant="h4" fontWeight="bold" color="warning.main">
                    {certificates.filter(cert => cert.finalScore >= 90).length}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Excellence Awards
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          </Grid>

          {/* Certificates Grid */}
          <Grid container spacing={3}>
            {certificates.map((certificate) => (
              <Grid item xs={12} sm={6} md={4} key={certificate.id}>
                {renderCertificateCard(certificate)}
              </Grid>
            ))}
          </Grid>
        </>
      )}

      {/* Context Menu */}
      <Menu
        anchorEl={menuAnchor}
        open={Boolean(menuAnchor)}
        onClose={handleMenuClose}
      >
        <MenuItem onClick={() => handleView(selectedCertificate)}>
          <ViewIcon sx={{ mr: 1 }} />
          View Certificate
        </MenuItem>
        <MenuItem onClick={() => handleDownload(selectedCertificate)}>
          <DownloadIcon sx={{ mr: 1 }} />
          Download PDF
        </MenuItem>
        <MenuItem onClick={() => handleShare(selectedCertificate)}>
          <ShareIcon sx={{ mr: 1 }} />
          Share
        </MenuItem>
      </Menu>
    </Box>
  );
};

export default CertificatesList;