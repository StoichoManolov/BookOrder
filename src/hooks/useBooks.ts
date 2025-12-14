import { useState, useEffect } from 'react';
import { Book } from '../types/Book';
import { getRandomStockImage } from '../utils/imageUtils';

const STORAGE_KEY = 'book-management-app-books';

const generateId = () => Math.random().toString(36).substr(2, 9);

const coverColors = [
  'bg-gradient-to-br from-blue-500 to-blue-600',
  'bg-gradient-to-br from-purple-500 to-purple-600',
  'bg-gradient-to-br from-green-500 to-green-600',
  'bg-gradient-to-br from-orange-500 to-orange-600',
  'bg-gradient-to-br from-red-500 to-red-600',
  'bg-gradient-to-br from-teal-500 to-teal-600',
  'bg-gradient-to-br from-pink-500 to-pink-600',
  'bg-gradient-to-br from-indigo-500 to-indigo-600',
];

const sampleBooks: Book[] = [
  {
    id: '1',
    title: 'The Great Gatsby',
    author: 'F. Scott Fitzgerald',
    genre: 'Classic Literature',
    pages: 180,
    status: 'read',
    rating: 4,
    summary: 'A masterpiece of American literature exploring themes of decadence, idealism, and social upheaval in the Jazz Age. The story primarily concerns the mysterious millionaire Jay Gatsby and his obsession with the beautiful Daisy Buchanan. Set in the summer of 1922, the novel is a critique of the American Dream.',
    dateAdded: '2024-01-15',
    dateRead: '2024-01-20',
    dateReadTimestamp: '2024-01-20T14:30:00.000Z',
    coverColor: coverColors[0],
    imageUrl: 'https://images.pexels.com/photos/159711/books-bookstore-book-reading-159711.jpeg?auto=compress&cs=tinysrgb&w=400',
  },
  {
    id: '2',
    title: 'Dune',
    author: 'Frank Herbert',
    genre: 'Science Fiction',
    pages: 688,
    status: 'to-read',
    dateAdded: '2024-01-10',
    coverColor: coverColors[1],
    imageUrl: 'https://images.pexels.com/photos/1029141/pexels-photo-1029141.jpeg?auto=compress&cs=tinysrgb&w=400',
  },
  {
    id: '3',
    title: 'To Kill a Mockingbird',
    author: 'Harper Lee',
    genre: 'Classic Literature',
    pages: 376,
    status: 'read',
    rating: 5,
    summary: 'A powerful story about justice and morality set in the Depression-era South. Through the eyes of Scout Finch, we witness her father Atticus defend a Black man falsely accused of assault, while learning profound lessons about prejudice, courage, and human dignity. The novel explores the destruction of innocence and the importance of standing up for what is right.',
    dateAdded: '2024-01-05',
    dateRead: '2024-01-12',
    dateReadTimestamp: '2024-01-12T19:45:00.000Z',
    coverColor: coverColors[2],
    imageUrl: 'https://images.pexels.com/photos/46274/pexels-photo-46274.jpeg?auto=compress&cs=tinysrgb&w=400',
  },
];

export const useBooks = () => {
  const [books, setBooks] = useState<Book[]>([]);

  useEffect(() => {
    const storedBooks = localStorage.getItem(STORAGE_KEY);
    if (storedBooks) {
      setBooks(JSON.parse(storedBooks));
    } else {
      setBooks(sampleBooks);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(sampleBooks));
    }
  }, []);

  const saveBooks = (newBooks: Book[]) => {
    setBooks(newBooks);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newBooks));
  };

  const addBook = (bookData: Omit<Book, 'id' | 'dateAdded' | 'coverColor'>) => {
    const now = new Date();
    const newBook: Book = {
      ...bookData,
      id: generateId(),
      dateAdded: now.toISOString().split('T')[0],
      dateReadTimestamp: bookData.status === 'read' ? now.toISOString() : undefined,
      coverColor: coverColors[Math.floor(Math.random() * coverColors.length)],
      imageUrl: bookData.imageUrl || getRandomStockImage(),
    };
    const newBooks = [...books, newBook];
    saveBooks(newBooks);
  };

  const updateBook = (id: string, updates: Partial<Book>) => {
    const newBooks = books.map(book => {
      if (book.id === id) {
        const updatedBook = { ...book, ...updates };
        
        // If status is being changed to 'read' and there's no existing dateReadTimestamp, add it
        if (updates.status === 'read' && !book.dateReadTimestamp) {
          updatedBook.dateReadTimestamp = new Date().toISOString();
        }
        
        // If status is being changed from 'read' to 'to-read', clear the timestamp
        if (updates.status === 'to-read') {
          updatedBook.dateReadTimestamp = undefined;
        }
        
        return updatedBook;
      }
      return book;
    });
    saveBooks(newBooks);
  };

  const deleteBook = (id: string) => {
    const newBooks = books.filter(book => book.id !== id);
    saveBooks(newBooks);
  };

  const markAsRead = (id: string, rating?: number, summary?: string) => {
    const now = new Date();
    updateBook(id, {
      status: 'read',
      dateRead: now.toISOString().split('T')[0],
      dateReadTimestamp: now.toISOString(),
      rating,
      summary,
    });
  };

  const markAsToRead = (id: string) => {
    updateBook(id, {
      status: 'to-read',
      dateRead: undefined,
      dateReadTimestamp: undefined,
      rating: undefined,
    });
  };

  return {
    books,
    addBook,
    updateBook,
    deleteBook,
    markAsRead,
    markAsToRead,
  };
};