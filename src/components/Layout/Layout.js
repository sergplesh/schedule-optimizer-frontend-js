import { Box, Container } from '@mui/material';
import NavMenu from './NavMenu';
import Sidebar from './Sidebar';

const Layout = ({ children }) => {
  return (
    <Box sx={{ display: 'flex' }}>
      <NavMenu />
      <Sidebar />
      <Container 
        component="main" 
        sx={{ 
          flexGrow: 1, 
          p: 3, 
          mt: 8,
          ml: 0,
          transition: 'margin-left 0.3s ease',
        }}
      >
        {children}
      </Container>
    </Box>
  );
};

export default Layout;