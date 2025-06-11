import React from 'react';
import { BookOpen, Home, BookMarked, CheckCircle, Plus } from 'lucide-react';

interface NavigationProps {
  currentPage: string;
  onPageChange: (page: string) => void;
  bookCounts: {
    total: number;
    toRead: number;
    read: number;
  };
}

const Navigation: React.FC<NavigationProps> = ({ currentPage, onPageChange, bookCounts }) => {
  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: Home },
    { id: 'all', label: 'All Books', icon: BookOpen, count: bookCounts.total },
    { id: 'to-read', label: 'To Read', icon: BookMarked, count: bookCounts.toRead },
    { id: 'read', label: 'Read', icon: CheckCircle, count: bookCounts.read },
    { id: 'add', label: 'Add Book', icon: Plus },
  ];

  return (
    <nav className="bg-white shadow-lg border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-2">
            <BookOpen className="h-8 w-8 text-indigo-600" />
            <h1 className="text-xl font-bold text-gray-900">BookShelf</h1>
          </div>
          
          <div className="hidden md:flex items-center space-x-1">
            {navItems.map(({ id, label, icon: Icon, count }) => (
              <button
                key={id}
                onClick={() => onPageChange(id)}
                className={`flex items-center px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                  currentPage === id
                    ? 'bg-indigo-100 text-indigo-700 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                }`}
              >
                <Icon className="h-4 w-4 mr-2" />
                {label}
                {count !== undefined && (
                  <span className={`ml-2 px-2 py-0.5 rounded-full text-xs font-semibold ${
                    currentPage === id
                      ? 'bg-indigo-200 text-indigo-800'
                      : 'bg-gray-200 text-gray-700'
                  }`}>
                    {count}
                  </span>
                )}
              </button>
            ))}
          </div>

          <div className="md:hidden">
            <select
              value={currentPage}
              onChange={(e) => onPageChange(e.target.value)}
              className="rounded-lg border-gray-300 text-sm font-medium focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            >
              {navItems.map(({ id, label, count }) => (
                <option key={id} value={id}>
                  {label} {count !== undefined ? `(${count})` : ''}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;