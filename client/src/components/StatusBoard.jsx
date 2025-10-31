import PropTypes from 'prop-types';

const StatusBoard = ({ statusData }) => {
  const getStatusIcon = (status) => {
    switch (status) {
      case 'Submitted': return '✅';
      case 'Paused': return '⏸️';
      case 'Pending': return '❌';
      default: return '⚪';
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Submitted': return 'text-green-600 bg-green-50 border-green-200';
      case 'Paused': return 'text-orange-600 bg-orange-50 border-orange-200';
      case 'Pending': return 'text-red-600 bg-red-50 border-red-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const getRowColor = (status) => {
    switch (status) {
      case 'Submitted': return 'bg-green-50';
      case 'Paused': return 'bg-orange-50';
      case 'Pending': return 'bg-red-50';
      default: return 'bg-gray-50';
    }
  };

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full bg-white border border-gray-200 rounded-lg">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Jury Name
            </th>
            <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
              Status
            </th>
            <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
              Submitted At
            </th>
            <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
              Progress
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {statusData.map((item, index) => (
            <tr key={item.juryName} className={index % 2 === 0 ? 'bg-white' : getRowColor(item.status)}>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="flex items-center">
                  <div className="text-2xl mr-3">👨‍⚖️</div>
                  <div className="font-medium text-gray-900">{item.juryName}</div>
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-center">
                <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(item.status)}`}>
                  {getStatusIcon(item.status)} <span className="ml-2">{item.status}</span>
                </span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-center text-sm text-gray-500">
                {item.submittedAt ? (
                  <div>
                    <div>{new Date(item.submittedAt).toLocaleDateString()}</div>
                    <div className="text-xs text-gray-400">
                      {new Date(item.submittedAt).toLocaleTimeString()}
                    </div>
                  </div>
                ) : (
                  <span className="text-gray-400">—</span>
                )}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-center">
                <div className="flex items-center justify-center">
                  {item.status === 'Submitted' ? (
                    <div className="flex items-center text-green-600">
                      <div className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center text-white text-sm font-bold">
                        ✓
                      </div>
                      <span className="ml-2 text-sm font-medium">100%</span>
                    </div>
                  ) : item.status === 'Paused' ? (
                    <div className="flex items-center text-orange-600">
                      <div className="w-8 h-8 bg-orange-600 rounded-full flex items-center justify-center text-white text-sm font-bold">
                        ⏸
                      </div>
                      <span className="ml-2 text-sm font-medium">Paused</span>
                    </div>
                  ) : (
                    <div className="flex items-center text-red-600">
                      <div className="w-8 h-8 bg-red-600 rounded-full flex items-center justify-center text-white text-sm font-bold">
                        !
                      </div>
                      <span className="ml-2 text-sm font-medium">Pending</span>
                    </div>
                  )}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      
      {statusData.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          No jury status data available.
        </div>
      )}
    </div>
  );
};

StatusBoard.propTypes = {
  statusData: PropTypes.array.isRequired,
};

export default StatusBoard;