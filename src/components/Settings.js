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
                    bg-black/60 backdrop-blur-md ${isOpen ? '' : 'hidden'}`}> {/* Darker backdrop */}
      <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 w-full max-w-md shadow-2xl max-h-[90vh] overflow-y-auto border border-gray-200 dark:border-slate-700">
        <h2 className="text-2xl font-serif text-gray-800 dark:text-gray-100 mb-6 text-center"> {/* Centered and more margin */}
          Ustawienia
        </h2>
        
        {/* Sekcja wyboru motywu */}
        <div className="mb-8">
          <h3 className="text-lg font-medium text-gray-700 dark:text-gray-100 mb-3">
            Wygląd aplikacji
          </h3>
          <div className="grid grid-cols-2 gap-4"> {/* Increased gap */}
            {Object.entries(themes).map(([key, value]) => (
              <button
                key={key}
                onClick={() => setCurrentTheme(key)}
                className={`p-4 rounded-xl transition-all duration-150 ease-in-out focus:outline-none border ${
                  currentTheme === key 
                    ? 'ring-2 ring-blue-500 dark:ring-blue-400 scale-105 shadow-lg border-transparent' 
                    : 'border-gray-300 dark:border-slate-600 hover:scale-105 hover:shadow-md hover:dark:ring-1 hover:dark:ring-slate-500'
                } bg-gradient-to-br ${value.preview}`}
              >
                <h4 className="font-semibold mb-1 text-gray-900">{value.name}</h4> {/* Theme name always dark on light preview */}
                <p className="text-sm text-gray-700">{value.description}</p> {/* Theme desc always dark on light preview */}
              </button>
            ))}
          </div>
        </div>

        {/* Sekcja wyboru motywu */}
        <hr className="border-gray-200 dark:border-slate-700 my-6" />

        {/* Sekcja trybu ciemnego */}
        <div className="mb-8"> {/* Increased margin */}
          <h3 className="text-lg font-medium text-gray-700 dark:text-gray-100 mb-4"> {/* Increased margin-bottom */}
            Tryb wyświetlania
          </h3>
          <div className="flex items-center justify-between">
            <span className="text-gray-800 dark:text-gray-200 font-medium">
              Tryb Ciemny
            </span>
            <button
              onClick={toggleTheme}
              type="button"
              className={`relative inline-flex items-center h-6 rounded-full w-11 transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 dark:focus:ring-offset-slate-800
                          ${theme === 'dark' ? 'bg-indigo-600 dark:bg-indigo-500' : 'bg-gray-200 dark:bg-slate-600'}`}
              role="switch"
              aria-checked={theme === 'dark'}
            >
              <span
                className={`inline-block w-4 h-4 transform bg-white rounded-full transition-transform duration-200 ease-in-out
                            ${theme === 'dark' ? 'translate-x-6' : 'translate-x-1'}`} 
              />
            </button>
          </div>
        </div>

        {/* Przycisk zamknięcia */}
        <button
          onClick={onClose}
          className="w-full px-4 py-3 bg-indigo-600 text-white rounded-lg 
                   hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600 
                   transition-colors font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 dark:focus:ring-offset-slate-800"
        >
          Zamknij
        </button>
      </div>
    </div>
  );
}

export default Settings;