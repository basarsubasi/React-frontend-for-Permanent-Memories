import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import SearchItems from './SearchItems';

function App() {
  return (
    <Router>
      <div>
      <Routes>
  <Route path="/search" element={<SearchItems />} />
  {/* Add more routes for other pages */}
</Routes>
      </div>
    </Router>
  );
}

export default App;
