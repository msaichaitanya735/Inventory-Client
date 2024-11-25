import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import SupplierManagementPage from './pages/Supplier/SupplierManagementPage';
import InventoryPage from './pages/Inventory/InventoryPage';
import AdminPage from './pages/Admin/AdminPage';
import PurchaseOrdersPage from './pages/Supplier/PurchaseOrdersPage';
import RestockPage from './pages/Inventory/RestockPage';
import QuotationsPage from './pages/Inventory/QuotationsPage';
import RetailerPage from './pages/Retailer/RetailerPage';
import OrderHistoryPage from './pages/Retailer/OrderHistoryPage';
import PaymentPage from './pages/Retailer/PaymentPage';
import SupplierPaymentPage from './pages/Inventory/SupplierPaymentPage';

const App = () => {
  const user = localStorage.getItem('role');
  console.log(user);
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
  
        <Route path="/suppliers" element={<SupplierManagementPage />} />
        <Route path="/purchase-orders" element={<PurchaseOrdersPage/>} />

        

        <Route path="/inventory" element={<InventoryPage />} />
        <Route path="/restock" element={<RestockPage/>}/>
        <Route path="/quotations" element={<QuotationsPage/>}/>
                <Route path="/admin" element={<AdminPage />} />
        {/* <Route path="/admin" element={<AdminPage />} /> */}
        <Route path="/orders" element={<OrderHistoryPage/>} />

        <Route path="/retailer" element={<RetailerPage/>} />
        {/* <Route path="/payment" element={<PaymentPage/>} />   */}

                <Route path="/payment" element={<PaymentPage/>} />  
                <Route path="/supplierpayment" element={<SupplierPaymentPage/>}/>
                <Route path="/orderhistory" element={<OrderHistoryPage/>}/>


        {/* Add more routes for other pages */}
      </Routes>
    </Router>
  );
};

export default App;