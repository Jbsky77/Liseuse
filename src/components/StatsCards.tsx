
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Book, BookOpen, Star, Clock } from 'lucide-react';
import { useBooks } from '@/hooks/useBooks';
import { useAuth } from '@/hooks/useAuth';

const StatsCards = () => {
  const { user } = useAuth();
  const { books, bookmarks } = useBooks();

  if (!user) return null;

  const totalBooks = books.length;
  const currentlyReading = books.filter(book => book.status === 'reading').length;
  const completedBooks = books.filter(book => book.status === 'completed').length;
  
  // Calculate total reading time (approximate based on progress)
  const totalReadingTime = bookmarks.reduce((total, bookmark) => {
    const progress = bookmark.reading_progress || 0;
    // Estimate 2 minutes per page read
    const pagesRead = bookmark.total_pages ? (bookmark.total_pages * progress / 100) : 0;
    return total + (pagesRead * 2);
  }, 0);

  const formatReadingTime = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    return `${hours}h`;
  };

  const stats = [
    {
      title: 'Total des livres',
      value: totalBooks.toString(),
      icon: Book,
      color: 'text-blue-600'
    },
    {
      title: 'En cours de lecture',
      value: currentlyReading.toString(),
      icon: BookOpen,
      color: 'text-green-600'
    },
    {
      title: 'Terminés',
      value: completedBooks.toString(),
      icon: Star,
      color: 'text-yellow-600'
    },
    {
      title: 'Temps de lecture',
      value: formatReadingTime(totalReadingTime),
      icon: Clock,
      color: 'text-purple-600'
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {stats.map((stat, index) => (
        <Card key={index} className="hover:shadow-md transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">
                  {stat.title}
                </p>
                <p className="text-2xl font-bold text-gray-900">
                  {stat.value}
                </p>
              </div>
              <stat.icon className={`h-8 w-8 ${stat.color}`} />
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default StatsCards;
