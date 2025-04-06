// components/ResponsiveAdminSidebar.js
'use client'
import { useState, useEffect } from 'react';
import styles from '@/public/assets/css/AdminSidebar.module.css';
import Product from '@/components/admin/products/product'
const ResponsiveAdminSidebar = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  const menuItems = [
    { id: 'dashboard', name: 'Dashboard', icon: '🏠' },
    { id: 'users', name: 'Users', icon: '👥' },
    { id: 'products', name: 'Products', icon: '📦' },
    { id: 'orders', name: 'Orders', icon: '📝' },
    { id: 'settings', name: 'Settings', icon: '⚙️' },
    { id: 'analytics', name: 'Analytics', icon: '📊' },
    { id: 'messages', name: 'Messages', icon: '✉️' },
  ];

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const handleTabChange = (tabId) => {
    setActiveTab(tabId);
    if (isMobile) setIsSidebarOpen(false);
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <div className={styles.content}><h1>Dashboard Overview</h1></div>;
        case 'products':
          return <Product/>
      // Add other cases...
      default:
        return  <Product/>;
    }
  };

  return (
    <div className={styles.container}>
      {isMobile && (
        <button 
          className={styles.hamburger}
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
        >
          ☰
        </button>
      )}

      <div className={`${styles.sidebar} ${isSidebarOpen ? styles.open : ''}`}>
        {isMobile && (
          <button 
            className={styles.closeButton}
            onClick={() => setIsSidebarOpen(false)}
          >
            ×
          </button>
        )}
        
        {menuItems.map((item) => (
          <button
            key={item.id}
            className={`${styles.menuItem} ${activeTab === item.id ? styles.active : ''}`}
            onClick={() => handleTabChange(item.id)}
          >
            <span className={styles.icon}>{item.icon}</span>
            {item.name}
          </button>
        ))}
      </div>

      
    </div>
  );
};

export default ResponsiveAdminSidebar;