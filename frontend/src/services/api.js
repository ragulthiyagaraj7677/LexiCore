import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Precedents API
export const getPrecedents = (params) => api.get('/precedents', { params });
export const getPrecedentById = (id) => api.get(`/precedents/${id}`);
export const searchPrecedentsVector = (data) => api.post('/precedents/vector-search', data);
export const createPrecedent = (data) => api.post('/precedents', data);
export const getPrecedentStats = () => api.get('/precedents/stats');

// Research RAG API
export const runResearchQuery = (data) => api.post('/research/query', data);
export const getResearchHistory = () => api.get('/research/history');

// Clause Risk Analyzer API
export const analyzeClause = (data) => api.post('/clauses/analyze', data);
export const getClauseHistory = () => api.get('/clauses/history');

// Case Brief Generator API
export const generateCaseBrief = (data) => api.post('/briefs/generate', data);
export const getBriefHistory = () => api.get('/briefs/history');

// Health Check
export const getSystemHealth = () => api.get('/health');

export default api;

