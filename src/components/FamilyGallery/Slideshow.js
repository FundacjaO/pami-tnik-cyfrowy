import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, ChevronLeft, ChevronRight, Play, Pause, RotateCcw, 
  Settings, Download, Share2, Heart, Info, Volume2, VolumeX 
} from 'lucide-react';

const Slideshow = ({ photos, isOpen, onClose, currentIndex = 0, theme }) => {
  const [activeIndex, setActiveIndex] = useState(currentIndex);
  const [isPlaying, setIsPlaying] = useState(false);
  const [interval, setInterval] = useState(3000);
  const [showControls, setShowControls] = useState(true);
  const [showInfo, setShowInfo] = useState(false);
  const [transition, setTransition] = useState('fade'); // fade, slide, zoom
  const [hasSound, setHasSound] = useState(false);
  
  // Auto-play functionality
  useEffect(() => {
    if (!isPlaying || photos.length <= 1) return;
    
    const timer = setTimeout(() => {
      setActiveIndex(prev => (prev + 1) % photos.length);
    }, interval);
    
    return () => clearTimeout(timer);
  }, [isPlaying, activeIndex, interval, photos.length]);

  // Keyboard controls
  useEffect(() => {
    const handleKeyPress = (e) => {
      switch(e.key) {
        case 'ArrowRight':
          nextPhoto();
          break;
        case 'ArrowLeft':
          prevPhoto();
          break;
        case ' ':
          e.preventDefault();
          togglePlay();
          break;
        case 'Escape':
          onClose();
          break;
        case 'i':
          setShowInfo(!showInfo);
          break;
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleKeyPress);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleKeyPress);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, showInfo]);

  const nextPhoto = useCallback(() => {
    setActiveIndex(prev => (prev + 1) % photos.length);
  }, [photos.length]);

  const prevPhoto = useCallback(() => {
    setActiveIndex(prev => (prev - 1 + photos.length) % photos.length);
  }, [photos.length]);

  const togglePlay = () => {
    setIsPlaying(!isPlaying);
  };

  const goToPhoto = (index) => {
    setActiveIndex(index);
  };

  // Auto-hide controls
  useEffect(() => {
    if (!showControls) return;
    
    const timer = setTimeout(() => {
      setShowControls(false);
    }, 3000);
    
    return () => clearTimeout(timer);
  }, [showControls, activeIndex]);

  const currentPhoto = photos[activeIndex];

  if (!isOpen || !currentPhoto) return null;

  const transitionVariants = {
    fade: {
      initial: { opacity: 0 },
      animate: { opacity: 1 },
      exit: { opacity: 0 }
    },
    slide: {
      initial: { x: 300, opacity: 0 },
      animate: { x: 0, opacity: 1 },
      exit: { x: -300, opacity: 0 }
    },
    zoom: {
      initial: { scale: 0.8, opacity: 0 },
      animate: { scale: 1, opacity: 1 },
      exit: { scale: 1.2, opacity: 0 }
    }
  };

  return (
    <motion.div
      className="fixed inset-0 bg-black z-50 flex items-center justify-center"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onMouseMove={() => setShowControls(true)}
    >
      {/* Background overlay */}
      <div className="absolute inset-0 bg-black/90" onClick={onClose} />

      {/* Main photo container */}
      <div className="relative w-full h-full flex items-center justify-center">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeIndex}
            {...transitionVariants[transition]}
            transition={{ duration: 0.5 }}
            className="relative max-w-[90vw] max-h-[90vh] flex items-center justify-center"
          >
            <img
              src={currentPhoto.dataUrl}
              alt={currentPhoto.title}
              className="max-w-full max-h-full object-contain rounded-lg shadow-2xl"
              draggable={false}
            />
          </motion.div>
        </AnimatePresence>

        {/* Navigation arrows */}
        <AnimatePresence>
          {showControls && photos.length > 1 && (
            <>
              <motion.button
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                onClick={prevPhoto}
                className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-3 rounded-full transition-colors z-10"
              >
                <ChevronLeft className="w-6 h-6" />
              </motion.button>

              <motion.button
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                onClick={nextPhoto}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-3 rounded-full transition-colors z-10"
              >
                <ChevronRight className="w-6 h-6" />
              </motion.button>
            </>
          )}
        </AnimatePresence>
      </div>

      {/* Top controls */}
      <AnimatePresence>
        {showControls && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="absolute top-4 left-4 right-4 flex items-center justify-between z-10"
          >
            {/* Left side - Info */}
            <div className="flex items-center space-x-3">
              <span className="bg-black/50 text-white px-3 py-1 rounded-full text-sm">
                {activeIndex + 1} / {photos.length}
              </span>
              {currentPhoto.title && (
                <span className="bg-black/50 text-white px-3 py-1 rounded-full text-sm max-w-xs truncate">
                  {currentPhoto.title}
                </span>
              )}
            </div>

            {/* Right side - Actions */}
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setShowInfo(!showInfo)}
                className="bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition-colors"
                title="Informacje"
              >
                <Info className="w-5 h-5" />
              </button>
              
              <button
                onClick={() => {/* Add download logic */}}
                className="bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition-colors"
                title="Pobierz"
              >
                <Download className="w-5 h-5" />
              </button>
              
              <button
                onClick={onClose}
                className="bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition-colors"
                title="Zamknij"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Bottom controls */}
      <AnimatePresence>
        {showControls && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="absolute bottom-4 left-4 right-4 z-10"
          >
            {/* Playback controls */}
            {photos.length > 1 && (
              <div className="flex items-center justify-center space-x-3 mb-4">
                <button
                  onClick={togglePlay}
                  className="bg-black/50 hover:bg-black/70 text-white p-3 rounded-full transition-colors"
                  title={isPlaying ? 'Pauza' : 'Odtwórz'}
                >
                  {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
                </button>

                <select
                  value={interval}
                  onChange={(e) => setInterval(Number(e.target.value))}
                  className="bg-black/50 text-white px-3 py-2 rounded border-0 focus:ring-2 focus:ring-white/50"
                  title="Szybkość slideshow"
                >
                  <option value={1000}>1s</option>
                  <option value={2000}>2s</option>
                  <option value={3000}>3s</option>
                  <option value={5000}>5s</option>
                  <option value={10000}>10s</option>
                </select>

                <select
                  value={transition}
                  onChange={(e) => setTransition(e.target.value)}
                  className="bg-black/50 text-white px-3 py-2 rounded border-0 focus:ring-2 focus:ring-white/50"
                  title="Efekt przejścia"
                >
                  <option value="fade">Fade</option>
                  <option value="slide">Slide</option>
                  <option value="zoom">Zoom</option>
                </select>
              </div>
            )}

            {/* Photo thumbnails */}
            <div className="flex items-center justify-center space-x-2 overflow-x-auto pb-2">
              {photos.slice(Math.max(0, activeIndex - 5), activeIndex + 6).map((photo, idx) => {
                const globalIndex = Math.max(0, activeIndex - 5) + idx;
                return (
                  <button
                    key={photo.id}
                    onClick={() => goToPhoto(globalIndex)}
                    className={`flex-shrink-0 w-16 h-12 rounded overflow-hidden border-2 transition-all ${
                      globalIndex === activeIndex
                        ? 'border-white shadow-lg scale-110'
                        : 'border-transparent hover:border-white/50'
                    }`}
                  >
                    <img
                      src={photo.dataUrl}
                      alt=""
                      className="w-full h-full object-cover"
                    />
                  </button>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Photo info panel */}
      <AnimatePresence>
        {showInfo && currentPhoto && (
          <motion.div
            initial={{ opacity: 0, x: 300 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 300 }}
            className="absolute right-4 top-20 bottom-20 w-80 bg-black/80 backdrop-blur-sm text-white p-6 rounded-lg overflow-y-auto z-10"
          >
            <h3 className="text-lg font-semibold mb-3">{currentPhoto.title}</h3>
            
            {currentPhoto.description && (
              <div className="mb-4">
                <h4 className="text-sm text-gray-300 mb-1">Opis:</h4>
                <p className="text-sm">{currentPhoto.description}</p>
              </div>
            )}

            {currentPhoto.date && (
              <div className="mb-4">
                <h4 className="text-sm text-gray-300 mb-1">Data:</h4>
                <p className="text-sm">{new Date(currentPhoto.date).toLocaleDateString('pl-PL')}</p>
              </div>
            )}

            {currentPhoto.people && currentPhoto.people.length > 0 && (
              <div className="mb-4">
                <h4 className="text-sm text-gray-300 mb-1">Osoby:</h4>
                <div className="flex flex-wrap gap-1">
                  {currentPhoto.people.map((person, idx) => (
                    <span
                      key={idx}
                      className="bg-white/20 px-2 py-1 rounded-full text-xs"
                    >
                      {person}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {currentPhoto.tags && currentPhoto.tags.length > 0 && (
              <div className="mb-4">
                <h4 className="text-sm text-gray-300 mb-1">Tagi:</h4>
                <div className="flex flex-wrap gap-1">
                  {currentPhoto.tags.map((tag, idx) => (
                    <span
                      key={idx}
                      className="bg-blue-500/20 px-2 py-1 rounded-full text-xs"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>
            )}

            <div className="text-xs text-gray-400 mt-4 pt-4 border-t border-gray-600">
              <p>Skróty klawiszowe:</p>
              <p>← → - Nawigacja</p>
              <p>Spacja - Odtwórz/Pauza</p>
              <p>I - Informacje</p>
              <p>Esc - Zamknij</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default Slideshow;
