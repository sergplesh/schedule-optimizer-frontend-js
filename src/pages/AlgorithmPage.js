import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { 
  Box, 
  Typography, 
  CircularProgress, 
  Alert, 
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow
} from '@mui/material';
import AlgorithmForm from '../components/AlgorithmForm/AlgorithmForm';
import { getAlgorithmDefinition, getAlgorithmResult } from '../api';

const AlgorithmPage = () => {
  const { algorithmName } = useParams();
  const [definition, setDefinition] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [result, setResult] = useState(null);
  const [prevAlgorithm, setPrevAlgorithm] = useState(null);

  // Сбрасываем результаты при смене алгоритма
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

  const renderResult = () => {
    if (!result) return null;

    return (
      <Paper elevation={3} sx={{ p: 3, mt: 3 }}>
        <Typography variant="h6" gutterBottom>
          Результат выполнения:
        </Typography>

        {Object.entries(result).map(([key, value]) => (
          <Box key={key} sx={{ mt: 1 }}>
            <Typography>
              <strong>{key}:</strong> {typeof value === 'object' ? JSON.stringify(value) : value}
            </Typography>
          </Box>
        ))}
      </Paper>
    );
  };

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