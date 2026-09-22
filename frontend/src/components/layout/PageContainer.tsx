import React from 'react';
import { Sidebar } from './Sidebar';
import { Navbar } from './Navbar';

interface PageContainerProps {
  children: React.ReactNode;
}

export const PageContainer: React.FC<PageContainerProps> = ({ children }) => {
  return (
    <div className="flex min-h-screen bg-[#FDF7E4] dark:bg-[#1C110A] text-[#2C1A0E] dark:text-[#F9EBD5] transition-colors">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <Navbar />
        <main className="flex-1 p-6 md:p-8 max-w-7xl w-full mx-auto space-y-6">
          {children}
        </main>
      </div>
    </div>
  );
};
