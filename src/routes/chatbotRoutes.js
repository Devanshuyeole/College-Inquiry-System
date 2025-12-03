import express from 'express';
import {
  saveQuery,
  getAllQueries,
  getQueriesBySession,
  searchQueries,
  getAnalytics,
  deleteQuery,
  exportToCSV
} from '../controllers/chatbotController.js';

const router = express.Router();

// Save user query
router.post('/queries', saveQuery);

// Get all queries (with pagination)
router.get('/queries', getAllQueries);

// Get queries by session ID
router.get('/queries/session/:sessionId', getQueriesBySession);

// Search queries
router.get('/queries/search', searchQueries);

// Get analytics/statistics
router.get('/analytics', getAnalytics);

// Delete query by ID
router.delete('/queries/:id', deleteQuery);

// Export queries to CSV
router.get('/queries/export/csv', exportToCSV);

export default router;