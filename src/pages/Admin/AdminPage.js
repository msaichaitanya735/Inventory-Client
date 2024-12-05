import React, { useState } from 'react';
import UserGrid from './UserGrid';
import CategoryGrid from './CategoryGrid';
import UnauthorizedUserGrid from './UnauthorizedUserGrid';
import ProductGrid from './ProductGrid';
import { useNavigate } from 'react-router-dom';
import './AdminPage.css';

const AdminPage = () => {
  const [activeTab, setActiveTab] = useState('users');
  const navigate = useNavigate();

  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };

  const handleLogOut = () => {
    localStorage.clear();
    navigate('/');
  };

  const handleManageInventory = () => {
    navigate('/inventory'); // Redirect to the inventory page
  };

  return (
    <div className="admin-container">
      <div className="header">
        <h1 style={{ color: 'black', paddingLeft: '1vw' }}>Welcome, Admin!</h1>
        <button className="logout-button" onClick={handleLogOut}>Log Out</button>
      </div>

      {/* Manage Inventory Button */}
      <div className="manage-inventory-container">
        <button className="manage-inventory-button" onClick={handleManageInventory}>
          Manage Inventory
        </button>
      </div>

      {/* Tab Navigation */}
      <div className="tab-container" style={{ color: 'black' }}>
        <button
          className={activeTab === 'users' ? 'active' : ''}
          onClick={() => handleTabChange('users')}
        >
          Users
        </button>
        <button
          className={activeTab === 'products' ? 'active' : ''}
          onClick={() => handleTabChange('products')}
        >
          Products
        </button>
        <button
          className={activeTab === 'categories' ? 'active' : ''}
          onClick={() => handleTabChange('categories')}
        >
          Categories
        </button>
        <button
          className={activeTab === 'unauthorizedUsers' ? 'active' : ''}
          onClick={() => handleTabChange('unauthorizedUsers')}
        >
          Pending Approval
        </button>
      </div>

      {/* Tab Content */}
      <div className="tab-content">
        {activeTab === 'users' && <UserGrid />}
        {activeTab === 'products' && <ProductGrid />}
        {activeTab === 'categories' && <CategoryGrid />}
        {activeTab === 'unauthorizedUsers' && <UnauthorizedUserGrid />}
      </div>
    </div>
  );
};

export default AdminPage;
