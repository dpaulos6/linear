import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Helmet } from 'react-helmet';

import Home from './pages/Home';
import Profile from './pages/Profile';
import Repo from './pages/Repo';

function App() {
  return (
    <>
      <Router>
        <Routes>
          <Route path='/' element={<Home/>} />
          <Route path='/Profile' element={<Profile/>} />
          <Route path='/Repo' element={<Repo/>} />
        </Routes>
      </Router>
    </>
  );
}

export default App;
