// src/pages/AdminPage.js
import React, { useState } from 'react';
import UserGrid from './UserGrid';
import CategoryGrid from './CategoryGrid';
import UnauthorizedUserGrid from './UnauthorizedUserGrid';
import { useNavigate } from 'react-router-dom';
import ProductGrid from './ProductGrid';
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

  return (
    <div className="admin-container">
      <div className="header">
        <h1 style={{color:'black',paddingLeft:'1vw'}}>Welcome, Admin!</h1>
        <button className="logout-button" onClick={handleLogOut}>Log Out</button>
      </div>

      <div className="tab-container" style={{color:'black'}}>
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
