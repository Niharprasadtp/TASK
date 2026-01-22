import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import CandidateForm from './components/CandidateForm';
import Dashboard from './components/Dashboard';
import { Menu, X } from 'lucide-react';

function App() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

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

                {/* Mobile menu button */}
                <div className="flex items-center sm:hidden">
                  <button
                    onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                    type="button"
                    className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500"
                    aria-expanded="false"
                  >
                    <span className="sr-only">Open main menu</span>
                    {isMobileMenuOpen ? (
                      <X className="block h-6 w-6" aria-hidden="true" />
                    ) : (
                      <Menu className="block h-6 w-6" aria-hidden="true" />
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Mobile menu, show/hide based on menu state. */}
          {isMobileMenuOpen && (
            <div className="sm:hidden bg-white border-b border-gray-200">
              <div className="pt-2 pb-3 space-y-1 px-4">
                <Link
                  to="/"
                  className="block pl-3 pr-4 py-2 text-base font-medium text-gray-500 hover:text-blue-600 hover:bg-gray-50 rounded-md"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Registration
                </Link>
                <Link
                  to="/dashboard"
                  className="block pl-3 pr-4 py-2 text-base font-medium text-gray-500 hover:text-blue-600 hover:bg-gray-50 rounded-md"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Dashboard
                </Link>
              </div>
            </div>
          )}
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
