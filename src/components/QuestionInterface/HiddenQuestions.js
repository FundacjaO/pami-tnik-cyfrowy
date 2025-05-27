import { motion } from 'framer-motion';
import { Eye } from 'lucide-react';

export function HiddenQuestions({ questions, hiddenIndices, onRestore, theme }) {
  if (hiddenIndices.length === 0) return null;

  return (
    <motion.div
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: 'auto' }}
      exit={{ opacity: 0, height: 0 }}
      className="bg-gray-50 dark:bg-gray-800/50 rounded-2xl p-4 mb-6"
    >
      <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-3">
        Ukryte pytania
      </h3>
      <div className="space-y-2">
        {hiddenIndices.map((index) => (
          <div
            key={index}
            className="flex items-center justify-between p-3 bg-white dark:bg-gray-800 
                     rounded-lg border border-gray-100 dark:border-gray-700"
          >
            <span className="text-gray-600 dark:text-gray-300">
              {questions[index]}
            </span>
            <button
              onClick={() => onRestore(index)}
              className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300
                       hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors"
            >
              <Eye className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>
    </motion.div>
  );
}