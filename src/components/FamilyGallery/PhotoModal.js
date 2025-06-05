import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, ChevronLeft, ChevronRight, Edit3, Trash2, Download, 
  Calendar, User, Tag, Share2, Heart, MessageCircle, AlertTriangle 
} from 'lucide-react';

const PhotoModal = ({ photo, photos, onClose, onUpdate, onDelete, getAlbumName, theme }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({
    title: photo.title || '',
    description: photo.description || '',
    date: photo.date || '',
    tags: photo.tags || [],
    people: photo.people || []
  });  const [currentIndex, setCurrentIndex] = useState(photos.findIndex(p => p.id === photo.id));
  const [newTag, setNewTag] = useState('');
  const [newPerson, setNewPerson] = useState('');
  const [isLiked, setIsLiked] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const currentPhoto = photos[currentIndex];
  useEffect(() => {
    const handleKeyPress = (e) => {
      if (e.key === 'Escape') {
        onClose();
      }
      if (e.key === 'ArrowLeft') {
        setCurrentIndex(prev => prev > 0 ? prev - 1 : photos.length - 1);
        setIsEditing(false);
      }
      if (e.key === 'ArrowRight') {
        setCurrentIndex(prev => prev < photos.length - 1 ? prev + 1 : 0);
        setIsEditing(false);
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [onClose, photos.length]);

  useEffect(() => {
    // Update edit data when photo changes
    if (currentPhoto) {
      setEditData({
        title: currentPhoto.title || '',
        description: currentPhoto.description || '',
        date: currentPhoto.date || '',
        tags: currentPhoto.tags || [],
        people: currentPhoto.people || []
      });
    }
  }, [currentPhoto]);
  const goToPrevious = useCallback(() => {
    setCurrentIndex(prev => prev > 0 ? prev - 1 : photos.length - 1);
    setIsEditing(false);
  }, [photos.length]);

  const goToNext = useCallback(() => {
    setCurrentIndex(prev => prev < photos.length - 1 ? prev + 1 : 0);
    setIsEditing(false);
  }, [photos.length]);

  const handleSave = () => {
    onUpdate(currentPhoto.id, editData);
    setIsEditing(false);
  };

  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = currentPhoto.dataUrl;
    link.download = currentPhoto.filename || `${currentPhoto.title || 'zdjecie'}.jpg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const addTag = () => {
    if (newTag.trim() && !editData.tags.includes(newTag.trim())) {
      setEditData(prev => ({
        ...prev,
        tags: [...prev.tags, newTag.trim()]
      }));
      setNewTag('');
    }
  };

  const removeTag = (tagToRemove) => {
    setEditData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };

  const addPerson = () => {
    if (newPerson.trim() && !editData.people.includes(newPerson.trim())) {
      setEditData(prev => ({
        ...prev,
        people: [...prev.people, newPerson.trim()]
      }));
      setNewPerson('');
    }
  };

  const removePerson = (personToRemove) => {
    setEditData(prev => ({
      ...prev,
      people: prev.people.filter(person => person !== personToRemove)
    }));
  };

  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('pl-PL', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (!currentPhoto) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center"
      onClick={onClose}
    >
      {/* Navigation buttons */}
      {photos.length > 1 && (
        <>
          <button
            onClick={goToPrevious}
            className="absolute left-4 top-1/2 transform -translate-y-1/2 z-60
                     w-12 h-12 bg-white/10 hover:bg-white/20 backdrop-blur-sm
                     rounded-full flex items-center justify-center text-white
                     transition-colors"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
          
          <button
            onClick={goToNext}
            className="absolute right-4 top-1/2 transform -translate-y-1/2 z-60
                     w-12 h-12 bg-white/10 hover:bg-white/20 backdrop-blur-sm
                     rounded-full flex items-center justify-center text-white
                     transition-colors"
          >
            <ChevronRight className="w-6 h-6" />
          </button>
        </>
      )}

      {/* Header */}
      <div className="absolute top-0 left-0 right-0 z-60 p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="text-white">
              <h2 className="text-xl font-semibold">
                {currentPhoto.title || 'Bez tytułu'}
              </h2>
              <div className="flex items-center space-x-4 text-sm text-gray-300 mt-1">
                {currentPhoto.date && (
                  <span className="flex items-center space-x-1">
                    <Calendar className="w-4 h-4" />
                    <span>{formatDate(currentPhoto.date)}</span>
                  </span>
                )}
                <span>{currentIndex + 1} z {photos.length}</span>
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            {/* Action buttons */}
            <button
              onClick={() => setIsLiked(!isLiked)}
              className={`p-2 rounded-full transition-colors ${
                isLiked 
                  ? 'bg-red-500 text-white' 
                  : 'bg-white/10 hover:bg-white/20 text-white'
              }`}
            >
              <Heart className={`w-5 h-5 ${isLiked ? 'fill-current' : ''}`} />
            </button>

            <button
              onClick={handleDownload}
              className="p-2 bg-white/10 hover:bg-white/20 text-white rounded-full transition-colors"
            >
              <Download className="w-5 h-5" />
            </button>

            <button
              onClick={() => setIsEditing(!isEditing)}
              className="p-2 bg-white/10 hover:bg-white/20 text-white rounded-full transition-colors"
            >
              <Edit3 className="w-5 h-5" />
            </button>            <button
              onClick={() => setShowDeleteConfirm(true)}
              className="p-2 bg-red-500/20 hover:bg-red-500/30 text-red-400 rounded-full transition-colors"
            >
              <Trash2 className="w-5 h-5" />
            </button>

            <button
              onClick={onClose}
              className="p-2 bg-white/10 hover:bg-white/20 text-white rounded-full transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="w-full h-full flex" onClick={(e) => e.stopPropagation()}>
        {/* Image */}
        <div className="flex-1 flex items-center justify-center p-20">
          <motion.img
            key={currentPhoto.id}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
            src={currentPhoto.dataUrl}
            alt={currentPhoto.title}
            className="max-w-full max-h-full object-contain rounded-lg shadow-2xl"
          />
        </div>

        {/* Sidebar */}
        <AnimatePresence>
          {isEditing && (
            <motion.div
              initial={{ x: 400, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: 400, opacity: 0 }}
              className="w-96 bg-white dark:bg-gray-800 p-6 overflow-y-auto"
            >
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
                    Edytuj zdjęcie
                  </h3>
                </div>

                {/* Title */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Tytuł
                  </label>
                  <input
                    type="text"
                    value={editData.title}
                    onChange={(e) => setEditData(prev => ({ ...prev, title: e.target.value }))}
                    className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600
                             bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100
                             focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                {/* Date */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Data
                  </label>
                  <input
                    type="date"
                    value={editData.date}
                    onChange={(e) => setEditData(prev => ({ ...prev, date: e.target.value }))}
                    className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600
                             bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100
                             focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                {/* Description */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Opis
                  </label>
                  <textarea
                    value={editData.description}
                    onChange={(e) => setEditData(prev => ({ ...prev, description: e.target.value }))}
                    rows={4}
                    className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600
                             bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100
                             focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                {/* Tags */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    <Tag className="w-4 h-4 inline mr-1" />
                    Tagi
                  </label>
                  <div className="flex space-x-2 mb-2">
                    <input
                      type="text"
                      value={newTag}
                      onChange={(e) => setNewTag(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && addTag()}
                      placeholder="Dodaj tag"
                      className="flex-1 px-3 py-2 text-sm rounded-lg border border-gray-300 dark:border-gray-600
                               bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                    />
                    <button
                      onClick={addTag}
                      className="px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                    >
                      +
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {editData.tags.map(tag => (
                      <span
                        key={tag}
                        className="inline-flex items-center px-2 py-1 bg-blue-100 dark:bg-blue-900
                                 text-blue-800 dark:text-blue-200 text-xs rounded-full"
                      >
                        {tag}
                        <button
                          onClick={() => removeTag(tag)}
                          className="ml-1 text-blue-600 dark:text-blue-300 hover:text-blue-800"
                        >
                          ×
                        </button>
                      </span>
                    ))}
                  </div>
                </div>

                {/* People */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    <User className="w-4 h-4 inline mr-1" />
                    Osoby na zdjęciu
                  </label>
                  <div className="flex space-x-2 mb-2">
                    <input
                      type="text"
                      value={newPerson}
                      onChange={(e) => setNewPerson(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && addPerson()}
                      placeholder="Imię osoby"
                      className="flex-1 px-3 py-2 text-sm rounded-lg border border-gray-300 dark:border-gray-600
                               bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                    />
                    <button
                      onClick={addPerson}
                      className="px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                    >
                      +
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {editData.people.map(person => (
                      <span
                        key={person}
                        className="inline-flex items-center px-2 py-1 bg-green-100 dark:bg-green-900
                                 text-green-800 dark:text-green-200 text-xs rounded-full"
                      >
                        {person}
                        <button
                          onClick={() => removePerson(person)}
                          className="ml-1 text-green-600 dark:text-green-300 hover:text-green-800"
                        >
                          ×
                        </button>
                      </span>
                    ))}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex space-x-3 pt-4">
                  <button
                    onClick={() => setIsEditing(false)}
                    className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600
                             text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700"
                  >
                    Anuluj
                  </button>
                  <button
                    onClick={handleSave}
                    className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg"
                  >
                    Zapisz
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Photo info overlay (when not editing) */}
      {!isEditing && (currentPhoto.description || currentPhoto.tags?.length > 0 || currentPhoto.people?.length > 0) && (
        <div className="absolute bottom-4 left-4 right-4 z-60">
          <div className="bg-black/50 backdrop-blur-sm rounded-xl p-4 text-white">
            {currentPhoto.description && (
              <p className="text-sm mb-3">{currentPhoto.description}</p>
            )}
            
            <div className="flex flex-wrap gap-2">
              {currentPhoto.people?.map(person => (
                <span
                  key={person}
                  className="inline-flex items-center px-2 py-1 bg-white/20 text-white text-xs rounded-full"
                >
                  <User className="w-3 h-3 mr-1" />
                  {person}
                </span>
              ))}
              
              {currentPhoto.tags?.map(tag => (
                <span
                  key={tag}
                  className="inline-flex items-center px-2 py-1 bg-white/20 text-white text-xs rounded-full"
                >
                  <Tag className="w-3 h-3 mr-1" />
                  {tag}
                </span>
              ))}
            </div>
          </div>        </div>
      )}

      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {showDeleteConfirm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-[60]"
            onClick={() => setShowDeleteConfirm(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-xl max-w-sm mx-4"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center mb-4">
                <AlertTriangle className="w-6 h-6 text-red-500 mr-3" />
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Potwierdź usunięcie
                </h3>
              </div>
              
              <p className="text-gray-600 dark:text-gray-300 mb-6">
                Czy na pewno chcesz usunąć to zdjęcie? Ta operacja nie może być cofnięta.
              </p>
              
              <div className="flex gap-3 justify-end">
                <button
                  onClick={() => setShowDeleteConfirm(false)}
                  className="px-4 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 transition-colors"
                >
                  Anuluj
                </button>
                <button
                  onClick={() => {
                    onDelete(currentPhoto.id);
                    setShowDeleteConfirm(false);
                  }}
                  className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-md transition-colors"
                >
                  Usuń
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default PhotoModal;
