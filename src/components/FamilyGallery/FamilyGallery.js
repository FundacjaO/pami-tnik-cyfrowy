import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Upload, Grid, List, Search, Plus, Filter } from 'lucide-react';
import PhotoUpload from './PhotoUpload';
import PhotoGrid from './PhotoGrid';
import PhotoModal from './PhotoModal';
import AlbumManager from './AlbumManager';

const FamilyGallery = ({ theme, onBack }) => {
  // States
  const [photos, setPhotos] = useState([]);
  const [albums, setAlbums] = useState([]);
  const [selectedPhoto, setSelectedPhoto] = useState(null);
  const [selectedAlbum, setSelectedAlbum] = useState('all');
  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'list'
  const [searchTerm, setSearchTerm] = useState('');
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [showAlbumManager, setShowAlbumManager] = useState(false);
  const [showFilters, setShowFilters] = useState(false);

  // Load data from localStorage
  useEffect(() => {
    const savedPhotos = localStorage.getItem('familyGallery-photos');
    const savedAlbums = localStorage.getItem('familyGallery-albums');
    
    if (savedPhotos) {
      setPhotos(JSON.parse(savedPhotos));
    }
    
    if (savedAlbums) {
      setAlbums(JSON.parse(savedAlbums));
    } else {
      // Default albums
      const defaultAlbums = [
        { id: 'all', name: 'Wszystkie zdjęcia', color: 'bg-gray-500' },
        { id: 'family', name: 'Rodzina', color: 'bg-blue-500' },
        { id: 'events', name: 'Wydarzenia', color: 'bg-green-500' },
        { id: 'holidays', name: 'Święta', color: 'bg-red-500' },
        { id: 'travels', name: 'Podróże', color: 'bg-purple-500' }
      ];
      setAlbums(defaultAlbums);
      localStorage.setItem('familyGallery-albums', JSON.stringify(defaultAlbums));
    }
  }, []);

  // Save photos to localStorage
  useEffect(() => {
    if (photos.length > 0) {
      localStorage.setItem('familyGallery-photos', JSON.stringify(photos));
    }
  }, [photos]);

  // Save albums to localStorage
  useEffect(() => {
    if (albums.length > 0) {
      localStorage.setItem('familyGallery-albums', JSON.stringify(albums));
    }
  }, [albums]);

  // Filter photos
  const filteredPhotos = photos.filter(photo => {
    const matchesAlbum = selectedAlbum === 'all' || photo.albumId === selectedAlbum;
    const matchesSearch = photo.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         photo.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         photo.tags?.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    return matchesAlbum && matchesSearch;
  });

  const addPhoto = (photoData) => {
    const newPhoto = {
      id: Date.now().toString(),
      ...photoData,
      createdAt: new Date().toISOString()
    };
    setPhotos(prev => [newPhoto, ...prev]);
  };

  const updatePhoto = (photoId, updates) => {
    setPhotos(prev => prev.map(photo => 
      photo.id === photoId ? { ...photo, ...updates } : photo
    ));
  };

  const deletePhoto = (photoId) => {
    setPhotos(prev => prev.filter(photo => photo.id !== photoId));
    setSelectedPhoto(null);
  };

  const getAlbumName = (albumId) => {
    const album = albums.find(a => a.id === albumId);
    return album ? album.name : 'Nieznany album';
  };

  const generateSampleData = () => {
    const samplePhotos = [
      {
        id: 'sample-1',
        title: 'Rodzinne spotkanie',
        description: 'Wspaniały dzień spędzony z rodziną w ogrodzie',
        albumId: 'family',
        data: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgZmlsbD0iIzM0OWVhNyIvPjx0ZXh0IHg9IjIwMCIgeT0iMTUwIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMjAiIGZpbGw9IndoaXRlIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIj5Sp2XDmQ0luaWE8L3RleHQ+PC9zdmc+',
        date: '2024-06-15',
        tags: ['rodzina', 'ogród', 'spotkanie'],
        people: ['Mama', 'Tata', 'Ania'],
        createdAt: new Date().toISOString()
      },
      {
        id: 'sample-2', 
        title: 'Święta Bożego Narodzenia',
        description: 'Magiczny wieczór wigiljny z najbliższymi',
        albumId: 'holidays',
        data: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgeG1zbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgZmlsbD0iI2VmNDQ0NCIvPjx0ZXh0IHg9IjIwMCIgeT0iMTUwIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMjAiIGZpbGw9IndoaXRlIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIj7Gx3nEmW9yaTwvdGV4dD48L3N2Zz4=',
        date: '2023-12-24',
        tags: ['święta', 'wigilia', 'choinka'],
        people: ['Rodzina'],
        createdAt: new Date().toISOString()
      },
      {
        id: 'sample-3',
        title: 'Wakacje nad morzem',
        description: 'Piękne dni spędzone nad Bałtykiem',
        albumId: 'travels', 
        data: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgeG1zbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgZmlsbD0iIzA2OTFlMyIvPjx0ZXh0IHg9IjIwMCIgeT0iMTUwIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMjAiIGZpbGw9IndoaXRlIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIj5Nb3J6ZTwvdGV4dD48L3N2Zz4=',
        date: '2024-07-10',
        tags: ['wakacje', 'morze', 'plaża'],
        people: ['Jan', 'Ania'],
        createdAt: new Date().toISOString()
      }
    ];
    
    setPhotos(samplePhotos);
    localStorage.setItem('familyGallery-photos', JSON.stringify(samplePhotos));
  };

  // Integration with FamilyTimeline - funkcja do automatycznego łączenia zdjęć z eventami
  const linkPhotoToTimelineEvent = (photoId, eventId) => {
    const timelineEvents = JSON.parse(localStorage.getItem('familyTimelineEvents') || '[]');
    const updatedEvents = timelineEvents.map(event => 
      event.id === eventId 
        ? { ...event, photoIds: [...(event.photoIds || []), photoId] }
        : event
    );
    localStorage.setItem('familyTimelineEvents', JSON.stringify(updatedEvents));
  };

  // Integration with FamilyTree - funkcja do łączenia zdjęć z osobami
  const linkPhotoToFamilyMember = (photoId, memberId) => {
    const familyMembers = JSON.parse(localStorage.getItem('familyTreeMembers') || '[]');
    const updatedMembers = familyMembers.map(member => 
      member.id === memberId 
        ? { ...member, photoIds: [...(member.photoIds || []), photoId] }
        : member
    );
    localStorage.setItem('familyTreeMembers', JSON.stringify(updatedMembers));
  };

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Left section */}
            <div className="flex items-center space-x-4">
              <button
                onClick={onBack}
                className="flex items-center space-x-2 text-gray-600 dark:text-gray-300 
                         hover:text-gray-800 dark:hover:text-gray-100 transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
                <span className="hidden sm:inline">Powrót</span>
              </button>
              
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-gradient-to-r from-pink-500 to-purple-500 rounded-lg 
                              flex items-center justify-center">
                  <span className="text-white text-lg">📷</span>
                </div>                <div>
                  <h1 
                    className="text-xl font-semibold text-gray-800 dark:text-gray-100 cursor-pointer"
                    onDoubleClick={generateSampleData}
                    title="Double-click aby dodać przykładowe zdjęcia"
                  >
                    Galeria Rodzinna
                  </h1>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {filteredPhotos.length} {filteredPhotos.length === 1 ? 'zdjęcie' : 'zdjęć'}
                  </p>
                </div>
              </div>
            </div>

            {/* Right section */}
            <div className="flex items-center space-x-3">
              {/* Search */}
              <div className="relative hidden sm:block">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 
                                text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Szukaj zdjęć..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 w-64 rounded-lg border border-gray-300 dark:border-gray-600
                           bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100
                           focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400"
                />
              </div>

              {/* View mode toggle */}
              <div className="flex bg-gray-100 dark:bg-gray-700 rounded-lg p-1">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 rounded ${viewMode === 'grid' 
                    ? 'bg-white dark:bg-gray-600 shadow-sm' 
                    : 'hover:bg-gray-200 dark:hover:bg-gray-600'}`}
                >
                  <Grid className="w-4 h-4 text-gray-600 dark:text-gray-300" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 rounded ${viewMode === 'list' 
                    ? 'bg-white dark:bg-gray-600 shadow-sm' 
                    : 'hover:bg-gray-200 dark:hover:bg-gray-600'}`}
                >
                  <List className="w-4 h-4 text-gray-600 dark:text-gray-300" />
                </button>
              </div>

              {/* Filters */}
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                <Filter className="w-5 h-5 text-gray-600 dark:text-gray-300" />
              </button>

              {/* Add photo */}
              <button
                onClick={() => setShowUploadModal(true)}
                className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 
                         text-white px-4 py-2 rounded-lg transition-colors"
              >
                <Plus className="w-4 h-4" />
                <span className="hidden sm:inline">Dodaj zdjęcia</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Filters Panel */}
      <AnimatePresence>
        {showFilters && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="bg-gray-50 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700"
          >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
              <div className="flex items-center space-x-4 overflow-x-auto">
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300 whitespace-nowrap">
                  Albumy:
                </span>
                {albums.map(album => (
                  <button
                    key={album.id}
                    onClick={() => setSelectedAlbum(album.id)}
                    className={`flex items-center space-x-2 px-3 py-1 rounded-full text-sm whitespace-nowrap
                              transition-colors ${selectedAlbum === album.id
                                ? 'bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200'
                                : 'bg-white dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-600'
                              }`}
                  >
                    <div className={`w-3 h-3 rounded-full ${album.color}`}></div>
                    <span>{album.name}</span>
                    {album.id !== 'all' && (
                      <span className="text-xs text-gray-500">
                        {photos.filter(p => p.albumId === album.id).length}
                      </span>
                    )}
                  </button>
                ))}
                <button
                  onClick={() => setShowAlbumManager(true)}
                  className="flex items-center space-x-1 px-3 py-1 rounded-full text-sm
                           bg-gray-200 dark:bg-gray-600 text-gray-600 dark:text-gray-300
                           hover:bg-gray-300 dark:hover:bg-gray-500 transition-colors"
                >
                  <Plus className="w-3 h-3" />
                  <span>Zarządzaj</span>
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {filteredPhotos.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-24 h-24 mx-auto mb-4 bg-gray-100 dark:bg-gray-700 rounded-full 
                          flex items-center justify-center">
              <span className="text-4xl">📷</span>
            </div>
            <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
              {photos.length === 0 ? 'Brak zdjęć' : 'Brak wyników'}
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              {photos.length === 0 
                ? 'Dodaj pierwsze zdjęcia do galerii rodzinnej'
                : 'Spróbuj zmienić kryteria wyszukiwania'
              }
            </p>
            {photos.length === 0 && (
              <button
                onClick={() => setShowUploadModal(true)}
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg"
              >
                Dodaj pierwsze zdjęcia
              </button>
            )}
          </div>
        ) : (
          <PhotoGrid
            photos={filteredPhotos}
            viewMode={viewMode}
            onPhotoClick={setSelectedPhoto}
            getAlbumName={getAlbumName}
            theme={theme}
          />
        )}
      </div>

      {/* Modals */}
      <AnimatePresence>
        {showUploadModal && (
          <PhotoUpload
            onClose={() => setShowUploadModal(false)}
            onPhotoAdd={addPhoto}
            albums={albums.filter(a => a.id !== 'all')}
            theme={theme}
          />
        )}

        {showAlbumManager && (
          <AlbumManager
            albums={albums}
            setAlbums={setAlbums}
            onClose={() => setShowAlbumManager(false)}
            theme={theme}
          />
        )}

        {selectedPhoto && (
          <PhotoModal
            photo={selectedPhoto}
            photos={filteredPhotos}
            onClose={() => setSelectedPhoto(null)}
            onUpdate={updatePhoto}
            onDelete={deletePhoto}
            getAlbumName={getAlbumName}
            theme={theme}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default FamilyGallery;
