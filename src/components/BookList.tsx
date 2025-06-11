import React, { useState } from 'react';
import { Book } from '../types/Book';
import BookCard from './BookCard';
import { Search, Filter, Grid, List } from 'lucide-react';

interface BookListProps {
  books: Book[];
  title: string;
  emptyMessage: string;
  onEdit: (book: Book) => void;
  onDelete: (id: string) => void;
  onMarkAsRead: (id: string, rating?: number, notes?: string) => void;
  onMarkAsToRead: (id: string) => void;
}

const BookList: React.FC<BookListProps> = ({
  books,
  title,
  emptyMessage,
  onEdit,
  onDelete,
  onMarkAsRead,
  onMarkAsToRead,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('dateAdded');
  const [sortOrder, setSortOrder] = useState('desc');
  const [filterGenre, setFilterGenre] = useState('');
  const [viewMode, setViewMode] = useState('grid');

  const filteredBooks = books
    .filter(book => {
      const matchesSearch = 
        book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        book.author.toLowerCase().includes(searchTerm.toLowerCase()) ||
        book.genre.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesGenre = !filterGenre || book.genre === filterGenre;
      
      return matchesSearch && matchesGenre;
    })
    .sort((a, b) => {
      let aValue, bValue;
      
      switch (sortBy) {
        case 'title':
          aValue = a.title.toLowerCase();
          bValue = b.title.toLowerCase();
          break;
        case 'author':
          aValue = a.author.toLowerCase();
          bValue = b.author.toLowerCase();
          break;
        case 'pages':
          aValue = a.pages;
          bValue = b.pages;
          break;
        case 'rating':
          aValue = a.rating || 0;
          bValue = b.rating || 0;
          break;
        case 'dateRead':
          aValue = a.dateRead ? new Date(a.dateRead).getTime() : 0;
          bValue = b.dateRead ? new Date(b.dateRead).getTime() : 0;
          break;
        default:
          aValue = new Date(a.dateAdded).getTime();
          bValue = new Date(b.dateAdded).getTime();
      }
      
      if (typeof aValue === 'string' && typeof bValue === 'string') {
        return sortOrder === 'asc' 
          ? aValue.localeCompare(bValue)
          : bValue.localeCompare(aValue);
      }
      
      return sortOrder === 'asc' ? aValue - bValue : bValue - aValue;
    });

  const genres = [...new Set(books.map(book => book.genre))].sort();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">{title}</h1>
        <p className="text-gray-600">
          {filteredBooks.length} {filteredBooks.length === 1 ? 'book' : 'books'}
          {searchTerm && ` matching "${searchTerm}"`}
        </p>
      </div>

      {/* Filters and Search */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
        <div className="flex flex-col lg:flex-row gap-4">
          {/* Search */}
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search books, authors, or genres..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>
          </div>

          {/* Genre Filter */}
          <div className="lg:w-48">
            <select
              value={filterGenre}
              onChange={(e) => setFilterGenre(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            >
              <option value="">All Genres</option>
              {genres.map(genre => (
                <option key={genre} value={genre}>{genre}</option>
              ))}
            </select>
          </div>

          {/* Sort */}
          <div className="lg:w-48">
            <select
              value={`${sortBy}-${sortOrder}`}
              onChange={(e) => {
                const [field, order] = e.target.value.split('-');
                setSortBy(field);
                setSortOrder(order);
              }}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            >
              <option value="dateAdded-desc">Recently Added</option>
              <option value="dateAdded-asc">Oldest First</option>
              <option value="title-asc">Title A-Z</option>
              <option value="title-desc">Title Z-A</option>
              <option value="author-asc">Author A-Z</option>
              <option value="author-desc">Author Z-A</option>
              <option value="pages-desc">Most Pages</option>
              <option value="pages-asc">Least Pages</option>
              <option value="rating-desc">Highest Rated</option>
              <option value="dateRead-desc">Recently Read</option>
            </select>
          </div>

          {/* View Mode */}
          <div className="flex border border-gray-300 rounded-lg overflow-hidden">
            <button
              onClick={() => setViewMode('grid')}
              className={`px-4 py-3 ${
                viewMode === 'grid' 
                  ? 'bg-indigo-600 text-white' 
                  : 'bg-white text-gray-700 hover:bg-gray-50'
              } transition-colors`}
            >
              <Grid className="h-5 w-5" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`px-4 py-3 ${
                viewMode === 'list' 
                  ? 'bg-indigo-600 text-white' 
                  : 'bg-white text-gray-700 hover:bg-gray-50'
              } transition-colors`}
            >
              <List className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Books Grid/List */}
      {filteredBooks.length > 0 ? (
        <div className={`${
          viewMode === 'grid' 
            ? 'grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6' 
            : 'space-y-4'
        }`}>
          {filteredBooks.map((book) => (
            <BookCard
              key={book.id}
              book={book}
              onEdit={onEdit}
              onDelete={onDelete}
              onMarkAsRead={onMarkAsRead}
              onMarkAsToRead={onMarkAsToRead}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-16">
          <div className="max-w-md mx-auto">
            <div className="mb-6">
              <div className="mx-auto h-24 w-24 bg-gray-100 rounded-full flex items-center justify-center">
                <Filter className="h-12 w-12 text-gray-400" />
              </div>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              {searchTerm || filterGenre ? 'No books found' : 'No books yet'}
            </h3>
            <p className="text-gray-600 mb-6">
              {searchTerm || filterGenre 
                ? 'Try adjusting your search or filters' 
                : emptyMessage
              }
            </p>
            {!searchTerm && !filterGenre && (
              <button
                onClick={() => window.dispatchEvent(new CustomEvent('navigate', { detail: 'add' }))}
                className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-medium"
              >
                Add Your First Book
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default BookList;