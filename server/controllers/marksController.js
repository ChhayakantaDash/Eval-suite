const Marks = require('../models/Marks');
const Jury = require('../models/Jury');
const Team = require('../models/Team');
const Config = require('../models/Config');

// -------------------- Save Marks --------------------
const saveMarks = async (req, res) => {
  try {
    const { juryName } = req.params;
    const { marks } = req.body;

    const config = await Config.findOne();
    const criteriaList = (config.criteria || []).map(c => c.toUpperCase());

    await Marks.deleteMany({ juryName });

    const savedMarks = await Marks.insertMany(
      marks.map(mark => {
        // Convert keys to ALL CAPS for matching
        const markCriteria = {};
        Object.keys(mark.criteria).forEach(key => {
          markCriteria[key.toUpperCase()] = mark.criteria[key];
        });

        // Only keep marks for current criteria
        const filteredCriteria = {};
        for (const criterion of criteriaList) {
          filteredCriteria[criterion] = markCriteria[criterion] ?? 0;
        }
        return {
          juryName,
          teamName: mark.teamName,
          criteria: filteredCriteria,
          total: Object.values(filteredCriteria).reduce((sum, v) => sum + (v || 0), 0)
        };
      })
    );

    await Jury.findOneAndUpdate(
      { name: juryName },
      { hasSubmitted: true, paused: false, submittedAt: new Date() },
      { upsert: true }
    );

    res.json({ success: true, message: 'Marks saved successfully.' });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// -------------------- Get Marks By Jury --------------------
const getMarksByJury = async (req, res) => {
  try {
    const { juryName } = req.params;
    const marks = await Marks.find({ juryName });
    console.log("Fetched marks:", marks);

    const config = await Config.findOne();
    const criteriaList = (config.criteria || []).map(c => c.toUpperCase());

    const filteredMarks = marks.map(mark => {
      const filteredCriteria = {};
      for (const criterion of criteriaList) {
        filteredCriteria[criterion] = mark.criteria.get(criterion) ?? 0;
      }
      return {
        ...mark.toObject(),
        criteria: filteredCriteria,
        total: Object.values(filteredCriteria).reduce((sum, v) => sum + (v || 0), 0)
      };
    });

    console.log("Filtered marks:", filteredMarks);
    res.json(filteredMarks);

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
};


// -------------------- Leaderboard --------------------
const getLeaderboard = async (req, res) => {
  try {
    const teams = await Team.find({});
    const juries = await Jury.find({});
    const allMarks = await Marks.find({});

    const leaderboard = teams.map(team => {
      let totalScore = 0;
      const juryTotals = {};

      juries.forEach(jury => {
        const juryMarks = allMarks.find(
          mark => mark.juryName === jury.name && mark.teamName === team.name
        );
        const score = juryMarks ? juryMarks.total : 0;
        juryTotals[jury.name] = score;
        totalScore += score;
      });

      return {
        teamName: team.name,
        category: team.category,
        juryTotals,
        grandTotal: totalScore
      };
    });

    // Sort descending by grand total
    leaderboard.sort((a, b) => b.grandTotal - a.grandTotal);

    // Add ranks
    const rankedLeaderboard = leaderboard.map((team, index) => ({
      rank: index + 1,
      ...team
    }));

    res.json({
      leaderboard: rankedLeaderboard,
      juries: juries.map(j => j.name)
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// -------------------- Get Submission Status --------------------
const getSubmissionStatus = async (req, res) => {
  try {
    const juries = await Jury.find({});
    const statusData = juries.map(jury => ({
      juryName: jury.name,
      status: jury.hasSubmitted ? 'Submitted' : jury.paused ? 'Paused' : 'Pending',
      submittedAt: jury.submittedAt
    }));
    res.json(statusData);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// -------------------- Get All Marks --------------------
const getAllMarks = async (req, res) => {
  try {
    const marks = await Marks.find({});
    res.json(marks);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// -------------------- Export --------------------
module.exports = {
  saveMarks,
  getMarksByJury,
  getLeaderboard,
  getSubmissionStatus,
  getAllMarks
};
