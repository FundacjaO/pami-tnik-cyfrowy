import React from 'react';
import { Moon, Sun } from 'lucide-react';

const themes = {
  classic: {
    name: 'Klasyczny',
    description: 'Elegancki i ponadczasowy',
    preview: 'from-amber-50 to-amber-100'
  },
  modern: {
    name: 'Nowoczesny',
    description: 'Minimalistyczny i świeży',
    preview: 'from-blue-50 to-indigo-100'
  },
  retro: {
    name: 'Retro',
    description: 'Nostalgiczny i ciepły',
    preview: 'from-rose-50 to-rose-100'
  },
  nature: {
    name: 'Natura',
    description: 'Organiczny i spokojny',
    preview: 'from-emerald-50 to-emerald-100'
  }
};

function Settings({ theme, toggleTheme, isOpen, onClose, currentTheme, setCurrentTheme }) {
  return (
    <div className={`fixed inset-0 z-50 flex items-center justify-center 
                    bg-black/50 backdrop-blur-sm ${isOpen ? '' : 'hidden'}`}>
      <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 w-full max-w-md shadow-2xl max-h-[90vh] overflow-y-auto">
        <h2 className="text-2xl font-serif text-gray-800 dark:text-white mb-4">
          Ustawienia
        </h2>
        
        {/* Sekcja wyboru motywu */}
        <div className="mb-8">
          <h3 className="text-lg text-gray-700 dark:text-gray-200 mb-3">
            Wygląd aplikacji
          </h3>
          <div className="grid grid-cols-2 gap-3">
            {Object.entries(themes).map(([key, value]) => (
              <button
                key={key}
                onClick={() => setCurrentTheme(key)}
                className={`p-4 rounded-xl transition-all ${
                  currentTheme === key 
                    ? 'ring-2 ring-blue-500 scale-105' 
                    : 'hover:scale-105'
                } bg-gradient-to-br ${value.preview}`}
              >
                <h4 className="font-medium mb-1">{value.name}</h4>
                <p className="text-sm text-gray-600">{value.description}</p>
              </button>
            ))}
          </div>
        </div>

        {/* Sekcja trybu ciemnego */}
        <div className="mb-6">
          <h3 className="text-lg text-gray-700 dark:text-gray-200 mb-3">
            Tryb wyświetlania
          </h3>
          <button
            onClick={toggleTheme}
            className="w-full flex items-center justify-between px-4 py-3 
                     bg-gray-100 dark:bg-gray-700 rounded-xl"
          >
            <div className="flex items-center space-x-3">
              {theme === 'dark' ? (
                <Moon className="w-5 h-5" />
              ) : (
                <Sun className="w-5 h-5" />
              )}
              <span>{theme === 'dark' ? 'Tryb jasny' : 'Tryb ciemny'}</span>
            </div>
          </button>
        </div>

        {/* Przycisk zamknięcia */}
        <button
          onClick={onClose}
          className="w-full px-4 py-2 bg-gray-800 text-white rounded-lg 
                   hover:bg-gray-700 transition-colors"
        >
          Zamknij
        </button>
      </div>
    </div>
  );
}

export default Settings;