import { useState, useEffect } from 'react';
import { Info } from 'lucide-react';
import { tooltips } from '../../utils/tooltips';

export const QuestionTooltip = ({ questionId }: { questionId: string }) => {
  const [tip, setTip] = useState('');

  useEffect(() => {
    const tips = tooltips[questionId] || tooltips.default;
    const randomTip = tips[Math.floor(Math.random() * tips.length)];
    setTip(randomTip);
  }, [questionId]);

  return (
    <div className="group relative inline-block ml-2">
      <Info className="w-4 h-4 text-gray-400 group-hover:text-gray-700 cursor-pointer" />
      <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 w-64 p-2 text-sm bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-300 border border-gray-300 dark:border-gray-700 rounded-lg shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-50 pointer-events-none">
        {tip}
      </div>
    </div>
  );
};