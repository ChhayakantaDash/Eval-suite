import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { juriesAPI } from "../utils/api";
import JuryCard from "../components/JuryCard";

const MASTER_KEY = "CDD123"; // Master key for all juries

const Home = () => {
  const navigate = useNavigate();
  const [juries, setJuries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedJury, setSelectedJury] = useState(null);
  const [passwordInput, setPasswordInput] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    fetchJuries();
  }, []);

  const fetchJuries = async () => {
    try {
      setLoading(true);
      const response = await juriesAPI.getAll();
      setJuries(response.data);
    } catch (error) {
      console.error("Failed to fetch juries:", error);
      setError("Failed to load juries. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleJurySelect = (jury) => {
    setSelectedJury(jury);
    setPasswordInput("");
    setPasswordError("");
  };

  const handlePasswordSubmit = () => {
    const entered = passwordInput.trim().toUpperCase();
    const juryNameUpper = selectedJury.name.trim().toUpperCase();

    if (entered === juryNameUpper || entered === MASTER_KEY) {
      navigate(`/jury/${encodeURIComponent(selectedJury.name)}`);
    } else {
      setPasswordError("Incorrect password. Please try again.");
    }
  };

  const handleCloseModal = () => {
    setSelectedJury(null);
    setPasswordInput("");
    setPasswordError("");
  };

  return (
    <div className="max-w-6xl mx-auto px-4">
      {/* Welcome Section */}
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-gray-800 mb-4">
          Welcome to the Marking System
        </h1>
        <p className="text-xl text-gray-600 mb-2">
          Please select your jury panel to begin marking
        </p>
        <div className="bg-blue-50 border-l-4 border-blue-400 p-4 max-w-2xl mx-auto">
          <p className="text-blue-800 text-sm">
            <strong>Instructions:</strong> Choose your jury name from the cards below and enter your password to access the marking interface.
          </p>
        </div>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          <p className="ml-4 text-gray-600">Loading juries...</p>
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="bg-red-50 border-l-4 border-red-400 p-4 mb-6">
          <p className="text-red-800">{error}</p>
          <button
            onClick={fetchJuries}
            className="mt-2 text-red-600 hover:text-red-800 font-medium"
          >
            Try Again
          </button>
        </div>
      )}

      {/* Jury Selection */}
      {!loading && !error && (
        <>
          {juries.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">👨‍⚖️</div>
              <h2 className="text-2xl font-bold text-gray-600 mb-4">
                No Juries Available
              </h2>
              <p className="text-gray-500 mb-6">
                Please contact the administrator to set up jury panels.
              </p>
              <button
                onClick={() => navigate("/admin")}
                className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition duration-200 ease-in-out"
              >
                Go to Admin Panel
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {juries.map((jury) => (
                <JuryCard
                  key={jury._id}
                  jury={jury}
                  onSelect={() => handleJurySelect(jury)}
                />
              ))}
            </div>
          )}
        </>
      )}

      {/* Quick Stats */}
      {juries.length > 0 && (
        <div className="mt-12 bg-white rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            📊 Quick Statistics
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <div className="text-3xl font-bold text-blue-600">
                {juries.length}
              </div>
              <div className="text-sm text-gray-600">Total Juries</div>
            </div>
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <div className="text-3xl font-bold text-green-600">
                {juries.filter((j) => j.hasSubmitted).length}
              </div>
              <div className="text-sm text-gray-600">Submitted</div>
            </div>
            <div className="text-center p-4 bg-orange-50 rounded-lg">
              <div className="text-3xl font-bold text-orange-600">
                {juries.filter((j) => j.paused && !j.hasSubmitted).length}
              </div>
              <div className="text-sm text-gray-600">Paused</div>
            </div>
          </div>
        </div>
      )}

      {/* Password Modal */}
      {selectedJury && (
  <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm z-50 transition">
    <div className="bg-white rounded-2xl shadow-2xl p-6 w-80 sm:w-96 text-center animate-fade-in relative">
      <h2 className="text-2xl font-semibold text-gray-800 mb-4">
        🔒 Access {selectedJury.name}
      </h2>

      <p className="text-gray-500 text-sm mb-3">
        Enter your name to continue.
      </p>

      {/* Password Input with Eye Toggle */}
      <div className="relative">
        <input
          type={showPassword ? "text" : "password"}
          value={passwordInput}
          onChange={(e) => setPasswordInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") handlePasswordSubmit(); // ✅ Handle Enter key
          }}
          className="w-full border border-gray-300 rounded-lg px-4 py-2 pr-10 text-center text-gray-700 
            focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
            placeholder-gray-400 transition-all duration-200"
          placeholder="Enter password"
          autoFocus
        />
        {/* Eye Icon */}
        <button
          type="button"
          onClick={() => setShowPassword((prev) => !prev)}
          className="absolute inset-y-0 right-3 flex items-center text-gray-500 hover:text-gray-700"
        >
          {showPassword ? (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={1.8}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M2.458 12C3.732 7.943 7.523 5 12 5c4.477 0 8.268 2.943 9.542 7-1.274 4.057-5.065 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
              />
            </svg>
          ) : (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={1.8}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.269-2.943-9.543-7a9.96 9.96 0 012.244-3.592m1.74-1.74A9.967 9.967 0 0112 5c4.478 0 8.269 2.943 9.543 7a9.964 9.964 0 01-4.132 4.569M15 12a3 3 0 00-3-3m0 0a3 3 0 013 3m0 0a3 3 0 01-3 3m-3 3 9-9"
              />
            </svg>
          )}
        </button>
      </div>

      {passwordError && (
        <p className="text-red-500 text-sm mt-2 animate-shake">{passwordError}</p>
      )}

      <div className="flex justify-center gap-4 mt-5">
        <button
          onClick={handlePasswordSubmit}
          className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-5 py-2 rounded-lg 
          shadow-md transition-transform transform hover:scale-105 active:scale-95"
        >
          Unlock
        </button>
        <button
          onClick={handleCloseModal}
          className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium px-5 py-2 rounded-lg 
          transition-transform transform hover:scale-105 active:scale-95"
        >
          Cancel
        </button>
      </div>
    </div>
  </div>
)}


    </div>
  );
};

export default Home;
