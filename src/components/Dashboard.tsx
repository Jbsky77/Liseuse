
import React from 'react';
import SearchAndFilters from '@/components/SearchAndFilters';
import BookGrid from '@/components/BookGrid';
import StatsCards from '@/components/StatsCards';

const Dashboard = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Bienvenue dans votre bibliothèque
        </h1>
        <p className="text-gray-600">
          Gérez et lisez vos livres PDF en toute simplicité
        </p>
      </div>

      <StatsCards />
      <SearchAndFilters />
      <BookGrid />
    </div>
  );
};

export default Dashboard;
