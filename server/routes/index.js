const express = require('express');
const juryRoutes = require('./juryRoutes');
const teamRoutes = require('./teamRoutes');
const marksRoutes = require('./marksRoutes');
const exportRoutes = require('./exportRoutes');
const configRoutes = require('./configRoutes');

const router = express.Router();

// API routes
router.use('/juries', juryRoutes);
router.use('/teams', teamRoutes);
router.use('/marks', marksRoutes);
router.use('/export', exportRoutes);
router.use('/config', configRoutes);

// Health check route
router.get('/health', (req, res) => {
  res.json({ status: 'OK', message: 'College Marking System API is running' });
});

module.exports = router;