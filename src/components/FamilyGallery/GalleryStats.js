import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, BarChart3, TrendingUp, Calendar, Users, Tag, 
  Image, Folder, Award, Star, Clock, MapPin
} from 'lucide-react';

const GalleryStats = ({ isOpen, onClose, photos, albums, folders, theme }) => {
  const [activeTab, setActiveTab] = useState('overview');

  const stats = useMemo(() => {
    const currentYear = new Date().getFullYear();
    const currentMonth = new Date().getMonth();

    // Basic counts
    const totalPhotos = photos.length;
    const totalAlbums = albums.length;
    const totalFolders = folders.length;

    // Date analysis
    const photosByYear = photos.reduce((acc, photo) => {
      const year = new Date(photo.date || photo.createdAt).getFullYear();
      acc[year] = (acc[year] || 0) + 1;
      return acc;
    }, {});

    const photosByMonth = photos.reduce((acc, photo) => {
      const date = new Date(photo.date || photo.createdAt);
      const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      acc[monthKey] = (acc[monthKey] || 0) + 1;
      return acc;
    }, {});

    // Most active year and month
    const mostActiveYear = Object.entries(photosByYear)
      .sort(([,a], [,b]) => b - a)[0];
    
    const mostActiveMonth = Object.entries(photosByMonth)
      .sort(([,a], [,b]) => b - a)[0];

    // People analysis
    const allPeople = photos.flatMap(photo => photo.people || []);
    const peopleCount = allPeople.reduce((acc, person) => {
      acc[person] = (acc[person] || 0) + 1;
      return acc;
    }, {});
    const mostPhotographedPerson = Object.entries(peopleCount)
      .sort(([,a], [,b]) => b - a)[0];

    // Tags analysis
    const allTags = photos.flatMap(photo => photo.tags || []);
    const tagCount = allTags.reduce((acc, tag) => {
      acc[tag] = (acc[tag] || 0) + 1;
      return acc;
    }, {});
    const popularTags = Object.entries(tagCount)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 10);

    // Album analysis
    const photosByAlbum = photos.reduce((acc, photo) => {
      const albumName = albums.find(a => a.id === photo.albumId)?.name || 'Nieznany';
      acc[albumName] = (acc[albumName] || 0) + 1;
      return acc;
    }, {});

    // Folder analysis
    const photosByFolder = photos.reduce((acc, photo) => {
      const folderName = folders.find(f => f.id === photo.folderId)?.name || 'Root';
      acc[folderName] = (acc[folderName] || 0) + 1;
      return acc;
    }, {});

    // Recent activity
    const lastMonth = new Date();
    lastMonth.setMonth(lastMonth.getMonth() - 1);
    const recentPhotos = photos.filter(photo => 
      new Date(photo.createdAt) > lastMonth
    ).length;

    // Storage estimation (mock)
    const estimatedSize = photos.length * 2.5; // MB

    return {
      totalPhotos,
      totalAlbums,
      totalFolders,
      photosByYear,
      photosByMonth,
      mostActiveYear,
      mostActiveMonth,
      peopleCount,
      mostPhotographedPerson,
      popularTags,
      photosByAlbum,
      photosByFolder,
      recentPhotos,
      estimatedSize
    };
  }, [photos, albums, folders]);

  if (!isOpen) return null;

  const StatCard = ({ icon: Icon, title, value, subtitle, trend }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`p-4 rounded-lg border ${
        theme === 'dark' 
          ? 'bg-gray-800 border-gray-700' 
          : 'bg-white border-gray-200'
      }`}
    >
      <div className="flex items-center justify-between mb-2">
        <Icon className="w-5 h-5 text-blue-500" />
        {trend && (
          <span className={`text-xs px-2 py-1 rounded-full ${
            trend > 0 
              ? 'bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400'
              : 'bg-red-100 text-red-700 dark:bg-red-900/20 dark:text-red-400'
          }`}>
            {trend > 0 ? '+' : ''}{trend}%
          </span>
        )}
      </div>
      <div className={`text-2xl font-bold ${theme === 'dark' ? 'text-gray-100' : 'text-gray-900'}`}>
        {value}
      </div>
      <div className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
        {title}
      </div>
      {subtitle && (
        <div className={`text-xs mt-1 ${theme === 'dark' ? 'text-gray-500' : 'text-gray-500'}`}>
          {subtitle}
        </div>
      )}
    </motion.div>
  );

  const ChartBar = ({ label, value, maxValue, color = 'blue' }) => {
    const percentage = (value / maxValue) * 100;
    
    return (
      <div className="flex items-center space-x-3 mb-2">
        <div className={`w-20 text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
          {label}
        </div>
        <div className="flex-1 h-6 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${percentage}%` }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className={`h-full bg-${color}-500 rounded-full`}
          />
        </div>
        <div className={`w-8 text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
          {value}
        </div>
      </div>
    );
  };

  return (
    <motion.div
      className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className={`${theme === 'dark' ? 'bg-gray-900' : 'bg-white'} rounded-xl shadow-xl max-w-4xl w-full max-h-[90vh] overflow-hidden`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className={`flex items-center justify-between p-6 border-b ${theme === 'dark' ? 'border-gray-700' : 'border-gray-200'}`}>
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-blue-500 rounded-lg flex items-center justify-center">
              <BarChart3 className="w-4 h-4 text-white" />
            </div>
            <div>
              <h2 className={`text-xl font-semibold ${theme === 'dark' ? 'text-gray-100' : 'text-gray-900'}`}>
                Statystyki galerii
              </h2>
              <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                Analiza Twojej kolekcji zdjęć
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className={`p-2 rounded-lg transition-colors ${
              theme === 'dark' ? 'hover:bg-gray-700' : 'hover:bg-gray-100'
            }`}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tabs */}
        <div className={`flex border-b ${theme === 'dark' ? 'border-gray-700' : 'border-gray-200'}`}>
          {[
            { id: 'overview', label: 'Przegląd', icon: BarChart3 },
            { id: 'timeline', label: 'Chronologia', icon: Calendar },
            { id: 'people', label: 'Osoby', icon: Users },
            { id: 'content', label: 'Zawartość', icon: Tag }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center space-x-2 px-4 py-3 border-b-2 transition-colors ${
                activeTab === tab.id
                  ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                  : 'border-transparent text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
              }`}
            >
              <tab.icon className="w-4 h-4" />
              <span className="text-sm font-medium">{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-96">
          {activeTab === 'overview' && (
            <div className="space-y-6">
              {/* Main Stats */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <StatCard
                  icon={Image}
                  title="Łączna liczba zdjęć"
                  value={stats.totalPhotos}
                  subtitle={`~${stats.estimatedSize.toFixed(1)} MB`}
                />
                <StatCard
                  icon={Folder}
                  title="Albumy"
                  value={stats.totalAlbums}
                />
                <StatCard
                  icon={Users}
                  title="Unikalnych osób"
                  value={Object.keys(stats.peopleCount).length}
                />
                <StatCard
                  icon={TrendingUp}
                  title="W tym miesiącu"
                  value={stats.recentPhotos}
                  trend={stats.recentPhotos > 0 ? 15 : 0}
                />
              </div>

              {/* Quick Insights */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className={`text-lg font-medium mb-4 ${theme === 'dark' ? 'text-gray-200' : 'text-gray-800'}`}>
                    Najaktywniejszy rok
                  </h3>
                  {stats.mostActiveYear && (
                    <div className={`p-4 rounded-lg ${theme === 'dark' ? 'bg-gray-800' : 'bg-blue-50'}`}>
                      <div className="flex items-center justify-between">
                        <span className="text-2xl font-bold text-blue-600">
                          {stats.mostActiveYear[0]}
                        </span>
                        <span className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                          {stats.mostActiveYear[1]} zdjęć
                        </span>
                      </div>
                    </div>
                  )}
                </div>

                <div>
                  <h3 className={`text-lg font-medium mb-4 ${theme === 'dark' ? 'text-gray-200' : 'text-gray-800'}`}>
                    Najczęściej fotografowana osoba
                  </h3>
                  {stats.mostPhotographedPerson && (
                    <div className={`p-4 rounded-lg ${theme === 'dark' ? 'bg-gray-800' : 'bg-green-50'}`}>
                      <div className="flex items-center justify-between">
                        <span className="font-semibold text-green-600">
                          {stats.mostPhotographedPerson[0]}
                        </span>
                        <span className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                          {stats.mostPhotographedPerson[1]} zdjęć
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'timeline' && (
            <div className="space-y-6">
              <div>
                <h3 className={`text-lg font-medium mb-4 ${theme === 'dark' ? 'text-gray-200' : 'text-gray-800'}`}>
                  Zdjęcia według lat
                </h3>
                <div className="space-y-2">
                  {Object.entries(stats.photosByYear)
                    .sort(([a], [b]) => b.localeCompare(a))
                    .slice(0, 10)
                    .map(([year, count]) => (
                      <ChartBar
                        key={year}
                        label={year}
                        value={count}
                        maxValue={Math.max(...Object.values(stats.photosByYear))}
                        color="blue"
                      />
                    ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'people' && (
            <div className="space-y-6">
              <div>
                <h3 className={`text-lg font-medium mb-4 ${theme === 'dark' ? 'text-gray-200' : 'text-gray-800'}`}>
                  Najczęściej fotografowane osoby
                </h3>
                <div className="space-y-2">
                  {Object.entries(stats.peopleCount)
                    .sort(([,a], [,b]) => b - a)
                    .slice(0, 10)
                    .map(([person, count]) => (
                      <ChartBar
                        key={person}
                        label={person}
                        value={count}
                        maxValue={Math.max(...Object.values(stats.peopleCount))}
                        color="green"
                      />
                    ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'content' && (
            <div className="space-y-6">
              <div>
                <h3 className={`text-lg font-medium mb-4 ${theme === 'dark' ? 'text-gray-200' : 'text-gray-800'}`}>
                  Popularne tagi
                </h3>
                <div className="space-y-2">
                  {stats.popularTags.map(([tag, count]) => (
                    <ChartBar
                      key={tag}
                      label={`#${tag}`}
                      value={count}
                      maxValue={stats.popularTags[0]?.[1] || 1}
                      color="purple"
                    />
                  ))}
                </div>
              </div>

              <div>
                <h3 className={`text-lg font-medium mb-4 ${theme === 'dark' ? 'text-gray-200' : 'text-gray-800'}`}>
                  Zdjęcia według albumów
                </h3>
                <div className="space-y-2">
                  {Object.entries(stats.photosByAlbum)
                    .sort(([,a], [,b]) => b - a)
                    .slice(0, 8)
                    .map(([album, count]) => (
                      <ChartBar
                        key={album}
                        label={album}
                        value={count}
                        maxValue={Math.max(...Object.values(stats.photosByAlbum))}
                        color="indigo"
                      />
                    ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
};

export default GalleryStats;
