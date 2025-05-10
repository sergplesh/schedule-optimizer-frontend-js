import { Box, Typography, Button } from '@mui/material';
import { Link } from 'react-router-dom';

const NotFoundPage = () => {
  return (
    <Box textAlign="center" mt={10}>
      <Typography variant="h3" gutterBottom>
        404 - Страница не найдена
      </Typography>
      <Typography variant="body1" paragraph>
        Запрошенная страница не существует или была перемещена.
      </Typography>
      <Button 
        variant="contained" 
        component={Link} 
        to="/" 
        sx={{ mt: 2 }}
      >
        На главную
      </Button>
    </Box>
  );
};

export default NotFoundPage;