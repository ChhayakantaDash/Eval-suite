const Team = require('../models/Team');

// Get all teams
const getAllTeams = async (req, res) => {
  try {
    const teams = await Team.find({});
    res.json(teams);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Create a new team
const createTeam = async (req, res) => {
  try {
    const { name, category } = req.body;
    const team = new Team({ name, category });
    await team.save();
    res.status(201).json(team);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Update team
const updateTeam = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, category } = req.body;
    
    const team = await Team.findByIdAndUpdate(
      id,
      { name, category },
      { new: true }
    );
    
    if (!team) {
      return res.status(404).json({ message: 'Team not found' });
    }
    
    res.json(team);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Delete team
const deleteTeam = async (req, res) => {
  try {
    const { id } = req.params;
    await Team.findByIdAndDelete(id);
    res.json({ message: 'Team deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get team by name
const getTeamByName = async (req, res) => {
  try {
    const { name } = req.params;
    const team = await Team.findOne({ name });
    if (!team) {
      return res.status(404).json({ message: 'Team not found' });
    }
    res.json(team);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getAllTeams,
  createTeam,
  updateTeam,
  deleteTeam,
  getTeamByName
};