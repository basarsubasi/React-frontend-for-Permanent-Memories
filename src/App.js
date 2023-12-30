import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import SearchItems from './Pages/SearchItems';
import HomePage from './Pages/HomePage';
import Login from './Pages/Login';
import SignUp from './Pages/SignUp';
import Layout from './Components/Layout';

function App() {
  return (
    <Router>
      <Layout>
      <Routes>
  <Route path="/search" element={<SearchItems />} />
  <Route path="/homepage" element={<HomePage />} />
  <Route path="/Login" element={<Login />} />
  <Route path="/Signup" element={<SignUp />} />
  {/* Add more routes for other pages */}
</Routes>
     </Layout>
    </Router>
  );
}

export default App;
