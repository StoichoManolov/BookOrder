export interface Book {
  id: string;
  title: string;
  author: string;
  genre: string;
  pages: number;
  status: 'to-read' | 'read';
  rating?: number;
  notes?: string;
  dateAdded: string;
  dateRead?: string;
  dateReadTimestamp?: string; // New field for exact datetime when marked as read
  coverColor: string;
  imageUrl?: string;
}

export type BookStatus = 'to-read' | 'read';