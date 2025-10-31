import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { juriesAPI, teamsAPI, configAPI, getCriteria } from '../utils/api';
import toast from 'react-hot-toast';

const AdminPanel = ({ activeTab, juries, teams, config, onDataUpdate }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState('');
  const [editingItem, setEditingItem] = useState(null);
  const [formData, setFormData] = useState({});
  const [loading, setLoading] = useState(false);
  const [criteriaList, setCriteriaList] = useState([]);

  // Fetch criteria from backend when config tab is active or on mount
  useEffect(() => {
    if (activeTab === 'config') {
      getCriteria().then(res => setCriteriaList(res.data));
    }
  }, [activeTab]);

  const openModal = (type, item = null) => {
    setModalType(type);
    setEditingItem(item);
    setFormData(item || {});
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setModalType('');
    setEditingItem(null);
    setFormData({});
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (activeTab === 'juries') {
        if (editingItem) {
          // Update jury (not implemented in backend)
          toast.success('Update functionality coming soon!');
        } else {
          await juriesAPI.create({ name: formData.name });
        }
      } else if (activeTab === 'teams') {
        if (editingItem) {
          await teamsAPI.update(editingItem._id, formData);
        } else {
          await teamsAPI.create(formData);
        }
      } else if (activeTab === 'config') {
        await configAPI.update(formData);
      }

      closeModal();
      onDataUpdate();
    } catch (error) {
      toast.error('Error: ' + (error.response?.data?.message || error.message));
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (type, id, name) => {
    if (!confirm(`Are you sure you want to delete ${name}?`)) return;

    try {
      if (type === 'jury') {
        await juriesAPI.delete(name);
      } else if (type === 'team') {
        await teamsAPI.delete(id);
      }
      onDataUpdate();
    } catch (error) {
      toast.error('Error: ' + (error.response?.data?.message || error.message));
    }
  };

  const renderJuriesTab = () => (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Manage Juries</h2>
        <button onClick={() => openModal('jury')} className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition duration-200 ease-in-out">
          ➕ Add Jury
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {juries.map((jury) => (
          <div key={jury._id} className="bg-white p-4 rounded-lg border border-gray-200">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-lg font-medium">{jury.name}</h3>
              <div className={`px-2 py-1 rounded text-xs ${
                jury.hasSubmitted ? 'bg-green-100 text-green-800' :
                jury.paused ? 'bg-orange-100 text-orange-800' :
                'bg-red-100 text-red-800'
              }`}>
                {jury.hasSubmitted ? '✅ Submitted' : jury.paused ? '⏸️ Paused' : '❌ Pending'}
              </div>
            </div>
            <div className="text-sm text-gray-600 mb-3">
              {jury.submittedAt ? (
                <p>Submitted: {new Date(jury.submittedAt).toLocaleString()}</p>
              ) : (
                <p>No submission yet</p>
              )}
            </div>
            <button
              onClick={() => handleDelete('jury', jury._id, jury.name)}
              className="bg-red-600 hover:bg-red-700 text-white font-medium py-2 px-4 rounded-lg transition duration-200 ease-in-out text-sm"
            >
              🗑️ Delete
            </button>
          </div>
        ))}
      </div>
    </div>
  );

  const renderTeamsTab = () => (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Manage Teams</h2>
        <button onClick={() => openModal('team')} className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition duration-200 ease-in-out">
          ➕ Add Team
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-200 rounded-lg">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Team Name
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Category
              </th>
              <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {teams.map((team, index) => (
              <tr key={team._id} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-900">
                  {team.name}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-gray-500">
                  {team.category}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-center">
                  <div className="flex justify-center space-x-2">
                    <button
                      onClick={() => openModal('team', team)}
                      className="text-blue-600 hover:text-blue-800"
                    >
                      ✏️ Edit
                    </button>
                    <button
                      onClick={() => handleDelete('team', team._id, team.name)}
                      className="text-red-600 hover:text-red-800"
                    >
                      🗑️ Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

 const renderConfigTab = () => (
  <div>
    <div className="flex justify-between items-center mb-6">
      <h2 className="text-2xl font-bold text-gray-800">System Configuration</h2>
      <button
        onClick={() => openModal('config', config)}
        className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition duration-200 ease-in-out"
      >
        ✏️ Edit Config
      </button>
    </div>

    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* Competition Details */}
      <div className="bg-white p-6 rounded-lg border border-gray-200">
        <h3 className="text-lg font-medium mb-4">Competition Details</h3>
        <div className="space-y-3">
          <div>
            <label className="text-sm font-medium text-gray-700">Competition Name</label>
            <p className="text-gray-900">{config?.competitionName || 'N/A'}</p>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700">College Name</label>
            <p className="text-gray-900">{config?.collegeName || 'N/A'}</p>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700">Club Name</label>
            <p className="text-gray-900">{config?.clubName || 'N/A'}</p>
          </div>
        </div>
      </div>

      {/* Marking Criteria */}
      <div className="bg-white p-6 rounded-lg border border-gray-200">
        <h3 className="text-lg font-medium mb-4">Marking Criteria</h3>
        <div className="space-y-3">
          <div>
            <label className="text-sm font-medium text-gray-700">Criteria List</label>
            <div className="flex flex-wrap gap-2 mt-1">
              {criteriaList.length === 0 ? (
                <span className="text-gray-400">No criteria set.</span>
              ) : (
                criteriaList.map((criterion, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full"
                  >
                    {criterion}
                  </span>
                ))
              )}
            </div>
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700">Max Marks per Criterion</label>
            <p className="text-2xl font-bold text-blue-600">
              {config?.maxMarksPerCriterion || 0}
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
);


  const renderModal = () => {
    if (!isModalOpen) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
          <h3 className="text-lg font-medium mb-4">
            {editingItem ? 'Edit' : 'Add'} {modalType.charAt(0).toUpperCase() + modalType.slice(1)}
          </h3>

          <form onSubmit={handleSubmit} className="space-y-4">
            {modalType === 'jury' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Jury Name
                </label>
                <input
                  type="text"
                  value={formData.name || ''}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
            )}

            {modalType === 'team' && (
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Team Name
                  </label>
                  <input
                    type="text"
                    value={formData.name || ''}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Category
                  </label>
                  <input
                    type="text"
                    value={formData.category || ''}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
              </>
            )}

            {modalType === 'config' && (
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Competition Name
                  </label>
                  <input
                    type="text"
                    value={formData.competitionName || ''}
                    onChange={(e) => setFormData({ ...formData, competitionName: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    College Name
                  </label>
                  <input
                    type="text"
                    value={formData.collegeName || ''}
                    onChange={(e) => setFormData({ ...formData, collegeName: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Club Name
                  </label>
                  <input
                    type="text"
                    value={formData.clubName || ''}
                    onChange={(e) => setFormData({ ...formData, clubName: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Max Marks per Criterion
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="100"
                    value={formData.maxMarksPerCriterion || ''}
                    onChange={(e) => setFormData({ ...formData, maxMarksPerCriterion: parseInt(e.target.value) })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </>
            )}

            <div className="flex justify-end space-x-3 pt-4">
              <button type="button" onClick={closeModal} className="bg-gray-600 hover:bg-gray-700 text-white font-medium py-2 px-4 rounded-lg transition duration-200 ease-in-out">
                Cancel
              </button>
              <button type="submit" disabled={loading} className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition duration-200 ease-in-out">
                {loading ? 'Saving...' : 'Save'}
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  };

  return (
    <div>
      {activeTab === 'juries' && renderJuriesTab()}
      {activeTab === 'teams' && renderTeamsTab()}
      {activeTab === 'config' && renderConfigTab()}
      {renderModal()}
    </div>
  );
};

AdminPanel.propTypes = {
  activeTab: PropTypes.string.isRequired,
  juries: PropTypes.array.isRequired,
  teams: PropTypes.array.isRequired,
  config: PropTypes.object.isRequired,
  onDataUpdate: PropTypes.func.isRequired,
};

export default AdminPanel;