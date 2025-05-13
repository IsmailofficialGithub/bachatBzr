"use client";
import React, { FC, ReactNode } from 'react';
import AdminDashboardMenu from './AdminDashboardMenu'; // Adjust the path as needed
import '@/app/admin/dashboard/admin.css'
// Import the custom CSS

interface DashboardWrapperProps {
  children: ReactNode;
}

const DashboardWrapper: FC<DashboardWrapperProps> = ({ children }) => {
  return (
    <div className="dashboard-wrapper">
      <div className="sidebar">
        <AdminDashboardMenu />
      </div>

      <div className="main-content">
        {children}
      </div>
    </div>
  );
};

export default DashboardWrapper;
