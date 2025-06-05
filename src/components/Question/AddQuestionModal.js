import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus } from 'lucide-react';

export function AddQuestionModal({ isOpen, onClose, onAdd, theme }) {
  const [newQuestion, setNewQuestion] = useState('');
  const [questionType, setQuestionType] = useState('self');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (newQuestion.trim()) {
      onAdd({
        question: newQuestion.trim(),
        type: questionType,
        custom: true
      });
      setNewQuestion('');
      onClose();
    }
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
        className="bg-white dark:bg-gray-800 rounded-xl w-full max-w-md p-6"
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", damping: 25, stiffness: 300 }}
      >
        <div className="flex justify-between items-center mb-6">
          <h3 className={`text-xl font-semibold text-gray-900 dark:text-gray-100 ${theme.font}`}>
            Dodaj własne pytanie
          </h3>          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 
                     text-gray-500 dark:text-gray-400 transition-colors"
          >
            <span className="text-lg">✕</span>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Treść pytania
            </label>
            <textarea
              value={newQuestion}
              onChange={(e) => setNewQuestion(e.target.value)}
              placeholder="Np. Jakie jest Twoje najpiękniejsze wspomnienie z dzieciństwa?"
              className="w-full p-3 rounded-lg bg-gray-50 dark:bg-gray-700 
                       border border-gray-200 dark:border-gray-600
                       focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400
                       text-gray-800 dark:text-gray-100"
              rows="3"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Typ pytania
            </label>
            <select
              value={questionType}
              onChange={(e) => setQuestionType(e.target.value)}
              className="w-full p-3 rounded-lg bg-gray-50 dark:bg-gray-700 
                       border border-gray-200 dark:border-gray-600
                       focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400
                       text-gray-800 dark:text-gray-100"
            >
              <option value="self">Dla mnie</option>
              <option value="recipient">Dla odbiorcy</option>
            </select>
          </div>

          <div className="pt-4">
            <button
              type="submit"
              className={`w-full py-3 px-4 rounded-lg bg-gradient-to-r ${theme.buttons} 
                       text-white font-medium hover:shadow-lg transition-shadow
                       flex items-center justify-center space-x-2`}
            >
              <Plus className="w-5 h-5" />
              <span>Dodaj pytanie</span>
            </button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
}