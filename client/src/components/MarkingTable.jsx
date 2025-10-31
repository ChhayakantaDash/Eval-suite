import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { getCriteria, configAPI } from '../utils/api'; // import configAPI
import toast from 'react-hot-toast';
import Swal from 'sweetalert2';

const MarkingTable = ({ teams, initialMarks, onSave, disabled, saving, juryName }) => {
  const [marks, setMarks] = useState([]);
  const [criteria, setCriteria] = useState([]);
  const [maxMarks, setMaxMarks] = useState(20); // default, will be updated

  // Fetch criteria and maxMarks from backend
  useEffect(() => {
    getCriteria().then(res => setCriteria(res.data));
    configAPI.get().then(res => {
      const val = res.data.maxMarksPerCriterion;
      setMaxMarks(Number(val) || 20);
    });

  }, []);

  // Initialize marks with teams and dynamic criteria
  useEffect(() => {
    if (criteria.length === 0) return;
    const initializedMarks = teams.map(team => {
      const existingMark = initialMarks.find(m => m.teamName === team.name);
      if (existingMark) {
        // Ensure all criteria are present
        const updatedCriteria = {};
        criteria.forEach(criterion => {
          updatedCriteria[criterion] = existingMark.criteria?.[criterion] || 0;
        });
        return {
          ...existingMark,
          criteria: updatedCriteria,
          total: Object.values(updatedCriteria).reduce((sum, mark) => sum + (mark || 0), 0)
        };
      }
      // New mark object with all criteria
      const criteriaObj = {};
      criteria.forEach(criterion => {
        criteriaObj[criterion.toUpperCase()] = 0;
      });
      return {
        teamName: team.name,
        criteria: criteriaObj,
        total: 0
      };
    });
    setMarks(initializedMarks);
  }, [teams, initialMarks, criteria]);

  const calculateTotal = (criteriaMarks) => {
    return Object.values(criteriaMarks).reduce((sum, mark) => sum + (mark || 0), 0);
  };

  const handleMarkChange = (teamIndex, criterion, value) => {
    if (disabled) return;
    let numValue = parseInt(value);
    if (isNaN(numValue) || numValue < 0) numValue = 0; // no negatives, empty input becomes 0
    if (numValue > maxMarks) numValue = maxMarks;

    setMarks(prevMarks => {
      const newMarks = [...prevMarks];
      newMarks[teamIndex] = {
        ...newMarks[teamIndex],
        criteria: {
          ...newMarks[teamIndex].criteria,
          [criterion]: numValue
        }
      };
      newMarks[teamIndex].total = calculateTotal(newMarks[teamIndex].criteria);

      // Auto-save to localStorage
      localStorage.setItem(`marks_${juryName}`, JSON.stringify(newMarks));

      return newMarks;
    });
  };

const handleSubmit = async () => {
  if (disabled || saving) return;

  const isComplete = marks.every(mark =>
    Object.values(mark.criteria).every(value => value >= 0)
  );

  if (!isComplete) {
    toast.error('Please complete marking for all teams and criteria before submitting.');
    return;
  }

  const result = await Swal.fire({
    title: 'Submit your marks?',
    text: 'Once submitted, you cannot change them.',
    icon: 'question',
    showCancelButton: true,
    confirmButtonColor: '#2563eb', // Tailwind blue-600
    cancelButtonColor: '#6b7280',  // Tailwind gray-500
    confirmButtonText: 'Yes, submit',
    cancelButtonText: 'Cancel',
    background: '#fff',
    backdrop: 'rgba(0,0,0,0.4)',
  });

  if (result.isConfirmed) {
    onSave(marks, true);
    
  }
};

  // const handleDraft = () => {
  //   if (disabled || saving) return;
  //   onSave(marks, false);
  //   toast.success('Draft saved successfully!');
  // };

  if (criteria.length === 0) {
    return <div>Loading criteria...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="bg-blue-50 border-l-4 border-blue-400 p-4">
        <p className="text-blue-800 text-sm">
          <strong>Instructions:</strong> Rate each team on a scale of 0-{maxMarks} for each criterion.
          The total will be calculated automatically. Save drafts frequently and submit when complete.
        </p>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-200 rounded-lg">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                S.No
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Team Name
              </th>
              {criteria.map(criterion => (
                <th key={criterion} className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {criterion}
                  <div className="text-xs font-normal text-gray-400">({maxMarks} max)</div>
                </th>
              ))}
              <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                Total
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {marks.map((mark, index) => (
              <tr key={mark.teamName} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {index + 1}
                </td>
                <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-900">
                  {mark.teamName}
                </td>
                {criteria.map(criterion => (
                  <td key={criterion} className="px-6 py-4 whitespace-nowrap text-center">
                    <input
                      type="number"
                      min="0"
                      max={maxMarks}
                      value={
                        mark.criteria[criterion] === 0
                          ? 0
                          : mark.criteria[criterion] || ''
                      }
                      onFocus={(e) => {
                        if (e.target.value === '0') e.target.value = '';
                      }}
                      onBlur={(e) => {
                        if (e.target.value === '') {
                          handleMarkChange(index, criterion, 0);
                        }
                      }}
                      onChange={(e) => handleMarkChange(index, criterion, e.target.value)}
                      disabled={disabled}
                      className={`w-16 px-2 py-1 text-center border rounded focus:outline-none focus:ring-2 focus:ring-blue-500 ${disabled ? 'bg-gray-100 cursor-not-allowed' : 'bg-white'
                        }`}
                    />

                  </td>
                ))}
                <td className="px-6 py-4 whitespace-nowrap text-center font-bold text-lg text-blue-600">
                  {mark.total}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex justify-between items-center pt-6 border-t border-gray-200">
        <div className="text-sm text-gray-600">
          Teams: {marks.length} |
          Completed: {marks.filter(m => Object.values(m.criteria).every(v => v > 0)).length} |
          Max possible total: {maxMarks * criteria.length}
        </div>

        <div className="flex space-x-3">
          {!disabled && (
            <>
              {/* <button
                onClick={handleDraft}
                disabled={saving}
                className="bg-gray-600 hover:bg-gray-700 text-white font-medium py-2 px-4 rounded-lg transition duration-200 ease-in-out"
              >
                {saving ? 'Saving...' : '💾 Save Draft'}
              </button> */}

              <button
                onClick={handleSubmit}
                disabled={saving}
                className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition duration-200 ease-in-out"
              >
                {saving ? 'Submitting...' : '✅ Submit Final'}
              </button>
            </>
          )}

          {disabled && (
            <div className="text-green-600 font-medium">
              ✅ Marking Complete
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

MarkingTable.propTypes = {
  teams: PropTypes.array.isRequired,
  initialMarks: PropTypes.array.isRequired,
  onSave: PropTypes.func.isRequired,
  disabled: PropTypes.bool.isRequired,
  saving: PropTypes.bool.isRequired,
  juryName: PropTypes.string.isRequired,
};

export default MarkingTable;