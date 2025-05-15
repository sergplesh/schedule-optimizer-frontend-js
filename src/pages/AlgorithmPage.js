import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { 
  Box, 
  Typography, 
  CircularProgress, 
  Alert, 
  Paper
} from '@mui/material';
import AlgorithmForm from '../components/AlgorithmForm/AlgorithmForm';
import GanttChart from '../components/GanttChart/GanttChart';
import { getAlgorithmDefinition, getAlgorithmResult } from '../api';

const AlgorithmPage = () => {
  const { algorithmName } = useParams();
  const [definition, setDefinition] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [result, setResult] = useState(null);
  const [prevAlgorithm, setPrevAlgorithm] = useState(null);

  useEffect(() => {
    if (algorithmName !== prevAlgorithm) {
      setResult(null);
      setPrevAlgorithm(algorithmName);
    }
  }, [algorithmName, prevAlgorithm]);

  useEffect(() => {
    const loadAlgorithm = async () => {
      try {
        setLoading(true);
        setError(null);
        const def = await getAlgorithmDefinition(algorithmName);
        setDefinition(def);
      } catch (err) {
        setError(err.response?.data?.message || err.message || 'Ошибка загрузки алгоритма');
      } finally {
        setLoading(false);
      }
    };

    loadAlgorithm();
  }, [algorithmName]);

  const handleSubmit = async (values) => {
    try {
      setLoading(true);
      setError(null);
      setResult(null);
      
      const response = await getAlgorithmResult(algorithmName, values);
      setResult(response);
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Ошибка выполнения алгоритма');
    } finally {
      setLoading(false);
    }
  };

  // const renderResult = () => {
  //   if (!result) return null;

  //   // Безопасное преобразование schedule в массив
  //   const scheduleArray = Array.isArray(result.schedule) 
  //     ? result.schedule 
  //     : (result.schedule ? [result.schedule] : []);

  //   return (
  //     <>
  //       <Paper elevation={3} sx={{ p: 3, mt: 3 }}>
  //         <Typography variant="h6" gutterBottom>
  //           Основные результаты:
  //         </Typography>
          
  //         <Box sx={{ mt: 2 }}>
  //           {result.optimal_time && (
  //             <Typography>
  //               <strong>Оптимальное время:</strong> {result.optimal_time}
  //             </Typography>
  //           )}
            
  //           {scheduleArray.length > 0 && (
  //             <Typography sx={{ mt: 1 }}>
  //               <strong>Порядок работ:</strong> {scheduleArray.join(' → ')}
  //             </Typography>
  //           )}

  //           {result.schedule_details && (
  //             <Box sx={{ mt: 2, whiteSpace: 'pre-line' }}>
  //               <Typography variant="subtitle2" gutterBottom>
  //                 Детали расписания:
  //               </Typography>
  //               <Typography component="div" sx={{ 
  //                 p: 1, 
  //                 bgcolor: '#f5f5f5', 
  //                 borderRadius: 1,
  //                 fontFamily: 'monospace'
  //               }}>
  //                 {result.schedule_details}
  //               </Typography>
  //             </Box>
  //           )}
  //         </Box>
  //       </Paper>

  //       {result.gantt_data && <GanttChart data={result.gantt_data} />}
  //     </>
  //   );
  // };
  const renderResult = () => {
  if (!result) return null;

  // Безопасное преобразование schedule в массив
  const scheduleArray = Array.isArray(result.schedule) 
    ? result.schedule 
    : (result.schedule ? [result.schedule] : []);

  return (
    <>
      <Paper elevation={3} sx={{ p: 3, mt: 3 }}>
        <Typography variant="h6" gutterBottom>
          Основные результаты:
        </Typography>
        
        <Box sx={{ mt: 2 }}>
          {result.optimal_time && (
            <Typography>
              <strong>Оптимальное время:</strong> {result.optimal_time}
            </Typography>
          )}
          
          {scheduleArray.length > 0 && (
            <Typography sx={{ mt: 1 }}>
              <strong>Порядок работ:</strong> {scheduleArray.join(' → ')}
            </Typography>
          )}

          {result.schedule_details && (
            <Box sx={{ mt: 2, whiteSpace: 'pre-line' }}>
              <Typography variant="subtitle2" gutterBottom>
                Детали расписания:
              </Typography>
              <Typography component="div" sx={{ 
                p: 1, 
                bgcolor: 'grey.100', 
                borderRadius: 1,
                fontFamily: 'monospace'
              }}>
                {result.schedule_details}
              </Typography>
            </Box>
          )}
        </Box>
      </Paper>

      {result.gantt_data && (
        <GanttChart 
          data={{
            ...result.gantt_data,
            workers: result.gantt_data.workers || [],
            timeScale: result.gantt_data.timeScale || []
          }} 
        />
      )}
    </>
  );
};

  if (loading && !definition) {
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

  if (!definition) {
    return (
      <Alert severity="info" sx={{ m: 2 }}>
        Алгоритм не найден
      </Alert>
    );
  }

  return (
    <Box sx={{ maxWidth: 800, mx: 'auto', p: 3 }}>
      <Typography variant="h4" gutterBottom>
        {definition.title}
      </Typography>
      <Typography paragraph>
        {definition.description}
      </Typography>

      <Paper elevation={3} sx={{ p: 3 }}>
        <AlgorithmForm 
          parameters={definition.parameters} 
          onSubmit={handleSubmit}
          loading={loading}
          algorithmName={algorithmName}
        />
      </Paper>

      {renderResult()}
    </Box>
  );
};

export default AlgorithmPage;
