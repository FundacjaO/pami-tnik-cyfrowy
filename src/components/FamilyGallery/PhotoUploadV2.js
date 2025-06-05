import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, Upload, Image, Calendar, User, Tag, 
  FileImage, Trash2, Eye, FolderOpen, 
  CheckCircle, AlertCircle, Progress 
} from 'lucide-react';

const PhotoUpload = ({ onClose, onPhotoAdd, albums, folders, selectedFolder, theme }) => {
  const [dragOver, setDragOver] = useState(false);
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
  });
  const [individualDetails, setIndividualDetails] = useState({});
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

  const handleFiles = async (files) => {
    setUploading(true);
    setUploadProgress(0);
    const processed = [];

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      setUploadProgress(((i + 1) / files.length) * 100);

      try {
        const dataUrl = await new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = () => resolve(reader.result);
          reader.onerror = reject;
          reader.readAsDataURL(file);
        });

        // Extract EXIF data if possible
        const exifData = await extractExifData(file);
        
        processed.push({
          id: `temp-${Date.now()}-${i}`,
          file,
          dataUrl,
          filename: file.name,
          size: file.size,
          type: file.type,
          lastModified: file.lastModified,
          exifData,
          title: file.name.replace(/\.[^/.]+$/, ""), // Remove extension
          description: '',
          error: null
        });
      } catch (error) {
        processed.push({
          id: `temp-${Date.now()}-${i}`,
          file,
          filename: file.name,
          error: 'Błąd podczas wczytywania pliku'
        });
      }
    }

    setProcessedFiles(processed);
    setSelectedFiles(files);
    setCurrentStep(2);
    setUploading(false);
  };

  // Simple EXIF data extraction (basic date from file)
  const extractExifData = async (file) => {
    try {
      // Try to get date from file modification time as fallback
      const date = new Date(file.lastModified);
      return {
        dateTime: date.toISOString().split('T')[0],
        fileSize: file.size,
        fileName: file.name
      };
    } catch (error) {
      return null;
    }
  };

  const removeFile = (fileId) => {
    setProcessedFiles(prev => prev.filter(file => file.id !== fileId));
    if (processedFiles.length <= 1) {
      setCurrentStep(1);
    }
  };

  const updateFileDetails = (fileId, details) => {
    setIndividualDetails(prev => ({
      ...prev,
      [fileId]: { ...prev[fileId], ...details }
    }));
  };

  const addBatchTag = () => {
    if (newTag.trim() && !batchDetails.tags.includes(newTag.trim())) {
      setBatchDetails(prev => ({
        ...prev,
        tags: [...prev.tags, newTag.trim()]
      }));
      setNewTag('');
    }
  };

  const removeBatchTag = (tagToRemove) => {
    setBatchDetails(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };

  const addBatchPerson = () => {
    if (newPerson.trim() && !batchDetails.people.includes(newPerson.trim())) {
      setBatchDetails(prev => ({
        ...prev,
        people: [...prev.people, newPerson.trim()]
      }));
      setNewPerson('');
    }
  };

  const removeBatchPerson = (personToRemove) => {
    setBatchDetails(prev => ({
      ...prev,
      people: prev.people.filter(person => person !== personToRemove)
    }));
  };

  const handleSubmit = () => {
    processedFiles.forEach(fileData => {
      if (fileData.error) return;

      const details = individualDetails[fileData.id] || {};
      const finalDetails = batchDetails.applyToAll ? batchDetails : details;
      
      const photoData = {
        filename: fileData.filename,
        dataUrl: fileData.dataUrl,
        size: fileData.size,
        type: fileData.type,
        title: details.title || fileData.title,
        description: details.description || '',
        albumId: finalDetails.albumId || batchDetails.albumId,
        folderId: finalDetails.folderId || batchDetails.folderId,
        date: finalDetails.date || batchDetails.date,
        tags: finalDetails.tags || batchDetails.tags,
        people: finalDetails.people || batchDetails.people,
        uploadedAt: new Date().toISOString(),
        exifData: fileData.exifData
      };
      
      onPhotoAdd(photoData);
    });
    
    onClose();
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <AnimatePresence>
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
          className={`${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} rounded-xl shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto`}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className={`flex items-center justify-between p-6 border-b ${theme === 'dark' ? 'border-gray-700' : 'border-gray-200'}`}>
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg flex items-center justify-center">
                <Upload className="w-4 h-4 text-white" />
              </div>
              <div>
                <h2 className={`text-xl font-semibold ${theme === 'dark' ? 'text-gray-100' : 'text-gray-900'}`}>
                  Dodaj zdjęcia
                </h2>
                <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                  {currentStep === 1 && 'Wybierz pliki do przesłania'}
                  {currentStep === 2 && `${processedFiles.length} ${processedFiles.length === 1 ? 'plik' : 'plików'} gotowych do przesłania`}
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className={`p-2 rounded-lg transition-colors ${
                theme === 'dark' ? 'hover:bg-gray-700' : 'hover:bg-gray-100'
              }`}
            >
              <X className="w-5 h-5 text-gray-500" />
            </button>
          </div>

          <div className="p-6">
            {currentStep === 1 ? (
              /* Step 1: File Upload */
              <div className="space-y-6">
                {/* Progress Bar */}
                {uploading && (
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className={theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}>
                        Przetwarzanie plików...
                      </span>
                      <span className={theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}>
                        {Math.round(uploadProgress)}%
                      </span>
                    </div>
                    <div className={`w-full h-2 rounded-full ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-200'}`}>
                      <div 
                        className="h-2 bg-blue-500 rounded-full transition-all duration-300"
                        style={{ width: `${uploadProgress}%` }}
                      ></div>
                    </div>
                  </div>
                )}

                {/* Drag & Drop Area */}
                <div
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                  className={`border-2 border-dashed rounded-xl p-12 text-center transition-all duration-200 ${
                    dragOver 
                      ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20 scale-[1.02]' 
                      : `border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500 ${
                          theme === 'dark' ? 'hover:bg-gray-750' : 'hover:bg-gray-50'
                        }`
                  }`}
                >
                  <div className="space-y-4">
                    <div className={`w-16 h-16 mx-auto rounded-full flex items-center justify-center ${
                      dragOver ? 'bg-blue-100 dark:bg-blue-900' : 'bg-gray-100 dark:bg-gray-700'
                    }`}>
                      <FileImage className={`w-8 h-8 ${
                        dragOver ? 'text-blue-500' : 'text-gray-400'
                      }`} />
                    </div>
                    
                    <div>
                      <h3 className={`text-lg font-medium mb-2 ${theme === 'dark' ? 'text-gray-100' : 'text-gray-900'}`}>
                        {dragOver ? 'Upuść pliki tutaj' : 'Przeciągnij i upuść zdjęcia'}
                      </h3>
                      <p className={`text-sm mb-4 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                        Lub kliknij poniżej aby wybrać pliki z komputera
                      </p>
                    </div>
                    
                    <button
                      onClick={() => fileInputRef.current?.click()}
                      disabled={uploading}
                      className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white px-8 py-3 rounded-lg transition-colors font-medium"
                    >
                      {uploading ? 'Przetwarzanie...' : 'Wybierz zdjęcia'}
                    </button>
                  </div>
                  
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleFileSelect}
                    className="hidden"
                    disabled={uploading}
                  />
                </div>

                <div className={`text-center text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                  <p>Obsługiwane formaty: JPG, PNG, GIF, WebP, HEIC</p>
                  <p>Maksymalny rozmiar pliku: 50MB</p>
                </div>
              </div>
            ) : (
              /* Step 2: Preview & Details */
              <div className="space-y-6">
                {/* File Preview Grid */}
                <div>
                  <h3 className={`text-lg font-medium mb-4 ${theme === 'dark' ? 'text-gray-100' : 'text-gray-900'}`}>
                    Podgląd plików ({processedFiles.length})
                  </h3>
                  
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 max-h-64 overflow-y-auto">
                    {processedFiles.map((file) => (
                      <div key={file.id} className="relative group">
                        {file.error ? (
                          <div className={`aspect-square rounded-lg border-2 border-dashed flex items-center justify-center ${
                            theme === 'dark' ? 'border-red-600 bg-red-900/20' : 'border-red-300 bg-red-50'
                          }`}>
                            <AlertCircle className="w-6 h-6 text-red-500" />
                          </div>
                        ) : (
                          <div className="relative">
                            <img
                              src={file.dataUrl}
                              alt={file.filename}
                              className="aspect-square object-cover rounded-lg"
                            />
                            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/50 transition-all duration-200 rounded-lg flex items-center justify-center">
                              <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                                <button
                                  onClick={() => removeFile(file.id)}
                                  className="p-2 bg-red-500 hover:bg-red-600 text-white rounded-full transition-colors"
                                  title="Usuń plik"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </div>
                            </div>
                            
                            {/* File info overlay */}
                            <div className="absolute bottom-0 left-0 right-0 bg-black/70 text-white p-2 rounded-b-lg">
                              <p className="text-xs truncate font-medium">{file.filename}</p>
                              <p className="text-xs text-gray-300">{formatFileSize(file.size)}</p>
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Batch Settings */}
                <div className={`p-4 rounded-lg ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-50'}`}>
                  <div className="flex items-center justify-between mb-4">
                    <h4 className={`font-medium ${theme === 'dark' ? 'text-gray-100' : 'text-gray-900'}`}>
                      Ustawienia wspólne dla wszystkich zdjęć
                    </h4>
                    <label className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={batchDetails.applyToAll}
                        onChange={(e) => setBatchDetails(prev => ({ ...prev, applyToAll: e.target.checked }))}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                      <span className={`text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                        Zastosuj do wszystkich
                      </span>
                    </label>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Album Selection */}
                    <div>
                      <label className={`block text-sm font-medium mb-2 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                        Album
                      </label>
                      <select
                        value={batchDetails.albumId}
                        onChange={(e) => setBatchDetails(prev => ({ ...prev, albumId: e.target.value }))}
                        className={`w-full px-3 py-2 rounded-lg border ${
                          theme === 'dark' 
                            ? 'bg-gray-600 border-gray-500 text-gray-100' 
                            : 'bg-white border-gray-300 text-gray-900'
                        } focus:ring-2 focus:ring-blue-500`}
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
                      <label className={`block text-sm font-medium mb-2 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                        <Calendar className="w-4 h-4 inline mr-1" />
                        Data
                      </label>
                      <input
                        type="date"
                        value={batchDetails.date}
                        onChange={(e) => setBatchDetails(prev => ({ ...prev, date: e.target.value }))}
                        className={`w-full px-3 py-2 rounded-lg border ${
                          theme === 'dark' 
                            ? 'bg-gray-600 border-gray-500 text-gray-100' 
                            : 'bg-white border-gray-300 text-gray-900'
                        } focus:ring-2 focus:ring-blue-500`}
                      />
                    </div>

                    {/* Batch Tags */}
                    <div>
                      <label className={`block text-sm font-medium mb-2 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                        <Tag className="w-4 h-4 inline mr-1" />
                        Tagi
                      </label>
                      <div className="flex space-x-2 mb-2">
                        <input
                          type="text"
                          value={newTag}
                          onChange={(e) => setNewTag(e.target.value)}
                          onKeyPress={(e) => e.key === 'Enter' && addBatchTag()}
                          placeholder="Dodaj tag"
                          className={`flex-1 px-3 py-2 text-sm rounded-lg border ${
                            theme === 'dark' 
                              ? 'bg-gray-600 border-gray-500 text-gray-100' 
                              : 'bg-white border-gray-300 text-gray-900'
                          }`}
                        />
                        <button
                          onClick={addBatchTag}
                          className="px-3 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                        >
                          +
                        </button>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {batchDetails.tags.map(tag => (
                          <span
                            key={tag}
                            className="inline-flex items-center px-2 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 text-xs rounded-full"
                          >
                            {tag}
                            <button
                              onClick={() => removeBatchTag(tag)}
                              className="ml-1 text-blue-600 dark:text-blue-300 hover:text-blue-800"
                            >
                              ×
                            </button>
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Batch People */}
                    <div>
                      <label className={`block text-sm font-medium mb-2 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                        <User className="w-4 h-4 inline mr-1" />
                        Osoby
                      </label>
                      <div className="flex space-x-2 mb-2">
                        <input
                          type="text"
                          value={newPerson}
                          onChange={(e) => setNewPerson(e.target.value)}
                          onKeyPress={(e) => e.key === 'Enter' && addBatchPerson()}
                          placeholder="Imię osoby"
                          className={`flex-1 px-3 py-2 text-sm rounded-lg border ${
                            theme === 'dark' 
                              ? 'bg-gray-600 border-gray-500 text-gray-100' 
                              : 'bg-white border-gray-300 text-gray-900'
                          }`}
                        />
                        <button
                          onClick={addBatchPerson}
                          className="px-3 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
                        >
                          +
                        </button>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {batchDetails.people.map(person => (
                          <span
                            key={person}
                            className="inline-flex items-center px-2 py-1 bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 text-xs rounded-full"
                          >
                            {person}
                            <button
                              onClick={() => removeBatchPerson(person)}
                              className="ml-1 text-green-600 dark:text-green-300 hover:text-green-800"
                            >
                              ×
                            </button>
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex justify-between pt-4">
                  <button
                    onClick={() => {
                      setCurrentStep(1);
                      setProcessedFiles([]);
                      setSelectedFiles([]);
                    }}
                    className={`px-6 py-2 border rounded-lg transition-colors ${
                      theme === 'dark' 
                        ? 'border-gray-600 text-gray-300 hover:bg-gray-700' 
                        : 'border-gray-300 text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    Wstecz
                  </button>
                  
                  <div className="flex space-x-3">
                    <button
                      onClick={handleSubmit}
                      disabled={processedFiles.filter(f => !f.error).length === 0}
                      className="px-6 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white rounded-lg transition-colors disabled:cursor-not-allowed flex items-center space-x-2"
                    >
                      <Upload className="w-4 h-4" />
                      <span>
                        Dodaj {processedFiles.filter(f => !f.error).length} {
                          processedFiles.filter(f => !f.error).length === 1 ? 'zdjęcie' : 'zdjęć'
                        }
                      </span>
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default PhotoUpload;
