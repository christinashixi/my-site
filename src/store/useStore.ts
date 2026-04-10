import { create } from 'zustand';
import { User, Chapter, LearningProgress, Note } from '../types';
import { supabase } from '../utils/supabase';

interface Store {
  // User state
  user: User | null;
  setUser: (user: User | null) => void;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  
  // Chapters state
  chapters: Chapter[];
  setChapters: (chapters: Chapter[]) => void;
  fetchChapters: () => Promise<void>;
  
  // Learning progress state
  learningProgress: LearningProgress[];
  setLearningProgress: (progress: LearningProgress[]) => void;
  fetchLearningProgress: () => Promise<void>;
  updateLearningProgress: (chapterId: string, completed: boolean) => Promise<void>;
  
  // Notes state
  notes: Note[];
  setNotes: (notes: Note[]) => void;
  fetchNotes: () => Promise<void>;
  addNote: (title: string, content: string, chapterId: string | null) => Promise<void>;
  updateNote: (noteId: string, content: string) => Promise<void>;
  deleteNote: (noteId: string) => Promise<void>;
  
  // Loading state
  loading: boolean;
  setLoading: (loading: boolean) => void;
  
  // Error state
  error: string | null;
  setError: (error: string | null) => void;
}

export const useStore = create<Store>((set, get) => ({
  // User state
  user: null,
  setUser: (user) => set({ user }),
  
  login: async (email, password) => {
    set({ loading: true, error: null });
    try {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;
      if (data.user) {
        set({ user: {
          id: data.user.id,
          email: data.user.email || '',
          created_at: data.user.created_at
        }});
        // Fetch user data after login
        await get().fetchLearningProgress();
        await get().fetchNotes();
      }
    } catch (error: any) {
      set({ error: error.message });
    } finally {
      set({ loading: false });
    }
  },
  
  register: async (email, password) => {
    set({ loading: true, error: null });
    try {
      const { data, error } = await supabase.auth.signUp({ email, password });
      if (error) throw error;
      if (data.user) {
        set({ user: {
          id: data.user.id,
          email: data.user.email || '',
          created_at: data.user.created_at
        }});
      }
    } catch (error: any) {
      set({ error: error.message });
    } finally {
      set({ loading: false });
    }
  },
  
  logout: async () => {
    set({ loading: true, error: null });
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      set({ user: null, learningProgress: [], notes: [] });
    } catch (error: any) {
      set({ error: error.message });
    } finally {
      set({ loading: false });
    }
  },
  
  // Chapters state
  chapters: [],
  setChapters: (chapters) => set({ chapters }),
  
  fetchChapters: async () => {
    set({ loading: true, error: null });
    try {
      const { data, error } = await supabase.from('chapters').select('*').order('order', { ascending: true });
      if (error) throw error;
      set({ chapters: data || [] });
    } catch (error: any) {
      set({ error: error.message });
    } finally {
      set({ loading: false });
    }
  },
  
  // Learning progress state
  learningProgress: [],
  setLearningProgress: (learningProgress) => set({ learningProgress }),
  
  fetchLearningProgress: async () => {
    const user = get().user;
    if (!user) return;
    
    set({ loading: true, error: null });
    try {
      const { data, error } = await supabase
        .from('learning_progress')
        .select('*')
        .eq('user_id', user.id);
      if (error) throw error;
      set({ learningProgress: data || [] });
    } catch (error: any) {
      set({ error: error.message });
    } finally {
      set({ loading: false });
    }
  },
  
  updateLearningProgress: async (chapterId, completed) => {
    const user = get().user;
    if (!user) return;
    
    set({ loading: true, error: null });
    try {
      const { data, error } = await supabase
        .from('learning_progress')
        .upsert({
          user_id: user.id,
          chapter_id: chapterId,
          completed,
          completed_at: completed ? new Date().toISOString() : null
        })
        .select();
      if (error) throw error;
      
      // Update local state
      const currentProgress = get().learningProgress;
      const existingIndex = currentProgress.findIndex(p => p.chapter_id === chapterId);
      
      if (existingIndex >= 0) {
        const updatedProgress = [...currentProgress];
        updatedProgress[existingIndex] = data[0];
        set({ learningProgress: updatedProgress });
      } else {
        set({ learningProgress: [...currentProgress, data[0]] });
      }
    } catch (error: any) {
      set({ error: error.message });
    } finally {
      set({ loading: false });
    }
  },
  
  // Notes state
  notes: [],
  setNotes: (notes) => set({ notes }),
  
  fetchNotes: async () => {
    const user = get().user;
    if (!user) return;
    
    set({ loading: true, error: null });
    try {
      const { data, error } = await supabase
        .from('notes')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });
      if (error) throw error;
      set({ notes: data || [] });
    } catch (error: any) {
      set({ error: error.message });
    } finally {
      set({ loading: false });
    }
  },
  
  addNote: async (title, content, chapterId) => {
    const user = get().user;
    if (!user) return;
    
    set({ loading: true, error: null });
    try {
      const { data, error } = await supabase
        .from('notes')
        .insert({
          user_id: user.id,
          title,
          content,
          chapter_id: chapterId
        })
        .select();
      if (error) throw error;
      set({ notes: [data[0], ...get().notes] });
    } catch (error: any) {
      set({ error: error.message });
    } finally {
      set({ loading: false });
    }
  },
  
  updateNote: async (noteId, content) => {
    set({ loading: true, error: null });
    try {
      const { data, error } = await supabase
        .from('notes')
        .update({ content, updated_at: new Date().toISOString() })
        .eq('id', noteId)
        .select();
      if (error) throw error;
      
      const currentNotes = get().notes;
      const updatedNotes = currentNotes.map(note => 
        note.id === noteId ? data[0] : note
      );
      set({ notes: updatedNotes });
    } catch (error: any) {
      set({ error: error.message });
    } finally {
      set({ loading: false });
    }
  },
  
  deleteNote: async (noteId) => {
    set({ loading: true, error: null });
    try {
      const { error } = await supabase
        .from('notes')
        .delete()
        .eq('id', noteId);
      if (error) throw error;
      
      const currentNotes = get().notes;
      const updatedNotes = currentNotes.filter(note => note.id !== noteId);
      set({ notes: updatedNotes });
    } catch (error: any) {
      set({ error: error.message });
    } finally {
      set({ loading: false });
    }
  },
  
  // Loading state
  loading: false,
  setLoading: (loading) => set({ loading }),
  
  // Error state
  error: null,
  setError: (error) => set({ error })
}));
