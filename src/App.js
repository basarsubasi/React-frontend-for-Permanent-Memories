import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import SearchItems from './Pages/SearchItems';
import HomePage from './Pages/HomePage';
import Layout from './Components/Layout';

function App() {
  return (
    <Router>
      <Layout>
      <Routes>
  <Route path="/search" element={<SearchItems />} />
  <Route path="/homepage" element={<HomePage />} />
  {/* Add more routes for other pages */}
</Routes>
     </Layout>
    </Router>
  );
}

export default App;
