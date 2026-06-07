import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';
import Typography from '@mui/material/Typography';
import PropTypes from 'prop-types';
import { memo, useEffect, useMemo, useState } from 'react';

const containerStyles = {
  position: 'relative',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center'
};

const labelBoxStyles = {
  top: 0,
  left: 0,
  bottom: 0,
  right: 0,
  position: 'absolute',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
};

const typographyStyles = {
  color: 'text.secondary'
};

const CircularProgressWithLabel = memo(({ value, ...rest }) => {
  // ✅ Memoize the percentage string to avoid recalculation
  const percentage = useMemo(() => `${Math.round(value)}%`, [value]);

  return (
    <Box sx={containerStyles}>
      <CircularProgress size={60} variant="determinate" value={value} {...rest} />
      <Box sx={labelBoxStyles}>
        <Typography variant="h6" component="div" sx={typographyStyles}>
          {percentage}
        </Typography>
      </Box>
    </Box>
  );
});

CircularProgressWithLabel.displayName = 'CircularProgressWithLabel';

CircularProgressWithLabel.propTypes = {
  value: PropTypes.number.isRequired,
};

export default function CircularWithValueLabel() {
  const [progress, setProgress] = useState(10);

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress((prev) => (prev >= 100 ? 0 : prev + 10));
    }, 800);
    
    return () => clearInterval(timer);
  }, []);

  return <CircularProgressWithLabel value={progress} />;
}