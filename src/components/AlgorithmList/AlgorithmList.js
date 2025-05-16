import React, { useState, useEffect } from 'react';
import { 
  List, 
  ListItem, 
  ListItemButton, 
  ListItemText, 
  ListItemIcon,
  CircularProgress, 
  Alert,
  Box,
  Typography,
  Paper,
  Chip,
  Divider,
  useTheme
} from '@mui/material';
import { Link } from 'react-router-dom';
import { getAlgorithms } from '../../api';
import ScheduleIcon from '@mui/icons-material/Schedule';

const AlgorithmList = () => {
  const [algorithms, setAlgorithms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const theme = useTheme();

  useEffect(() => {
    const loadAlgorithms = async () => {
      try {
        const data = await getAlgorithms();
        setAlgorithms(data);
        setError(null);
      } catch (err) {
        setError(err.message || 'Не удалось загрузить алгоритмы');
      } finally {
        setLoading(false);
      }
    };

    loadAlgorithms();
  }, []);

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" p={3}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Alert severity="error" sx={{ m: 2 }}>
        {error}
      </Alert>
    );
  }

  if (algorithms.length === 0) {
    return (
      <Typography variant="body1" sx={{ p: 2 }}>
        Нет доступных алгоритмов
      </Typography>
    );
  }

  return (
    <Paper 
      elevation={3} 
      sx={{ 
        borderRadius: 2,
        overflow: 'hidden',
        mb: 3
      }}
    >
      <List disablePadding>
        {algorithms.map((algorithm, index) => (
          <React.Fragment key={algorithm.name}>
            <ListItem disablePadding>
              <ListItemButton 
                component={Link} 
                to={`/algorithm/${algorithm.name}`}
                sx={{
                  px: 3,
                  py: 2,
                  '&:hover': {
                    backgroundColor: theme.palette.action.hover,
                  },
                  transition: 'background-color 0.2s ease'
                }}
              >
                <ListItemIcon sx={{ minWidth: 40 }}>
                  <ScheduleIcon color="primary" />
                </ListItemIcon>
                <ListItemText 
                  primary={
                    <Typography 
                      variant="subtitle1" 
                      fontWeight="medium"
                      color="text.primary"
                    >
                      {algorithm.title}
                    </Typography>
                  }
                  secondary={
                    <Typography 
                      variant="body2" 
                      color="text.secondary"
                      sx={{
                        display: '-webkit-box',
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis'
                      }}
                    >
                      {algorithm.description}
                    </Typography>
                  }
                  sx={{ my: 0 }}
                />
                <Chip 
                  label="Перейти" 
                  size="small" 
                  color="primary" 
                  variant="outlined"
                  sx={{ 
                    ml: 2,
                    borderRadius: 1,
                    fontSize: '0.75rem'
                  }}
                />
              </ListItemButton>
            </ListItem>
            {index < algorithms.length - 1 && (
              <Divider variant="middle" component="li" />
            )}
          </React.Fragment>
        ))}
      </List>
    </Paper>
  );
};

export default AlgorithmList;
