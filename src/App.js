import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import SearchItems from './Pages/SearchItems';
import HomePage from './Pages/HomePage';
import Login from './Pages/Login';
import SignUp from './Pages/SignUp';
import Cameras from './Pages/Cameras';
import Films from './Pages/Films';
import ProductPage from './Pages/ProductPage';
import CreateItem from './Pages/CreateItem';
import Layout from './Components/Layout';

function App() {
  return (
    <Router>
      <Layout>
      <Routes>
  <Route path="/search" element={<SearchItems />} />
  <Route path="/" element={<HomePage />} />
  <Route path="/Login" element={<Login />} />
  <Route path="/Signup" element={<SignUp />} />
  <Route path="/product/:guid" element={<ProductPage />} />
  <Route path="/films" element={<Films />} />
  <Route path="/cameras" element={<Cameras />} />
  <Route path="/createitem" element={<CreateItem />} />
  {/* Add more routes for other pages */}
</Routes>
     </Layout>
    </Router>
  );
}

export default App;
