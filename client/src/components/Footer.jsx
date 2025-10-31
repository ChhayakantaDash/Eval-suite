import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Rabindra from "../assets/Rabindra.jpg"; // Your profile image
// import baibhab from "../assets/baibhab.jpg"; // Removed unused image
import cdd_logo from '../assets/cdd_logo.png'; // Assuming you have a club logo
import chhaya from "../assets/chhaya.jpg"; // Your profile image

// The developers array now contains only your single profile
const developers = [
  {
    name: "Chhayakanta Dash",
    role: "Lead Developer",
    img: chhaya,
    branch: "Computer Science & Engineering",
    year: "4th Year",
  },
];

const Footer = () => {
  // Use the single developer profile directly from the array
  const developer = developers[0];

  const [showModal, setShowModal] = useState(false);
  // selectedDeveloper is not strictly needed since there's only one, but we'll use 'developer' instead

  const handleDeveloperClick = () => {
    // No need to pass a developer object since it's hardcoded
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  return (
    <footer className="bg-gray-900 text-white py-6 mt-auto relative border-t-4 border-indigo-700">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row items-center justify-between">
          {/* Left */}
          <div className="text-center md:text-left mb-4 md:mb-0">
            <p className="text-lg font-semibold text-blue-300">
              <span role="img" aria-label="college"></span> College Competition Marking System
            </p>
            <p className="text-sm text-gray-400 mt-1">
              Streamlined marking and leaderboard management
            </p>
          </div>

          {/* Right - Single Developer's Image and Name */}
          <div className="text-center md:text-right">
            <p className="text-sm text-gray-300 mb-2">Developed  by</p>
            <div className="flex justify-center md:justify-end items-center gap-3 flex-wrap">
              <button
                onClick={handleDeveloperClick}
                className="relative group focus:outline-none flex items-center space-x-2 p-1  hover:bg-gray-800 transition-colors"
              >
                {/* Developer Image */}
                
                {/* Developer Name */}
                <span className="text-base font-semibold text-blue-400">
                  {developer.name}
                </span>
              </button>
            </div>
            <p className="text-xs text-gray-500 mt-3">
              © {new Date().getFullYear()} All rights reserved
            </p>
          </div>
        </div>

        {/* Bottom */}
        <div className="border-t border-gray-700 mt-6 pt-4 text-center">
          <div className="flex items-center justify-center space-x-2">
           
            <p className="text-xs text-gray-400">
              Powered by Coding Design And Development Club
            </p>
          </div>
        </div>
      </div>

      {/* Contributor Modal (Profile Card) */}
      <AnimatePresence>
        {showModal && (
          <motion.div
            className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-75 z-50 p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleCloseModal} // Close modal when clicking outside
          >
            <motion.div
              className="bg-gray-800 rounded-xl p-8 text-center max-w-sm w-full shadow-2xl relative"
              initial={{ scale: 0.8, opacity: 0, y: 50 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.8, opacity: 0, y: 50 }}
              transition={{ duration: 0.3 }}
              onClick={(e) => e.stopPropagation()} // Prevent modal close when clicking inside
            >
              <button
                onClick={handleCloseModal}
                className="absolute top-3 right-3 text-gray-400 hover:text-white text-xl"
              >
                &times;
              </button>
              <h2 className="text-2xl font-bold text-blue-400 mb-6">
                Developer Profile
              </h2>

              <div className="flex flex-col items-center">
                <img
                  src={developer.img}
                  alt={developer.name}
                  className="w-32 h-32  border-4 border-indigo-600 shadow-lg mb-4 "
                />
                <p className="font-extrabold text-blue-300 text-xl">
                  {developer.name}
                </p>
                <p className="text-sm text-gray-400 mt-1">
                  <span className="font-semibold">{developer.role}</span>
                </p>
                <p className="text-sm text-gray-500">{developer.branch}</p>
                <p className="text-sm text-gray-500">{developer.year}</p>
              </div>

              <button
                onClick={handleCloseModal}
                className="mt-8 bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-semibold transition-colors duration-200"
              >
                Close
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </footer>
  );
};

export default Footer;