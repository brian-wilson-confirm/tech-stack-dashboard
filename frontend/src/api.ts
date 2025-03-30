import axios from 'axios';

export const fetchTechStack = async () => {
  const response = await axios.get('/api/tech-stack');
  return response.data;
};