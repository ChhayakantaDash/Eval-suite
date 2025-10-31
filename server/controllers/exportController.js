const ExcelJS = require('exceljs');
const Marks = require('../models/Marks');
const Team = require('../models/Team');
const Jury = require('../models/Jury');
const Config = require('../models/Config');

// Export jury-wise Excel file
const exportJuryExcel = async (req, res) => {
  try {
    const { juryName } = req.params;
    const marks = await Marks.find({ juryName });
    const teams = await Team.find({});
    const config = await Config.findOne({}) || new Config();

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet(`${juryName}_Marks`);

    // Use dynamic criteria
    const criteriaList = config.criteria || [];
    console.log("Using criteria list:", criteriaList);
    
    const headers = ['S.No', 'Team Name', ...criteriaList, 'Total'];
    worksheet.addRow(headers);

    // Style headers
    const headerRow = worksheet.getRow(1);
    headerRow.font = { bold: true, color: { argb: 'FFFFFF' } };
    headerRow.fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: '366092' }
    };

    // Add data rows
    let serialNo = 1;
    for (const team of teams) {
      const teamMarks = marks.find(m => m.teamName === team.name);
      if (teamMarks) {
        // ✅ Use .get() for Map fields
        const criteriaValues = criteriaList.map(criterion => teamMarks.criteria.get(criterion) ?? 0);
        const rowData = [
          serialNo++,
          team.name,
          ...criteriaValues,
          teamMarks.total
        ];
        worksheet.addRow(rowData);
      } else {
        const rowData = [
          serialNo++,
          team.name,
          ...criteriaList.map(() => 0),
          0
        ];
        worksheet.addRow(rowData);
      }
    }

    // Auto-fit columns
    worksheet.columns.forEach(column => {
      column.width = Math.max(column.width || 10, 15);
    });

    // Add borders to all cells
    worksheet.eachRow((row) => {
      row.eachCell((cell) => {
        cell.border = {
          top: { style: 'thin' },
          left: { style: 'thin' },
          bottom: { style: 'thin' },
          right: { style: 'thin' }
        };
      });
    });

    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', `attachment; filename=${juryName}_Marks.xlsx`);

    await workbook.xlsx.write(res);
    res.end();
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Export leaderboard Excel file
const exportLeaderboardExcel = async (req, res) => {
  try {
    const teams = await Team.find({});
    const juries = await Jury.find({});
    const allMarks = await Marks.find({});

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Final_Leaderboard');

    // Create leaderboard data
    const leaderboard = teams.map(team => {
      const teamData = {
        teamName: team.name,
        juryTotals: {},
        grandTotal: 0
      };

      let totalScore = 0;
      juries.forEach(jury => {
        const juryMarks = allMarks.find(
          mark => mark.juryName === jury.name && mark.teamName === team.name
        );
        const score = juryMarks ? juryMarks.total : 0;
        teamData.juryTotals[jury.name] = score;
        totalScore += score;
      });

      teamData.grandTotal = totalScore;
      return teamData;
    });

    // Sort by grand total (descending)
    leaderboard.sort((a, b) => b.grandTotal - a.grandTotal);

    // Add headers
    const juryHeaders = juries.map(j => `${j.name} Total`);
    const headers = ['Rank', 'Team Name', ...juryHeaders, 'Grand Total'];
    worksheet.addRow(headers);

    // Style headers
    const headerRow = worksheet.getRow(1);
    headerRow.font = { bold: true, color: { argb: 'FFFFFF' } };
    headerRow.fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: '366092' }
    };

    // Add data rows
    leaderboard.forEach((team, index) => {
      const rank = index + 1;
      const juryScores = juries.map(j => team.juryTotals[j.name] || 0);
      const rowData = [rank, team.teamName, ...juryScores, team.grandTotal];
      const row = worksheet.addRow(rowData);

      // Highlight top 3 ranks
      if (rank <= 3) {
        let fillColor = '';
        switch (rank) {
          case 1: fillColor = 'FFD700'; break; // Gold
          case 2: fillColor = 'C0C0C0'; break; // Silver
          case 3: fillColor = 'CD7F32'; break; // Bronze
        }
        row.fill = {
          type: 'pattern',
          pattern: 'solid',
          fgColor: { argb: fillColor }
        };
      }
    });

    // Auto-fit columns
    worksheet.columns.forEach(column => {
      column.width = Math.max(column.width || 10, 15);
    });

    // Add borders
    worksheet.eachRow((row) => {
      row.eachCell((cell) => {
        cell.border = {
          top: { style: 'thin' },
          left: { style: 'thin' },
          bottom: { style: 'thin' },
          right: { style: 'thin' }
        };
      });
    });

    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', 'attachment; filename=Final_Leaderboard.xlsx');

    await workbook.xlsx.write(res);
    res.end();
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  exportJuryExcel,
  exportLeaderboardExcel
};
