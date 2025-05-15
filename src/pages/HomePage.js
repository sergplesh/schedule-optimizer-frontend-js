import { Box, Typography, Paper, Alert } from '@mui/material';
import AlgorithmList from '../components/AlgorithmList/AlgorithmList';

const HomePage = () => {
  return (
    <Box sx={{ maxWidth: 800, mx: 'auto', p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Оптимизатор расписаний
      </Typography>
      
      <Paper elevation={3} sx={{ p: 3, mb: 3 }}>
        <Typography paragraph>
          Добро пожаловать в приложение для оптимизации расписаний. 
          Выберите алгоритм из списка для начала работы.
        </Typography>
      </Paper>

      <Box sx={{ mt: 4 }}>
        <Typography variant="h6" gutterBottom>
          Доступные алгоритмы:
        </Typography>
        <AlgorithmList />
      </Box>
    </Box>
  );
};

export default HomePage;
