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
import EditItem from './Pages/EditItem';
import AdminDashboard from './Pages/AdminDashboard';
import RegisterEmployee from './Pages/RegisterEmployee';
import ItemsListPage from './Pages/ListAllItems';
import OrdersListPage from './Pages/ListAllOrders';
import ListUsersPage from './Pages/ListUsers';
import CustomerDashboard from './Pages/CustomerDashboard';
import ShoppingCart from './Pages/ShoppingCart';
import OrderPage from './Pages/OrderPage';
import MyOrders from './Pages/MyOrders';
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
  <Route path="/edititem/:guid" element={<EditItem />} />
  <Route path="/admindashboard" element={<AdminDashboard />} />
  <Route path="/registeremployee" element={<RegisterEmployee />} />
  <Route path="/listallitems" element={<ItemsListPage />} />
  <Route path="/listallorders" element={<OrdersListPage />} />
  <Route path="/listusers" element={<ListUsersPage />} />
  <Route path="/customerdashboard" element={<CustomerDashboard />} />
  <Route path="/shoppingcart" element={<ShoppingCart />} />
  <Route path="/orderpage/:OrderId" element={<OrderPage />} />
  <Route path="/myorders/:UserId" element={<MyOrders />} />
  
  {/* Add more routes for other pages */}
</Routes>
     </Layout>
    </Router>
    
  );
}

export default App;
