
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { toast } from '@/hooks/use-toast';

export interface Book {
  id: string;
  title: string;
  author: string | null;
  series: string | null;
  series_number: number | null;
  language: string;
  page_count: number | null;
  file_path: string;
  cover_url: string | null;
  file_size: number | null;
  status: 'reading' | 'completed' | 'to_read';
  created_at: string;
  updated_at: string;
  user_id: string;
}

export interface Bookmark {
  id: string;
  user_id: string;
  book_id: string;
  current_page: number;
  total_pages: number | null;
  reading_progress: number | null;
  last_read_at: string;
}

export const useBooks = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const { data: books = [], isLoading } = useQuery({
    queryKey: ['books', user?.id],
    queryFn: async () => {
      if (!user) return [];
      
      const { data, error } = await supabase
        .from('books')
        .select('*')
        .eq('user_id', user.id)
        .order('updated_at', { ascending: false });

      if (error) throw error;
      return data as Book[];
    },
    enabled: !!user,
  });

  const { data: bookmarks = [] } = useQuery({
    queryKey: ['bookmarks', user?.id],
    queryFn: async () => {
      if (!user) return [];
      
      const { data, error } = await supabase
        .from('bookmarks')
        .select('*')
        .eq('user_id', user.id);

      if (error) throw error;
      return data as Bookmark[];
    },
    enabled: !!user,
  });

  const uploadBookMutation = useMutation({
    mutationFn: async ({ file, title, author, series }: {
      file: File;
      title: string;
      author?: string;
      series?: string;
    }) => {
      if (!user) throw new Error('User not authenticated');

      // Upload file to Supabase Storage
      const fileName = `${user.id}/${Date.now()}-${file.name}`;
      const { error: uploadError } = await supabase.storage
        .from('books')
        .upload(fileName, file);

      if (uploadError) throw uploadError;

      // Save book metadata to database
      const { data, error } = await supabase
        .from('books')
        .insert([
          {
            user_id: user.id,
            title,
            author: author || null,
            series: series || null,
            file_path: fileName,
            file_size: file.size,
            language: 'fr',
            status: 'to_read',
          },
        ])
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['books', user?.id] });
      toast({
        title: 'Livre ajouté avec succès',
        description: 'Votre livre a été téléchargé et ajouté à votre bibliothèque.',
      });
    },
    onError: (error) => {
      toast({
        title: 'Erreur lors du téléchargement',
        description: error.message,
        variant: 'destructive',
      });
    },
  });

  const updateBookmarkMutation = useMutation({
    mutationFn: async ({ bookId, currentPage, totalPages }: {
      bookId: string;
      currentPage: number;
      totalPages?: number;
    }) => {
      if (!user) throw new Error('User not authenticated');

      const progress = totalPages ? (currentPage / totalPages) * 100 : 0;

      const { data, error } = await supabase
        .from('bookmarks')
        .upsert([
          {
            user_id: user.id,
            book_id: bookId,
            current_page: currentPage,
            total_pages: totalPages || null,
            reading_progress: progress,
            last_read_at: new Date().toISOString(),
          },
        ])
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['bookmarks', user?.id] });
    },
  });

  return {
    books,
    bookmarks,
    isLoading,
    uploadBook: uploadBookMutation.mutate,
    isUploading: uploadBookMutation.isPending,
    updateBookmark: updateBookmarkMutation.mutate,
  };
};
