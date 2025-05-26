import { motion } from "framer-motion";

function ChapterOverview({ onSelectChapter, answers, theme, chapters }) {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 p-4 md:p-8 pb-24">
      <div className="max-w-6xl mx-auto">
        <motion.div className="text-center mb-12">
          <BookOpen className="w-16 h-16 mx-auto text-indigo-600 dark:text-indigo-400 mb-4" />
          <h1 className="text-3xl font-serif text-gray-800 dark:text-white mb-2">
            Twoja Historia
          </h1>
          <p className="text-gray-600 dark:text-gray-300">
            Wybierz rozdział, który chcesz pisać
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {chapters.map((chapter) => (
            <motion.div key={chapter.id} className="relative group">
              <motion.div
                onClick={() => onSelectChapter(chapter)}
                className="bg-white dark:bg-gray-800 p-6 rounded-2xl cursor-pointer 
                         shadow-lg hover:shadow-xl transition-all duration-300"
                whileHover={{ scale: 1.02 }}
              >
                {chapter.component ? (
                  <chapter.component />
                ) : (
                  <div className="relative z-10">
                    <div className="flex items-center space-x-3 mb-4">
                      <span className="text-2xl">{timelineIcons[chapter.title]}</span>
                      <h3 className="text-xl font-semibold text-gray-800 dark:text-white">
                        {chapter.title}
                      </h3>
                    </div>
                    <p className="text-gray-600 dark:text-gray-300 text-sm mb-4">
                      {chapter.subtitle}
                    </p>
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-gray-500 dark:text-gray-400">
                        {Object.keys(answers).filter(key => 
                          key.startsWith(`${chapter.id}-`)).length}/{chapter.questions.length} odpowiedzi
                      </span>
                      <div className="w-16 h-1 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                        <div 
                          className="h-1 bg-gradient-to-r from-green-400 to-green-500 rounded-full"
                          style={{ 
                            width: `${(Object.keys(answers).filter(key => 
                              key.startsWith(`${chapter.id}-`)).length / chapter.questions.length) * 100}%` 
                          }}
                        />
                      </div>
                    </div>
                  </div>
                )}
              </motion.div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default ChapterOverview;