import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, RefreshCw, Copy, Check } from 'lucide-react';

export function AIParaphraseWidget({ text, onParaphraseSelect, theme }) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [paraphrases, setParaphrases] = useState([]);
  const [copiedIndex, setCopiedIndex] = useState(null);

  // Symulacja API AI (w rzeczywistej aplikacji byłoby to prawdziwe API)
  const generateParaphrases = async (inputText) => {
    setIsLoading(true);
    
    // Symulacja opóźnienia API
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Przykładowe parafrazie (w rzeczywistości z AI)
    const variations = [
      inputText.replace(/bardzo/g, 'niezwykle').replace(/był/g, 'bywał'),
      inputText.replace(/pamiętam/g, 'przypominam sobie').replace(/gdy/g, 'kiedy'),
      inputText.charAt(0).toUpperCase() + inputText.slice(1).replace(/\./g, ', co pozostało w mojej pamięci.')
    ];
    
    setParaphrases(variations.filter(v => v !== inputText && v.length > 10));
    setIsLoading(false);
  };

  const handleCopy = async (text, index) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedIndex(index);
      setTimeout(() => setCopiedIndex(null), 2000);
    } catch (err) {
      console.error('Nie udało się skopiować tekstu:', err);
    }
  };

  const handleParaphraseUse = (paraphrase) => {
    onParaphraseSelect(paraphrase);
    setIsExpanded(false);
  };

  if (!text || text.length < 20) {
    return null; // Nie pokazuj dla krótkich tekstów
  }

  return (
    <div className="relative">
      <motion.button
        onClick={() => {
          setIsExpanded(!isExpanded);
          if (!isExpanded && paraphrases.length === 0) {
            generateParaphrases(text);
          }
        }}
        className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-sm
                   ${theme.buttons} text-white hover:shadow-lg transition-all
                   ${isExpanded ? 'shadow-lg' : 'shadow-md'}`}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        <Sparkles className="w-4 h-4" />
        <span>AI Parafrazowanie</span>
        {isLoading && <RefreshCw className="w-4 h-4 animate-spin" />}
      </motion.button>

      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-gray-800 
                       rounded-xl shadow-2xl border border-gray-200 dark:border-gray-700 
                       p-4 z-50 max-w-md"
          >
            <h4 className="text-sm font-medium text-gray-800 dark:text-gray-200 mb-3">
              Propozycje parafraz:
            </h4>

            {isLoading ? (
              <div className="space-y-3">
                {[1, 2, 3].map(i => (
                  <div key={i} className="animate-pulse">
                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full mb-2"></div>
                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
                  </div>
                ))}
              </div>
            ) : paraphrases.length > 0 ? (
              <div className="space-y-3">
                {paraphrases.map((paraphrase, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="p-3 bg-gray-50 dark:bg-gray-700 rounded-lg group"
                  >
                    <p className="text-sm text-gray-700 dark:text-gray-300 mb-2">
                      {paraphrase}
                    </p>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleParaphraseUse(paraphrase)}
                        className="text-xs px-2 py-1 bg-blue-500 text-white rounded 
                                 hover:bg-blue-600 transition-colors"
                      >
                        Użyj
                      </button>
                      <button
                        onClick={() => handleCopy(paraphrase, index)}
                        className="text-xs px-2 py-1 bg-gray-500 text-white rounded 
                                 hover:bg-gray-600 transition-colors flex items-center space-x-1"
                      >
                        {copiedIndex === index ? (
                          <>
                            <Check className="w-3 h-3" />
                            <span>Skopiowano</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3 h-3" />
                            <span>Kopiuj</span>
                          </>
                        )}
                      </button>
                    </div>
                  </motion.div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Nie udało się wygenerować parafraz dla tego tekstu.
              </p>
            )}

            <button
              onClick={() => setIsExpanded(false)}
              className="mt-3 w-full text-xs text-gray-500 dark:text-gray-400 
                       hover:text-gray-700 dark:hover:text-gray-200 transition-colors"
            >
              Zamknij
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
