"use client";
import React from 'react';
import Sidebar from '../components/side_nav';
import Header from '../components/header';

const NotDeveloped = () => {
  return (
    <div className="flex min-h-screen dark:bg-gray-900 bg-gray-50">
      <Sidebar />
      <main className="flex-1 p-6">
        <Header />
        <div style={{ textAlign: 'center', marginTop: '50px' }}>
      <h1>This module is currently under development and is not yet available.</h1>
    </div>
      </main>
    </div>
    
  );
};
export default NotDeveloped;
