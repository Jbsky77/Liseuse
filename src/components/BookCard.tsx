
import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { BookOpen, Star, MoreVertical } from 'lucide-react';
import { useBooks } from '@/hooks/useBooks';
import type { Book } from '@/hooks/useBooks';

interface BookCardProps {
  book: Book;
}

const BookCard = ({ book }: BookCardProps) => {
  const { bookmarks } = useBooks();
  
  // Find bookmark for this book
  const bookmark = bookmarks.find(b => b.book_id === book.id);
  const progress = bookmark?.reading_progress || 0;
  
  const getStatusText = () => {
    if (book.status === 'completed') return 'Terminé';
    if (book.status === 'reading') return 'En cours';
    return 'À lire';
  };

  const getButtonText = () => {
    if (book.status === 'completed') return 'Relire';
    if (book.status === 'reading') return 'Continuer';
    return 'Commencer';
  };

  const formatLastRead = () => {
    if (!bookmark) return 'Jamais lu';
    
    const lastRead = new Date(bookmark.last_read_at);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - lastRead.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 1) return 'Hier';
    if (diffDays < 7) return `Il y a ${diffDays} jours`;
    if (diffDays < 30) return `Il y a ${Math.ceil(diffDays / 7)} semaines`;
    return `Il y a ${Math.ceil(diffDays / 30)} mois`;
  };

  return (
    <Card className="group hover:shadow-lg transition-all duration-200 cursor-pointer">
      <CardContent className="p-0">
        <div className="relative">
          <div className="aspect-[3/4] bg-gradient-to-br from-blue-100 to-purple-100 rounded-t-lg flex items-center justify-center">
            {book.cover_url ? (
              <img 
                src={book.cover_url} 
                alt={book.title}
                className="w-full h-full object-cover rounded-t-lg"
              />
            ) : (
              <BookOpen className="h-12 w-12 text-gray-400" />
            )}
          </div>
          
          {progress > 0 && (
            <Badge 
              className="absolute top-2 right-2 bg-green-600 hover:bg-green-700"
            >
              {Math.round(progress)}%
            </Badge>
          )}
          
          <Button
            variant="ghost"
            size="sm"
            className="absolute top-2 left-2 opacity-0 group-hover:opacity-100 transition-opacity"
          >
            <Star className="h-4 w-4" />
          </Button>
        </div>

        <div className="p-4">
          <h3 className="font-semibold text-sm text-gray-900 mb-1 line-clamp-2">
            {book.title}
          </h3>
          
          {book.author && (
            <p className="text-xs text-gray-600 mb-1">
              {book.author}
            </p>
          )}
          
          {book.series && (
            <p className="text-xs text-blue-600 mb-2">
              {book.series}
              {book.series_number && ` #${book.series_number}`}
            </p>
          )}

          {progress > 0 && progress < 100 && (
            <div className="mb-2">
              <Progress value={progress} className="h-2" />
            </div>
          )}

          <div className="flex items-center justify-between text-xs text-gray-500 mb-3">
            <span>{formatLastRead()}</span>
            <Button variant="ghost" size="sm" className="h-auto p-1">
              <MoreVertical className="h-3 w-3" />
            </Button>
          </div>

          <Button asChild className="w-full" size="sm">
            <Link to={`/read/${book.id}`}>{getButtonText()}</Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default BookCard;
