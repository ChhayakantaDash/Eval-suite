const express = require('express');
const {
  exportJuryExcel,
  exportLeaderboardExcel
} = require('../controllers/exportController');

const router = express.Router();

// GET /api/export/jury/:juryName - Download jury Excel
router.get('/jury/:juryName', exportJuryExcel);

// GET /api/export/leaderboard - Download leaderboard Excel
router.get('/leaderboard', exportLeaderboardExcel);

module.exports = router;