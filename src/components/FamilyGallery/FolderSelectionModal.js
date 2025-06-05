import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Folder, FolderOpen, X, ChevronRight, ChevronDown, 
  Image, Calendar, Users, MapPin, Heart, Star 
} from 'lucide-react';

const FolderSelectionModal = ({ isOpen, onClose, folders, onFolderSelect, selectedFolder, theme, photosCount }) => {
  const [expandedFolders, setExpandedFolders] = useState(new Set(['root']));
  const [selectedFolderId, setSelectedFolderId] = useState(selectedFolder || null);

  const folderIcons = {
    Folder: Folder,
    Calendar: Calendar,
    Users: Users,
    MapPin: MapPin,
    Heart: Heart,
    Star: Star,
    Image: Image
  };

  const folderColors = {
    blue: 'bg-blue-500 text-blue-100',
    green: 'bg-green-500 text-green-100',
    red: 'bg-red-500 text-red-100',
    purple: 'bg-purple-500 text-purple-100',
    yellow: 'bg-yellow-500 text-yellow-100',
    pink: 'bg-pink-500 text-pink-100',
    indigo: 'bg-indigo-500 text-indigo-100',
    gray: 'bg-gray-500 text-gray-100'
  };

  const toggleFolder = (folderId) => {
    const newExpanded = new Set(expandedFolders);
    if (newExpanded.has(folderId)) {
      newExpanded.delete(folderId);
    } else {
      newExpanded.add(folderId);
    }
    setExpandedFolders(newExpanded);
  };

  const handleFolderSelect = (folderId) => {
    setSelectedFolderId(folderId);
  };

  const handleConfirm = () => {
    if (selectedFolderId) {
      onFolderSelect(selectedFolderId);
    }
  };

  const renderFolder = (folder, level = 0) => {
    const isExpanded = expandedFolders.has(folder.id);
    const hasChildren = folder.children && folder.children.length > 0;
    const isSelected = selectedFolderId === folder.id;
    const IconComponent = folderIcons[folder.icon] || Folder;

    return (
      <div key={folder.id} className="w-full">
        {/* Folder Item */}
        <div
          className={`flex items-center gap-2 p-2 rounded-lg cursor-pointer group transition-colors ${
            isSelected 
              ? (theme === 'dark' ? 'bg-blue-900' : 'bg-blue-100') 
              : `hover:bg-gray-100 dark:hover:bg-gray-700`
          }`}
          style={{ marginLeft: `${level * 20}px` }}
          onClick={() => {
            handleFolderSelect(folder.id);
            if (hasChildren && !isExpanded) {
              toggleFolder(folder.id);
            }
          }}
        >
          {/* Expand/Collapse Button */}
          <div 
            className="w-4 h-4 flex items-center justify-center"
            onClick={(e) => {
              e.stopPropagation();
              if (hasChildren) {
                toggleFolder(folder.id);
              }
            }}
          >
            {hasChildren && (
              <motion.div
                animate={{ rotate: isExpanded ? 90 : 0 }}
                transition={{ duration: 0.2 }}
              >
                <ChevronRight className="w-4 h-4" />
              </motion.div>
            )}
          </div>

          {/* Folder Icon */}
          <div className={`p-1.5 rounded ${folderColors[folder.color]} flex-shrink-0`}>
            <IconComponent className="w-4 h-4" />
          </div>

          {/* Folder Name */}
          <span className={`flex-1 font-medium ${
            theme === 'dark' ? 'text-gray-200' : 'text-gray-700'
          }`}>
            {folder.name}
          </span>
        </div>

        {/* Children */}
        <AnimatePresence>
          {isExpanded && hasChildren && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="overflow-hidden"
            >
              {folder.children.map(child => renderFolder(child, level + 1))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  };

  if (!isOpen) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-70"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className={`w-full max-w-md p-6 rounded-xl shadow-xl ${
          theme === 'dark' ? 'bg-gray-800' : 'bg-white'
        }`}
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h3 className={`text-lg font-semibold ${
            theme === 'dark' ? 'text-white' : 'text-gray-900'
          }`}>
            Wybierz folder docelowy
          </h3>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Folder Tree */}
        <div className={`border rounded-lg mb-4 p-2 max-h-64 overflow-y-auto ${
          theme === 'dark' ? 'border-gray-700 bg-gray-900' : 'border-gray-200'
        }`}>
          {folders && folders.map(folder => renderFolder(folder))}
        </div>

        {/* Action info */}
        <div className={`mb-4 p-3 rounded-lg ${
          theme === 'dark' ? 'bg-gray-700' : 'bg-gray-100'
        }`}>
          <p className={`text-sm ${
            theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
          }`}>
            {photosCount} {photosCount === 1 ? 'zdjęcie zostanie przeniesione' : 'zdjęć zostanie przeniesionych'} do wybranego folderu.
          </p>
        </div>

        {/* Actions */}
        <div className="flex justify-end space-x-3">
          <button
            onClick={onClose}
            className={`px-4 py-2 rounded-lg ${
              theme === 'dark' 
                ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' 
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Anuluj
          </button>
          <button
            onClick={handleConfirm}
            disabled={!selectedFolderId}
            className={`px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50 disabled:pointer-events-none`}
          >
            Przenieś
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default FolderSelectionModal;
