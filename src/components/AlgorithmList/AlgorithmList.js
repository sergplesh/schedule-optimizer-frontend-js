import React, { useState, useEffect } from 'react';
import { 
  List, 
  ListItem, 
  ListItemButton, 
  ListItemText, 
  CircularProgress, 
  Alert,
  Box,
  Typography
} from '@mui/material';
import { Link } from 'react-router-dom';
import { getAlgorithms } from '../../api';

const AlgorithmList = () => {
  const [algorithms, setAlgorithms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadAlgorithms = async () => {
      try {
        const data = await getAlgorithms();
        setAlgorithms(data);
        setError(null);
      } catch (err) {
        setError(err.message || 'Failed to load algorithms');
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
        No algorithms available. Please check back later.
      </Typography>
    );
  }

  return (
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
              secondary={algorithm.description}
              primaryTypographyProps={{ fontWeight: 'medium' }}
            />
          </ListItemButton>
        </ListItem>
      ))}
    </List>
  );
};

export default AlgorithmList;