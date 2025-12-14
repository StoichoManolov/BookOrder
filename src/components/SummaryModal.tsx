import React from 'react';
import { X, FileText, BookOpen } from 'lucide-react';
import { Book } from '../types/Book';

interface SummaryModalProps {
  book: Book;
  onClose: () => void;
}

const SummaryModal: React.FC<SummaryModalProps> = ({ book, onClose }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-4 flex justify-between items-center z-10 rounded-t-2xl">
          <div className="flex items-center space-x-3">
            <FileText className="h-6 w-6 text-white" />
            <h2 className="text-xl font-bold text-white">Summary</h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-white hover:bg-white hover:bg-opacity-20 rounded-lg transition-colors"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <div className="p-6">
          <div className="mb-6">
            <div className="flex items-start space-x-4">
              <div className="p-3 bg-blue-100 rounded-lg">
                <BookOpen className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-gray-900 mb-1">{book.title}</h3>
                <p className="text-lg text-gray-600">by {book.author}</p>
              </div>
            </div>
          </div>

          <div className="border-t border-gray-200 pt-6">
            {book.summary ? (
              <div className="prose prose-lg max-w-none">
                <p className="text-gray-800 leading-relaxed whitespace-pre-wrap">
                  {book.summary}
                </p>
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-100 rounded-full mb-4">
                  <FileText className="h-8 w-8 text-gray-400" />
                </div>
                <p className="text-gray-500 text-lg">No summary available for this book</p>
              </div>
            )}
          </div>

          <div className="flex justify-end pt-6 border-t border-gray-200 mt-6">
            <button
              onClick={onClose}
              className="px-6 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SummaryModal;
