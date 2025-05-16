import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Typography, 
  CircularProgress, 
  Alert, 
  Paper,
  Chip,
  Stack,
  Collapse,
  IconButton,
  List,
  ListItem
} from '@mui/material';
import { useParams, useLocation } from 'react-router-dom';
import AlgorithmForm from '../components/AlgorithmForm/AlgorithmForm';
import GanttChart from '../components/GanttChart/GanttChart';
import { getAlgorithmDefinition, getAlgorithmResult } from '../api';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import InfoIcon from '@mui/icons-material/Info';

const AlgorithmPage = () => {
  const { algorithmName } = useParams();
  const location = useLocation();
  const [definition, setDefinition] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [result, setResult] = useState(null);
  const [expandedDesc, setExpandedDesc] = useState(false);

  useEffect(() => {
    let isMounted = true;
    
    const resetAndLoad = async () => {
      try {
        if (isMounted) {
          setLoading(true);
          setError(null);
          setResult(null);
          setDefinition(null);
          
          const def = await getAlgorithmDefinition(algorithmName);
          if (isMounted) {
            setDefinition(def);
          }
        }
      } catch (err) {
        if (isMounted) {
          setError(getUserFriendlyError(err));
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    resetAndLoad();
    
    return () => {
      isMounted = false;
    };
  }, [algorithmName, location.key]);

  const handleSubmit = async (values) => {
    try {
      setLoading(true);
      setError(null);
      setResult(null);
      
      const response = await getAlgorithmResult(algorithmName, values);
      
      if (response.error) {
        setError(response.message || 'Произошла ошибка при выполнении алгоритма');
      } else {
        setResult(response);
      }
    } catch (err) {
      setError(getUserFriendlyError(err));
    } finally {
      setLoading(false);
    }
  };

  const getUserFriendlyError = (error) => {
    if (error.response) {
      return error.response.data.message || 
        `Ошибка сервера (${error.response.status})`;
    }
    
    if (error.request) {
      return 'Не удалось получить ответ от сервера. Проверьте подключение к интернету';
    }
    
    return error.message || 'Неизвестная ошибка';
  };

  const renderAlgorithmHeader = () => {
    if (!definition) return null;

    return (
      <Paper elevation={3} sx={{ 
        mb: 3,
        borderLeft: '4px solid',
        borderColor: 'primary.main',
      }}>
        <Box sx={{ p: 3 }}>
          <Box display="flex" justifyContent="space-between" alignItems="flex-start">
            <Box>
              <Typography variant="h4" gutterBottom>
                {definition.title}
              </Typography>
              
              {definition.tags?.length > 0 && (
                <Stack direction="row" spacing={1} sx={{ mb: 2 }}>
                  {definition.tags.map(tag => (
                    <Chip key={tag} label={tag} size="small" />
                  ))}
                </Stack>
              )}
            </Box>
            
            <IconButton 
              onClick={() => setExpandedDesc(!expandedDesc)}
              aria-label={expandedDesc ? "Скрыть описание" : "Показать описание"}
              color="primary"
            >
              {expandedDesc ? <ExpandLessIcon /> : <ExpandMoreIcon />}
            </IconButton>
          </Box>

          <Collapse in={expandedDesc}>
            <Box sx={{ 
              mt: 2,
              p: 2,
              backgroundColor: 'background.paper',
              borderRadius: 1
            }}>
              <Typography variant="body1" paragraph>
                {definition.description}
              </Typography>
              
              {definition.notes && (
                <Paper elevation={0} sx={{ 
                  p: 2,
                  mt: 2,
                  backgroundColor: 'grey.100'
                }}>
                  <Box display="flex" alignItems="center" sx={{ mb: 1 }}>
                    <InfoIcon color="info" sx={{ mr: 1 }} />
                    <Typography variant="subtitle2">Примечание</Typography>
                  </Box>
                  <Typography variant="body2">
                    {definition.notes}
                  </Typography>
                </Paper>
              )}
            </Box>
          </Collapse>
        </Box>
      </Paper>
    );
  };

  const renderErrorBlock = () => {
    if (!error) return null;

    return (
      <Paper elevation={3} sx={{ 
        mt: 3,
        borderLeft: '4px solid',
        borderColor: 'error.main',
        backgroundColor: 'error.light',
        p: 3
      }}>
        <Typography variant="h6" color="error.dark" gutterBottom>
          Ошибка выполнения
        </Typography>
        <Typography>
          {error}
        </Typography>
      </Paper>
    );
  };

  const renderOutputValue = (value, outputDef) => {
    if (!outputDef) return null;

    const { data_type: dataType, data_shape: dataShape } = outputDef;

    // Для SCALAR значений
    if (dataShape === 'SCALAR') {
      return (
        <Typography component="div" sx={{ 
          p: 2,
          bgcolor: 'grey.100',
          borderRadius: 1,
          fontFamily: dataType === 'STRING' ? 'inherit' : 'monospace',
          whiteSpace: 'pre-wrap'
        }}>
          {String(value)}
        </Typography>
      );
    }

    // Для LIST значений - вывод через пробел
    if (dataShape === 'LIST') {
      return (
        <Typography component="div" sx={{ 
          p: 2,
          bgcolor: 'grey.100',
          borderRadius: 1,
          fontFamily: 'monospace',
          whiteSpace: 'pre-wrap'
        }}>
          {value.join(' ')}
        </Typography>
      );
    }

    // Для DYNAMIC_MATRIX
    if (dataShape === 'DYNAMIC_MATRIX') {
      return (
        <Box sx={{ 
          bgcolor: 'grey.100',
          borderRadius: 1,
          p: 1,
          overflowX: 'auto'
        }}>
          <table style={{ borderCollapse: 'collapse' }}>
            <tbody>
              {value.map((row, rowIndex) => (
                <tr key={rowIndex}>
                  {row.map((cell, cellIndex) => (
                    <td 
                      key={cellIndex} 
                      style={{ 
                        padding: '8px', 
                        border: '1px solid #ddd',
                        fontFamily: 'monospace'
                      }}
                    >
                      {String(cell)}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </Box>
      );
    }

    return null;
  };

  const renderResults = () => {
    if (!result || !definition?.outputs) return null;

    return (
      <>
        <Paper elevation={3} sx={{ p: 3, mt: 3 }}>
          <Typography variant="h6" gutterBottom>
            Результаты выполнения
          </Typography>
          
          <Box sx={{ mt: 2 }}>
            {definition.outputs.map((outputDef) => {
              const value = result[outputDef.name];
              if (value === undefined || outputDef.name === 'gantt_data') return null;

              return (
                <Box key={outputDef.name} sx={{ mb: 3 }}>
                  <Typography variant="subtitle1" gutterBottom>
                    {outputDef.title || outputDef.name}
                  </Typography>
                  {outputDef.description && (
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                      {outputDef.description}
                    </Typography>
                  )}
                  {renderOutputValue(value, outputDef)}
                </Box>
              );
            })}
          </Box>
        </Paper>

        {/* Отдельно выводим диаграмму Ганта если есть gantt_data */}
        {result.gantt_data && (
          <Box sx={{ mt: 3 }}>
            <GanttChart 
              data={{
                ...result.gantt_data,
                workers: result.gantt_data.workers || [],
                timeScale: result.gantt_data.timeScale || []
              }} 
            />
          </Box>
        )}
      </>
    );
  };

  if (loading && !definition) {
    return (
      <Box display="flex" justifyContent="center" p={3}>
        <CircularProgress size={60} />
      </Box>
    );
  }

  if (error && !definition) {
    return (
      <Paper elevation={3} sx={{ 
        m: 3,
        borderLeft: '4px solid',
        borderColor: 'error.main',
        backgroundColor: 'error.light',
        p: 3
      }}>
        <Typography variant="h6" color="error.dark" gutterBottom>
          Ошибка загрузки алгоритма
        </Typography>
        <Typography>
          {error}
        </Typography>
      </Paper>
    );
  }

  if (!definition) {
    return (
      <Alert severity="info" sx={{ m: 3 }}>
        Алгоритм не найден в системе
      </Alert>
    );
  }

  return (
    <Box sx={{ 
      maxWidth: 800, 
      mx: 'auto', 
      p: 3,
      '& > * + *': {
        mt: 3
      }
    }}>
      {renderAlgorithmHeader()}

      <Paper elevation={3} sx={{ p: 3 }}>
        <AlgorithmForm 
          parameters={definition.parameters} 
          onSubmit={handleSubmit}
          loading={loading}
          algorithmName={algorithmName}
        />
      </Paper>

      {renderErrorBlock()}
      {renderResults()}
    </Box>
  );
};

export default AlgorithmPage;
