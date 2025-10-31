import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Header from './components/Header';
import Footer from './components/Footer';
import Home from './pages/Home';
import MarkingPage from './pages/MarkingPage';
import LeaderboardPage from './pages/LeaderboardPage';
import StatusPage from './pages/StatusPage';
import AdminPage from './pages/AdminPage';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <Header />
        <Toaster position="top-right" />
        <main className="flex-1 container mx-auto px-4 py-6">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/jury/:juryName" element={<MarkingPage />} />
            <Route path="/leaderboard" element={<LeaderboardPage />} />
            <Route path="/status" element={<StatusPage />} />
            <Route path="/admin" element={<AdminPage />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
