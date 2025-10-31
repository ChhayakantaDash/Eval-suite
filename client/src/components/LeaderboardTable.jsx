import PropTypes from 'prop-types';


const LeaderboardTable = ({ leaderboard, juries }) => {
  const getRankIcon = (rank) => {
    switch (rank) {
      case 1: return '🥇';
      case 2: return '🥈';
      case 3: return '🥉';
      default: return `#${rank}`;
    }
  };

  const getRankClass = (rank) => {
    switch (rank) {
      case 1: return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 2: return 'bg-gray-100 text-gray-800 border-gray-200';
      case 3: return 'bg-orange-100 text-orange-800 border-orange-200';
      default: return '';
    }
  };

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full bg-white border border-gray-200 rounded-lg">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Rank
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Team Name
            </th>
            {juries.map(juryName => (
              <th key={juryName} className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                {juryName}
                <div className="text-xs font-normal text-gray-400">Total</div>
              </th>
            ))}
            <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
              Grand Total
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {leaderboard.map((team, index) => (
            <tr key={team.teamName} className={`${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'} ${getRankClass(team.rank)}`}>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="flex items-center">
                  <span className="text-2xl mr-2">{getRankIcon(team.rank)}</span>
                  <span className="font-bold text-lg">{team.rank}</span>
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="font-medium text-gray-900">{team.teamName}</div>
                {team.category && (
                  <div className="text-sm text-gray-500">{team.category}</div>
                )}
              </td>
              {juries.map(juryName => (
                <td key={juryName} className="px-6 py-4 whitespace-nowrap text-center">
                  <div className="text-lg font-medium text-blue-600">
                    {team.juryTotals[juryName] || 0}
                  </div>
                </td>
              ))}
              <td className="px-6 py-4 whitespace-nowrap text-center">
                <div className="text-xl font-bold text-green-600">
                  {team.grandTotal}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      
      {leaderboard.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          No teams have been scored yet.
        </div>
      )}
    </div>
  );
};

LeaderboardTable.propTypes = {
  leaderboard: PropTypes.array.isRequired,
  juries: PropTypes.array.isRequired,
};

export default LeaderboardTable;