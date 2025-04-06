"use client";

import React, { FC, ReactNode } from 'react';
import AdminDashboardMenu from './AdminDashboardMenu'; // Adjust the path as needed

interface DashboardWrapperProps {
  children: ReactNode;
}

const DashboardWrapper: FC<DashboardWrapperProps> = ({ children }) => {
  return (
    <div
      className="
        grid h-screen 
        sm:grid-cols-[0fr_4fr] 
        md:grid-cols-[1fr_3fr] 
        lg:grid-cols-[minmax(200px,auto)_1fr] 
        grid-cols-[0fr_4fr]
      "
    >
      {/* Sidebar / First Grid Cell */}
      <div>
        <AdminDashboardMenu />
      </div>

      {/* Main Content / Second Grid Cell */}
      <div className="bg-[#16404D] text-white shadow-lg p-3 flex-1 overflow-y-auto min-h-0">
        {children}
      </div>
    </div>
  );
};

export default DashboardWrapper;
