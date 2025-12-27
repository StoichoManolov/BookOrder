import React from 'react';
import { X, Quote, BookOpen } from 'lucide-react';
import { Book } from '../types/Book';

interface QuotesModalProps {
  book: Book;
  onClose: () => void;
}

const QuotesModal: React.FC<QuotesModalProps> = ({ book, onClose }) => {
  const quotes = book.quotes?.split('\n').filter(q => q.trim()) || [];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-gradient-to-r from-green-600 to-green-700 px-6 py-4 flex justify-between items-center z-10 rounded-t-2xl">
          <div className="flex items-center space-x-3">
            <Quote className="h-6 w-6 text-white" />
            <h2 className="text-xl font-bold text-white">Quotes</h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-white hover:bg-white hover:bg-opacity-20 rounded-lg transition-colors"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <div className="p-8">
          <div className="mb-6">
            <div className="flex items-start space-x-4">
              <div className="p-3 bg-green-100 rounded-lg">
                <BookOpen className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-gray-900 mb-1">{book.title}</h3>
                <p className="text-lg text-gray-600">by {book.author}</p>
              </div>
            </div>
          </div>

          <div className="border-t border-gray-200 pt-6">
            {book.quotes ? (
              <div className="space-y-6">
                {quotes.map((quote, index) => (
                  <div
                    key={index}
                    className="relative pl-8 pr-6 py-6 bg-gradient-to-br from-gray-50 to-white border-l-4 border-green-500 rounded-r-lg shadow-sm hover:shadow-md transition-shadow"
                  >
                    <Quote className="absolute top-4 left-2 h-5 w-5 text-green-500 opacity-50" />
                    <p className="text-gray-800 text-lg leading-relaxed font-serif italic">
                      {quote.trim()}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-100 rounded-full mb-4">
                  <Quote className="h-8 w-8 text-gray-400" />
                </div>
                <p className="text-gray-500 text-lg">No quotes available for this book</p>
              </div>
            )}
          </div>

          <div className="flex justify-end pt-6 border-t border-gray-200 mt-8">
            <button
              onClick={onClose}
              className="px-6 py-2.5 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuotesModal;
