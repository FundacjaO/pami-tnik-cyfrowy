import { useState } from 'react';
import { Info } from 'lucide-react';
import { TIPS } from '../../constants/tips';

export function SimpleTooltip() {
  const [tip] = useState(() => TIPS[Math.floor(Math.random() * TIPS.length)]);
  const [isVisible, setIsVisible] = useState(false);

  return (
    <div className="mt-3 mb-4">
      <button
        className="flex items-center space-x-2 text-gray-500 hover:text-gray-700 
                   dark:text-gray-400 dark:hover:text-gray-300"
        onClick={() => setIsVisible(!isVisible)}
      >
        <Info className="w-4 h-4" />
        <span className="text-sm">Podpowiedź do pytania</span>
      </button>

      {isVisible && (
        <div className="mt-2 p-3 bg-white dark:bg-gray-800 rounded-lg shadow-md
                     border border-gray-200 dark:border-gray-700
                     text-sm text-gray-600 dark:text-gray-300
                     animate-fadeIn">
          {tip}
        </div>
      )}
    </div>
  );
}