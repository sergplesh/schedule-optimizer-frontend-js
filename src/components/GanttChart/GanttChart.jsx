import React from 'react';
import { 
  Box, 
  Typography, 
  Paper, 
  Divider,
  Tooltip,
  useTheme
} from '@mui/material';

const GanttChart = ({ data }) => {
  const theme = useTheme();

  // Защита от отсутствия данных
  if (!data || !data.workers || !Array.isArray(data.workers)) {
    return (
      <Paper elevation={3} sx={{ p: 3, mt: 3 }}>
        <Typography color="error">
          Нет данных для отображения диаграммы Ганта
        </Typography>
      </Paper>
    );
  }

  // Функция для генерации цвета на основе ID
  const getStageColor = (jobId, stageNum) => {
    const colors = [
      theme.palette.primary.main,
      theme.palette.secondary.main,
      theme.palette.error.main,
      theme.palette.warning.main,
      theme.palette.info.main,
      theme.palette.success.main
    ];
    return colors[(jobId + stageNum) % colors.length];
  };

  return (
    <Paper elevation={3} sx={{ p: 3, mt: 3, overflowX: 'auto' }}>
      <Typography variant="h6" gutterBottom>
        Диаграмма Ганта
      </Typography>
      <Divider sx={{ mb: 3 }} />

      {data.workers.map(worker => (
        <Box key={worker.workerId || worker.name} sx={{ mb: 4 }}>
          <Typography variant="subtitle1" sx={{ mb: 1 }}>
            {worker.workerName || `Worker ${worker.workerId}`}
          </Typography>
          
          {/* Контейнер для диаграммы */}
          <Box sx={{ 
            position: 'relative',
            height: '60px',
            bgcolor: theme.palette.grey[100],
            borderRadius: '4px',
            mb: 2
          }}>
            {/* Шкала времени */}
            {data.timeScale?.map((time, idx) => (
              <Box key={idx} sx={{
                position: 'absolute',
                left: `${(time.time / data.totalDuration) * 100}%`,
                width: '1px',
                height: '100%',
                bgcolor: theme.palette.grey[400],
                '&::after': {
                  content: `"${time.label}"`,
                  position: 'absolute',
                  top: '100%',
                  left: '50%',
                  transform: 'translateX(-50%)',
                  fontSize: '0.75rem',
                  mt: 0.5
                }
              }} />
            ))}
            
            {/* Элементы диаграммы */}
            {worker.stages?.map((stage, idx) => {
              if (!stage.start && stage.start !== 0) return null;
              
              const left = (stage.start / data.totalDuration) * 100;
              const width = Math.max(
                2, // Минимальная ширина для видимости
                ((stage.duration / data.totalDuration) * 100)
              );

              return (
                <Tooltip 
                  key={idx}
                  title={`${stage.jobId}.${stage.stageNum} (${stage.start.toFixed(1)}-${stage.end.toFixed(1)})`}
                  arrow
                >
                  <Box sx={{
                    position: 'absolute',
                    left: `${left}%`,
                    width: `${width}%`,
                    height: '40px',
                    bgcolor: getStageColor(stage.jobId, stage.stageNum),
                    borderRadius: '4px',
                    top: '10px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'white',
                    fontWeight: 'bold',
                    fontSize: '0.8rem',
                    boxShadow: 1,
                    transition: 'all 0.2s',
                    '&:hover': {
                      transform: 'scale(1.02)',
                      boxShadow: 3
                    }
                  }}>
                    {stage.jobId}.{stage.stageNum}
                  </Box>
                </Tooltip>
              );
            })}
          </Box>
        </Box>
      ))}
      
      {data.totalDuration && (
        <Typography sx={{ mt: 2, fontWeight: 'bold' }}>
          Общая длительность: {data.totalDuration.toFixed(1)}
        </Typography>
      )}
    </Paper>
  );
};

export default GanttChart;
