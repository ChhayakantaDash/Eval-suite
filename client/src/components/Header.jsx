import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { configAPI } from '../utils/api';
import parala from '../assets/Parala_maharaja_engineering_college.jpg';
import cdd_logo from '../assets/cdd_logo.png';
import Swal from 'sweetalert2';
import { FaHome } from "react-icons/fa";
import { GiTrophy } from "react-icons/gi";
import { IoBarChart } from "react-icons/io5";
import { IoSettingsSharp } from "react-icons/io5";

const ADMIN_PASSWORD = 'CDD'; // Change this to your desired password

const Header = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [config, setConfig] = useState({
    collegeName: 'Your College Name',
    clubName: 'Your Club Name',
    competitionName: 'College Competition'
  });

  useEffect(() => {
    const fetchConfig = async () => {
      try {
        const response = await configAPI.get();
        setConfig(response.data);
      } catch (error) {
        console.error('Failed to fetch config:', error);
      }
    };
    fetchConfig();
  }, []);

  const isActive = (path) => {
    if (path === '/' && location.pathname === '/') return true;
    if (path !== '/' && location.pathname.startsWith(path)) return true;
    return false;
  };

  const navLinks = [
    { path: '/', label: 'Home', icon: <FaHome /> },
    { path: '/leaderboard', label: 'Leaderboard', icon: <GiTrophy /> },
    { path: '/status', label: 'Status', icon: <IoBarChart /> },
    
    // Remove admin from here
  ];

  // Handler for admin link


const handleAdminClick = async (e) => {
  e.preventDefault();

  if (localStorage.getItem('isAdminAuthed') === 'true') {
    navigate('/admin');
    return;
  }

  // Show SweetAlert2 password input
  const { value: password } = await Swal.fire({
    title: 'Admin Login',
    input: 'password',
    inputLabel: 'Enter admin password:',
    inputPlaceholder: 'Type your password here',
    showCancelButton: true,
    confirmButtonText: 'Login',
    cancelButtonText: 'Cancel',
    confirmButtonColor: '#2563eb', // Tailwind blue-600
    cancelButtonColor: '#6b7280',  // gray-500
    background: '#fff',
    inputAttributes: {
      autocapitalize: 'off',
      autocorrect: 'off'
    },
  });

  if (password === undefined) return; // user cancelled

  if (password === 'CDD') {
    localStorage.setItem('isAdminAuthed', 'true');
    await Swal.fire({
      icon: 'success',
      title: 'Access granted!',
      text: 'Welcome, Admin.',
      timer: 1500,
      showConfirmButton: false,
    });
    navigate('/admin');
  } else {
    Swal.fire({
      icon: 'error',
      title: 'Incorrect password!',
      text: 'Please try again.',
    });
  }
};


  return (
    <header className="bg-white shadow-lg border-b-4 border-blue-600">
      <div className="container mx-auto px-4">
        {/* Top Bar with Logos and Title */}
        <div className="flex items-center justify-between py-4">
          {/* College Logo */}
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full flex items-center justify-center text-white font-bold text-2xl">
              <img
                src={parala}
                alt="College Logo"></img>
            </div>
            <div className="hidden md:block">
              <h1 className="text-2xl font-bold text-gray-800">
                {config.collegeName}
              </h1>
              <p className="text-sm text-gray-600">{config.clubName}</p>
            </div>
          </div>

          {/* Competition Title */}
          <div className="text-center">
            <h2 className="text-xl md:text-3xl font-bold text-blue-600 mb-1">
              {config.competitionName}
            </h2>
            <p className="text-sm text-gray-600 font-medium">
              Marking & Leaderboard System
            </p>
          </div>

          {/* Club Logo */}
          <div className="flex items-center space-x-4">
            <div className="hidden md:block text-right">
              <h1 className="text-2xl font-bold text-gray-800">
                Competition
              </h1>
              <p className="text-sm text-gray-600">2024-25</p>
            </div>
            <div className="w-16 h-16 bg-gradient-to-r from-green-600 to-teal-600 rounded-full flex items-center justify-center text-white font-bold text-2xl">
              <img
                src={cdd_logo}
                alt="Club Logo"></img>
            </div>
          </div>
        </div>

        {/* Navigation Bar */}
        <nav className="border-t border-gray-200 py-3">
          <div className="flex flex-wrap justify-center space-x-1 md:space-x-6">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`flex items-center space-x-2 px-3 md:px-4 py-2 rounded-lg text-sm md:text-base font-medium transition-all duration-200 ${
                  isActive(link.path)
                    ? 'bg-blue-600 text-white shadow-md'
                    : 'text-gray-600 hover:text-blue-600 hover:bg-blue-50'
                }`}
              >
                <span className="text-lg">{link.icon}</span>
                <span className="hidden sm:inline">{link.label}</span>
              </Link>
            ))}
            {/* Admin Link with password protection */}
            <button
              onClick={handleAdminClick}
              className={`flex items-center space-x-2 px-3 md:px-4 py-2 rounded-lg text-sm md:text-base font-medium transition-all duration-200 ${
                isActive('/admin')
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'text-gray-600 hover:text-blue-600 hover:bg-blue-50'
              }`}
            >
              <span className="text-lg"><IoSettingsSharp /></span>
              <span className="hidden sm:inline">Admin</span>
            </button>
          </div>
        </nav>
      </div>
    </header>
  );
};

export default Header;
