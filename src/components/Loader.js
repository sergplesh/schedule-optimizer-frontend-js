import { CircularProgress, Box } from '@mui/material';

const Loader = ({ fullScreen = false }) => {
  return (
    <Box 
      display="flex" 
      justifyContent="center" 
      alignItems="center"
      sx={{
        height: fullScreen ? '100vh' : 'auto',
        width: fullScreen ? '100vw' : 'auto',
        position: fullScreen ? 'fixed' : 'static',
        top: 0,
        left: 0,
        zIndex: 9999,
        backgroundColor: fullScreen ? 'rgba(0,0,0,0.5)' : 'transparent'
      }}
    >
      <CircularProgress size={fullScreen ? 80 : 40} />
    </Box>
  );
};

export default Loader;