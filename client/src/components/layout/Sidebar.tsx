import { Link } from "wouter";
import {
  LayoutDashboard,
  LineChart,
  Wallet,
  FileText,
  Bot,
  TrendingUp,
  ShieldAlert,
  Settings,
  User,
} from "lucide-react";

interface SidebarProps {
  currentPage: string;
}

export default function Sidebar({ currentPage }: SidebarProps) {
  // Navigation items
  const navItems = [
    { name: "Dashboard", icon: <LayoutDashboard className="w-5 h-5" />, href: "/" },
    { name: "Investments", icon: <LineChart className="w-5 h-5" />, href: "/investments" },
    { name: "Budget", icon: <Wallet className="w-5 h-5" />, href: "/budget" },
    { name: "Reports", icon: <FileText className="w-5 h-5" />, href: "/reports" },
    { name: "AI Advisor", icon: <Bot className="w-5 h-5" />, href: "/ai-advisor" },
    { name: "Forecasting", icon: <TrendingUp className="w-5 h-5" />, href: "/forecasting" },
    { name: "Risk Analysis", icon: <ShieldAlert className="w-5 h-5" />, href: "/risk-analysis" },
    { name: "Profile", icon: <User className="w-5 h-5" />, href: "/profile" },
    { name: "Settings", icon: <Settings className="w-5 h-5" />, href: "/settings" },
  ];

  return (
    <aside className="hidden md:flex md:flex-shrink-0">
      <div className="flex flex-col w-64 bg-white border-r border-gray-200">
        <div className="flex items-center justify-center h-16 px-4 border-b border-gray-200">
          <h1 className="text-xl font-bold text-primary">Smart AI Analyzer</h1>
        </div>
        <div className="flex flex-col flex-grow px-4 pt-5 pb-4 overflow-y-auto custom-scrollbar">
          <div className="flex-grow flex flex-col">
            <nav className="flex-1 space-y-1">
              {navItems.map((item) => {
                const isActive = item.name === currentPage;
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={`flex items-center px-2 py-2 text-sm font-medium rounded-md ${
                      isActive
                        ? "text-white bg-primary"
                        : "text-gray-700 hover:bg-gray-100"
                    }`}
                  >
                    <span className={`mr-3 ${isActive ? "text-white" : "text-gray-500"}`}>
                      {item.icon}
                    </span>
                    {item.name}
                  </Link>
                );
              })}
            </nav>
          </div>
          <div className="mt-auto">
            <div className="flex items-center px-4 py-3 bg-gray-50 rounded-lg">
              <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center text-white">
                <User className="h-4 w-4" />
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-700">John Doe</p>
                <p className="text-xs font-medium text-gray-500">john@example.com</p>
              </div>
              <div className="ml-auto">
                <button className="text-gray-500 hover:text-gray-700">
                  <Settings className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
}
