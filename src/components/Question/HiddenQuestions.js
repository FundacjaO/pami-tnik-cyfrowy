import { motion, AnimatePresence } from 'framer-motion';
import { Eye } from 'lucide-react';

const listVariants = {
  hidden: { opacity: 0, height: 0 },
  visible: {
    opacity: 1,
    height: 'auto',
    transition: {
      staggerChildren: 0.1,
      height: { type: 'spring', stiffness: 100 },
    },
  },
  exit: {
    opacity: 0,
    height: 0,
    transition: {
      staggerChildren: 0.05,
      staggerDirection: -1,
      height: { type: 'spring', stiffness: 100 },
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, x: -20 },
  visible: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: 20 },
};

export function HiddenQuestions({ questions, hiddenIndices, onRestore, theme }) {
  if (hiddenIndices.length === 0) return null;

  return (
    <motion.div
      variants={listVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
      className="bg-gray-50 dark:bg-gray-800/50 rounded-2xl p-4 mb-6"
    >
      <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-3">
        Ukryte pytania ({hiddenIndices.length})
      </h3>
      <AnimatePresence mode="popLayout">
        <div className="space-y-2">
          {hiddenIndices.map((index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              className="flex items-center justify-between p-3 bg-white 
                       dark:bg-gray-800 rounded-lg border border-gray-100 
                       dark:border-gray-700"
            >
              <span className="text-gray-600 dark:text-gray-300 text-sm">
                {questions[index]}
              </span>
              <button
                onClick={() => onRestore(index)}
                className="p-2 text-gray-400 hover:text-gray-600 
                         dark:hover:text-gray-300 hover:bg-gray-100 
                         dark:hover:bg-gray-700 rounded-full transition-colors
                         group"
                title="Przywróć pytanie"
              >
                <Eye className="w-4 h-4 group-hover:scale-110 transition-transform" />
              </button>
            </motion.div>
          ))}
        </div>
      </AnimatePresence>
    </motion.div>
  );
}