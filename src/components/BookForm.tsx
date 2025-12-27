import React, { useState, useEffect } from 'react';
import { Book } from '../types/Book';
import { Star, Save, X } from 'lucide-react';
import ImageUpload from './ImageUpload';

interface BookFormProps {
  book?: Book;
  onSubmit: (bookData: Omit<Book, 'id' | 'dateAdded' | 'coverColor'>) => void;
  onCancel: () => void;
}

const BookForm: React.FC<BookFormProps> = ({ book, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    title: '',
    author: '',
    genre: '',
    pages: '',
    status: 'to-read' as 'to-read' | 'read',
    rating: 0,
    summary: '',
    quotes: '',
    dateRead: '',
    imageUrl: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (book) {
      setFormData({
        title: book.title,
        author: book.author,
        genre: book.genre,
        pages: book.pages.toString(),
        status: book.status,
        rating: book.rating || 0,
        summary: book.summary || '',
        quotes: book.quotes || '',
        dateRead: book.dateRead || '',
        imageUrl: book.imageUrl || '',
      });
    }
  }, [book]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.title.trim()) newErrors.title = 'Title is required';
    if (!formData.author.trim()) newErrors.author = 'Author is required';
    if (!formData.genre.trim()) newErrors.genre = 'Genre is required';
    if (!formData.pages || parseInt(formData.pages) <= 0) {
      newErrors.pages = 'Valid page count is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    const bookData = {
      title: formData.title.trim(),
      author: formData.author.trim(),
      genre: formData.genre.trim(),
      pages: parseInt(formData.pages),
      status: formData.status,
      rating: formData.status === 'read' && formData.rating > 0 ? formData.rating : undefined,
      summary: formData.summary.trim() || undefined,
      quotes: formData.quotes.trim() || undefined,
      dateRead: formData.status === 'read' && formData.dateRead ? formData.dateRead : undefined,
      dateReadTimestamp: formData.status === 'read' && !book?.dateReadTimestamp ? new Date().toISOString() : book?.dateReadTimestamp,
      imageUrl: formData.imageUrl || undefined,
    };

    onSubmit(bookData);
  };

  const renderStars = (rating: number, onRate: (rating: number) => void) => {
    return (
      <div className="flex space-x-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`h-5 w-5 cursor-pointer transition-colors ${
              star <= rating 
                ? 'text-yellow-400 fill-current' 
                : 'text-gray-300 hover:text-yellow-300'
            }`}
            onClick={() => onRate(star)}
          />
        ))}
      </div>
    );
  };

  return (
    <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 p-6">
        <h2 className="text-2xl font-bold text-white">
          {book ? 'Edit Book' : 'Add New Book'}
        </h2>
        <p className="text-blue-100 mt-1">
          {book ? 'Update book information' : 'Add a new book to your collection'}
        </p>
      </div>

      <form onSubmit={handleSubmit} className="p-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Image Upload Section */}
          <div className="lg:col-span-1">
            <ImageUpload
              currentImage={formData.imageUrl}
              onImageChange={(imageUrl) => setFormData({ ...formData, imageUrl: imageUrl || '' })}
            />
          </div>

          {/* Form Fields Section */}
          <div className="lg:col-span-2 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Title *
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                    errors.title ? 'border-red-300 bg-red-50' : 'border-gray-300'
                  }`}
                  placeholder="Enter book title"
                />
                {errors.title && <p className="mt-1 text-sm text-red-600">{errors.title}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Author *
                </label>
                <input
                  type="text"
                  value={formData.author}
                  onChange={(e) => setFormData({ ...formData, author: e.target.value })}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                    errors.author ? 'border-red-300 bg-red-50' : 'border-gray-300'
                  }`}
                  placeholder="Enter author name"
                />
                {errors.author && <p className="mt-1 text-sm text-red-600">{errors.author}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Genre *
                </label>
                <input
                  type="text"
                  value={formData.genre}
                  onChange={(e) => setFormData({ ...formData, genre: e.target.value })}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                    errors.genre ? 'border-red-300 bg-red-50' : 'border-gray-300'
                  }`}
                  placeholder="e.g., Fiction, Science Fiction, Biography"
                />
                {errors.genre && <p className="mt-1 text-sm text-red-600">{errors.genre}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Pages *
                </label>
                <input
                  type="number"
                  value={formData.pages}
                  onChange={(e) => setFormData({ ...formData, pages: e.target.value })}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                    errors.pages ? 'border-red-300 bg-red-50' : 'border-gray-300'
                  }`}
                  placeholder="Number of pages"
                  min="1"
                />
                {errors.pages && <p className="mt-1 text-sm text-red-600">{errors.pages}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Reading Status
                </label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value as 'to-read' | 'read' })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="to-read">To Read</option>
                  <option value="read">Read</option>
                </select>
              </div>
            </div>

            {formData.status === 'read' && (
              <div className="space-y-4 p-4 bg-green-50 rounded-lg border border-green-200">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Rating (optional)
                  </label>
                  {renderStars(formData.rating, (rating) => setFormData({ ...formData, rating }))}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Date Read (optional)
                  </label>
                  <input
                    type="date"
                    value={formData.dateRead}
                    onChange={(e) => setFormData({ ...formData, dateRead: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                  <p className="mt-1 text-xs text-gray-500">
                    Note: The exact completion time will be recorded automatically when you mark a book as read.
                  </p>
                </div>
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Summary (optional)
              </label>
              <textarea
                value={formData.summary}
                onChange={(e) => setFormData({ ...formData, summary: e.target.value })}
                rows={6}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 font-serif leading-relaxed"
                placeholder="Write a detailed summary of this book... unlimited characters"
              />
              <p className="mt-1 text-xs text-gray-500">
                Add your thoughts, key takeaways, or a detailed synopsis. No character limit.
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Quotes (optional)
              </label>
              <textarea
                value={formData.quotes}
                onChange={(e) => setFormData({ ...formData, quotes: e.target.value })}
                rows={6}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 font-serif leading-relaxed"
                placeholder="Add your favorite quotes from this book... Each quote on a new line"
              />
              <p className="mt-1 text-xs text-gray-500">
                Add memorable quotes, one per line. They will be displayed beautifully in the quotes view.
              </p>
            </div>

            <div className="flex space-x-4 pt-4">
              <button
                type="submit"
                className="flex-1 flex items-center justify-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors font-medium"
              >
                <Save className="h-5 w-5 mr-2" />
                {book ? 'Update Book' : 'Add Book'}
              </button>
              <button
                type="button"
                onClick={onCancel}
                className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors font-medium"
              >
                <X className="h-5 w-5 mr-2 inline" />
                Cancel
              </button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default BookForm;