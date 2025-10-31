import { useState, useEffect } from 'react';
import { marksAPI } from '../utils/api';
import StatusBoard from '../components/StatusBoard';

const StatusPage = () => {
  const [statusData, setStatusData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    fetchStatus();
    
    // Auto-refresh every 10 seconds
    const interval = setInterval(fetchStatus, 10000);
    return () => clearInterval(interval);
  }, []);

  const fetchStatus = async () => {
    try {
      if (!refreshing) setLoading(true);
      const response = await marksAPI.getStatus();
      setStatusData(response.data);
      setError('');
    } catch (error) {
      console.error('Failed to fetch status:', error);
      setError('Failed to load status data. Please try again.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleRefresh = () => {
    setRefreshing(true);
    fetchStatus();
  };

  const getStatusCounts = () => {
    const submitted = statusData.filter(s => s.status === 'Submitted').length;
    const paused = statusData.filter(s => s.status === 'Paused').length;
    const pending = statusData.filter(s => s.status === 'Pending').length;
    return { submitted, paused, pending };
  };

  if (loading && !refreshing) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        <p className="ml-4 text-gray-600">Loading status data...</p>
      </div>
    );
  }

  if (error && !refreshing) {
    return (
      <div className="bg-red-50 border-l-4 border-red-400 p-4 mb-6">
        <p className="text-red-800">{error}</p>
        <button
          onClick={fetchStatus}
          className="mt-2 text-red-600 hover:text-red-800 font-medium"
        >
          Try Again
        </button>
      </div>
    );
  }

  const { submitted, paused, pending } = getStatusCounts();

  return (
    <div className="max-w-6xl mx-auto">
      <div className="bg-white rounded-lg shadow-lg">
        {/* Header */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-800 mb-2">
                📊 Jury Submission Status
              </h1>
              <p className="text-gray-600">
                Real-time tracking of jury marking progress
              </p>
            </div>
            
            <div className="flex items-center space-x-3 mt-4 md:mt-0">
              <button
                onClick={handleRefresh}
                disabled={refreshing}
                className={`bg-gray-600 hover:bg-gray-700 text-white font-medium py-2 px-4 rounded-lg transition duration-200 ease-in-out ${refreshing ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                {refreshing ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Refreshing...
                  </>
                ) : (
                  '🔄 Refresh'
                )}
              </button>
              
              <div className="text-sm text-gray-500">
                Auto-refresh: 10s
              </div>
            </div>
          </div>
        </div>

        {/* Status Summary Cards */}
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Summary</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
              <div className="text-3xl font-bold text-blue-600">
                {statusData.length}
              </div>
              <div className="text-sm text-gray-600">Total Juries</div>
            </div>
            
            <div className="p-4 bg-green-50 rounded-lg border border-green-200">
              <div className="text-3xl font-bold text-green-600">
                {submitted}
              </div>
              <div className="text-sm text-gray-600">✅ Submitted</div>
            </div>
            
            <div className="p-4 bg-orange-50 rounded-lg border border-orange-200">
              <div className="text-3xl font-bold text-orange-600">
                {paused}
              </div>
              <div className="text-sm text-gray-600">⏸️ Paused</div>
            </div>
            
            <div className="p-4 bg-red-50 rounded-lg border border-red-200">
              <div className="text-3xl font-bold text-red-600">
                {pending}
              </div>
              <div className="text-sm text-gray-600">❌ Pending</div>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="mt-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-700">Overall Progress</span>
              <span className="text-sm text-gray-600">
                {statusData.length > 0 ? Math.round((submitted / statusData.length) * 100) : 0}%
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3">
              <div
                className="bg-green-600 h-3 rounded-full transition-all duration-300"
                style={{
                  width: statusData.length > 0 ? `${(submitted / statusData.length) * 100}%` : '0%'
                }}
              ></div>
            </div>
          </div>
        </div>

        {/* Status Board */}
        <div className="p-6">
          {statusData.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">📋</div>
              <h2 className="text-2xl font-bold text-gray-600 mb-4">
                No Jury Data Available
              </h2>
              <p className="text-gray-500 mb-6">
                Status information will appear once juries are added to the system.
              </p>
            </div>
          ) : (
            <StatusBoard statusData={statusData} />
          )}
        </div>

        {/* Last Updated */}
        <div className="bg-gray-50 p-4 border-t border-gray-200">
          <div className="flex items-center justify-between text-sm text-gray-600">
            <span>Last updated: {new Date().toLocaleString()}</span>
            <span>🔄 Auto-refreshing every 10 seconds</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StatusPage;