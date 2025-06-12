import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';

const Reader = () => {
  const { bookId } = useParams<{ bookId: string }>();
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadBook = async () => {
      if (!bookId) return;
      console.log('Fetching book info for', bookId);
      const { data: book, error } = await supabase
        .from('books')
        .select('file_path')
        .eq('id', bookId)
        .single();
      if (error) {
        console.error('Error fetching book', error);
        setError('Erreur lors du chargement du livre');
        return;
      }
      const { data: urlData, error: urlError } = await supabase.storage
        .from('books')
        .createSignedUrl(book.file_path, 60 * 60);
      if (urlError || !urlData) {
        console.error('Error getting PDF url', urlError);
        setError('Impossible de récupérer le PDF');
        return;
      }
      console.log('PDF URL loaded');
      setPdfUrl(urlData.signedUrl);
    };
    loadBook();
  }, [bookId]);

  if (error) {
    return <div className="p-4 text-red-600">{error}</div>;
  }

  if (!pdfUrl) {
    return <div className="p-4">Chargement du PDF...</div>;
  }

  return (
    <iframe
      src={pdfUrl}
      title="Lecteur PDF"
      className="w-full h-screen"
    />
  );
};

export default Reader;
