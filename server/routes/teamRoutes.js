const express = require('express');
const {
  getAllTeams,
  createTeam,
  updateTeam,
  deleteTeam,
  getTeamByName
} = require('../controllers/teamController');

const router = express.Router();

// GET /api/teams - Get all teams
router.get('/', getAllTeams);

// POST /api/teams - Create a new team
router.post('/', createTeam);

// GET /api/teams/name/:name - Get team by name
router.get('/name/:name', getTeamByName);

// PUT /api/teams/:id - Update team
router.put('/:id', updateTeam);

// DELETE /api/teams/:id - Delete team
router.delete('/:id', deleteTeam);

module.exports = router;