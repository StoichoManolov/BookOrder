export interface Book {
  id: string;
  title: string;
  author: string;
  genre: string;
  pages: number;
  status: 'to-read' | 'read';
  rating?: number;
  summary?: string;
  quotes?: string;
  dateAdded: string;
  dateRead?: string;
  dateReadTimestamp?: string;
  coverColor: string;
  imageUrl?: string;
}

export type BookStatus = 'to-read' | 'read';