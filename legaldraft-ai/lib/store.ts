import { create } from 'zustand';
import { User, Document, Template } from '@/types';

interface AppState {
  user: User | null;
  documents: Document[];
  templates: Template[];
  theme: 'light' | 'dark';
  setUser: (user: User | null) => void;
  setDocuments: (documents: Document[]) => void;
  setTemplates: (templates: Template[]) => void;
  addDocument: (document: Document) => void;
  toggleTheme: () => void;
}

export const useStore = create<AppState>((set) => ({
  user: null,
  documents: [],
  templates: [],
  theme: 'light',
  setUser: (user) => set({ user }),
  setDocuments: (documents) => set({ documents }),
  setTemplates: (templates) => set({ templates }),
  addDocument: (document) => set((state) => ({ 
    documents: [document, ...state.documents] 
  })),
  toggleTheme: () => set((state) => ({ 
    theme: state.theme === 'light' ? 'dark' : 'light' 
  })),
}));
