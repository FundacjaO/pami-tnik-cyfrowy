import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Folder, FolderOpen, FolderPlus, Edit3, Trash2, 
  ChevronRight, ChevronDown, Image, Calendar,
  Users, MapPin, Heart, Star
} from 'lucide-react';

const FolderManager = ({ folders, onFoldersChange, photos, theme, onPhotoMove }) => {
  const [expandedFolders, setExpandedFolders] = useState(new Set(['root']));
  const [editingFolder, setEditingFolder] = useState(null);
  const [newFolderName, setNewFolderName] = useState('');
  const [newFolderIcon, setNewFolderIcon] = useState('Folder');
  const [newFolderColor, setNewFolderColor] = useState('blue');
  const [creatingSubfolder, setCreatingSubfolder] = useState(null);
  const [activeDropFolder, setActiveDropFolder] = useState(null);

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

  const defaultFolders = [
    {
      id: 'root',
      name: 'Galeria Rodzinna',
      icon: 'Folder',
      color: 'blue',
      parentId: null,
      isDefault: true,
      children: [
        {
          id: 'family',
          name: 'Rodzina',
          icon: 'Users',
          color: 'blue',
          parentId: 'root',
          children: [
            { id: 'family-portraits', name: 'Portrety', icon: 'Users', color: 'blue', parentId: 'family' },
            { id: 'family-gatherings', name: 'Spotkania rodzinne', icon: 'Heart', color: 'pink', parentId: 'family' }
          ]
        },
        {
          id: 'events',
          name: 'Wydarzenia',
          icon: 'Calendar',
          color: 'green',
          parentId: 'root',
          children: [
            { id: 'birthdays', name: 'Urodziny', icon: 'Star', color: 'yellow', parentId: 'events' },
            { id: 'celebrations', name: 'Święta', icon: 'Heart', color: 'red', parentId: 'events' },
            { id: 'weddings', name: 'Śluby', icon: 'Heart', color: 'pink', parentId: 'events' }
          ]
        },
        {
          id: 'travels',
          name: 'Podróże',
          icon: 'MapPin',
          color: 'purple',
          parentId: 'root',
          children: [
            { id: 'domestic', name: 'Krajowe', icon: 'MapPin', color: 'green', parentId: 'travels' },
            { id: 'abroad', name: 'Zagraniczne', icon: 'MapPin', color: 'purple', parentId: 'travels' }
          ]
        },
        {
          id: 'yearly',
          name: 'Według lat',
          icon: 'Calendar',
          color: 'indigo',
          parentId: 'root',
          children: []
        }
      ]
    }
  ];

  // Initialize folders if empty
  React.useEffect(() => {
    if (!folders || folders.length === 0) {
      onFoldersChange(defaultFolders);
    }
  }, [folders, onFoldersChange]);

  const toggleFolder = (folderId) => {
    const newExpanded = new Set(expandedFolders);
    if (newExpanded.has(folderId)) {
      newExpanded.delete(folderId);
    } else {
      newExpanded.add(folderId);
    }
    setExpandedFolders(newExpanded);
  };

  const getPhotoCount = (folderId) => {
    return photos.filter(photo => photo.folderId === folderId).length;
  };

  const createFolder = (parentId) => {
    if (newFolderName.trim()) {
      const newFolder = {
        id: `folder-${Date.now()}`,
        name: newFolderName.trim(),
        icon: newFolderIcon,
        color: newFolderColor,
        parentId: parentId,
        children: [],
        createdAt: new Date().toISOString()
      };

      const updateFoldersRecursively = (folderList) => {
        return folderList.map(folder => {
          if (folder.id === parentId) {
            return {
              ...folder,
              children: [...(folder.children || []), newFolder]
            };
          }
          if (folder.children) {
            return {
              ...folder,
              children: updateFoldersRecursively(folder.children)
            };
          }
          return folder;
        });
      };

      const updatedFolders = updateFoldersRecursively(folders);
      onFoldersChange(updatedFolders);
      
      setNewFolderName('');
      setNewFolderIcon('Folder');
      setNewFolderColor('blue');
      setCreatingSubfolder(null);
    }
  };

  const deleteFolder = (folderId) => {
    const deleteFolderRecursively = (folderList) => {
      return folderList.map(folder => ({
        ...folder,
        children: folder.children ? 
          deleteFolderRecursively(folder.children.filter(child => child.id !== folderId)) : 
          []
      })).filter(folder => folder.id !== folderId);
    };

    const updatedFolders = deleteFolderRecursively(folders);
    onFoldersChange(updatedFolders);
  };
  const renderFolder = (folder, level = 0) => {
    const isExpanded = expandedFolders.has(folder.id);
    const hasChildren = folder.children && folder.children.length > 0;
    const photoCount = getPhotoCount(folder.id);
    const IconComponent = folderIcons[folder.icon] || Folder;
    const isDropTarget = activeDropFolder === folder.id;

    return (
      <div key={folder.id} className="w-full">
        {/* Folder Item */}
        <motion.div          className={`flex items-center gap-2 p-2 rounded-lg cursor-pointer group transition-all ${
            isDropTarget 
              ? 'bg-blue-100 dark:bg-blue-900 border-2 border-blue-500 scale-105 shadow-lg' 
              : `hover:bg-gray-100 dark:hover:bg-gray-700 ${theme === 'dark' ? 'text-gray-200' : 'text-gray-700'}`
          }`}
          style={{ marginLeft: `${level * 20}px` }}
          onClick={() => toggleFolder(folder.id)}          onDragOver={(e) => {
            e.preventDefault();
            e.stopPropagation();
            setActiveDropFolder(folder.id);
          }}
          onDragEnter={(e) => {
            e.preventDefault();
            e.stopPropagation();
            setActiveDropFolder(folder.id);
            
            // Jeśli folder ma dzieci, rozwiń go po krótkim opóźnieniu podczas przeciągania
            if (hasChildren && !isExpanded) {
              const timer = setTimeout(() => {
                toggleFolder(folder.id);
              }, 800); // Opóźnienie 800ms
              
              // Zapisz timer w elemencie DOM, aby móc go anulować
              e.currentTarget.dragExpandTimer = timer;
            }
          }}          onDragLeave={(e) => {
            e.preventDefault();
            e.stopPropagation();
            
            // Anuluj timer autorozwinięcia folderu
            if (e.currentTarget.dragExpandTimer) {
              clearTimeout(e.currentTarget.dragExpandTimer);
              e.currentTarget.dragExpandTimer = null;
            }
            
            if (activeDropFolder === folder.id) {
              setActiveDropFolder(null);
            }
          }}          onDrop={(e) => {
            e.preventDefault();
            e.stopPropagation();
            
            // Anuluj timer autorozwinięcia folderu
            if (e.currentTarget.dragExpandTimer) {
              clearTimeout(e.currentTarget.dragExpandTimer);
              e.currentTarget.dragExpandTimer = null;
            }
            
            try {
              const data = JSON.parse(e.dataTransfer.getData('application/json'));
              
              // Wizualna informacja zwrotna o udanym upuszczeniu
              const folderEl = e.currentTarget;
              folderEl.classList.add('bg-green-100', 'dark:bg-green-900');
              folderEl.style.transform = 'scale(1.05)';
              
              setTimeout(() => {
                folderEl.classList.remove('bg-green-100', 'dark:bg-green-900');
                folderEl.style.transform = '';
              }, 300);
              
              if (data.type === 'photo') {
                // Pojedyncze zdjęcie
                onPhotoMove(data.photoId, folder.id);
                // Expand the folder when dropping a photo
                if (!isExpanded && hasChildren) {
                  toggleFolder(folder.id);
                }
              } else if (data.type === 'multi-photo' && data.photoIds) {
                // Wiele zdjęć
                onPhotoMove(data.photoIds, folder.id, true);
                // Expand the folder when dropping photos
                if (!isExpanded && hasChildren) {
                  toggleFolder(folder.id);
                }
              }
            } catch (err) {
              console.error('Error processing dragged data:', err);
            }
            
            setActiveDropFolder(null);
          }}
        >
          {/* Expand/Collapse Button */}
          <div className="w-4 h-4 flex items-center justify-center">
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
          <span className="flex-1 font-medium">{folder.name}</span>

          {/* Photo Count */}
          <span className="text-xs text-gray-500 dark:text-gray-400 bg-gray-200 dark:bg-gray-600 px-2 py-1 rounded">
            {photoCount}
          </span>

          {/* Actions */}
          {!folder.isDefault && (
            <div className="opacity-0 group-hover:opacity-100 transition-opacity flex gap-1">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setCreatingSubfolder(folder.id);
                }}
                className="p-1 hover:bg-gray-200 dark:hover:bg-gray-600 rounded"
                title="Dodaj podfolder"
              >
                <FolderPlus className="w-3 h-3" />
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setEditingFolder(folder);
                  setNewFolderName(folder.name);
                }}
                className="p-1 hover:bg-gray-200 dark:hover:bg-gray-600 rounded"
                title="Edytuj"
              >
                <Edit3 className="w-3 h-3" />
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  if (window.confirm(`Czy na pewno chcesz usunąć folder "${folder.name}"?`)) {
                    deleteFolder(folder.id);
                  }
                }}
                className="p-1 hover:bg-red-200 dark:hover:bg-red-600 rounded text-red-500"
                title="Usuń"
              >
                <Trash2 className="w-3 h-3" />
              </button>
            </div>
          )}
        </motion.div>

        {/* Create Subfolder Form */}
        {creatingSubfolder === folder.id && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="ml-6 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg mt-2"
          >
            <div className="space-y-3">
              <input
                type="text"
                value={newFolderName}
                onChange={(e) => setNewFolderName(e.target.value)}
                placeholder="Nazwa folderu"
                className="w-full px-3 py-2 rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                onKeyPress={(e) => e.key === 'Enter' && createFolder(folder.id)}
                autoFocus
              />
              
              <div className="flex gap-2">
                {/* Icon Selection */}
                <select
                  value={newFolderIcon}
                  onChange={(e) => setNewFolderIcon(e.target.value)}
                  className="px-2 py-1 rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 text-sm"
                >
                  {Object.keys(folderIcons).map(icon => (
                    <option key={icon} value={icon}>{icon}</option>
                  ))}
                </select>

                {/* Color Selection */}
                <select
                  value={newFolderColor}
                  onChange={(e) => setNewFolderColor(e.target.value)}
                  className="px-2 py-1 rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 text-sm"
                >
                  {Object.keys(folderColors).map(color => (
                    <option key={color} value={color}>{color}</option>
                  ))}
                </select>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => createFolder(folder.id)}
                  className="px-3 py-1 bg-blue-500 text-white rounded text-sm hover:bg-blue-600 transition-colors"
                >
                  Utwórz
                </button>
                <button
                  onClick={() => {
                    setCreatingSubfolder(null);
                    setNewFolderName('');
                  }}
                  className="px-3 py-1 bg-gray-300 dark:bg-gray-600 text-gray-700 dark:text-gray-300 rounded text-sm hover:bg-gray-400 dark:hover:bg-gray-500 transition-colors"
                >
                  Anuluj
                </button>
              </div>
            </div>
          </motion.div>
        )}

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

  return (
    <div className={`h-full ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} rounded-lg p-4`}>
      <div className="flex items-center justify-between mb-4">
        <h3 className={`font-semibold ${theme === 'dark' ? 'text-gray-200' : 'text-gray-800'}`}>
          Katalogi
        </h3>
        <button
          onClick={() => setCreatingSubfolder('root')}
          className="p-1.5 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
          title="Dodaj nowy folder"
        >
          <FolderPlus className="w-4 h-4" />
        </button>
      </div>

      <div className="space-y-1 max-h-96 overflow-y-auto">
        {folders && folders.map(folder => renderFolder(folder))}
      </div>
    </div>
  );
};

export default FolderManager;
