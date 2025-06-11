import React, { useState } from 'react';
import { Star, Edit, Trash2, CheckCircle, BookMarked, Calendar, FileText, Clock } from 'lucide-react';
import { Book } from '../types/Book';

interface BookCardProps {
  book: Book;
  onEdit: (book: Book) => void;
  onDelete: (id: string) => void;
  onMarkAsRead: (id: string, rating?: number, notes?: string) => void;
  onMarkAsToRead: (id: string) => void;
}

const BookCard: React.FC<BookCardProps> = ({
  book,
  onEdit,
  onDelete,
  onMarkAsRead,
  onMarkAsToRead,
}) => {
  const [showQuickRate, setShowQuickRate] = useState(false);
  const [quickRating, setQuickRating] = useState(3);
  const [quickNotes, setQuickNotes] = useState('');
  const [imageError, setImageError] = useState(false);

  const handleMarkAsRead = () => {
    if (book.status === 'to-read') {
      setShowQuickRate(true);
    } else {
      onMarkAsToRead(book.id);
    }
  };

  const submitQuickRate = () => {
    onMarkAsRead(book.id, quickRating, quickNotes);
    setShowQuickRate(false);
    setQuickNotes('');
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
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-all duration-200 group">
      <div className="flex">
        {/* Book Cover */}
        <div className="w-32 h-40 flex-shrink-0 relative overflow-hidden">
          {book.imageUrl && !imageError ? (
            <img
              src={book.imageUrl}
              alt={`${book.title} cover`}
              className="w-full h-full object-cover"
              onError={handleImageError}
            />
          ) : (
            <div className={`w-full h-full ${book.coverColor} flex items-center justify-center`}>
              <div className="text-white text-center p-3">
                <div className="font-bold text-sm leading-tight mb-1">{book.title}</div>
                <div className="text-xs opacity-90">{book.author}</div>
              </div>
            </div>
          )}
          
          {/* Status Badge */}
          <div className="absolute top-2 left-2">
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
              book.status === 'read'
                ? 'bg-green-100 text-green-800'
                : 'bg-blue-100 text-blue-800'
            }`}>
              {book.status === 'read' ? 'Read' : 'To Read'}
            </span>
          </div>
        </div>

        {/* Book Details */}
        <div className="flex-1 p-4">
          <div className="flex justify-between items-start">
            <div className="flex-1">
              <h3 className="font-semibold text-gray-900 text-lg leading-tight">{book.title}</h3>
              <p className="text-gray-600 text-sm mt-1">{book.author}</p>
              <div className="flex items-center space-x-4 mt-2 text-xs text-gray-500">
                <span className="bg-gray-100 px-2 py-1 rounded-full">{book.genre}</span>
                <span>{book.pages} pages</span>
              </div>
            </div>

            <div className="flex items-center space-x-2 ml-4">
              <button
                onClick={() => onEdit(book)}
                className="p-2 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
              >
                <Edit className="h-4 w-4" />
              </button>
              <button
                onClick={() => onDelete(book.id)}
                className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* Rating and Status */}
          <div className="mt-3 flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <button
                onClick={handleMarkAsRead}
                className={`flex items-center px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
                  book.status === 'read'
                    ? 'bg-green-100 text-green-800 hover:bg-green-200'
                    : 'bg-blue-100 text-blue-800 hover:bg-blue-200'
                }`}
              >
                {book.status === 'read' ? (
                  <>
                    <CheckCircle className="h-3 w-3 mr-1" />
                    Mark as To Read
                  </>
                ) : (
                  <>
                    <BookMarked className="h-3 w-3 mr-1" />
                    Mark as Read
                  </>
                )}
              </button>

              {book.status === 'read' && book.rating && (
                <div className="flex items-center space-x-1">
                  {renderStars(book.rating)}
                </div>
              )}
            </div>

            <div className="flex flex-col items-end space-y-1 text-xs text-gray-500">
              {book.status === 'read' && book.dateReadTimestamp ? (
                <>
                  <div className="flex items-center">
                    <CheckCircle className="h-3 w-3 mr-1" />
                    <span>Finished {formatDateTime(book.dateReadTimestamp).date}</span>
                  </div>
                  <div className="flex items-center">
                    <Clock className="h-3 w-3 mr-1" />
                    <span>at {formatDateTime(book.dateReadTimestamp).time}</span>
                  </div>
                </>
              ) : book.status === 'read' && book.dateRead ? (
                <div className="flex items-center">
                  <Calendar className="h-3 w-3 mr-1" />
                  <span>Read {new Date(book.dateRead).toLocaleDateString()}</span>
                </div>
              ) : (
                <div className="flex items-center">
                  <Calendar className="h-3 w-3 mr-1" />
                  <span>Added {new Date(book.dateAdded).toLocaleDateString()}</span>
                </div>
              )}
            </div>
          </div>

          {book.notes && (
            <div className="mt-2 flex items-start space-x-2 text-xs text-gray-600">
              <FileText className="h-3 w-3 mt-0.5 flex-shrink-0" />
              <p className="italic">{book.notes}</p>
            </div>
          )}
        </div>
      </div>

      {/* Quick Rate Modal */}
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
                Notes (optional):
              </label>
              <textarea
                value={quickNotes}
                onChange={(e) => setQuickNotes(e.target.value)}
                placeholder="What did you think of this book?"
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                rows={2}
              />
            </div>
            <div className="flex space-x-2">
              <button
                onClick={submitQuickRate}
                className="flex-1 px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700 transition-colors"
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