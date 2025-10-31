const express = require('express');
const {
  getAllJuries,
  createJury,
  updateJuryStatus,
  getJuryByName,
  deleteJury
} = require('../controllers/juryController');

const router = express.Router();

// GET /api/juries - Get all juries
router.get('/', getAllJuries);

// POST /api/juries - Create a new jury
router.post('/', createJury);

// GET /api/juries/:name - Get jury by name
router.get('/:name', getJuryByName);

// PUT /api/juries/:name - Update jury status
router.put('/:name', updateJuryStatus);

// DELETE /api/juries/:name - Delete jury
router.delete('/:name', deleteJury);

module.exports = router;