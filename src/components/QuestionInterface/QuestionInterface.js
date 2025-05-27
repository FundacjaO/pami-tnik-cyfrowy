import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, AlertCircle, XCircle } from 'lucide-react';
import { Question } from '../Question/Question';
import { HiddenQuestions } from '../Question/HiddenQuestions';
import { AddQuestionModal } from '../Question/AddQuestionModal';

// Add error messages constant
const ERROR_MESSAGES = {
  localStorage: "Nie udało się zapisać danych lokalnie. Sprawdź ustawienia przeglądarki.",
  loadData: "Wystąpił problem podczas ładowania danych. Spróbuj odświeżyć stronę.",
  addQuestion: "Nie udało się dodać pytania. Spróbuj ponownie.",
  hideQuestion: "Nie udało się ukryć pytania. Spróbuj ponownie.",
  emotion: "Nie udało się zapisać reakcji. Spróbuj ponownie."
};

export function QuestionInterface({ chapter, answers, setAnswers, theme, onBack }) {
  // Add error state
  const [error, setError] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);

  // Wrap localStorage operations in try-catch
  const [customQuestions, setCustomQuestions] = useState(() => {
    try {
      const saved = localStorage.getItem(`custom-questions-${chapter.id}`);
      return saved ? JSON.parse(saved) : [];
    } catch (err) {
      setError(ERROR_MESSAGES.loadData);
      return [];
    }
  });

  const [hiddenQuestions, setHiddenQuestions] = useState(() => {
    try {
      const saved = localStorage.getItem(`hidden-questions-${chapter.id}`);
      return saved ? JSON.parse(saved) : [];
    } catch (err) {
      setError(ERROR_MESSAGES.loadData);
      return [];
    }
  });

  const [emotions, setEmotions] = useState(() => {
    try {
      const saved = localStorage.getItem(`emotions-${chapter.id}`);
      return saved ? JSON.parse(saved) : {};
    } catch (err) {
      setError(ERROR_MESSAGES.loadData);
      return {};
    }
  });

  // Add safe localStorage setter
  const safeSetLocalStorage = useCallback((key, value, errorType) => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (err) {
      setError(ERROR_MESSAGES[errorType]);
      return false;
    }
    return true;
  }, []);

  // Update handlers with error handling
  const handleAnswerChange = (questionIndex, value) => {
    try {
      const key = `${chapter.id}-${questionIndex}`;
      setAnswers(prev => ({
        ...prev,
        [key]: value
      }));
    } catch (err) {
      setError(ERROR_MESSAGES.localStorage);
    }
  };

  const handleEmotionToggle = (questionIndex, type) => {
    try {
      const key = `${chapter.id}-${questionIndex}`;
      const updatedEmotions = {
        ...emotions,
        [key]: {
          ...emotions[key],
          [type]: !emotions[key]?.[type]
        }
      };
      
      if (safeSetLocalStorage(`emotions-${chapter.id}`, updatedEmotions, 'emotion')) {
        setEmotions(updatedEmotions);
        setError(null);
      }
    } catch (err) {
      setError(ERROR_MESSAGES.emotion);
    }
  };

  const handleHideQuestion = (index) => {
    try {
      const updatedHidden = [...hiddenQuestions, index];
      if (safeSetLocalStorage(`hidden-questions-${chapter.id}`, updatedHidden, 'hideQuestion')) {
        setHiddenQuestions(updatedHidden);
        setError(null);
      }
    } catch (err) {
      setError(ERROR_MESSAGES.hideQuestion);
    }
  };

  const handleRestoreQuestion = (index) => {
    try {
      const updatedHidden = hiddenQuestions.filter(i => i !== index);
      if (safeSetLocalStorage(`hidden-questions-${chapter.id}`, updatedHidden, 'hideQuestion')) {
        setHiddenQuestions(updatedHidden);
        setError(null);
      }
    } catch (err) {
      setError(ERROR_MESSAGES.hideQuestion);
    }
  };

  const handleAddQuestion = (newQuestion) => {
    try {
      const updatedQuestions = [...customQuestions, newQuestion];
      if (safeSetLocalStorage(`custom-questions-${chapter.id}`, updatedQuestions, 'addQuestion')) {
        setCustomQuestions(updatedQuestions);
        setError(null);
      }
    } catch (err) {
      setError(ERROR_MESSAGES.addQuestion);
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      {/* Error Message */}
      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 rounded-xl 
                     border border-red-100 dark:border-red-800"
          >
            <div className="flex items-start space-x-3">
              <AlertCircle className="w-5 h-5 text-red-500 mt-0.5 flex-shrink-0" />
              <div className="flex-grow">
                <p className="text-red-700 dark:text-red-300">{error}</p>
              </div>
              <button
                onClick={() => setError(null)}
                className="text-red-400 hover:text-red-600 dark:text-red-500 
                         dark:hover:text-red-300"
              >
                <XCircle className="w-5 h-5" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Hidden Questions Section */}
      <HiddenQuestions
        questions={chapter.questions}
        hiddenIndices={hiddenQuestions}
        onRestore={handleRestoreQuestion}
        theme={theme}
      />

      {/* Questions List */}
      <div className="space-y-6">
        {visibleQuestions.map((question, index) => (
          <Question
            key={`${chapter.id}-${index}`}
            chapterId={chapter.id}
            questionIndex={index}
            question={question}
            answer={answers[`${chapter.id}-${index}`] || ''}
            onAnswerChange={(value) => handleAnswerChange(index, value)}
            emotions={emotions[`${chapter.id}-${index}`] || {}}
            onEmotionToggle={(type) => handleEmotionToggle(index, type)}
            onHide={() => handleHideQuestion(index)}
            theme={theme}
          />
        ))}

        {/* Custom Questions */}
        {customQuestions.map((customQ, index) => (
          <Question
            key={`custom-${chapter.id}-${index}`}
            chapterId={chapter.id}
            questionIndex={`custom-${index}`}
            question={customQ.question}
            answer={answers[`${chapter.id}-custom-${index}`] || ''}
            onAnswerChange={(value) => handleAnswerChange(`custom-${index}`, value)}
            emotions={emotions[`${chapter.id}-custom-${index}`] || {}}
            onEmotionToggle={(type) => handleEmotionToggle(`custom-${index}`, type)}
            theme={theme}
            custom={true}
          />
        ))}
      </div>

      {/* Add Question Button */}
      <motion.button
        onClick={() => setShowAddModal(true)}
        className="w-full p-4 mt-8 border-2 border-dashed border-gray-200 
                 dark:border-gray-700 rounded-2xl flex items-center 
                 justify-center space-x-2 text-gray-500 dark:text-gray-400 
                 hover:border-blue-500 dark:hover:border-blue-400 
                 hover:text-blue-500 dark:hover:text-blue-400
                 transition-colors group"
        whileHover={{ scale: 1.01 }}
        whileTap={{ scale: 0.99 }}
      >
        <Plus className="w-5 h-5" />
        <span>Dodaj własne pytanie do tego rozdziału</span>
      </motion.button>

      {/* Add Question Modal */}
      <AnimatePresence>
        {showAddModal && (
          <AddQuestionModal
            isOpen={showAddModal}
            onClose={() => setShowAddModal(false)}
            onAdd={handleAddQuestion}
            theme={theme}
          />
        )}
      </AnimatePresence>
    </div>
  );
}