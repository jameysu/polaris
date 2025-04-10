import { Routes, Route, Link, Navigate } from 'react-router-dom';
import Home from './pages/Home/Home.jsx';
import Navbar from './components/Navbar/Navbar.jsx';
import ThemeProvider from './ThemeProvider.jsx';
import NotFound from './pages/NotFound/NotFound.jsx';
import Dashboard from './pages/Dashboard/Dashboard.jsx';  // Assuming you have a Dashboard page

// ProtectedRoute Component to guard routes for authenticated users only
function ProtectedRoute({ element }) {
  const token = localStorage.getItem('auth');  // Assuming your token is saved in 'jwtToken'

  if (!token) {
    return <Navigate to="/" />;  // Redirect to home page if not authenticated
  }

  return element;
}

function App() {
  return (
    <>
      <ThemeProvider>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/dashboard" element={<ProtectedRoute element={<Dashboard />} />} />
          <Route path="/*" element={<NotFound />} />
        </Routes>
      </ThemeProvider>
    </>
  );
}

export default App;
