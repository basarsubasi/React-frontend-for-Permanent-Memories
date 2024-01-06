// axios-config.js
import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: 'http://localhost:5232'
});

export default axiosInstance;
