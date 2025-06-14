
import React, { useState } from 'react';
import { Book, User, Settings, LogOut } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';
import AuthModal from './AuthModal';
import UploadModal from './UploadModal';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

const Navigation = () => {
  const { user, signOut } = useAuth();
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showUploadModal, setShowUploadModal] = useState(false);

  const handleSignOut = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  return (
    <>
      <nav className="bg-white border-b shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-8">
              <div className="flex items-center space-x-2">
                <Book className="h-8 w-8 text-blue-600" />
                <span className="text-xl font-bold text-gray-900">Ma Bibliothèque</span>
              </div>
              
              {user && (
                <div className="hidden md:flex items-center space-x-6">
                  <Button variant="ghost" className="text-gray-700 hover:text-blue-600">
                    Bibliothèque
                  </Button>
                  <Button variant="ghost" className="text-gray-700 hover:text-blue-600">
                    En cours de lecture
                  </Button>
                  <Button variant="ghost" className="text-gray-700 hover:text-blue-600">
                    Favoris
                  </Button>
                  <Button asChild variant="ghost" className="text-gray-700 hover:text-blue-600">
                    <Link to="/payment">Paiement</Link>
                  </Button>
                </div>
              )}
            </div>

            <div className="flex items-center space-x-4">
              {user ? (
                <>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="hidden sm:flex"
                    onClick={() => setShowUploadModal(true)}
                  >
                    Ajouter un livre
                  </Button>
                  
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm">
                        <User className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem>
                        <Settings className="h-4 w-4 mr-2" />
                        Paramètres
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={handleSignOut}>
                        <LogOut className="h-4 w-4 mr-2" />
                        Déconnexion
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </>
              ) : (
                <Button 
                  variant="default" 
                  size="sm"
                  onClick={() => setShowAuthModal(true)}
                >
                  Se connecter
                </Button>
              )}
            </div>
          </div>
        </div>
      </nav>

      <AuthModal 
        isOpen={showAuthModal} 
        onClose={() => setShowAuthModal(false)} 
      />
      
      <UploadModal 
        isOpen={showUploadModal} 
        onClose={() => setShowUploadModal(false)} 
      />
    </>
  );
};

export default Navigation;
