import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import PythonCourse from './pages/PythonCourse';
import LearningRecords from './pages/LearningRecords';
import Login from './pages/Login';
import { useStore } from './store/useStore';
import { supabase } from './utils/supabase';

function App() {
  const { setUser, fetchChapters } = useStore();

  // Check for user session on mount
  useEffect(() => {
    const checkUserSession = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        setUser({
          id: user.id,
          email: user.email || '',
          created_at: user.created_at
        });
      }
    };

    checkUserSession();
    fetchChapters();
  }, [setUser, fetchChapters]);

  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/python-course" element={<PythonCourse />} />
          <Route path="/python-course/:chapterId" element={<PythonCourse />} />
          <Route path="/learning-records" element={<LearningRecords />} />
          <Route path="/login" element={<Login />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
