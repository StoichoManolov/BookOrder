import React from 'react';
import { X, Calendar, BookOpen, User, Tag, FileText, Star, CheckCircle, Clock, Quote } from 'lucide-react';
import { Book } from '../types/Book';

interface BookDetailsProps {
  book: Book;
  onClose: () => void;
  onEdit: (book: Book) => void;
}

const BookDetails: React.FC<BookDetailsProps> = ({ book, onClose, onEdit }) => {
  const [imageError, setImageError] = React.useState(false);

  const formatDateTime = (timestamp: string) => {
    const date = new Date(timestamp);
    return {
      date: date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      }),
      time: date.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit'
      })
    };
  };

  const renderStars = (rating: number) => {
    return (
      <div className="flex items-center space-x-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`h-5 w-5 ${
              star <= rating
                ? 'text-yellow-400 fill-current'
                : 'text-gray-300'
            }`}
          />
        ))}
        <span className="ml-2 text-sm text-gray-600 font-medium">{rating} out of 5</span>
      </div>
    );
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center z-10">
          <h2 className="text-2xl font-bold text-gray-900">Book Details</h2>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="md:col-span-1">
              <div className="w-full aspect-[2/3] rounded-lg overflow-hidden shadow-lg">
                {book.imageUrl && !imageError ? (
                  <img
                    src={book.imageUrl}
                    alt={`${book.title} cover`}
                    className="w-full h-full object-cover"
                    onError={() => setImageError(true)}
                  />
                ) : (
                  <div className={`w-full h-full ${book.coverColor} flex items-center justify-center p-6`}>
                    <div className="text-white text-center">
                      <div className="font-bold text-xl leading-tight mb-2">{book.title}</div>
                      <div className="text-sm opacity-90">{book.author}</div>
                    </div>
                  </div>
                )}
              </div>

              <div className="mt-4">
                <span className={`inline-block px-4 py-2 rounded-full text-sm font-semibold ${
                  book.status === 'read'
                    ? 'bg-green-100 text-green-800'
                    : 'bg-blue-100 text-blue-800'
                }`}>
                  {book.status === 'read' ? 'Read' : 'To Read'}
                </span>
              </div>
            </div>

            <div className="md:col-span-2 space-y-6">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">{book.title}</h1>
                <p className="text-xl text-gray-600 mb-4">by {book.author}</p>

                {book.rating && (
                  <div className="mb-4">
                    {renderStars(book.rating)}
                  </div>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-start space-x-3 p-4 bg-gray-50 rounded-lg">
                  <Tag className="h-5 w-5 text-gray-600 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-gray-500">Genre</p>
                    <p className="text-base font-semibold text-gray-900">{book.genre}</p>
                  </div>
                </div>

                <div className="flex items-start space-x-3 p-4 bg-gray-50 rounded-lg">
                  <BookOpen className="h-5 w-5 text-gray-600 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-gray-500">Pages</p>
                    <p className="text-base font-semibold text-gray-900">{book.pages}</p>
                  </div>
                </div>

                <div className="flex items-start space-x-3 p-4 bg-gray-50 rounded-lg">
                  <Calendar className="h-5 w-5 text-gray-600 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-gray-500">Date Added</p>
                    <p className="text-base font-semibold text-gray-900">
                      {new Date(book.dateAdded).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </p>
                  </div>
                </div>

                {book.dateReadTimestamp && (
                  <div className="flex items-start space-x-3 p-4 bg-green-50 rounded-lg">
                    <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-green-700">Finished Reading</p>
                      <p className="text-base font-semibold text-gray-900">
                        {formatDateTime(book.dateReadTimestamp).date}
                      </p>
                      <p className="text-sm text-gray-600">
                        at {formatDateTime(book.dateReadTimestamp).time}
                      </p>
                    </div>
                  </div>
                )}
              </div>

              {book.summary && (
                <div className="mt-6">
                  <div className="flex items-center space-x-2 mb-3">
                    <FileText className="h-5 w-5 text-gray-700" />
                    <h3 className="text-lg font-semibold text-gray-900">Summary</h3>
                  </div>
                  <div className="prose prose-gray max-w-none">
                    <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                      {book.summary}
                    </p>
                  </div>
                </div>
              )}

              {book.quotes && (
                <div className="mt-6">
                  <div className="flex items-center space-x-2 mb-3">
                    <Quote className="h-5 w-5 text-green-600" />
                    <h3 className="text-lg font-semibold text-gray-900">Quotes</h3>
                  </div>
                  <div className="space-y-3">
                    {book.quotes.split('\n').filter(q => q.trim()).map((quote, index) => (
                      <div
                        key={index}
                        className="pl-4 border-l-4 border-green-500 py-2"
                      >
                        <p className="text-gray-700 leading-relaxed italic font-serif">
                          "{quote.trim()}"
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
            <button
              onClick={onClose}
              className="px-6 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
            >
              Close
            </button>
            <button
              onClick={() => {
                onEdit(book);
                onClose();
              }}
              className="px-6 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
            >
              Edit Book
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookDetails;
