const express = require('express');
const {
  saveMarks,
  getMarksByJury,
  getLeaderboard,
  getSubmissionStatus,
  getAllMarks
} = require('../controllers/marksController');

const router = express.Router();

// GET /api/marks/leaderboard - Get leaderboard data
router.get('/leaderboard', getLeaderboard);

// GET /api/marks/status - Get jury submission statuses
router.get('/status', getSubmissionStatus);

// GET /api/marks/all - Get all marks
router.get('/all', getAllMarks);

// POST /api/marks/:juryName - Save marks for a jury
router.post('/:juryName', saveMarks);

// GET /api/marks/:juryName - Get marks for a specific jury
router.get('/:juryName', getMarksByJury);

module.exports = router;
