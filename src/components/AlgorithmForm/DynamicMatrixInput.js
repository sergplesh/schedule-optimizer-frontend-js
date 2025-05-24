import React, { useEffect, useMemo } from 'react';
import { useField, useFormikContext } from 'formik';
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

const DynamicMatrixInput = ({ param }) => {
  const [field, , helpers] = useField(param.name);
  const { values } = useFormikContext();

  const getDimensions = useMemo(() => {
    return () => {
      const getParamValue = (paramName) => {
        if (typeof paramName === 'number') return paramName;
        if (typeof paramName !== 'string') return 1;
        
        const value = values[paramName];
        return typeof value === 'number' ? Math.max(1, value) : 1;
      };

      return {
        rows: param.dimensions?.rows ? getParamValue(param.dimensions.rows) : 1,
        cols: param.dimensions?.cols ? getParamValue(param.dimensions.cols) : 1
      };
    };
  }, [param.dimensions?.rows, param.dimensions?.cols, values]);

  useEffect(() => {
    const { rows, cols } = getDimensions();
    
    const current = field.value || [];
    const needsUpdate = 
      !current.length || 
      current.length !== rows || 
      (current[0] && current[0].length !== cols);

    if (rows > 0 && cols > 0 && needsUpdate) {
      const newMatrix = Array(rows).fill().map((_, i) => 
        Array(cols).fill().map((_, j) => 
          (current[i] && current[i][j] !== undefined) ? current[i][j] : 0
        )
      );
      
      helpers.setValue(newMatrix);
    }
  }, [getDimensions, field.value, helpers]);

  if (!field.value || field.value.length === 0) return null;

  const columnLabels = param.column_labels || 
    Array(field.value[0].length).fill().map((_, i) => `${i + 1}`);

  const handleCellChange = (rowIndex, colIndex) => (e) => {
    let value;
    if (param.data_type === 'INT') {
      value = parseInt(e.target.value) || 0;
    } else if (param.data_type === 'FLOAT') {
      value = parseFloat(e.target.value) || 0;
    } else if (param.data_type === 'BOOL') {
      // Для BOOL принимаем 0/1 и конвертируем в boolean
      value = e.target.value === '1';
    } else {
      value = e.target.value;
    }
    
    const newMatrix = field.value.map((row, rIdx) => 
      row.map((cell, cIdx) => 
        rIdx === rowIndex && cIdx === colIndex ? value : cell
      )
    );
    
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
              <TableCell>№</TableCell>
              {columnLabels.map((label, index) => (
                <TableCell key={index} align="center">{label}</TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {field.value.map((row, rowIndex) => (
              <TableRow key={rowIndex}>
                <TableCell>{rowIndex + 1}</TableCell>
                {row.map((cell, colIndex) => (
                  <TableCell key={colIndex} align="center">
                    <TextField
                      value={param.data_type === 'BOOL' ? (cell ? 1 : 0) : cell}
                      onChange={handleCellChange(rowIndex, colIndex)}
                      type="number"
                      inputProps={{ 
                        min: param.data_type === 'BOOL' ? 0 : 
                             (param.data_type === 'INT' || param.data_type === 'FLOAT' ? 0 : undefined),
                        max: param.data_type === 'BOOL' ? 1 : undefined,
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

export default React.memo(DynamicMatrixInput);