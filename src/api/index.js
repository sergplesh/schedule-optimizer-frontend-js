import axios from 'axios';

export const host = 'https://localhost:7292';

export const getAlgorithms = async () => {
  const response = await axios.get(`${host}/api/Algorithms`);
  return response.data;
};

export const getAlgorithmDefinition = async (algorithmName) => {
  const response = await axios.get(`${host}/api/Algorithms/${algorithmName}`);
  return response.data;
};

export const getAlgorithmResult = async (algorithmName, parameters) => {
  const requestParams = Object.keys(parameters).map(name => ({
    name,
    value: typeof parameters[name] === 'object' 
      ? JSON.stringify(parameters[name]) 
      : parameters[name].toString()
  }));

  const response = await axios.post(
    `${host}/api/Algorithms/${algorithmName}`,
    { parameters: requestParams }
  );
  return response.data;
};