import React, { useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Calendar, User, Tag, MoreHorizontal, Move, Image } from 'lucide-react';

const PhotoGrid = ({ photos, viewMode, onPhotoClick, getAlbumName, theme, selectionMode, selectedPhotos, onPhotosSelect, onDragStart }) => {
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('pl-PL', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (viewMode === 'list') {
    return (      <div className="space-y-4">
        {photos.map((photo, index) => (
          <motion.div
            key={photo.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            onClick={(e) => !selectionMode && onPhotoClick(photo)}
            draggable
            onDragStart={(e) => {
              e.stopPropagation();
              onDragStart(e, photo);
              // Add a ghost image
              const dragImage = new Image();
              dragImage.src = photo.dataUrl;
              dragImage.width = 50;
              e.dataTransfer.setDragImage(dragImage, 25, 25);
              e.dataTransfer.setData('application/json', JSON.stringify({ 
                photoId: photo.id, 
                type: 'photo' 
              }));
            }}
            className="bg-white dark:bg-gray-800 rounded-xl shadow-sm hover:shadow-md 
                     border border-gray-200 dark:border-gray-700 cursor-pointer
                     transition-all duration-200 overflow-hidden group relative"
          >
            <div className="flex">
              {/* Image */}
              <div className="flex-shrink-0">
                <img
                  src={photo.dataUrl}
                  alt={photo.title}
                  className="w-24 h-24 object-cover"
                />
              </div>

              {/* Content */}
              <div className="flex-1 p-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1 min-w-0">
                    <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 truncate">
                      {photo.title || 'Bez tytułu'}
                    </h3>
                    {photo.description && (
                      <p className="text-gray-600 dark:text-gray-400 text-sm mt-1 line-clamp-2">
                        {photo.description}
                      </p>
                    )}
                    
                    <div className="flex items-center space-x-4 mt-3 text-sm text-gray-500 dark:text-gray-400">
                      {photo.date && (
                        <div className="flex items-center space-x-1">
                          <Calendar className="w-4 h-4" />
                          <span>{formatDate(photo.date)}</span>
                        </div>
                      )}
                      
                      {photo.albumId && (
                        <div className="flex items-center space-x-1">
                          <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                          <span>{getAlbumName(photo.albumId)}</span>
                        </div>
                      )}
                    </div>

                    {/* Tags and People */}
                    <div className="flex flex-wrap gap-2 mt-3">
                      {photo.people?.slice(0, 3).map(person => (
                        <span
                          key={person}
                          className="inline-flex items-center px-2 py-1 bg-green-100 dark:bg-green-900
                                   text-green-800 dark:text-green-200 text-xs rounded-full"
                        >
                          <User className="w-3 h-3 mr-1" />
                          {person}
                        </span>
                      ))}
                      
                      {photo.tags?.slice(0, 2).map(tag => (
                        <span
                          key={tag}
                          className="inline-flex items-center px-2 py-1 bg-blue-100 dark:bg-blue-900
                                   text-blue-800 dark:text-blue-200 text-xs rounded-full"
                        >
                          <Tag className="w-3 h-3 mr-1" />
                          {tag}
                        </span>
                      ))}
                      
                      {(photo.people?.length > 3 || photo.tags?.length > 2) && (
                        <span className="text-xs text-gray-500 dark:text-gray-400">
                          +{(photo.people?.length || 0) + (photo.tags?.length || 0) - 5} więcej
                        </span>
                      )}
                    </div>
                  </div>

                  <button className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors">
                    <MoreHorizontal className="w-5 h-5 text-gray-400" />
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    );
  }  // Stworzenie niestandardowego elementu drag preview dla wielu zdjęć
  const createCustomDragImage = (e, photo) => {
    // Sprawdź, czy to część zbiorowego zaznaczenia
    const isMultipleSelection = selectedPhotos && selectedPhotos.includes(photo.id) && selectedPhotos.length > 1;

    if (!isMultipleSelection) {
      // Jeśli to pojedyncze zdjęcie, użyj standardowego podglądu
      const dragImage = new Image();
      dragImage.src = photo.dataUrl;
      e.dataTransfer.setDragImage(dragImage, 50, 50);
      return;
    }

    // Tworzenie niestandardowego elementu dla wielu zdjęć
    const dragPreviewEl = document.createElement('div');
    dragPreviewEl.style.position = 'absolute';
    dragPreviewEl.style.top = '-1000px';
    dragPreviewEl.style.padding = '5px';
    dragPreviewEl.style.background = 'rgba(0, 0, 0, 0.7)';
    dragPreviewEl.style.borderRadius = '8px';
    dragPreviewEl.style.display = 'flex';
    dragPreviewEl.style.alignItems = 'center';
    dragPreviewEl.style.gap = '10px';

    // Dodanie miniatury głównego zdjęcia
    const mainImageEl = document.createElement('img');
    mainImageEl.src = photo.dataUrl;
    mainImageEl.style.width = '50px';
    mainImageEl.style.height = '50px';
    mainImageEl.style.objectFit = 'cover';
    mainImageEl.style.borderRadius = '4px';

    // Dodanie liczby zdjęć
    const countEl = document.createElement('div');
    countEl.textContent = `+${selectedPhotos.length - 1}`;
    countEl.style.color = 'white';
    countEl.style.fontWeight = 'bold';
    countEl.style.fontSize = '14px';

    dragPreviewEl.appendChild(mainImageEl);
    dragPreviewEl.appendChild(countEl);
    document.body.appendChild(dragPreviewEl);

    // Ustaw niestandardowy element jako podgląd przeciągania
    e.dataTransfer.setDragImage(dragPreviewEl, 25, 25);

    // Usuń element po zakończeniu przeciągania
    setTimeout(() => {
      document.body.removeChild(dragPreviewEl);
    }, 0);
  };
  // Grid view
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
      {photos.map((photo, index) => (
        <motion.div
          key={photo.id}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
          // Zastosuj animację pulsowania przy przenoszeniu
          whileDrag={{ scale: 1.05, boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.2)" }}
          transition={{ 
            delay: index * 0.05,
            type: "spring",
            stiffness: 400,
            damping: 25
          }}
          onClick={(e) => {
            if (selectionMode) {
              e.stopPropagation();
              // Toggle selection
              if (selectedPhotos.includes(photo.id)) {
                onPhotosSelect(selectedPhotos.filter(id => id !== photo.id));
              } else {
                onPhotosSelect([...selectedPhotos, photo.id]);
              }
            } else {
              onPhotoClick(photo);
            }
          }}
          draggable
          onDragStart={(e) => {
            e.stopPropagation();
            
            // Jeśli zdjęcie jest częścią zaznaczenia, przeciągamy wszystkie zaznaczone zdjęcia
            if (selectedPhotos.includes(photo.id) && selectedPhotos.length > 1) {
              // Tworzenie niestandardowego podglądu dla wielu zdjęć
              createCustomDragImage(e, photo);
              
              // Ustaw dane dla wielu zdjęć
              e.dataTransfer.setData('application/json', JSON.stringify({
                photoIds: selectedPhotos,
                type: 'multi-photo'
              }));
            } else {
              // W przeciwnym razie pojedyncze zdjęcie
              const dragImage = new Image();
              dragImage.src = photo.dataUrl;
              e.dataTransfer.setDragImage(dragImage, 50, 50);
              
              e.dataTransfer.setData('application/json', JSON.stringify({ 
                photoId: photo.id, 
                type: 'photo' 
              }));
            }
            
            // Wywołaj onDragStart jeśli istnieje
            if (onDragStart) {
              onDragStart(e, photo);
            }
          }}
          className={`group relative aspect-square bg-gray-100 dark:bg-gray-800 rounded-xl overflow-hidden 
                   cursor-pointer shadow-sm hover:shadow-md transition-all duration-200
                   ${selectedPhotos.includes(photo.id) ? 'ring-2 ring-blue-500 ring-offset-2' : ''}`}
        >          {/* Drag handle overlay */}
          <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-0 
                       group-hover:bg-opacity-30 transition-opacity z-10">
            <div className="opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center">
              <Move className="w-6 h-6 text-white" />
              {selectedPhotos.includes(photo.id) && selectedPhotos.length > 1 && (
                <span className="mt-1 px-2 py-0.5 bg-blue-500 rounded-full text-xs text-white">
                  {selectedPhotos.length}
                </span>
              )}
            </div>
          </div>
          {/* Image */}
          <img
            src={photo.dataUrl}
            alt={photo.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
          />

          {/* Overlay */}
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-200">
            {/* Top overlay with album indicator */}
            <div className="absolute top-2 left-2 right-2 flex justify-between items-start">
              {photo.albumId && (
                <span className="px-2 py-1 bg-black/50 text-white text-xs rounded-full backdrop-blur-sm">
                  {getAlbumName(photo.albumId)}
                </span>
              )}
            </div>

            {/* Bottom overlay with title */}
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent 
                          p-3 transform translate-y-2 group-hover:translate-y-0 transition-transform duration-200">
              <h3 className="text-white text-sm font-medium truncate">
                {photo.title || 'Bez tytułu'}
              </h3>
              {photo.date && (
                <p className="text-gray-200 text-xs mt-1">
                  {formatDate(photo.date)}
                </p>
              )}
            </div>
          </div>

          {/* Tags indicator */}
          {(photo.tags?.length > 0 || photo.people?.length > 0) && (
            <div className="absolute top-2 right-2">
              <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center
                            text-white text-xs font-medium">
                {(photo.tags?.length || 0) + (photo.people?.length || 0)}
              </div>
            </div>
          )}
        </motion.div>
      ))}
    </div>
  );
};

export default PhotoGrid;
