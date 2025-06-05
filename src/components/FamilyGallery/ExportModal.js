import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, Download, Share2, Mail, Link, Facebook, Copy, 
  FileText, Image, Archive, Settings, Check, Cloud,
  Printer, Smartphone, Monitor
} from 'lucide-react';

const ExportModal = ({ isOpen, onClose, photos, selectedPhotos = [], theme }) => {
  const [exportType, setExportType] = useState('download'); // download, share, print
  const [format, setFormat] = useState('zip'); // zip, pdf, json
  const [quality, setQuality] = useState('high'); // low, medium, high, original
  const [includeMetadata, setIncludeMetadata] = useState(true);
  const [isExporting, setIsExporting] = useState(false);
  const [shareLink, setShareLink] = useState('');
  const [copySuccess, setCopySuccess] = useState(false);

  const photosToExport = selectedPhotos.length > 0 ? selectedPhotos : photos;

  const handleDownload = async () => {
    setIsExporting(true);
    
    try {
      if (format === 'zip') {
        await downloadAsZip();
      } else if (format === 'pdf') {
        await downloadAsPDF();
      } else if (format === 'json') {
        await downloadAsJSON();
      }
    } catch (error) {
      console.error('Export error:', error);
    } finally {
      setIsExporting(false);
    }
  };

  const downloadAsZip = async () => {
    // This would typically use a library like JSZip
    // For now, we'll simulate the process
    console.log('Downloading as ZIP with', photosToExport.length, 'photos');
    
    // Simulate processing time
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // In a real implementation, you would:
    // 1. Create JSZip instance
    // 2. Add each photo to the zip
    // 3. Add metadata.json if includeMetadata is true
    // 4. Generate and download the zip file
    
    const blob = new Blob(['Simulated ZIP content'], { type: 'application/zip' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `galeria-rodzinna-${new Date().toISOString().split('T')[0]}.zip`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const downloadAsPDF = async () => {
    console.log('Generating PDF with', photosToExport.length, 'photos');
    
    // Simulate processing time
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    // In a real implementation, you would use jsPDF or similar library
    // to create a PDF with photos and metadata
    
    const blob = new Blob(['Simulated PDF content'], { type: 'application/pdf' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `galeria-rodzinna-${new Date().toISOString().split('T')[0]}.pdf`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const downloadAsJSON = async () => {
    const exportData = {
      exportDate: new Date().toISOString(),
      version: '1.0',
      totalPhotos: photosToExport.length,
      photos: photosToExport.map(photo => ({
        ...photo,
        // Remove dataUrl for smaller file size if not needed
        dataUrl: includeMetadata ? photo.dataUrl : undefined
      }))
    };

    const blob = new Blob([JSON.stringify(exportData, null, 2)], { 
      type: 'application/json' 
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `galeria-rodzinna-metadata-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const generateShareLink = () => {
    // In a real implementation, this would upload photos to a cloud service
    // and return a shareable link
    const mockLink = `https://galeria.example.com/share/${Date.now()}`;
    setShareLink(mockLink);
  };

  const copyToClipboard = async (text) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
    } catch (err) {
      console.error('Failed to copy to clipboard:', err);
    }
  };

  const qualityOptions = {
    low: { label: 'Niska (800px)', size: 'Mały rozmiar pliku' },
    medium: { label: 'Średnia (1200px)', size: 'Średni rozmiar pliku' },
    high: { label: 'Wysoka (1920px)', size: 'Duży rozmiar pliku' },
    original: { label: 'Oryginalna', size: 'Największy rozmiar pliku' }
  };

  if (!isOpen) return null;

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
        className={`${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className={`flex items-center justify-between p-6 border-b ${theme === 'dark' ? 'border-gray-700' : 'border-gray-200'}`}>
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gradient-to-r from-green-500 to-blue-500 rounded-lg flex items-center justify-center">
              <Download className="w-4 h-4 text-white" />
            </div>
            <div>
              <h2 className={`text-xl font-semibold ${theme === 'dark' ? 'text-gray-100' : 'text-gray-900'}`}>
                Eksport i udostępnianie
              </h2>
              <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                {photosToExport.length} {photosToExport.length === 1 ? 'zdjęcie' : 'zdjęć'} do eksportu
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

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Export Type Selection */}
          <div>
            <h3 className={`text-lg font-medium mb-3 ${theme === 'dark' ? 'text-gray-200' : 'text-gray-800'}`}>
              Wybierz opcję
            </h3>
            <div className="grid grid-cols-3 gap-3">
              <button
                onClick={() => setExportType('download')}
                className={`p-4 rounded-lg border-2 transition-all ${
                  exportType === 'download'
                    ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                    : theme === 'dark'
                      ? 'border-gray-600 hover:border-gray-500'
                      : 'border-gray-300 hover:border-gray-400'
                }`}
              >
                <Download className="w-6 h-6 mx-auto mb-2 text-blue-500" />
                <div className={`text-sm font-medium ${theme === 'dark' ? 'text-gray-200' : 'text-gray-800'}`}>
                  Pobierz
                </div>
              </button>

              <button
                onClick={() => setExportType('share')}
                className={`p-4 rounded-lg border-2 transition-all ${
                  exportType === 'share'
                    ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                    : theme === 'dark'
                      ? 'border-gray-600 hover:border-gray-500'
                      : 'border-gray-300 hover:border-gray-400'
                }`}
              >
                <Share2 className="w-6 h-6 mx-auto mb-2 text-green-500" />
                <div className={`text-sm font-medium ${theme === 'dark' ? 'text-gray-200' : 'text-gray-800'}`}>
                  Udostępnij
                </div>
              </button>

              <button
                onClick={() => setExportType('print')}
                className={`p-4 rounded-lg border-2 transition-all ${
                  exportType === 'print'
                    ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                    : theme === 'dark'
                      ? 'border-gray-600 hover:border-gray-500'
                      : 'border-gray-300 hover:border-gray-400'
                }`}
              >
                <Printer className="w-6 h-6 mx-auto mb-2 text-purple-500" />
                <div className={`text-sm font-medium ${theme === 'dark' ? 'text-gray-200' : 'text-gray-800'}`}>
                  Drukuj
                </div>
              </button>
            </div>
          </div>

          {/* Download Options */}
          {exportType === 'download' && (
            <div className="space-y-4">
              <div>
                <label className={`block text-sm font-medium mb-2 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                  Format eksportu
                </label>
                <select
                  value={format}
                  onChange={(e) => setFormat(e.target.value)}
                  className={`w-full px-3 py-2 rounded-lg border ${
                    theme === 'dark' 
                      ? 'bg-gray-700 border-gray-600 text-gray-200' 
                      : 'bg-white border-gray-300 text-gray-900'
                  } focus:ring-2 focus:ring-blue-500`}
                >
                  <option value="zip">Archiwum ZIP (zdjęcia + metadane)</option>
                  <option value="pdf">Dokument PDF (album fotograficzny)</option>
                  <option value="json">Plik JSON (tylko metadane)</option>
                </select>
              </div>

              <div>
                <label className={`block text-sm font-medium mb-2 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                  Jakość zdjęć
                </label>
                <div className="space-y-2">
                  {Object.entries(qualityOptions).map(([key, option]) => (
                    <label key={key} className="flex items-center space-x-3">
                      <input
                        type="radio"
                        name="quality"
                        value={key}
                        checked={quality === key}
                        onChange={(e) => setQuality(e.target.value)}
                        className="text-blue-500"
                      />
                      <div>
                        <div className={`text-sm font-medium ${theme === 'dark' ? 'text-gray-200' : 'text-gray-800'}`}>
                          {option.label}
                        </div>
                        <div className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                          {option.size}
                        </div>
                      </div>
                    </label>
                  ))}
                </div>
              </div>

              <label className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  checked={includeMetadata}
                  onChange={(e) => setIncludeMetadata(e.target.checked)}
                  className="text-blue-500"
                />
                <span className={`text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                  Dołącz metadane (tytuły, opisy, tagi, osoby)
                </span>
              </label>

              <button
                onClick={handleDownload}
                disabled={isExporting}
                className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white py-3 px-4 rounded-lg transition-colors disabled:cursor-not-allowed flex items-center justify-center space-x-2"
              >
                {isExporting ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    <span>Eksportowanie...</span>
                  </>
                ) : (
                  <>
                    <Download className="w-4 h-4" />
                    <span>Pobierz {format.toUpperCase()}</span>
                  </>
                )}
              </button>
            </div>
          )}

          {/* Share Options */}
          {exportType === 'share' && (
            <div className="space-y-4">
              <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                Udostępnij swoje zdjęcia poprzez link do galerii online
              </p>

              {!shareLink ? (
                <button
                  onClick={generateShareLink}
                  className="w-full bg-green-600 hover:bg-green-700 text-white py-3 px-4 rounded-lg transition-colors flex items-center justify-center space-x-2"
                >
                  <Cloud className="w-4 h-4" />
                  <span>Wygeneruj link do udostępniania</span>
                </button>
              ) : (
                <div className="space-y-3">
                  <div className={`p-3 rounded-lg border ${theme === 'dark' ? 'bg-gray-700 border-gray-600' : 'bg-gray-50 border-gray-300'}`}>
                    <div className="flex items-center justify-between">
                      <span className={`text-sm font-mono ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                        {shareLink}
                      </span>
                      <button
                        onClick={() => copyToClipboard(shareLink)}
                        className={`p-1 rounded transition-colors ${
                          copySuccess 
                            ? 'text-green-500' 
                            : theme === 'dark' 
                              ? 'text-gray-400 hover:text-gray-200' 
                              : 'text-gray-600 hover:text-gray-800'
                        }`}
                      >
                        {copySuccess ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <button
                      onClick={() => copyToClipboard(shareLink)}
                      className="flex items-center justify-center space-x-2 py-2 px-4 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                    >
                      <Link className="w-4 h-4" />
                      <span>Kopiuj link</span>
                    </button>

                    <button
                      onClick={() => window.open(`mailto:?subject=Galeria rodzinna&body=Sprawdź moje zdjęcia: ${shareLink}`)}
                      className="flex items-center justify-center space-x-2 py-2 px-4 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                    >
                      <Mail className="w-4 h-4" />
                      <span>Email</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Print Options */}
          {exportType === 'print' && (
            <div className="space-y-4">
              <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                Przygotuj zdjęcia do druku
              </p>

              <div className="grid grid-cols-2 gap-3">
                <button className="p-4 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                  <Smartphone className="w-6 h-6 mx-auto mb-2" />
                  <div className="text-sm">Format mobilny</div>
                </button>

                <button className="p-4 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                  <Monitor className="w-6 h-6 mx-auto mb-2" />
                  <div className="text-sm">Format A4</div>
                </button>
              </div>

              <button
                onClick={() => window.print()}
                className="w-full bg-purple-600 hover:bg-purple-700 text-white py-3 px-4 rounded-lg transition-colors flex items-center justify-center space-x-2"
              >
                <Printer className="w-4 h-4" />
                <span>Drukuj</span>
              </button>
            </div>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
};

export default ExportModal;
