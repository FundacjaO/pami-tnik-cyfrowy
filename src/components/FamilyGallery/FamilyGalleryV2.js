import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ArrowLeft, Upload, Grid, List, Search, Plus, Filter, 
  FolderOpen, Download, Settings, Eye, Play, Share2,
  Shuffle, SlidersHorizontal
} from 'lucide-react';

// Import new components
import FolderManager from './FolderManager';
import GalleryToolbar from './GalleryToolbar';
import PhotoUploadV2 from './PhotoUploadV2';
import PhotoGrid from './PhotoGrid';
import PhotoModal from './PhotoModal';
import AlbumManager from './AlbumManager';
import Slideshow from './Slideshow';
import ExportModal from './ExportModal';
import GalleryStats from './GalleryStats';
import FolderSelectionModal from './FolderSelectionModal';

const FamilyGalleryV2 = ({ theme, onBack }) => {
  // Core states
  const [photos, setPhotos] = useState([]);
  const [albums, setAlbums] = useState([]);
  const [folders, setFolders] = useState([]);
  const [selectedPhoto, setSelectedPhoto] = useState(null);
  const [selectedAlbum, setSelectedAlbum] = useState('all');
  const [selectedFolder, setSelectedFolder] = useState('root');

  // UI states
  const [viewMode, setViewMode] = useState('grid');
  const [sidebarVisible, setSidebarVisible] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('date-desc');
  const [filters, setFilters] = useState({});  // Modal states
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [showAlbumManager, setShowAlbumManager] = useState(false);
  const [showSlideshow, setShowSlideshow] = useState(false);
  const [showExportModal, setShowExportModal] = useState(false);
  const [showStatsModal, setShowStatsModal] = useState(false);
  const [showFolderSelectionModal, setShowFolderSelectionModal] = useState(false);
    // Notification state
  const [notification, setNotification] = useState(null);
  
  // Stan dla zdjęć do przeniesienia w modalu wyboru folderu
  const [photosToMove, setPhotosToMove] = useState([]);
  
  // Historia operacji na zdjęciach do funkcji cofania
  const [photoOperationsHistory, setPhotoOperationsHistory] = useState([]);

  // Selection states
  const [selectedPhotos, setSelectedPhotos] = useState([]);
  const [selectionMode, setSelectionMode] = useState(false);

  // Load data from localStorage
  useEffect(() => {
    const savedPhotos = localStorage.getItem('familyGallery-photos');
    const savedAlbums = localStorage.getItem('familyGallery-albums');
    const savedFolders = localStorage.getItem('familyGallery-folders');
    
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

    if (savedFolders) {
      setFolders(JSON.parse(savedFolders));
    }
  }, []);

  // Save data to localStorage
  useEffect(() => {
    if (photos.length > 0) {
      localStorage.setItem('familyGallery-photos', JSON.stringify(photos));
    }
  }, [photos]);

  useEffect(() => {
    if (albums.length > 0) {
      localStorage.setItem('familyGallery-albums', JSON.stringify(albums));
    }
  }, [albums]);

  useEffect(() => {
    if (folders.length > 0) {
      localStorage.setItem('familyGallery-folders', JSON.stringify(folders));
    }
  }, [folders]);

  // Filter and sort photos
  const filteredPhotos = useCallback(() => {
    let filtered = photos.filter(photo => {
      // Album filter
      const matchesAlbum = selectedAlbum === 'all' || photo.albumId === selectedAlbum;
      
      // Folder filter
      const matchesFolder = selectedFolder === 'all' || photo.folderId === selectedFolder;
      
      // Search filter
      const matchesSearch = !searchTerm || 
        photo.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        photo.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        photo.tags?.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase())) ||
        photo.people?.some(person => person.toLowerCase().includes(searchTerm.toLowerCase()));
      
      // Advanced filters
      const matchesDateRange = (!filters.dateFrom || photo.date >= filters.dateFrom) &&
                              (!filters.dateTo || photo.date <= filters.dateTo);
      
      const matchesTags = !filters.tags?.length || 
        filters.tags.some(tag => photo.tags?.includes(tag));
      
      const matchesPeople = !filters.people?.length || 
        filters.people.some(person => photo.people?.includes(person));

      return matchesAlbum && matchesFolder && matchesSearch && 
             matchesDateRange && matchesTags && matchesPeople;
    });

    // Sort
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'date-desc':
          return new Date(b.date || b.createdAt) - new Date(a.date || a.createdAt);
        case 'date-asc':
          return new Date(a.date || a.createdAt) - new Date(b.date || b.createdAt);
        case 'title-asc':
          return (a.title || '').localeCompare(b.title || '');
        case 'title-desc':
          return (b.title || '').localeCompare(a.title || '');
        case 'size-desc':
          return (b.size || 0) - (a.size || 0);
        case 'size-asc':
          return (a.size || 0) - (b.size || 0);
        default:
          return 0;
      }
    });

    return filtered;
  }, [photos, selectedAlbum, selectedFolder, searchTerm, sortBy, filters]);

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
    setSelectedPhotos(prev => prev.filter(id => id !== photoId));
  };

  const getAlbumName = (albumId) => {
    const album = albums.find(a => a.id === albumId);
    return album ? album.name : 'Nieznany album';
  };  const handleBulkAction = async (action) => {
    switch (action) {
      case 'download':
        setShowExportModal(true);
        break;
      
      case 'delete':
        if (window.confirm(`Czy na pewno chcesz usunąć ${selectedPhotos.length} zdjęć?`)) {
          setPhotos(prev => prev.filter(photo => !selectedPhotos.includes(photo.id)));
          setSelectedPhotos([]);
        }
        break;
      
      case 'move':
        // Przechowujemy ID zdjęć do przeniesienia i otwieramy modal wyboru folderu
        setPhotosToMove(selectedPhotos);
        setShowFolderSelectionModal(true);
        break;
    }
  };
  
  // Obsługa wybrania folderu w modalu
  const handleFolderSelectForMove = (folderId) => {
    // Przenieś zaznaczone zdjęcia do wybranego folderu
    handleBulkMove(photosToMove, folderId);
    // Zamknij modal
    setShowFolderSelectionModal(false);
    // Wyczyść listę zdjęć do przeniesienia
    setPhotosToMove([]);
  };
  // Function to handle moving a photo to a different folder
  const handlePhotoMove = (photoId, targetFolderId, isMulti = false) => {
    if (isMulti) {
      // Jeśli to tablica ID zdjęć, przekieruj do handleBulkMove
      handleBulkMove(photoId, targetFolderId);
      return;
    }
    
    // Zapisz stan przed zmianami do historii
    const photoToMove = photos.find(photo => photo.id === photoId);
    if (photoToMove) {
      const previousState = {
        type: 'move',
        photos: [{ id: photoId, previousFolderId: photoToMove.folderId }]
      };
      setPhotoOperationsHistory(prev => [previousState, ...prev.slice(0, 9)]); // zachowaj maksymalnie 10 ostatnich operacji
    }
    
    // Update the photo's folder
    setPhotos(prev => prev.map(photo => 
      photo.id === photoId 
        ? { ...photo, folderId: targetFolderId }
        : photo
    ));
    
    // Pokaż powiadomienie z opcją cofnięcia
    setNotification({
      message: 'Zdjęcie zostało przeniesione do folderu',
      type: 'success',
      action: {
        label: 'Cofnij',
        onClick: () => undoLastOperation()
      }
    });
    
    // Hide notification after 5 seconds
    setTimeout(() => {
      setNotification(null);
    }, 5000);
  };
  
  // Function to handle bulk moving multiple photos
  const handleBulkMove = (photoIds, targetFolderId) => {
    // Zapisz stan przed zmianami do historii
    const photosToSave = photos
      .filter(photo => photoIds.includes(photo.id))
      .map(photo => ({ id: photo.id, previousFolderId: photo.folderId }));
      
    if (photosToSave.length > 0) {
      const previousState = {
        type: 'move',
        photos: photosToSave
      };
      setPhotoOperationsHistory(prev => [previousState, ...prev.slice(0, 9)]);
    }
    
    // Aktualizuj lokalizację zdjęć
    setPhotos(prev => prev.map(photo => 
      photoIds.includes(photo.id) 
        ? { ...photo, folderId: targetFolderId }
        : photo
    ));
    
    // Pokaż powiadomienie z opcją cofnięcia
    setNotification({
      message: `${photoIds.length} ${photoIds.length === 1 ? 'zdjęcie zostało przeniesione' : 'zdjęć zostało przeniesionych'} do folderu`,
      type: 'success',
      action: {
        label: 'Cofnij',
        onClick: () => undoLastOperation()
      }
    });
    
    setTimeout(() => {
      setNotification(null);
    }, 5000);
    
    // Clear selection after moving
    setSelectedPhotos([]);
  };
  
  // Funkcja do cofania ostatniej operacji
  const undoLastOperation = () => {
    if (photoOperationsHistory.length === 0) return;
    
    const lastOperation = photoOperationsHistory[0];
    
    if (lastOperation.type === 'move') {
      // Cofnij przeniesienie zdjęć
      setPhotos(prev => prev.map(photo => {
        const historyItem = lastOperation.photos.find(item => item.id === photo.id);
        if (historyItem) {
          return { ...photo, folderId: historyItem.previousFolderId };
        }
        return photo;
      }));
      
      // Usuń cofniętą operację z historii
      setPhotoOperationsHistory(prev => prev.slice(1));
      
      // Powiadomienie o cofnięciu
      setNotification({
        message: 'Operacja została cofnięta',
        type: 'info'
      });
      
      setTimeout(() => {
        setNotification(null);
      }, 3000);
    }
  };
  
  // Function to handle drag start for photo(s)
  const handleDragStart = (e, photo) => {
    // If in selection mode and the photo is selected, prepare to move all selected photos
    if (selectedPhotos.includes(photo.id) && selectedPhotos.length > 1) {
      e.dataTransfer.setData('application/json', JSON.stringify({
        photoIds: selectedPhotos,
        type: 'multi-photo'
      }));
    } else {
      // Otherwise just move the dragged photo
      e.dataTransfer.setData('application/json', JSON.stringify({
        photoId: photo.id,
        type: 'photo'
      }));
    }
  };

  const generateSampleData = () => {
    const samplePhotos = [
      {
        id: 'sample-1',
        title: 'Rodzinne spotkanie',
        description: 'Wspaniały dzień spędzony z rodziną w ogrodzie',
        albumId: 'family',
        folderId: 'family',
        dataUrl: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgZmlsbD0iIzM0OWVhNyIvPjx0ZXh0IHg9IjIwMCIgeT0iMTUwIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMjAiIGZpbGw9IndoaXRlIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIj5Sp2XDmQ0luaWE8L3RleHQ+PC9zdmc+',
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
        folderId: 'celebrations',
        dataUrl: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgZmlsbD0iI2VmNDQ0NCIvPjx0ZXh0IHg9IjIwMCIgeT0iMTUwIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMjAiIGZpbGw9IndoaXRlIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIj7Gx3nEmW9yaTwvdGV4dD48L3N2Zz4=',
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
        folderId: 'domestic',
        dataUrl: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgeG1zbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgZmlsbD0iIzA2OTFlMyIvPjx0ZXh0IHg9IjIwMCIgeT0iMTUwIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMjAiIGZpbGw9IndoaXRlIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIj5Nb3J6ZTwvdGV4dD48L3N2Zz4=',
        date: '2024-07-10',
        tags: ['wakacje', 'morze', 'plaża'],
        people: ['Jan', 'Ania'],
        createdAt: new Date().toISOString()
      }
    ];
    
    setPhotos(samplePhotos);
    localStorage.setItem('familyGallery-photos', JSON.stringify(samplePhotos));
  };

  const currentPhotos = filteredPhotos();

  return (
    <div className={`min-h-screen ${theme === 'dark' ? 'bg-gray-900' : 'bg-gray-50'}`}>
      {/* Header */}
      <div className={`${theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} shadow-sm border-b`}>      {/* Notification Toast */}
      <AnimatePresence>
        {notification && (
          <motion.div
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            className={`fixed top-4 right-4 z-50 flex items-center justify-between p-4 rounded-lg shadow-lg ${
              notification.type === 'success' ? 'bg-green-500' : 
              notification.type === 'error' ? 'bg-red-500' :
              notification.type === 'info' ? 'bg-blue-500' : 'bg-gray-500'
            } text-white max-w-md`}
          >
            <div className="flex-1">{notification.message}</div>
            {notification.action && (
              <button
                onClick={notification.action.onClick}
                className="ml-4 px-2 py-1 bg-white bg-opacity-20 hover:bg-opacity-30 rounded text-sm"
              >
                {notification.action.label}
              </button>
            )}
          </motion.div>
        )}
      </AnimatePresence>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Left section */}
          <div className="flex items-center space-x-4">
            <button
              onClick={onBack}
              className={`flex items-center space-x-2 ${
                theme === 'dark' ? 'text-gray-300 hover:text-gray-100' : 'text-gray-600 hover:text-gray-800'
              } transition-colors`}
            >
              <ArrowLeft className="w-5 h-5" />
              <span className="hidden sm:inline">Powrót</span>
            </button>
              
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-gradient-to-r from-pink-500 to-purple-500 rounded-lg flex items-center justify-center">
                  <span className="text-white text-lg">📷</span>
                </div>
                <div>
                  <h1 
                    className={`text-xl font-semibold cursor-pointer ${
                      theme === 'dark' ? 'text-gray-100' : 'text-gray-800'
                    }`}
                    onDoubleClick={generateSampleData}
                    title="Double-click aby dodać przykładowe zdjęcia"
                  >
                    Galeria Rodzinna
                  </h1>
                  <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                    {currentPhotos.length} {currentPhotos.length === 1 ? 'zdjęcie' : 'zdjęć'}
                  </p>
                </div>
              </div>
            </div>

            {/* Right section */}
            <div className="flex items-center space-x-3">
              {/* Action buttons */}
              <button
                onClick={() => setSidebarVisible(!sidebarVisible)}
                className={`p-2 rounded-lg transition-colors ${
                  theme === 'dark' ? 'hover:bg-gray-700' : 'hover:bg-gray-100'
                }`}
                title="Przełącz panel boczny"
              >
                <FolderOpen className="w-5 h-5" />
              </button>

              <button
                onClick={() => setShowSlideshow(true)}
                disabled={currentPhotos.length === 0}
                className={`p-2 rounded-lg transition-colors disabled:opacity-50 ${
                  theme === 'dark' ? 'hover:bg-gray-700' : 'hover:bg-gray-100'
                }`}
                title="Slideshow"
              >
                <Play className="w-5 h-5" />
              </button>

              <button
                onClick={() => setShowAlbumManager(true)}
                className={`p-2 rounded-lg transition-colors ${
                  theme === 'dark' ? 'hover:bg-gray-700' : 'hover:bg-gray-100'
                }`}
                title="Zarządzaj albumami"
              >
                <Settings className="w-5 h-5" />
              </button>

              <button
                onClick={() => setShowUploadModal(true)}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors flex items-center space-x-2"
              >
                <Upload className="w-4 h-4" />
                <span className="hidden sm:inline">Dodaj zdjęcia</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex gap-6">
          {/* Sidebar */}
          <AnimatePresence>
            {sidebarVisible && (
              <motion.div
                initial={{ x: -300, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: -300, opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="w-80 flex-shrink-0"
              >
                <div className="sticky top-6">                  <FolderManager
                    folders={folders}
                    onFoldersChange={setFolders}
                    photos={photos}
                    theme={theme}
                    onPhotoMove={handlePhotoMove}
                  />
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Main Content */}
          <div className="flex-1 min-w-0">
            {/* Toolbar */}            <GalleryToolbar
              photos={currentPhotos}
              selectedPhotos={selectedPhotos}
              onPhotosSelect={setSelectedPhotos}
              searchTerm={searchTerm}
              onSearchChange={setSearchTerm}
              sortBy={sortBy}
              onSortChange={setSortBy}
              viewMode={viewMode}
              onViewModeChange={setViewMode}
              filters={filters}
              onFiltersChange={setFilters}
              onBulkAction={handleBulkAction}
              folders={folders}
              selectedFolder={selectedFolder}
              onFolderChange={setSelectedFolder}
              onShowStats={() => setShowStatsModal(true)}
              onShowExport={() => setShowExportModal(true)}
              onShowSlideshow={() => setShowSlideshow(true)}
              theme={theme}
            />

            {/* Photo Grid */}
            <div className="mt-6">
              {currentPhotos.length > 0 ? (                <PhotoGrid
                  photos={currentPhotos}
                  viewMode={viewMode}
                  onPhotoClick={setSelectedPhoto}
                  getAlbumName={getAlbumName}
                  selectedPhotos={selectedPhotos}
                  onPhotosSelect={setSelectedPhotos}
                  theme={theme}
                  onDragStart={handleDragStart}
                  selectionMode={selectionMode}
                />
              ) : (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className={`text-center py-20 ${
                    theme === 'dark' ? 'bg-gray-800' : 'bg-white'
                  } rounded-lg`}
                >
                  <div className="w-24 h-24 mx-auto mb-6 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center">
                    <Upload className="w-12 h-12 text-gray-400" />
                  </div>
                  <h3 className={`text-xl font-medium mb-2 ${
                    theme === 'dark' ? 'text-gray-200' : 'text-gray-900'
                  }`}>
                    Brak zdjęć
                  </h3>
                  <p className={`text-sm mb-6 ${
                    theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                  }`}>
                    Dodaj swoje pierwsze zdjęcia aby rozpocząć tworzenie galerii rodzinnej
                  </p>
                  <div className="space-x-3">
                    <button
                      onClick={() => setShowUploadModal(true)}
                      className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg transition-colors"
                    >
                      Dodaj zdjęcia
                    </button>
                    <button
                      onClick={generateSampleData}
                      className={`px-6 py-3 rounded-lg border transition-colors ${
                        theme === 'dark' 
                          ? 'border-gray-600 text-gray-300 hover:bg-gray-700' 
                          : 'border-gray-300 text-gray-600 hover:bg-gray-50'
                      }`}
                    >
                      Dodaj przykładowe zdjęcia
                    </button>
                  </div>
                </motion.div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Modals */}
      <AnimatePresence>
        {showUploadModal && (
          <PhotoUploadV2
            onClose={() => setShowUploadModal(false)}
            onPhotoAdd={addPhoto}
            albums={albums}
            folders={folders}
            selectedFolder={selectedFolder}
            theme={theme}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showAlbumManager && (
          <AlbumManager
            isOpen={showAlbumManager}
            onClose={() => setShowAlbumManager(false)}
            albums={albums}
            onAlbumsChange={setAlbums}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {selectedPhoto && (
          <PhotoModal
            photo={selectedPhoto}
            photos={currentPhotos}
            onClose={() => setSelectedPhoto(null)}
            onUpdate={updatePhoto}
            onDelete={deletePhoto}
            getAlbumName={getAlbumName}            theme={theme}
          />
        )}
      </AnimatePresence>      <AnimatePresence>
        {showSlideshow && currentPhotos.length > 0 && (
          <Slideshow
            photos={currentPhotos}
            isOpen={showSlideshow}
            onClose={() => setShowSlideshow(false)}
            currentIndex={selectedPhoto ? currentPhotos.findIndex(p => p.id === selectedPhoto.id) : 0}
            theme={theme}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showExportModal && (
          <ExportModal
            isOpen={showExportModal}
            onClose={() => setShowExportModal(false)}
            photos={currentPhotos}
            selectedPhotos={selectedPhotos.map(id => photos.find(p => p.id === id)).filter(Boolean)}
            theme={theme}
          />
        )}
      </AnimatePresence>      <AnimatePresence>
        {showStatsModal && (
          <GalleryStats
            isOpen={showStatsModal}
            onClose={() => setShowStatsModal(false)}
            photos={photos}
            albums={albums}
            folders={folders}
            theme={theme}
          />
        )}
      </AnimatePresence>
      
      <AnimatePresence>
        {showFolderSelectionModal && (
          <FolderSelectionModal
            isOpen={showFolderSelectionModal}
            onClose={() => setShowFolderSelectionModal(false)}
            folders={folders}
            onFolderSelect={handleFolderSelectForMove}
            selectedFolder={selectedFolder !== 'root' ? selectedFolder : null}
            theme={theme}
            photosCount={photosToMove.length}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default FamilyGalleryV2;
