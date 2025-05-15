import { AppBar, Toolbar, Typography, Button } from '@mui/material';
import { Link } from 'react-router-dom';

const NavMenu = () => {
  return (
    <AppBar position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
      <Toolbar>
        <Button 
          component={Link} 
          to="/" 
          color="inherit" 
          sx={{ textTransform: 'none' }}
        >
          <Typography variant="h6" noWrap>
            Оптимизатор расписаний
          </Typography>
        </Button>
      </Toolbar>
    </AppBar>
  );
};

export default NavMenu;
