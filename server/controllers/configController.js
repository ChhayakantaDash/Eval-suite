const Jury = require('../models/Jury');
const Team = require('../models/Team');
const Marks = require('../models/Marks');
const Config = require('../models/Config');


// Get configuration
const getConfig = async (req, res) => {
  try {
    let config = await Config.findOne({});
    if (!config) {
      config = new Config();
      await config.save();
    }

    // Ensure numeric value is sent
    res.json({
      ...config.toObject(),
      maxMarksPerCriterion: Number(config.maxMarksPerCriterion) || 20
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// Update configuration
const updateConfig = async (req, res) => {
  try {
    const {
      criteriaList,
      maxMarksPerCriterion,
      competitionName,
      collegeName,
      clubName
    } = req.body;

    let config = await Config.findOne({});
    if (!config) config = new Config();

    if (criteriaList) config.criteriaList = criteriaList;
    if (maxMarksPerCriterion !== undefined)
      config.maxMarksPerCriterion = maxMarksPerCriterion;
    if (competitionName) config.competitionName = competitionName;
    if (collegeName) config.collegeName = collegeName;
    if (clubName) config.clubName = clubName;

    await config.save();
    res.json(config);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Criteria handlers
const getCriteria = async (req, res) => {
  try {
    const config = await Config.findOne();
    res.json(config?.criteria || []);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const addCriteria = async (req, res) => {
  try {
    let { criterion } = req.body;
    criterion = criterion.trim().toUpperCase(); // <-- ALL CAPS

    const config = await Config.findOne() || new Config();
    if (!config.criteria.includes(criterion)) {
      config.criteria.push(criterion);
      await config.save();
    }
    res.json(config.criteria);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const removeCriteria = async (req, res) => {
  try {
    const { index } = req.body;
    const config = await Config.findOne();
    if (!config) return res.status(404).json({ message: "No config found" });

    config.criteria.splice(index, 1);
    await config.save();
    res.json(config.criteria);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const resetAll = async (req, res) => {
  try {
    await Jury.deleteMany({});
    await Team.deleteMany({});
    await Marks.deleteMany({});
    // Optionally, reset criteria and config fields
    const config = await Config.findOne();
    if (config) {
      config.criteria = [];
      config.maxMarksPerCriterion = 20;
      config.competitionName = '';
      config.collegeName = '';
      config.clubName = '';
      await config.save();
    }
    res.json({ success: true, message: 'All data reset.' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ✅ Export all functions properly
module.exports = {
  getConfig,
  updateConfig,
  getCriteria,
  addCriteria,
  removeCriteria,
  resetAll,
};
