import React, { useState } from 'react';
import { useBooks } from './hooks/useBooks';
import { Book } from './types/Book';
import Navigation from './components/Navigation';
import Dashboard from './components/Dashboard';
import BookList from './components/BookList';
import BookForm from './components/BookForm';

function App() {
  const { books, addBook, updateBook, deleteBook, markAsRead, markAsToRead } = useBooks();
  const [currentPage, setCurrentPage] = useState('dashboard');
  const [editingBook, setEditingBook] = useState<Book | null>(null);

  // Calculate book counts for navigation
  const bookCounts = {
    total: books.length,
    toRead: books.filter(book => book.status === 'to-read').length,
    read: books.filter(book => book.status === 'read').length,
  };

  const handleEditBook = (book: Book) => {
    setEditingBook(book);
    setCurrentPage('add');
  };

  const handleAddBook = (bookData: Omit<Book, 'id' | 'dateAdded' | 'coverColor'>) => {
    if (editingBook) {
      updateBook(editingBook.id, bookData);
      setEditingBook(null);
    } else {
      addBook(bookData);
    }
    setCurrentPage('dashboard');
  };

  const handleCancelEdit = () => {
    setEditingBook(null);
    setCurrentPage('dashboard');
  };

  const handleDeleteBook = (id: string) => {
    if (window.confirm('Are you sure you want to delete this book?')) {
      deleteBook(id);
    }
  };

  // Listen for navigation events from components
  React.useEffect(() => {
    const handleNavigate = (event: any) => {
      setCurrentPage(event.detail);
    };
    
    window.addEventListener('navigate', handleNavigate);
    return () => window.removeEventListener('navigate', handleNavigate);
  }, []);

  const renderCurrentPage = () => {
    switch (currentPage) {
      case 'dashboard':
        return <Dashboard books={books} onPageChange={setCurrentPage} />;
      
      case 'all':
        return (
          <BookList
            books={books}
            title="All Books"
            emptyMessage="Start building your library by adding your first book."
            onEdit={handleEditBook}
            onDelete={handleDeleteBook}
            onMarkAsRead={markAsRead}
            onMarkAsToRead={markAsToRead}
          />
        );
      
      case 'to-read':
        return (
          <BookList
            books={books.filter(book => book.status === 'to-read')}
            title="Books to Read"
            emptyMessage="Add books you're planning to read to your wishlist."
            onEdit={handleEditBook}
            onDelete={handleDeleteBook}
            onMarkAsRead={markAsRead}
            onMarkAsToRead={markAsToRead}
          />
        );
      
      case 'read':
        return (
          <BookList
            books={books.filter(book => book.status === 'read')}
            title="Books I've Read"
            emptyMessage="Books you've finished will appear here."
            onEdit={handleEditBook}
            onDelete={handleDeleteBook}
            onMarkAsRead={markAsRead}
            onMarkAsToRead={markAsToRead}
          />
        );
      
      case 'add':
        return (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <BookForm
              book={editingBook || undefined}
              onSubmit={handleAddBook}
              onCancel={handleCancelEdit}
            />
          </div>
        );
      
      default:
        return <Dashboard books={books} onPageChange={setCurrentPage} />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation 
        currentPage={currentPage} 
        onPageChange={setCurrentPage}
        bookCounts={bookCounts}
      />
      <main>
        {renderCurrentPage()}
      </main>
    </div>
  );
}

export default App;