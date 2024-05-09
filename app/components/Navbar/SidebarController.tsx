"use client";
import React, { useState } from 'react';
import NavSideBar from '../Navbar/NavSideBar';

const sidebarWidth = "16rem"; // 256px или 64rem в Tailwind

const SidebarController = ({ children }: { children: React.ReactNode }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const mainContentStyle = {
    marginLeft: isSidebarOpen ? sidebarWidth : '0',
    transition: 'margin-left 0.3s ease-out',
  };

  return (
    <>
      <NavSideBar onSidebarToggle={setIsSidebarOpen} />
      <main style={mainContentStyle}>
        {children}
      </main>
    </>
  );
};

export default SidebarController;