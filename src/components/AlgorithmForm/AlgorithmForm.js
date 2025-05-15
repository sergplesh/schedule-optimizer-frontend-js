import React from 'react';
import { Formik, Form } from 'formik';
import { 
  Box, 
  Button, 
  TextField, 
  Typography, 
  Paper,
  Alert,
  CircularProgress
} from '@mui/material';
import DynamicMatrixInput from './DynamicMatrixInput';

const AlgorithmForm = ({ parameters = [], onSubmit, loading, algorithmName }) => {
  const getInitialValues = () => {
    const values = {};
    
    parameters.forEach(param => {
      if (param.matrix_controller) {
        values[param.name] = param.default_value || 3;
      } else if (param.data_shape === 'DYNAMIC_MATRIX') {
        values[param.name] = param.default_value || [];
      } else {
        switch (param.data_type) {
          case 'INT':
            values[param.name] = param.default_value || 0;
            break;
          case 'FLOAT':
            values[param.name] = param.default_value || 0.0;
            break;
          case 'BOOL':
            values[param.name] = param.default_value || false;
            break;
          default:
            values[param.name] = param.default_value || '';
        }
      }
    });
    
    return values;
  };

  const initialValues = getInitialValues();

  const validate = (values) => {
    const errors = {};
    
    parameters.forEach(param => {
      if (param.data_shape === 'SCALAR') {
        if (param.data_type === 'INT' && isNaN(parseInt(values[param.name]))) {
          errors[param.name] = 'Введите целое число';
        }
        if (param.data_type === 'FLOAT' && isNaN(parseFloat(values[param.name]))) {
          errors[param.name] = 'Введите число';
        }
      }
      
      if (param.matrix_controller && (values[param.name] < 1 || values[param.name] > 20)) {
        errors[param.name] = 'Количество работ должно быть от 1 до 20';
      }
    });
    
    return errors;
  };

  return (
    <Formik
      initialValues={initialValues}
      onSubmit={onSubmit}
      validate={validate}
    >
      {({ values, handleChange, errors, touched }) => (
        <Form>
          <Paper elevation={3} sx={{ p: 3 }}>
            {parameters.map((param) => {
              if (param.data_shape === 'SCALAR') {
                return (
                  <TextField
                    key={param.name}
                    fullWidth
                    label={param.title}
                    helperText={touched[param.name] && errors[param.name] ? 
                      errors[param.name] : param.description}
                    name={param.name}
                    type={param.data_type === 'FLOAT' ? 'number' : 
                          param.data_type === 'INT' ? 'number' : 'text'}
                    value={values[param.name] || ''}
                    onChange={handleChange}
                    error={touched[param.name] && Boolean(errors[param.name])}
                    inputProps={{ 
                      min: param.data_type === 'INT' || param.data_type === 'FLOAT' ? 0 : undefined,
                      step: param.data_type === 'FLOAT' ? '0.1' : '1'
                    }}
                    sx={{ mb: 3 }}
                  />
                );
              }
              
              if (param.matrix_controller) {
                return (
                  <TextField
                    key={param.name}
                    fullWidth
                    label={param.title}
                    helperText={touched[param.name] && errors[param.name] ? 
                      errors[param.name] : param.description}
                    name={param.name}
                    type="number"
                    value={values[param.name] || ''}
                    onChange={handleChange}
                    error={touched[param.name] && Boolean(errors[param.name])}
                    inputProps={{ min: 1, max: 20 }}
                    sx={{ mb: 3 }}
                  />
                );
              }
              
              return null;
            })}

            {parameters.map((param) => {
              if (param.data_shape === 'DYNAMIC_MATRIX') {
                const controllerParam = parameters.find(p => p.matrix_controller);
                const controllerValue = controllerParam ? 
                  Math.max(1, Math.min(20, parseInt(values[controllerParam.name]) || 1)) : 1;
                
                return (
                  <DynamicMatrixInput 
                    key={param.name}
                    param={param}
                    controllerValue={controllerValue}
                  />
                );
              }
              return null;
            })}

            <Box sx={{ mt: 3, display: 'flex', alignItems: 'center' }}>
              <Button
                type="submit"
                variant="contained"
                disabled={loading}
                sx={{ mr: 2 }}
              >
                {loading ? 'Вычисляем...' : 'Рассчитать'}
              </Button>
              {loading && <CircularProgress size={24} />}
            </Box>

            {Object.keys(errors).length > 0 && (
              <Alert severity="error" sx={{ mt: 2 }}>
                Пожалуйста, исправьте ошибки в форме
              </Alert>
            )}
          </Paper>
        </Form>
      )}
    </Formik>
  );
};

export default AlgorithmForm;
