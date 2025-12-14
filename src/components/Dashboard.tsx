import React from 'react';
import { Book } from '../types/Book';
import { BookOpen, CheckCircle, BookMarked, TrendingUp, Calendar, Star, Clock } from 'lucide-react';

interface DashboardProps {
  books: Book[];
  onPageChange: (page: string) => void;
  onViewDetails?: (book: Book) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ books, onPageChange, onViewDetails }) => {
  const stats = {
    total: books.length,
    read: books.filter(book => book.status === 'read').length,
    toRead: books.filter(book => book.status === 'to-read').length,
    totalPages: books.reduce((sum, book) => sum + book.pages, 0),
    readPages: books.filter(book => book.status === 'read').reduce((sum, book) => sum + book.pages, 0),
    averageRating: books.filter(book => book.rating).reduce((sum, book, _, arr) => 
      sum + (book.rating || 0) / arr.length, 0
    ),
  };

  const recentlyRead = books
    .filter(book => book.status === 'read' && (book.dateReadTimestamp || book.dateRead))
    .sort((a, b) => {
      const aTime = a.dateReadTimestamp ? new Date(a.dateReadTimestamp).getTime() : new Date(a.dateRead!).getTime();
      const bTime = b.dateReadTimestamp ? new Date(b.dateReadTimestamp).getTime() : new Date(b.dateRead!).getTime();
      return bTime - aTime;
    })
    .slice(0, 3);

  const upcomingReads = books
    .filter(book => book.status === 'to-read')
    .sort((a, b) => new Date(b.dateAdded).getTime() - new Date(a.dateAdded).getTime())
    .slice(0, 3);

  const StatCard = ({ title, value, icon: Icon, color, onClick, subtitle }: any) => (
    <div 
      onClick={onClick}
      className={`bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-all duration-200 cursor-pointer group`}
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-3xl font-bold text-gray-900 mt-1">{value}</p>
          {subtitle && <p className="text-sm text-gray-500 mt-1">{subtitle}</p>}
        </div>
        <div className={`p-3 rounded-lg ${color} group-hover:scale-105 transition-transform`}>
          <Icon className="h-6 w-6 text-white" />
        </div>
      </div>
    </div>
  );

  const BookPreview = ({ book }: { book: Book }) => {
    const [imageError, setImageError] = React.useState(false);

    const formatDateTime = (timestamp: string) => {
      const date = new Date(timestamp);
      return {
        date: date.toLocaleDateString(),
        time: date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
    };

    return (
      <div
        className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer"
        onClick={() => onViewDetails?.(book)}
      >
        <div className="w-12 h-16 flex-shrink-0 rounded overflow-hidden">
          {book.imageUrl && !imageError ? (
            <img
              src={book.imageUrl}
              alt={`${book.title} cover`}
              className="w-full h-full object-cover"
              onError={() => setImageError(true)}
            />
          ) : (
            <div className={`w-full h-full ${book.coverColor} flex items-center justify-center`}>
              <div className="text-white text-xs font-bold text-center leading-tight">
                {book.title.split(' ').map(word => word[0]).join('').slice(0, 2)}
              </div>
            </div>
          )}
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-medium text-gray-900 truncate hover:text-blue-600 transition-colors">{book.title}</p>
          <p className="text-sm text-gray-500">{book.author}</p>
          <div className="flex items-center mt-1">
            {book.rating && (
              <div className="flex items-center space-x-1 mr-3">
                {[...Array(book.rating)].map((_, i) => (
                  <Star key={i} className="h-3 w-3 text-yellow-400 fill-current" />
                ))}
              </div>
            )}
            <div className="flex flex-col text-xs text-gray-500">
              {book.status === 'read' && book.dateReadTimestamp ? (
                <>
                  <div className="flex items-center">
                    <CheckCircle className="h-3 w-3 mr-1" />
                    <span>{formatDateTime(book.dateReadTimestamp).date}</span>
                  </div>
                  <div className="flex items-center">
                    <Clock className="h-3 w-3 mr-1" />
                    <span>{formatDateTime(book.dateReadTimestamp).time}</span>
                  </div>
                </>
              ) : book.status === 'read' && book.dateRead ? (
                <div className="flex items-center">
                  <Calendar className="h-3 w-3 mr-1" />
                  <span>{new Date(book.dateRead).toLocaleDateString()}</span>
                </div>
              ) : (
                <div className="flex items-center">
                  <Calendar className="h-3 w-3 mr-1" />
                  <span>Added {new Date(book.dateAdded).toLocaleDateString()}</span>
                </div>
              )}
            </div>
          </div>
        </div>
        {book.status === 'to-read' && (
          <span className="text-xs font-medium text-blue-700 bg-blue-100 px-2 py-1 rounded-full">
            {book.pages} pages
          </span>
        )}
      </div>
    );
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Dashboard</h1>
        <p className="text-gray-600">Welcome back! Here's an overview of your reading journey.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard
          title="Total Books"
          value={stats.total}
          icon={BookOpen}
          color="bg-blue-600"
          onClick={() => onPageChange('all')}
        />
        <StatCard
          title="Books Read"
          value={stats.read}
          icon={CheckCircle}
          color="bg-green-500"
          onClick={() => onPageChange('read')}
          subtitle={`${stats.readPages.toLocaleString()} pages`}
        />
        <StatCard
          title="To Read"
          value={stats.toRead}
          icon={BookMarked}
          color="bg-blue-500"
          onClick={() => onPageChange('to-read')}
        />
        <StatCard
          title="Avg Rating"
          value={stats.averageRating > 0 ? stats.averageRating.toFixed(1) : '—'}
          icon={Star}
          color="bg-yellow-500"
          subtitle={stats.averageRating > 0 ? 'out of 5' : 'No ratings yet'}
        />
      </div>

      {/* Reading Progress */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
        <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
          <TrendingUp className="h-5 w-5 mr-2 text-blue-600" />
          Reading Progress
        </h2>
        <div className="space-y-4">
          <div>
            <div className="flex justify-between text-sm font-medium text-gray-700 mb-1">
              <span>Books Completed</span>
              <span>{stats.read} of {stats.total}</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3">
              <div 
                className="bg-gradient-to-r from-green-500 to-green-600 h-3 rounded-full transition-all duration-500"
                style={{ width: `${stats.total > 0 ? (stats.read / stats.total) * 100 : 0}%` }}
              ></div>
            </div>
          </div>
          <div>
            <div className="flex justify-between text-sm font-medium text-gray-700 mb-1">
              <span>Pages Read</span>
              <span>{stats.readPages.toLocaleString()} of {stats.totalPages.toLocaleString()}</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3">
              <div 
                className="bg-gradient-to-r from-blue-500 to-blue-600 h-3 rounded-full transition-all duration-500"
                style={{ width: `${stats.totalPages > 0 ? (stats.readPages / stats.totalPages) * 100 : 0}%` }}
              ></div>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recently Read */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
            <CheckCircle className="h-5 w-5 mr-2 text-green-600" />
            Recently Read
          </h2>
          {recentlyRead.length > 0 ? (
            <div className="space-y-2">
              {recentlyRead.map((book) => (
                <BookPreview key={book.id} book={book} />
              ))}
            </div>
          ) : (
            <p className="text-gray-500 text-center py-8">No books read yet</p>
          )}
        </div>

        {/* Up Next */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
            <BookMarked className="h-5 w-5 mr-2 text-blue-600" />
            Up Next
          </h2>
          {upcomingReads.length > 0 ? (
            <div className="space-y-2">
              {upcomingReads.map((book) => (
                <BookPreview key={book.id} book={book} />
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-gray-500 mb-4">No books in your reading list</p>
              <button
                onClick={() => onPageChange('add')}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
              >
                Add Your First Book
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;