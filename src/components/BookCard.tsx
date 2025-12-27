import React, { useState } from 'react';
import { Star, Edit, Trash2, CheckCircle, Calendar, BookOpen, Quote } from 'lucide-react';
import { Book } from '../types/Book';

interface BookCardProps {
  book: Book;
  onEdit: (book: Book) => void;
  onDelete: (id: string) => void;
  onMarkAsRead: (id: string, rating?: number, summary?: string) => void;
  onMarkAsToRead: (id: string) => void;
  onViewDetails?: (book: Book) => void;
  onViewSummary?: (book: Book) => void;
  onViewQuotes?: (book: Book) => void;
}

const BookCard: React.FC<BookCardProps> = ({
  book,
  onEdit,
  onDelete,
  onMarkAsRead,
  onMarkAsToRead,
  onViewDetails,
  onViewSummary,
  onViewQuotes,
}) => {
  const [showQuickRate, setShowQuickRate] = useState(false);
  const [quickRating, setQuickRating] = useState(3);
  const [quickSummary, setQuickSummary] = useState('');
  const [imageError, setImageError] = useState(false);

  const handleMarkAsRead = () => {
    if (book.status === 'to-read') {
      setShowQuickRate(true);
    }
  };

  const submitQuickRate = () => {
    onMarkAsRead(book.id, quickRating, quickSummary);
    setShowQuickRate(false);
    setQuickSummary('');
  };

  const renderStars = (rating: number, interactive = false, onRate?: (rating: number) => void) => {
    return (
      <div className="flex space-x-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`h-4 w-4 ${
              star <= rating
                ? 'text-yellow-400 fill-current'
                : 'text-gray-300'
            } ${interactive ? 'cursor-pointer hover:text-yellow-400' : ''}`}
            onClick={() => interactive && onRate?.(star)}
          />
        ))}
      </div>
    );
  };

  const handleImageError = () => {
    setImageError(true);
  };

  const formatDateTime = (timestamp: string) => {
    const date = new Date(timestamp);
    return {
      date: date.toLocaleDateString(),
      time: date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-all duration-200 group h-full flex flex-col">
      <div className="flex flex-col h-full">
        <div className="w-full h-64 flex-shrink-0 relative overflow-hidden bg-gray-100">
          {book.imageUrl && !imageError ? (
            <img
              src={book.imageUrl}
              alt={`${book.title} cover`}
              className="w-full h-full object-cover"
              onError={handleImageError}
            />
          ) : (
            <div className={`w-full h-full ${book.coverColor} flex items-center justify-center`}>
              <div className="text-white text-center p-6">
                <div className="font-bold text-xl leading-tight mb-2">{book.title}</div>
                <div className="text-sm opacity-90">{book.author}</div>
              </div>
            </div>
          )}

          <div className="absolute top-3 left-3">
            <span className={`px-3 py-1 rounded-full text-xs font-medium shadow-md ${
              book.status === 'read'
                ? 'bg-green-100 text-green-800'
                : 'bg-blue-100 text-blue-800'
            }`}>
              {book.status === 'read' ? 'Read' : 'To Read'}
            </span>
          </div>

          <div className="absolute top-3 right-3 flex items-center space-x-2">
            <button
              onClick={() => onEdit(book)}
              className="p-2 bg-white bg-opacity-90 text-gray-700 hover:bg-opacity-100 hover:text-blue-600 rounded-lg transition-colors shadow-md"
              title="Edit book"
            >
              <Edit className="h-4 w-4" />
            </button>
            <button
              onClick={() => onDelete(book.id)}
              className="p-2 bg-white bg-opacity-90 text-gray-700 hover:bg-opacity-100 hover:text-red-600 rounded-lg transition-colors shadow-md"
              title="Delete book"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        </div>

        <div className="flex-1 p-4 flex flex-col">
          <div className="flex-1">
            <h3
              onClick={() => onViewDetails?.(book)}
              className="font-semibold text-gray-900 text-lg leading-tight cursor-pointer hover:text-blue-600 transition-colors line-clamp-2 mb-1"
            >
              {book.title}
            </h3>
            <p className="text-gray-600 text-sm mb-3 line-clamp-1">{book.author}</p>

            <div className="flex items-center space-x-3 mb-3 text-xs text-gray-500">
              <span className="bg-gray-100 px-2 py-1 rounded-full">{book.genre}</span>
              <span>{book.pages} pages</span>
            </div>

            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center space-x-2">
                {book.status === 'read' && book.rating && (
                  <div className="flex items-center space-x-1">
                    {renderStars(book.rating)}
                  </div>
                )}
              </div>

              <div className="text-xs text-gray-500">
                {book.status === 'read' && book.dateReadTimestamp ? (
                  <div className="flex items-center">
                    <CheckCircle className="h-3 w-3 mr-1" />
                    <span>{formatDateTime(book.dateReadTimestamp).date}</span>
                  </div>
                ) : book.status === 'read' && book.dateRead ? (
                  <div className="flex items-center">
                    <Calendar className="h-3 w-3 mr-1" />
                    <span>{new Date(book.dateRead).toLocaleDateString()}</span>
                  </div>
                ) : (
                  <div className="flex items-center">
                    <Calendar className="h-3 w-3 mr-1" />
                    <span>{new Date(book.dateAdded).toLocaleDateString()}</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-2 pt-3 border-t border-gray-100">
            <button
              onClick={() => onViewDetails?.(book)}
              className="flex-1 flex items-center justify-center px-3 py-2 bg-blue-600 text-white text-xs font-medium rounded-lg hover:bg-blue-700 transition-colors"
            >
              <BookOpen className="h-3 w-3 mr-1" />
              Details
            </button>

            {book.quotes && (
              <button
                onClick={() => onViewQuotes?.(book)}
                className="flex items-center justify-center px-3 py-2 bg-green-600 text-white text-xs font-medium rounded-lg hover:bg-green-700 transition-colors"
                title="View Quotes"
              >
                <Quote className="h-4 w-4" />
              </button>
            )}
          </div>
        </div>
      </div>

      {showQuickRate && (
        <div className="border-t border-gray-200 p-4 bg-gray-50">
          <div className="space-y-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Rate this book:
              </label>
              {renderStars(quickRating, true, setQuickRating)}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Summary (optional):
              </label>
              <textarea
                value={quickSummary}
                onChange={(e) => setQuickSummary(e.target.value)}
                placeholder="Write a summary or your thoughts about this book..."
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 font-serif leading-relaxed"
                rows={3}
              />
            </div>
            <div className="flex space-x-2">
              <button
                onClick={submitQuickRate}
                className="flex-1 px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
              >
                Mark as Read
              </button>
              <button
                onClick={() => setShowQuickRate(false)}
                className="px-4 py-2 text-gray-600 text-sm font-medium rounded-lg hover:bg-gray-200 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BookCard;
