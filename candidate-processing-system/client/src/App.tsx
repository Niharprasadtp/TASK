import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import CandidateForm from './components/CandidateForm';
import Dashboard from './components/Dashboard';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-100">
        <nav className="bg-white/80 backdrop-blur-md sticky top-0 z-50 border-b border-gray-100">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between h-16">
              <div className="flex">
                <div className="flex-shrink-0 flex items-center">
                  <div className="h-8 w-8 bg-blue-600 rounded-lg flex items-center justify-center mr-3">
                    <span className="text-white font-bold text-xl">C</span>
                  </div>
                  <h1 className="text-xl font-bold bg-clip-text text-transparent bg-linear-to-r from-blue-600 to-indigo-600">CandidateOne</h1>
                </div>
                <div className="hidden sm:ml-10 sm:flex sm:space-x-8">
                  <Link to="/" className="text-gray-500 hover:text-blue-600 inline-flex items-center px-1 pt-1 text-sm font-medium transition-colors duration-200">
                    Registration
                  </Link>
                  <Link to="/dashboard" className="text-gray-500 hover:text-blue-600 inline-flex items-center px-1 pt-1 text-sm font-medium transition-colors duration-200">
                    Dashboard
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </nav>

        <main className="">
          <Routes>
            <Route path="/" element={<CandidateForm />} />
            <Route path="/dashboard" element={<Dashboard />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
