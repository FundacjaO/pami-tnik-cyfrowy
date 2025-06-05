import { useState } from 'react';
import { motion } from 'framer-motion';
import { Heart, Star, MoreVertical, Info } from 'lucide-react';
import { TIPS } from '../../constants/tips';
import { AIParaphraseWidget } from './AIParaphraseWidget';
import { useFeatureFlag, FEATURE_FLAGS } from '../../constants/features';

export function Question({ 
  question,
  answer,
  onAnswerChange,
  onEmotionToggle,
  emotions = { touched: false, favorite: false },
  theme
}) {
  const [showMenu, setShowMenu] = useState(false);
  const [showTip, setShowTip] = useState(false);
  const [tip] = useState(() => TIPS[Math.floor(Math.random() * TIPS.length)]);
  
  // Sprawdź dostęp do funkcji premium
  const { isEnabled: aiParaphraseEnabled } = useFeatureFlag(FEATURE_FLAGS.AI_PARAPHRASE_WIDGET);

  return (
    <motion.div className="bg-white dark:bg-gray-800 rounded-2xl p-6 mb-6 shadow-lg">
      {/* Question header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-start space-x-2">
          <h3 className="text-lg text-gray-800 dark:text-gray-100">
            {question}
          </h3>
        </div>
        
        {/* Menu button */}
        <div className="relative">
          <button
            onClick={() => setShowMenu(!showMenu)}
            className="p-1.5 text-gray-400 hover:text-gray-600"
          >
            <MoreVertical className="w-4 h-4" />
          </button>
          {showMenu && (
            <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 
                         rounded-lg shadow-lg border border-gray-200 
                         dark:border-gray-700 overflow-hidden z-50">
              {/* ... menu content ... */}
            </div>
          )}
        </div>
      </div>

      {/* Tooltip */}
      <div className="mb-4">
        <button
          onMouseEnter={() => setShowTip(true)}
          onMouseLeave={() => setShowTip(false)}
          onClick={() => setShowTip(!showTip)}
          className="flex items-center space-x-2 text-gray-400 hover:text-gray-600"
        >
          <Info className="w-4 h-4" />
          <span className="text-sm">Podpowiedź</span>
        </button>
        
        {showTip && (
          <div className="mt-2 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg
                       text-sm text-gray-600 dark:text-gray-300">
            {tip}
          </div>
        )}
      </div>

      {/* Answer textarea */}
      <textarea
        value={answer || ""}
        onChange={(e) => onAnswerChange?.(e.target.value)}
        placeholder="Twoja odpowiedź..."
        className="w-full min-h-[150px] p-4 mb-4 bg-gray-50 dark:bg-gray-700/50 
                 rounded-xl border border-gray-200 dark:border-gray-600
                 focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400
                 text-gray-800 dark:text-gray-100"
      />

      {/* AI Paraphrase Widget - tylko dla użytkowników premium */}
      {aiParaphraseEnabled && answer && (
        <div className="mb-4">
          <AIParaphraseWidget
            text={answer}
            onParaphraseSelect={onAnswerChange}
            theme={theme}
          />
        </div>
      )}

      {/* Emotion buttons */}
      <div className="flex items-center space-x-3">
        <button
          onClick={() => onEmotionToggle('touched')}
          className={`flex items-center space-x-2 px-3 py-1.5 rounded-full text-sm 
                    transition-colors duration-200
                    ${emotions.touched 
                      ? 'bg-rose-100 dark:bg-rose-500/20 text-rose-500' 
                      : 'bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400'}`}
        >
          <Heart 
            className="w-4 h-4" 
            fill={emotions.touched ? 'currentColor' : 'none'} 
          />
          <span>Wzruszyło mnie</span>
        </button>

        <button
          onClick={() => onEmotionToggle('favorite')}
          className={`flex items-center space-x-2 px-3 py-1.5 rounded-full text-sm
                    transition-colors duration-200
                    ${emotions.favorite 
                      ? 'bg-amber-100 dark:bg-amber-500/20 text-amber-500' 
                      : 'bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400'}`}
        >
          <Star 
            className="w-4 h-4" 
            fill={emotions.favorite ? 'currentColor' : 'none'} 
          />
          <span>Ważne wspomnienie</span>
        </button>
      </div>
    </motion.div>
  );
}