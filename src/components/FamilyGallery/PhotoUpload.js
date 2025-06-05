import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, Upload, Image, Calendar, User, Tag, 
  FileImage, Trash2, Eye, FolderOpen, 
  CheckCircle, AlertCircle, Progress 
} from 'lucide-react';

const PhotoUpload = ({ onClose, onPhotoAdd, albums, folders, selectedFolder, theme }) => {  const [dragOver, setDragOver] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [processedFiles, setProcessedFiles] = useState([]);
  const [currentStep, setCurrentStep] = useState(1); // 1: upload, 2: preview, 3: details
  const [uploadProgress, setUploadProgress] = useState(0);
  const [batchDetails, setBatchDetails] = useState({
    albumId: albums[0]?.id || '',
    folderId: selectedFolder || 'root',
    date: new Date().toISOString().split('T')[0],
    tags: [],
    people: [],
    applyToAll: false
  });  const [individualDetails, setIndividualDetails] = useState({});
  const [photoDetails, setPhotoDetails] = useState({
    title: '',
    description: '',
    albumId: albums[0]?.id || '',
    folderId: selectedFolder || 'root',
    date: new Date().toISOString().split('T')[0],
    tags: [],
    people: []
  });
  const [newTag, setNewTag] = useState('');
  const [newPerson, setNewPerson] = useState('');
  
  const fileInputRef = useRef(null);

  const handleDragOver = (e) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setDragOver(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    
    const files = Array.from(e.dataTransfer.files).filter(file => 
      file.type.startsWith('image/')
    );
    
    if (files.length > 0) {
      handleFiles(files);
    }
  };

  const handleFileSelect = (e) => {
    const files = Array.from(e.target.files).filter(file => 
      file.type.startsWith('image/')
    );
    
    if (files.length > 0) {
      handleFiles(files);
    }
  };

  const handleFiles = (files) => {
    setUploading(true);
    
    const filePromises = files.map(file => {
      return new Promise((resolve) => {
        const reader = new FileReader();
        reader.onload = (e) => {
          resolve({
            file,
            preview: e.target.result,
            id: Date.now() + Math.random()
          });
        };
        reader.readAsDataURL(file);
      });
    });

    Promise.all(filePromises).then(fileData => {
      setSelectedFiles(fileData);
      setUploading(false);
      if (fileData.length === 1) {
        // Auto-fill title with filename for single upload
        setPhotoDetails(prev => ({
          ...prev,
          title: fileData[0].file.name.split('.')[0]
        }));
      }
      setCurrentStep(2);
    });
  };

  const addTag = () => {
    if (newTag.trim() && !photoDetails.tags.includes(newTag.trim())) {
      setPhotoDetails(prev => ({
        ...prev,
        tags: [...prev.tags, newTag.trim()]
      }));
      setNewTag('');
    }
  };

  const removeTag = (tagToRemove) => {
    setPhotoDetails(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };

  const addPerson = () => {
    if (newPerson.trim() && !photoDetails.people.includes(newPerson.trim())) {
      setPhotoDetails(prev => ({
        ...prev,
        people: [...prev.people, newPerson.trim()]
      }));
      setNewPerson('');
    }
  };

  const removePerson = (personToRemove) => {
    setPhotoDetails(prev => ({
      ...prev,
      people: prev.people.filter(person => person !== personToRemove)
    }));
  };

  const handleSubmit = () => {
    selectedFiles.forEach(fileData => {
      const photoData = {
        ...photoDetails,
        id: fileData.id,
        filename: fileData.file.name,
        dataUrl: fileData.preview,
        size: fileData.file.size,
        uploadedAt: new Date().toISOString()
      };
      
      if (selectedFiles.length > 1) {
        // For multiple files, add index to title
        photoData.title = `${photoDetails.title || 'Zdjęcie'} ${selectedFiles.indexOf(fileData) + 1}`;
      }
      
      onPhotoAdd(photoData);
    });
    
    onClose();
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="bg-white dark:bg-gray-800 rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg 
                          flex items-center justify-center">
              <Upload className="w-4 h-4 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
                Dodaj zdjęcia
              </h2>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Krok {currentStep} z 2: {currentStep === 1 ? 'Wybierz pliki' : 'Dodaj szczegóły'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        <div className="p-6">
          {currentStep === 1 ? (
            /* Step 1: File Upload */
            <div className="space-y-6">
              {/* Drag & Drop Area */}
              <div
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                className={`border-2 border-dashed rounded-xl p-8 text-center transition-colors
                          ${dragOver 
                            ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20' 
                            : 'border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500'
                          }`}
              >
                <Image className="w-12 h-12 mx-auto text-gray-400 mb-4" />
                <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
                  Przeciągnij zdjęcia tutaj
                </h3>
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                  lub kliknij aby wybrać pliki
                </p>
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg transition-colors"
                >
                  Wybierz zdjęcia
                </button>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleFileSelect}
                  className="hidden"
                />
              </div>

              <div className="text-center text-sm text-gray-500 dark:text-gray-400">
                Obsługiwane formaty: JPG, PNG, GIF, WebP
              </div>
            </div>
          ) : (
            /* Step 2: Details */
            <div className="space-y-6">
              {/* Preview */}
              <div className="flex space-x-4 overflow-x-auto pb-2">
                {selectedFiles.map((file, index) => (
                  <div key={file.id} className="flex-shrink-0">
                    <img
                      src={file.preview}
                      alt={`Preview ${index + 1}`}
                      className="w-20 h-20 object-cover rounded-lg"
                    />
                  </div>
                ))}
              </div>

              {/* Form */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Title */}
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Tytuł
                  </label>
                  <input
                    type="text"
                    value={photoDetails.title}
                    onChange={(e) => setPhotoDetails(prev => ({ ...prev, title: e.target.value }))}
                    placeholder="Nazwa zdjęcia/wydarzenia"
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600
                             bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100
                             focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400"
                  />
                </div>

                {/* Album */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Album
                  </label>
                  <select
                    value={photoDetails.albumId}
                    onChange={(e) => setPhotoDetails(prev => ({ ...prev, albumId: e.target.value }))}
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600
                             bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100
                             focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400"
                  >
                    {albums.map(album => (
                      <option key={album.id} value={album.id}>
                        {album.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Date */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    <Calendar className="w-4 h-4 inline mr-1" />
                    Data
                  </label>
                  <input
                    type="date"
                    value={photoDetails.date}
                    onChange={(e) => setPhotoDetails(prev => ({ ...prev, date: e.target.value }))}
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600
                             bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100
                             focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400"
                  />
                </div>

                {/* Description */}
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Opis
                  </label>
                  <textarea
                    value={photoDetails.description}
                    onChange={(e) => setPhotoDetails(prev => ({ ...prev, description: e.target.value }))}
                    placeholder="Opisz to zdjęcie..."
                    rows={3}
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600
                             bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100
                             focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400"
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
                      className="px-3 py-2 bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-300
                               rounded-lg hover:bg-gray-300 dark:hover:bg-gray-500 transition-colors"
                    >
                      +
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {photoDetails.tags.map(tag => (
                      <span
                        key={tag}
                        className="inline-flex items-center px-2 py-1 bg-blue-100 dark:bg-blue-900
                                 text-blue-800 dark:text-blue-200 text-xs rounded-full"
                      >
                        {tag}
                        <button
                          onClick={() => removeTag(tag)}
                          className="ml-1 text-blue-600 dark:text-blue-300 hover:text-blue-800 dark:hover:text-blue-100"
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
                      className="px-3 py-2 bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-300
                               rounded-lg hover:bg-gray-300 dark:hover:bg-gray-500 transition-colors"
                    >
                      +
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {photoDetails.people.map(person => (
                      <span
                        key={person}
                        className="inline-flex items-center px-2 py-1 bg-green-100 dark:bg-green-900
                                 text-green-800 dark:text-green-200 text-xs rounded-full"
                      >
                        {person}
                        <button
                          onClick={() => removePerson(person)}
                          className="ml-1 text-green-600 dark:text-green-300 hover:text-green-800 dark:hover:text-green-100"
                        >
                          ×
                        </button>
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex justify-between pt-4">
                <button
                  onClick={() => setCurrentStep(1)}
                  className="px-6 py-2 text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-gray-100
                           border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700
                           transition-colors"
                >
                  Wstecz
                </button>
                <button
                  onClick={handleSubmit}
                  disabled={!photoDetails.title.trim()}
                  className="px-6 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400
                           text-white rounded-lg transition-colors disabled:cursor-not-allowed"
                >
                  Dodaj {selectedFiles.length > 1 ? `${selectedFiles.length} zdjęć` : 'zdjęcie'}
                </button>
              </div>
            </div>
          )}

          {uploading && (
            <div className="text-center py-4">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              <p className="mt-2 text-gray-600 dark:text-gray-400">Przetwarzanie zdjęć...</p>
            </div>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
};

export default PhotoUpload;
