// axios-config.js
import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: 'http://localhost:5232', // Replace with your API's base URL
});

export default axiosInstance;
