import { Routes, Route, Link } from 'react-router-dom';
import Home from "./pages/Home/Home.jsx";
import Navbar from "./components/Navbar/Navbar.jsx";
import ThemeProvider from "./ThemeProvider.jsx";
import Signin from "./pages/Signin/Signin.jsx";
import NotFound from "./pages/NotFound/NotFound.jsx";
import Signup from "./pages/Signup/Signup.jsx";

function App() {
  return (
    <>
      <Navbar/>
      <ThemeProvider>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/signin" element={<Signin />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/*" element={<NotFound />} />
        </Routes>
      </ThemeProvider>
    </>
  );
}

export default App;
