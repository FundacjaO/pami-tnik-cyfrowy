import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, Folder, Image, X } from 'lucide-react';

const AlbumManager = ({ isOpen, onClose, albums, onAlbumsChange }) => {
  const [isCreating, setIsCreating] = useState(false);
  const [editingAlbum, setEditingAlbum] = useState(null);
  const [newAlbumName, setNewAlbumName] = useState('');
  const [newAlbumDescription, setNewAlbumDescription] = useState('');

  const defaultAlbums = ['Rodzina', 'Wydarzenia', 'Święta', 'Podróże'];

  const handleCreateAlbum = () => {
    if (newAlbumName.trim()) {
      const newAlbum = {
        id: Date.now(),
        name: newAlbumName.trim(),
        description: newAlbumDescription.trim(),
        photoCount: 0,
        createdAt: new Date().toISOString(),
        isDefault: false
      };
      
      const updatedAlbums = [...albums, newAlbum];
      onAlbumsChange(updatedAlbums);
      
      setNewAlbumName('');
      setNewAlbumDescription('');
      setIsCreating(false);
    }
  };

  const handleEditAlbum = (album) => {
    if (album.isDefault) return; // Nie można edytować domyślnych albumów
    
    setEditingAlbum(album);
    setNewAlbumName(album.name);
    setNewAlbumDescription(album.description || '');
  };

  const handleUpdateAlbum = () => {
    if (newAlbumName.trim() && editingAlbum) {
      const updatedAlbums = albums.map(album => 
        album.id === editingAlbum.id 
          ? { ...album, name: newAlbumName.trim(), description: newAlbumDescription.trim() }
          : album
      );
      
      onAlbumsChange(updatedAlbums);
      
      setEditingAlbum(null);
      setNewAlbumName('');
      setNewAlbumDescription('');
    }
  };

  const handleDeleteAlbum = (albumToDelete) => {
    if (albumToDelete.isDefault) return; // Nie można usuwać domyślnych albumów
    
    if (window.confirm(`Czy na pewno chcesz usunąć album "${albumToDelete.name}"? Wszystkie zdjęcia z tego albumu zostaną przeniesione do albumu "Rodzina".`)) {
      // Przenieś zdjęcia do domyślnego albumu
      const photos = JSON.parse(localStorage.getItem('familyPhotos') || '[]');
      const updatedPhotos = photos.map(photo => 
        photo.album === albumToDelete.name 
          ? { ...photo, album: 'Rodzina' }
          : photo
      );
      localStorage.setItem('familyPhotos', JSON.stringify(updatedPhotos));
      
      // Usuń album
      const updatedAlbums = albums.filter(album => album.id !== albumToDelete.id);
      onAlbumsChange(updatedAlbums);
    }
  };

  const cancelEdit = () => {
    setIsCreating(false);
    setEditingAlbum(null);
    setNewAlbumName('');
    setNewAlbumDescription('');
  };

  const getAlbumPhotoCount = (albumName) => {
    const photos = JSON.parse(localStorage.getItem('familyPhotos') || '[]');
    return photos.filter(photo => photo.album === albumName).length;
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[80vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-xl font-semibold flex items-center gap-2">
            <Folder className="w-5 h-5" />
            Zarządzaj Albumami
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 max-h-[60vh] overflow-y-auto">
          {/* Create/Edit Form */}
          {(isCreating || editingAlbum) && (
            <div className="mb-6 p-4 border rounded-lg bg-gray-50">
              <h3 className="font-medium mb-3">
                {isCreating ? 'Utwórz nowy album' : 'Edytuj album'}
              </h3>
              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-medium mb-1">Nazwa albumu</label>
                  <input
                    type="text"
                    value={newAlbumName}
                    onChange={(e) => setNewAlbumName(e.target.value)}
                    placeholder="Podaj nazwę albumu..."
                    className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Opis (opcjonalny)</label>
                  <textarea
                    value={newAlbumDescription}
                    onChange={(e) => setNewAlbumDescription(e.target.value)}
                    placeholder="Dodaj opis albumu..."
                    rows="2"
                    className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={isCreating ? handleCreateAlbum : handleUpdateAlbum}
                    disabled={!newAlbumName.trim()}
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
                  >
                    {isCreating ? 'Utwórz' : 'Zapisz'}
                  </button>
                  <button
                    onClick={cancelEdit}
                    className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors"
                  >
                    Anuluj
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Albums List */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="font-medium text-gray-700">Twoje Albumy</h3>
              {!isCreating && !editingAlbum && (
                <button
                  onClick={() => setIsCreating(true)}
                  className="flex items-center gap-2 px-3 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                >
                  <Plus className="w-4 h-4" />
                  Dodaj Album
                </button>
              )}
            </div>

            {albums.map((album) => (
              <div key={album.id || album.name} className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50 transition-colors">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                    <Folder className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <h4 className="font-medium">{album.name}</h4>
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                      <Image className="w-3 h-3" />
                      <span>{getAlbumPhotoCount(album.name)} zdjęć</span>
                      {album.isDefault && (
                        <span className="px-2 py-1 bg-gray-200 text-gray-600 rounded-full text-xs">
                          Domyślny
                        </span>
                      )}
                    </div>
                    {album.description && (
                      <p className="text-sm text-gray-600 mt-1">{album.description}</p>
                    )}
                  </div>
                </div>

                {!album.isDefault && (
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleEditAlbum(album)}
                      className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-full transition-colors"
                      title="Edytuj album"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDeleteAlbum(album)}
                      className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-full transition-colors"
                      title="Usuń album"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Info */}
          <div className="mt-6 p-4 bg-blue-50 rounded-lg">
            <h4 className="font-medium text-blue-900 mb-2">Informacje</h4>
            <ul className="text-sm text-blue-800 space-y-1">
              <li>• Albumy domyślne nie mogą być edytowane ani usuwane</li>
              <li>• Przy usuwaniu albumu, zdjęcia zostaną przeniesione do albumu "Rodzina"</li>
              <li>• Możesz organizować zdjęcia w albumach tematycznych</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AlbumManager;
