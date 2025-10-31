import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { teamsAPI, marksAPI, juriesAPI, getCriteria } from '../utils/api';
import MarkingTable from '../components/MarkingTable';
import toast from 'react-hot-toast';

const MarkingPage = () => {
  const { juryName } = useParams();
  const navigate = useNavigate();
  const [teams, setTeams] = useState([]);
  const [marks, setMarks] = useState([]);
  const [criteria, setCriteria] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (juryName) {
      fetchData();
    }
  }, [juryName]);

  useEffect(() => {
    getCriteria().then(res => setCriteria(res.data));
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [teamsResponse, marksResponse, juryResponse] = await Promise.all([
        teamsAPI.getAll(),
        marksAPI.getByJury(juryName),
        juriesAPI.getByName(juryName)
      ]);

      setTeams(teamsResponse.data);
      setMarks(marksResponse.data);
      setIsPaused(juryResponse.data?.paused || false);
      setHasSubmitted(juryResponse.data?.hasSubmitted || false);
      
      // Load from localStorage if no data from server
      if (marksResponse.data.length === 0) {
        const savedMarks = localStorage.getItem(`marks_${juryName}`);
        if (savedMarks) {
          setMarks(JSON.parse(savedMarks));
        }
      }
    } catch (error) {
      console.error('Failed to fetch data:', error);
      setError('Failed to load data. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (marksData, isSubmit = false) => {
    try {
      setSaving(true);
      console.log("Submitting marks:", marksData);
      await marksAPI.save(juryName, { marks: marksData });
      
      if (isSubmit) {
        setHasSubmitted(true);
        setIsPaused(false);
        localStorage.removeItem(`marks_${juryName}`);
        toast.success('Marks submitted successfully!');
        navigate('/');
      } else {
        // Auto-save to localStorage
        localStorage.setItem(`marks_${juryName}`, JSON.stringify(marksData));
      }
    } catch (error) {
      console.error('Failed to save marks:', error);
      toast.error('Failed to save marks. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const handlePause = async () => {
    try {
      await juriesAPI.updateStatus(juryName, { paused: true });
      setIsPaused(true);
    } catch (error) {
      console.error('Failed to pause:', error);
      toast.error('Failed to pause. Please try again.');
    }
  };

  const handleResume = async () => {
    try {
      await juriesAPI.updateStatus(juryName, { paused: false });
      setIsPaused(false);
    } catch (error) {
      console.error('Failed to resume:', error);
      toast.error('Failed to resume. Please try again.');
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        <p className="ml-4 text-gray-600">Loading marking interface...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border-l-4 border-red-400 p-4 mb-6">
        <p className="text-red-800">{error}</p>
        <button
          onClick={fetchData}
          className="mt-2 text-red-600 hover:text-red-800 font-medium"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto">
      <div className="bg-white rounded-lg shadow-lg p-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-800 mb-2">
              Marking Panel — Jury {juryName}
            </h1>
            <p className="text-gray-600">
              {hasSubmitted ? 'Marking completed and submitted' : 'Mark all teams based on the given criteria'}
            </p>
          </div>
          
          <div className="flex items-center space-x-3 mt-4 md:mt-0">
            {hasSubmitted ? (
              <div className="flex items-center text-green-600">
                <span className="text-2xl mr-2">✅</span>
                <span className="font-medium">Submitted</span>
              </div>
            ) : (
              <>
                {isPaused ? (
                  <button
                    onClick={handleResume}
                    className="bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-4 rounded-lg transition duration-200 ease-in-out"
                  >
                    ▶️ Resume
                  </button>
                ) : (
                  <button
                    onClick={handlePause}
                    className="bg-yellow-600 hover:bg-yellow-700 text-white font-medium py-2 px-4 rounded-lg transition duration-200 ease-in-out"
                  >
                    ⏸️ Pause
                  </button>
                )}
                <button
                  onClick={() => navigate('/')}
                  className="bg-gray-600 hover:bg-gray-700 text-white font-medium py-2 px-4 rounded-lg transition duration-200 ease-in-out"
                >
                  🏠 Home
                </button>
              </>
            )}
          </div>
        </div>

        {hasSubmitted && (
          <div className="bg-green-50 border-l-4 border-green-400 p-4 mb-6">
            <p className="text-green-800">
              <strong>Submitted:</strong> Your marks have been successfully submitted. 
              You can still view the results but cannot make changes.
            </p>
          </div>
        )}

        {isPaused && !hasSubmitted && (
          <div className="bg-orange-50 border-l-4 border-orange-400 p-4 mb-6">
            <p className="text-orange-800">
              <strong>Paused:</strong> Marking is currently paused. Click Resume to continue.
            </p>
          </div>
        )}

        <MarkingTable
          teams={teams}
          initialMarks={marks}
          onSave={handleSave}
          disabled={isPaused || hasSubmitted}
          saving={saving}
          juryName={juryName}
          criteria={criteria}
        />
      </div>
    </div>
  );
};

export default MarkingPage;