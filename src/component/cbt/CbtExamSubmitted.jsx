import { Box, Button, Paper, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const CbtExamSubmitted = () => {
  const navigate = useNavigate();
  return (
    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', p: 3 }}>
      <Paper sx={{ p: 5, maxWidth: 500, textAlign: 'center', borderRadius: '15px' }}>
        <Typography variant="h4" sx={{ color: '#0e387a', mb: 2 }}>
          Exam Submitted ✓
        </Typography>
        <Typography sx={{ color: '#555', mb: 4 }}>
          Your answers have been recorded. You may close this window.
        </Typography>
        <Button
          variant="contained"
          onClick={() => navigate('/cbt/login')}
          sx={{ backgroundColor: '#0e387a', borderRadius: '15px' }}
        >
          Back to Login
        </Button>
      </Paper>
    </Box>
  );
};

export default CbtExamSubmitted;