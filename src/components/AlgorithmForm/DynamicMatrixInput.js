import React, { useEffect } from 'react';
import { useField } from 'formik';
import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
  Paper
} from '@mui/material';

const DynamicMatrixInput = ({ param, controllerValue }) => {
  const [field, , helpers] = useField(param.name);

  useEffect(() => {
    if (controllerValue > 0) {
      // Определяем количество столбцов
      let cols;
      if (typeof param.dimensions?.cols === 'number') {
        cols = param.dimensions.cols;
      } else if (param.dimensions?.cols === 'num_jobs') {
        cols = controllerValue;
      } else {
        cols = param.name === 'job_times' ? 2 : controllerValue;
      }

      // Инициализируем или обновляем матрицу
      const current = field.value || [];
      const newMatrix = Array(controllerValue).fill().map((_, i) => 
        Array(cols).fill().map((_, j) => 
          (current[i] && current[i][j] !== undefined) ? current[i][j] : 0
        )
      );
      
      helpers.setValue(newMatrix);
    }
  }, [controllerValue, param.name, param.dimensions?.cols]);

  if (!field.value || field.value.length === 0 || controllerValue === 0) return null;

  // Генерируем заголовки столбцов
  const getColumnLabels = () => {
    if (param.column_labels) return param.column_labels;
    
    if (param.name === 'dependencies') {
      return Array(field.value[0].length).fill().map((_, i) => `Зависит от ${i + 1}`);
    }
    
    if (param.name === 'job_times' && param.dimensions?.cols === 2) {
      return ['Этап 1', 'Этап 2'];
    }
    
    return Array(field.value[0].length).fill().map((_, i) => `Колонка ${i + 1}`);
  };

  const columnLabels = getColumnLabels();

  // Обработчик изменения значения ячейки
  const handleCellChange = (rowIndex, colIndex, value) => {
    const newMatrix = field.value.map(row => [...row]);
    newMatrix[rowIndex][colIndex] = value;
    helpers.setValue(newMatrix);
  };

  return (
    <Box sx={{ mt: 3 }}>
      <Typography variant="h6" gutterBottom>
        {param.title}
      </Typography>
      {param.description && (
        <Typography variant="body2" color="text.secondary" gutterBottom>
          {param.description}
        </Typography>
      )}

      <TableContainer component={Paper}>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>Работа</TableCell>
              {columnLabels.map((label, index) => (
                <TableCell key={index} align="center">{label}</TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {field.value.map((row, rowIndex) => (
              <TableRow key={rowIndex}>
                <TableCell>Работа {rowIndex + 1}</TableCell>
                {row.map((cell, colIndex) => (
                  <TableCell key={colIndex} align="center">
                    <TextField
                      value={cell}
                      onChange={(e) => {
                        let value;
                        if (param.data_type === 'INT') {
                          value = parseInt(e.target.value) || 0;
                        } else if (param.data_type === 'FLOAT') {
                          value = parseFloat(e.target.value) || 0;
                        } else {
                          value = e.target.value;
                        }
                        
                        // Для зависимостей ограничиваем 0 или 1
                        if (param.name === 'dependencies') {
                          value = value ? 1 : 0;
                        }
                        
                        handleCellChange(rowIndex, colIndex, value);
                      }}
                      type={param.data_type === 'STRING' ? 'text' : 'number'}
                      inputProps={{ 
                        min: param.name === 'dependencies' ? 0 : undefined,
                        max: param.name === 'dependencies' ? 1 : undefined,
                        step: param.data_type === 'FLOAT' ? '0.1' : '1'
                      }}
                      sx={{ width: '80px' }}
                    />
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default DynamicMatrixInput;