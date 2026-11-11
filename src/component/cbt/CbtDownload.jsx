import {
    CheckCircleOutline as CheckIcon,
    Download as DownloadIcon,
    InfoOutlined as InfoIcon,
    Computer as WindowsIcon, // ← was: Windows as WindowsIcon
} from '@mui/icons-material';
import {
    Alert,
    Box,
    Button,
    Chip,
    Divider,
    Link as MuiLink,
    Paper,
    Stack,
    Typography,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';

const APP_VERSION = '1.0.0';
const DOWNLOAD_URL = '/downloads/cbt/Miqwii-CBT-1.0.0-x64.msi';
const FILE_SIZE = '2.81 MB';
const SHA256 = '200c2b4cea4e6e674b0b90d910a23fc6d5c0dd79e7e9903b01a992217a41164d';   // ← the 64-char hash from above

const CbtDownload = () => {
  const navigate = useNavigate();

  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = DOWNLOAD_URL;
    link.download = `Miqwii-CBT-${APP_VERSION}-x64.msi`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        p: { xs: 2, sm: 4 },
        background: 'radial-gradient(ellipse at 50% 50%, hsl(210, 100%, 97%), hsl(0, 0%, 100%))',
        display: 'flex',
        justifyContent: 'center',
      }}
    >
      <Paper
        sx={{
          maxWidth: 720,
          width: '100%',
          p: { xs: 3, sm: 5 },
          borderRadius: '15px',
          boxShadow:
            'hsla(220, 30%, 5%, 0.05) 0px 5px 15px 0px, hsla(220, 25%, 10%, 0.05) 0px 15px 35px -5px',
        }}
      >
        <Stack alignItems="center" spacing={1.5} sx={{ mb: 4 }}>
          <WindowsIcon sx={{ fontSize: 64, color: '#0e387a' }} />
          <Typography variant="h4" sx={{ color: '#0e387a', fontWeight: 700, textAlign: 'center' }}>
            Miqwii CBT for Windows
          </Typography>
          <Typography sx={{ color: '#9a99ac', fontSize: 16, textAlign: 'center' }}>
            Download the secure desktop app for taking CBT exams
          </Typography>
          <Chip
            label={`Version ${APP_VERSION} · ${FILE_SIZE}`}
            size="small"
            sx={{ backgroundColor: '#eef3fb', color: '#0e387a', fontWeight: 600 }}
          />
        </Stack>

        <Button
          variant="contained"
          onClick={handleDownload}
          startIcon={<DownloadIcon />}
          fullWidth
          sx={{
            py: 2,
            borderRadius: '15px',
            backgroundColor: '#0e387a',
            fontSize: 18,
            textTransform: 'none',
            '&:hover': { backgroundColor: '#0c3371' },
          }}
        >
          Download for Windows (64-bit)
        </Button>

        <Typography variant="caption" sx={{ display: 'block', textAlign: 'center', mt: 1, color: '#9a99ac' }}>
          Windows 10 / 11 · x64 · Free
        </Typography>

        <Box sx={{ mt: 3, p: 2, background: '#f9f9f9', borderRadius: '10px', border: '1px solid #eee' }}>
          <Typography sx={{ fontSize: 13, color: '#555', fontWeight: 600, mb: 0.5 }}>
            SHA-256 checksum
          </Typography>
          <Typography component="code" sx={{ fontSize: 11, color: '#333', fontFamily: 'monospace', wordBreak: 'break-all', display: 'block' }}>
            {SHA256}
          </Typography>
          <Typography sx={{ fontSize: 12, color: '#9a99ac', mt: 1 }}>
            Verify with PowerShell:{' '}
            <code style={{ background: '#eee', padding: '2px 6px', borderRadius: 4, fontSize: 11 }}>
              Get-FileHash .\Miqwii-CBT-{APP_VERSION}-x64.msi -Algorithm SHA256
            </code>
          </Typography>
        </Box>

        <Divider sx={{ my: 4 }} />

        <Typography variant="h6" sx={{ color: '#0e387a', mb: 2 }}>How to install</Typography>
        <Stack spacing={1.5} sx={{ mb: 4 }}>
          {[
            'Click the download button above.',
            'Open the downloaded file (Miqwii-CBT-1.0.0-x64.msi).',
            'If Windows SmartScreen appears, click "More info" → "Run anyway".',
            'Follow the installer — click "Next" → "Install" → "Finish".',
            'Find "Miqwii CBT" on your desktop and double-click to launch.',
          ].map((step, i) => (
            <Stack key={i} direction="row" spacing={1.5} alignItems="flex-start">
              <Box sx={{ minWidth: 24, height: 24, borderRadius: '50%', backgroundColor: '#0e387a', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, fontWeight: 700, mt: '2px' }}>
                {i + 1}
              </Box>
              <Typography sx={{ fontSize: 15, color: '#333' }}>{step}</Typography>
            </Stack>
          ))}
        </Stack>

        <Divider sx={{ my: 4 }} />

        <Typography variant="h6" sx={{ color: '#0e387a', mb: 2 }}>System requirements</Typography>
        <Stack spacing={1} sx={{ mb: 4 }}>
          {[
            'Windows 10 version 1809 or later, or Windows 11',
            '64-bit processor (x64)',
            '~10 MB free disk space',
            'Internet connection for accessing exams',
          ].map((req) => (
            <Stack key={req} direction="row" spacing={1} alignItems="center">
              <CheckIcon sx={{ fontSize: 18, color: '#388E3C' }} />
              <Typography sx={{ fontSize: 14, color: '#555' }}>{req}</Typography>
            </Stack>
          ))}
        </Stack>

        <Alert severity="warning" icon={<InfoIcon />} sx={{ fontSize: 14, borderRadius: '10px', mb: 3 }}>
          <strong>Only for CBT exams.</strong> This app requires the exam to be assigned to you by your school. Log in with your student credentials to see if an exam is available.
        </Alert>

        <Typography variant="h6" sx={{ color: '#0e387a', mb: 2 }}>Frequently asked questions</Typography>
        <Stack spacing={2}>
          {[
            { q: 'Is this safe to install?', a: 'Yes. The app is signed with our developer certificate. If Windows shows a SmartScreen warning, click "More info" → "Run anyway". This is normal for new applications.' },
            { q: 'Do I need admin rights to install?', a: 'Yes, the installer needs administrator permission. If you don\'t have admin rights, contact your school\'s IT department.' },
            { q: 'What if it says "No exam assigned"?', a: 'This means your teacher hasn\'t scheduled a live exam for your class yet, or the exam window has ended. Check with your teacher.' },
            { q: 'Can I take the exam in a web browser?', a: 'No. The CBT exam is only accessible through this desktop app for security reasons.' },
            { q: 'How do I uninstall?', a: 'Settings → Apps → Installed apps → find "Miqwii CBT" → Uninstall.' },
          ].map(({ q, a }) => (
            <Box key={q}>
              <Typography sx={{ fontWeight: 600, color: '#0e387a', mb: 0.5, fontSize: 15 }}>{q}</Typography>
              <Typography sx={{ fontSize: 14, color: '#666', lineHeight: 1.6 }}>{a}</Typography>
            </Box>
          ))}
        </Stack>

        <Box sx={{ textAlign: 'center', mt: 5 }}>
          <Typography sx={{ fontSize: 13, color: '#9a99ac' }}>
            Need help?{' '}
            <MuiLink
              onClick={() => navigate('/contact-us')}
              sx={{ color: '#0e387a', cursor: 'pointer', fontWeight: 600 }}
            >
              Contact support
            </MuiLink>
          </Typography>
        </Box>
      </Paper>
    </Box>
  );
};

export default CbtDownload;