import { useState, useEffect } from 'react';
import { Info } from 'lucide-react';
import { questionTooltips } from '../../constants/tooltips';

export function QuestionTooltip() {
  const [tip, setTip] = useState('');

  useEffect(() => {
    const tips = questionTooltips.default;
    const randomTip = tips[Math.floor(Math.random() * tips.length)];
    setTip(randomTip);
  }, []);

  return (
    <div className="group relative inline-block">
      <Info className="w-4 h-4 text-gray-400 group-hover:text-gray-600 
                      dark:text-gray-500 dark:group-hover:text-gray-300 
                      transition-colors cursor-pointer" />
      <div className="absolute left-0 top-full mt-2 w-64 p-3 text-sm
                    bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300
                    border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg
                    opacity-0 group-hover:opacity-100 transition-opacity duration-200
                    pointer-events-none z-50">
        {tip}
      </div>
    </div>
  );
}