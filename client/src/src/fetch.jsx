
import axios from 'axios';

const api = axios.create({
    baseURL: 'http://localhost:3000/',
    headers: { 'Content-Type': 'application/json' }
});

export const fetchStock = async (code) => {
  try {
    const response = await api.get('/stock?code='+code);
    return response.data; // 拿到 payload
  } catch (error) {
    console.error('请求失败:', error);
    throw error;
  }
};

export const fetchKnownStocks = async () => {
  try {
    const response = await api.get('/known_stocks');
    return response.data; // 拿到 payload
  } catch (error) {
    console.error('请求失败:', error);
    throw error;
  }
};

export const fetchRecords = async (code) => {
  try {
    const response = await api.post('/data', {
        code: code
    });
    return response.data; // 拿到 payload
  } catch (error) {
    console.error('请求失败:', error);
    throw error;
  }
};

export const fetchTransactions = async (code) => {
  try {
    const response = await api.post('/transactions', {
        code: code
    });
    return response.data; // 拿到 payload
  } catch (error) {
    console.error('请求失败:', error);
    throw error;
  }
};
