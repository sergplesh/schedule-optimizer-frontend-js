import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Drawer, 
  List, 
  ListItem, 
  ListItemButton, 
  ListItemText, 
  IconButton,
  Divider,
  CircularProgress,
  Alert,
  ListItemIcon
} from '@mui/material';
import { Link } from 'react-router-dom';
import { getAlgorithms } from '../../api';
import MenuIcon from '@mui/icons-material/Menu';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';

const drawerWidth = 240;

const Sidebar = () => {
  const [algorithms, setAlgorithms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [open, setOpen] = useState(true);

  useEffect(() => {
    const loadAlgorithms = async () => {
      try {
        const algorithms = await getAlgorithms();
        setAlgorithms(algorithms);
        setError(null);
      } catch (err) {
        setError(err.message || 'Failed to load algorithms');
      } finally {
        setLoading(false);
      }
    };

    loadAlgorithms();
  }, []);

  const toggleDrawer = () => {
    setOpen(!open);
  };

  if (loading) {
    return (
      <Drawer
        variant="permanent"
        open={open}
        sx={{
          width: open ? drawerWidth : 0,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: open ? drawerWidth : 0,
            boxSizing: 'border-box',
            transition: 'width 0.3s ease',
          },
        }}
      >
        <Box sx={{ p: 2, display: 'flex', justifyContent: 'center' }}>
          <CircularProgress size={24} />
        </Box>
      </Drawer>
    );
  }

  if (error) {
    return (
      <Drawer
        variant="permanent"
        open={open}
        sx={{
          width: open ? drawerWidth : 0,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: open ? drawerWidth : 0,
            boxSizing: 'border-box',
            transition: 'width 0.3s ease',
          },
        }}
      >
        <Box sx={{ p: 2 }}>
          <Alert severity="error">{error}</Alert>
        </Box>
      </Drawer>
    );
  }

  return (
    <Drawer
      variant="permanent"
      open={open}
      sx={{
        width: open ? drawerWidth : 0,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: open ? drawerWidth : 0,
          boxSizing: 'border-box',
          transition: 'width 0.3s ease',
          overflowX: 'hidden',
        },
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', p: 2 }}>
        <IconButton onClick={toggleDrawer}>
          {open ? <ChevronLeftIcon /> : <MenuIcon />}
        </IconButton>
      </Box>
      <Divider />
      
      <ListItem 
        disablePadding
        sx={{
          backgroundColor: 'primary.main',
          '&:hover': {
            backgroundColor: 'primary.main',
          }
        }}
      >
        <ListItemButton 
          component={Link} 
          to="/"
          sx={{
            '&:hover': {
              color: 'common.white',
            }
          }}
        >
          <ListItemIcon sx={{ color: 'inherit' }}>
          </ListItemIcon>
          <ListItemText 
            primary="Главная" 
            primaryTypographyProps={{ 
              fontWeight: 'bold',
              color: 'common.white'
            }} 
          />
        </ListItemButton>
      </ListItem>
      
      <Divider sx={{ my: 1 }} />
      
      <List>
        {algorithms.map((algorithm) => (
          <ListItem key={algorithm.name} disablePadding>
            <ListItemButton 
              component={Link} 
              to={`/algorithm/${algorithm.name}`}
              sx={{
                '&:hover': {
                  backgroundColor: 'action.hover',
                }
              }}
            >
              <ListItemText 
                primary={algorithm.title} 
                primaryTypographyProps={{ fontSize: '0.9rem' }}
              />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Drawer>
  );
};

export default Sidebar;
