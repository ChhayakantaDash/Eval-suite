const Jury = require('../models/Jury');

// Get all juries
const getAllJuries = async (req, res) => {
  try {
    const juries = await Jury.find({});
    res.json(juries);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Create a new jury
const createJury = async (req, res) => {
  try {
    const { name } = req.body;
    const jury = new Jury({ name });
    await jury.save();
    res.status(201).json(jury);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Update jury status (pause/resume/submit)
const updateJuryStatus = async (req, res) => {
  try {
    const { name } = req.params;
    const { hasSubmitted, paused, submittedAt } = req.body;
    
    const jury = await Jury.findOneAndUpdate(
      { name },
      { hasSubmitted, paused, submittedAt },
      { new: true, upsert: true }
    );
    
    res.json(jury);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Get jury by name
const getJuryByName = async (req, res) => {
  try {
    const { name } = req.params;
    const jury = await Jury.findOne({ name });
    if (!jury) {
      return res.status(404).json({ message: 'Jury not found' });
    }
    res.json(jury);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete jury
const deleteJury = async (req, res) => {
  try {
    const { name } = req.params;
    await Jury.findOneAndDelete({ name });
    res.json({ message: 'Jury deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getAllJuries,
  createJury,
  updateJuryStatus,
  getJuryByName,
  deleteJury
};