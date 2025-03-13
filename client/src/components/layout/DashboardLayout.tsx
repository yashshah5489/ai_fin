import React from "react";
import Sidebar from "./Sidebar";
import TopBar from "./TopBar";
import { useLocation } from "wouter";

interface DashboardLayoutProps {
  children: React.ReactNode;
  title: string;
  description?: string;
}

export default function DashboardLayout({ children, title, description }: DashboardLayoutProps) {
  const [location] = useLocation();
  
  // Determine current page from location
  const getCurrentPage = () => {
    if (location === "/") return "Dashboard";
    return location.slice(1).split("-").map(word => 
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(" ");
  };

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Sidebar */}
      <Sidebar currentPage={getCurrentPage()} />
      
      <div className="flex flex-col flex-1 w-0 overflow-hidden">
        {/* Top Navigation */}
        <TopBar />
        
        {/* Main Content */}
        <main className="flex-1 relative overflow-y-auto focus:outline-none bg-gray-50">
          <div className="py-6 px-4 sm:px-6 lg:px-8">
            {/* Page Header */}
            <div className="mb-6">
              <h1 className="text-2xl font-semibold text-gray-900">{title}</h1>
              {description && (
                <p className="mt-1 text-sm text-gray-500">{description}</p>
              )}
            </div>
            
            {/* Page Content */}
            {children}
            
            {/* Footer */}
            <div className="mt-8 border-t border-gray-200 pt-5">
              <div className="flex justify-between items-center">
                <div className="text-sm text-gray-500">
                  © 2023 Smart AI Analyzer. All rights reserved.
                </div>
                <div className="flex space-x-4">
                  <a href="#" className="text-sm text-gray-500 hover:text-gray-700">Privacy Policy</a>
                  <a href="#" className="text-sm text-gray-500 hover:text-gray-700">Terms of Service</a>
                  <a href="#" className="text-sm text-gray-500 hover:text-gray-700">Contact Support</a>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
