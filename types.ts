export interface AppItem {
  id: string;
  name: string;
  image: string;
  size: string;
  downloads: string;
  category: string;
  rating: string;
  reviews: string;
  age: string;
}

export type ViewState = 'LIST' | 'DETAIL' | 'PROGRESS' | 'VERIFY';

// Declaration for the external CPA locker function
declare global {
  interface Window {
    _cn: () => void;
  }
}