import PropTypes from 'prop-types';

const JuryCard = ({ jury, onSelect }) => {
  const getStatusIcon = () => {
    if (jury.hasSubmitted) return '✅';
    if (jury.paused) return '⏸️';
    return '📝';
  };

  const getStatusText = () => {
    if (jury.hasSubmitted) return 'Submitted';
    if (jury.paused) return 'Paused';
    return 'Ready to Mark';
  };

  const getStatusColor = () => {
    if (jury.hasSubmitted) return 'text-green-600 bg-green-50 border-green-200';
    if (jury.paused) return 'text-orange-600 bg-orange-50 border-orange-200';
    return 'text-blue-600 bg-blue-50 border-blue-200';
  };

  const getCardStyle = () => {
    if (jury.hasSubmitted) return 'border-green-200 hover:border-green-400 hover:shadow-green-100';
    if (jury.paused) return 'border-orange-200 hover:border-orange-400 hover:shadow-orange-100';
    return 'border-blue-200 hover:border-blue-400 hover:shadow-blue-100';
  };

  return (
    <div
      className={`bg-white rounded-lg shadow-md border-2 cursor-pointer transition-all duration-300 hover:shadow-lg transform hover:-translate-y-1 ${getCardStyle()}`}
      onClick={() => onSelect(jury.name)}
    >
      <div className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="text-3xl">👨‍⚖️</div>
          <div className={`px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor()}`}>
            {getStatusIcon()} {getStatusText()}
          </div>
        </div>
        
        <h3 className="text-xl font-bold text-gray-800 mb-2">
          {jury.name}
        </h3>
        
        {jury.hasSubmitted && jury.submittedAt && (
          <p className="text-sm text-gray-500 mb-2">
            Submitted: {new Date(jury.submittedAt).toLocaleString()}
          </p>
        )}
        
        <div className="flex items-center justify-between mt-4">
          <div className="text-sm text-gray-500">
            {jury.hasSubmitted ? 'View Results' : 'Continue Marking'}
          </div>
          <div className="text-blue-600">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
};

JuryCard.propTypes = {
  jury: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    hasSubmitted: PropTypes.bool.isRequired,
    paused: PropTypes.bool.isRequired,
    submittedAt: PropTypes.string,
  }).isRequired,
  onSelect: PropTypes.func.isRequired,
};

export default JuryCard;