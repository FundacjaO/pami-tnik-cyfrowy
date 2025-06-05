import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, Filter, SortAsc, SortDesc, Calendar, 
  Users, Tag, Grid, List, Image, Download,
  CheckSquare, Square, X, Trash2, FolderOpen,
  BarChart3, Share2, Play
} from 'lucide-react';

const GalleryToolbar = ({ 
  photos, 
  selectedPhotos, 
  onPhotosSelect,
  searchTerm, 
  onSearchChange,
  sortBy,
  onSortChange,
  viewMode,
  onViewModeChange,
  filters,
  onFiltersChange,
  onBulkAction,
  folders,
  selectedFolder,
  onFolderChange,
  onShowStats,
  onShowExport,
  onShowSlideshow,
  theme
}) => {
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  const [showBulkActions, setShowBulkActions] = useState(false);

  const sortOptions = [
    { value: 'date-desc', label: 'Najnowsze', icon: SortDesc },
    { value: 'date-asc', label: 'Najstarsze', icon: SortAsc },
    { value: 'title-asc', label: 'Nazwa A-Z', icon: SortAsc },
    { value: 'title-desc', label: 'Nazwa Z-A', icon: SortDesc },
    { value: 'size-desc', label: 'Największe', icon: SortDesc },
    { value: 'size-asc', label: 'Najmniejsze', icon: SortAsc }
  ];

  const getAllTags = () => {
    const allTags = new Set();
    photos.forEach(photo => {
      if (photo.tags) {
        photo.tags.forEach(tag => allTags.add(tag));
      }
    });
    return Array.from(allTags).sort();
  };

  const getAllPeople = () => {
    const allPeople = new Set();
    photos.forEach(photo => {
      if (photo.people) {
        photo.people.forEach(person => allPeople.add(person));
      }
    });
    return Array.from(allPeople).sort();
  };

  const getYearRange = () => {
    const years = photos
      .filter(photo => photo.date)
      .map(photo => new Date(photo.date).getFullYear())
      .filter(year => !isNaN(year));
    
    if (years.length === 0) return { min: new Date().getFullYear(), max: new Date().getFullYear() };
    return { min: Math.min(...years), max: Math.max(...years) };
  };

  const isAllSelected = selectedPhotos.length === photos.length && photos.length > 0;
  const isSomeSelected = selectedPhotos.length > 0 && selectedPhotos.length < photos.length;

  const handleSelectAll = () => {
    if (isAllSelected) {
      onPhotosSelect([]);
    } else {
      onPhotosSelect(photos.map(photo => photo.id));
    }
  };

  const renderFolderBreadcrumb = () => {
    if (!selectedFolder || selectedFolder === 'all') return null;

    // Find folder path
    const findFolderPath = (folders, targetId, path = []) => {
      for (const folder of folders) {
        if (folder.id === targetId) {
          return [...path, folder];
        }
        if (folder.children) {
          const childPath = findFolderPath(folder.children, targetId, [...path, folder]);
          if (childPath) return childPath;
        }
      }
      return null;
    };

    const folderPath = findFolderPath(folders, selectedFolder);
    if (!folderPath) return null;

    return (
      <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
        <FolderOpen className="w-4 h-4" />
        {folderPath.map((folder, index) => (
          <React.Fragment key={folder.id}>
            {index > 0 && <span>/</span>}
            <button
              onClick={() => onFolderChange(folder.id)}
              className="hover:text-blue-500 transition-colors"
            >
              {folder.name}
            </button>
          </React.Fragment>
        ))}
      </div>
    );
  };

  return (
    <div className={`${theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} border-b p-4 space-y-4`}>
      {/* Main Toolbar */}
      <div className="flex items-center justify-between gap-4">
        {/* Left Side - Search and Filters */}
        <div className="flex items-center gap-3 flex-1">
          {/* Search */}
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Szukaj zdjęć, tagów, osób..."
              className={`w-full pl-10 pr-4 py-2 rounded-lg border ${
                theme === 'dark' 
                  ? 'bg-gray-700 border-gray-600 text-gray-200 placeholder-gray-400' 
                  : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
              } focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors`}
            />
          </div>

          {/* Advanced Filters Toggle */}
          <button
            onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
            className={`p-2 rounded-lg border transition-colors ${
              showAdvancedFilters || Object.keys(filters).some(key => filters[key] && (Array.isArray(filters[key]) ? filters[key].length > 0 : true))
                ? 'bg-blue-500 text-white border-blue-500'
                : theme === 'dark'
                  ? 'bg-gray-700 border-gray-600 text-gray-300 hover:bg-gray-600'
                  : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
            }`}
            title="Filtry zaawansowane"
          >
            <Filter className="w-4 h-4" />
          </button>

          {/* Sort */}
          <select
            value={sortBy}
            onChange={(e) => onSortChange(e.target.value)}
            className={`px-3 py-2 rounded-lg border ${
              theme === 'dark' 
                ? 'bg-gray-700 border-gray-600 text-gray-200' 
                : 'bg-white border-gray-300 text-gray-900'
            } focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
          >
            {sortOptions.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        {/* Right Side - View Options and Bulk Actions */}
        <div className="flex items-center gap-3">
          {/* Bulk Selection */}
          {photos.length > 0 && (
            <div className="flex items-center gap-2">
              <button
                onClick={handleSelectAll}
                className={`p-2 rounded transition-colors ${
                  theme === 'dark' ? 'hover:bg-gray-700' : 'hover:bg-gray-100'
                }`}
                title={isAllSelected ? "Odznacz wszystkie" : "Zaznacz wszystkie"}
              >
                {isAllSelected ? (
                  <CheckSquare className="w-4 h-4 text-blue-500" />
                ) : isSomeSelected ? (
                  <div className="w-4 h-4 bg-blue-500 rounded border-2 border-blue-500 relative">
                    <div className="absolute inset-1 bg-white dark:bg-gray-800"></div>
                  </div>
                ) : (
                  <Square className="w-4 h-4 text-gray-400" />
                )}
              </button>
              
              {selectedPhotos.length > 0 && (
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  {selectedPhotos.length} zaznaczonych
                </span>
              )}
            </div>
          )}

          {/* Bulk Actions */}
          {selectedPhotos.length > 0 && (
            <button
              onClick={() => setShowBulkActions(!showBulkActions)}
              className="px-3 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors text-sm"
            >
              Akcje ({selectedPhotos.length})
            </button>
          )}

          {/* Quick Actions */}
          <div className="flex items-center gap-2">
            {photos.length > 0 && (
              <>
                <button
                  onClick={onShowSlideshow}
                  className={`p-2 rounded-lg transition-colors ${
                    theme === 'dark'
                      ? 'bg-gray-700 border-gray-600 text-gray-300 hover:bg-gray-600'
                      : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
                  } border`}
                  title="Slideshow"
                >
                  <Play className="w-4 h-4" />
                </button>

                <button
                  onClick={onShowStats}
                  className={`p-2 rounded-lg transition-colors ${
                    theme === 'dark'
                      ? 'bg-gray-700 border-gray-600 text-gray-300 hover:bg-gray-600'
                      : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
                  } border`}
                  title="Statystyki"
                >
                  <BarChart3 className="w-4 h-4" />
                </button>

                <button
                  onClick={onShowExport}
                  className={`p-2 rounded-lg transition-colors ${
                    theme === 'dark'
                      ? 'bg-gray-700 border-gray-600 text-gray-300 hover:bg-gray-600'
                      : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
                  } border`}
                  title="Eksport i udostępnianie"
                >
                  <Share2 className="w-4 h-4" />
                </button>
              </>
            )}
          </div>

          {/* View Mode Toggle */}
          <div className="flex border rounded-lg overflow-hidden">
            <button
              onClick={() => onViewModeChange('grid')}
              className={`p-2 transition-colors ${
                viewMode === 'grid'
                  ? 'bg-blue-500 text-white'
                  : theme === 'dark'
                    ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                    : 'bg-white text-gray-700 hover:bg-gray-50'
              }`}
              title="Widok siatki"
            >
              <Grid className="w-4 h-4" />
            </button>
            <button
              onClick={() => onViewModeChange('list')}
              className={`p-2 transition-colors ${
                viewMode === 'list'
                  ? 'bg-blue-500 text-white'
                  : theme === 'dark'
                    ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                    : 'bg-white text-gray-700 hover:bg-gray-50'
              }`}
              title="Widok listy"
            >
              <List className="w-4 h-4" />
            </button>
          </div>

          {/* Photo Count */}
          <div className="text-sm text-gray-600 dark:text-gray-400">
            {photos.length} {photos.length === 1 ? 'zdjęcie' : photos.length < 5 ? 'zdjęcia' : 'zdjęć'}
          </div>
        </div>
      </div>

      {/* Folder Breadcrumb */}
      {renderFolderBreadcrumb()}

      {/* Advanced Filters */}
      <AnimatePresence>
        {showAdvancedFilters && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className={`border-t pt-4 space-y-4 ${theme === 'dark' ? 'border-gray-700' : 'border-gray-200'}`}
          >
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Date Range */}
              <div>
                <label className={`block text-sm font-medium mb-2 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                  <Calendar className="w-4 h-4 inline mr-1" />
                  Zakres dat
                </label>
                <div className="flex gap-2">
                  <input
                    type="date"
                    value={filters.dateFrom || ''}
                    onChange={(e) => onFiltersChange({ ...filters, dateFrom: e.target.value })}
                    className={`flex-1 px-3 py-2 rounded border ${
                      theme === 'dark' 
                        ? 'bg-gray-700 border-gray-600 text-gray-200' 
                        : 'bg-white border-gray-300 text-gray-900'
                    } text-sm`}
                  />
                  <input
                    type="date"
                    value={filters.dateTo || ''}
                    onChange={(e) => onFiltersChange({ ...filters, dateTo: e.target.value })}
                    className={`flex-1 px-3 py-2 rounded border ${
                      theme === 'dark' 
                        ? 'bg-gray-700 border-gray-600 text-gray-200' 
                        : 'bg-white border-gray-300 text-gray-900'
                    } text-sm`}
                  />
                </div>
              </div>

              {/* Tags Filter */}
              <div>
                <label className={`block text-sm font-medium mb-2 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                  <Tag className="w-4 h-4 inline mr-1" />
                  Tagi
                </label>
                <select
                  multiple
                  value={filters.tags || []}
                  onChange={(e) => {
                    const selectedTags = Array.from(e.target.selectedOptions, option => option.value);
                    onFiltersChange({ ...filters, tags: selectedTags });
                  }}
                  className={`w-full px-3 py-2 rounded border ${
                    theme === 'dark' 
                      ? 'bg-gray-700 border-gray-600 text-gray-200' 
                      : 'bg-white border-gray-300 text-gray-900'
                  } text-sm max-h-24`}
                >
                  {getAllTags().map(tag => (
                    <option key={tag} value={tag}>{tag}</option>
                  ))}
                </select>
              </div>

              {/* People Filter */}
              <div>
                <label className={`block text-sm font-medium mb-2 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                  <Users className="w-4 h-4 inline mr-1" />
                  Osoby
                </label>
                <select
                  multiple
                  value={filters.people || []}
                  onChange={(e) => {
                    const selectedPeople = Array.from(e.target.selectedOptions, option => option.value);
                    onFiltersChange({ ...filters, people: selectedPeople });
                  }}
                  className={`w-full px-3 py-2 rounded border ${
                    theme === 'dark' 
                      ? 'bg-gray-700 border-gray-600 text-gray-200' 
                      : 'bg-white border-gray-300 text-gray-900'
                  } text-sm max-h-24`}
                >
                  {getAllPeople().map(person => (
                    <option key={person} value={person}>{person}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Clear Filters */}
            {Object.keys(filters).some(key => filters[key] && (Array.isArray(filters[key]) ? filters[key].length > 0 : true)) && (
              <div className="flex justify-end">
                <button
                  onClick={() => onFiltersChange({})}
                  className="px-3 py-1 text-sm text-gray-600 dark:text-gray-400 hover:text-red-500 transition-colors flex items-center gap-1"
                >
                  <X className="w-3 h-3" />
                  Wyczyść filtry
                </button>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Bulk Actions Panel */}
      <AnimatePresence>
        {showBulkActions && selectedPhotos.length > 0 && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className={`border-t pt-4 ${theme === 'dark' ? 'border-gray-700' : 'border-gray-200'}`}
          >
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => onBulkAction('download')}
                className="px-3 py-2 bg-green-500 text-white rounded text-sm hover:bg-green-600 transition-colors flex items-center gap-1"
              >
                <Download className="w-4 h-4" />
                Pobierz zaznaczone
              </button>
              
              <button
                onClick={() => onBulkAction('move')}
                className="px-3 py-2 bg-blue-500 text-white rounded text-sm hover:bg-blue-600 transition-colors flex items-center gap-1"
              >
                <FolderOpen className="w-4 h-4" />
                Przenieś do folderu
              </button>
              
              <button
                onClick={() => onBulkAction('delete')}
                className="px-3 py-2 bg-red-500 text-white rounded text-sm hover:bg-red-600 transition-colors flex items-center gap-1"
              >
                <Trash2 className="w-4 h-4" />
                Usuń zaznaczone
              </button>

              <button
                onClick={() => {
                  setShowBulkActions(false);
                  onPhotosSelect([]);
                }}
                className="px-3 py-2 bg-gray-500 text-white rounded text-sm hover:bg-gray-600 transition-colors flex items-center gap-1"
              >
                <X className="w-4 h-4" />
                Anuluj
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default GalleryToolbar;
