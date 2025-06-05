import React, { useState } from 'react';
import { Moon, Sun, Crown, Star } from 'lucide-react';
import { themes } from '../constants/themes';
import { isPremiumUser, togglePremiumStatus, PREMIUM_FEATURES } from '../constants/features';

function Settings({ theme, toggleTheme, isOpen, onClose, currentTheme, setCurrentTheme, isDarkMode, setIsDarkMode }) {
  const [premiumStatus, setPremiumStatus] = useState(isPremiumUser());

  const handlePremiumToggle = () => {
    const newStatus = togglePremiumStatus();
    setPremiumStatus(newStatus);
    // Odśwież stronę aby zastosować zmiany flag funkcji
    window.location.reload();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 w-full max-w-md shadow-2xl">
        <h2 className="text-2xl font-serif text-gray-800 dark:text-white mb-6">
          Ustawienia
        </h2>

        {/* Dark Mode Toggle */}
        <div className="mb-6">
          <h3 className="text-lg text-gray-700 dark:text-gray-200 mb-3">
            Tryb wyświetlania
          </h3>
          <button
            onClick={() => setIsDarkMode(!isDarkMode)}
            className="w-full flex items-center justify-between px-4 py-3 
                     bg-gray-100 dark:bg-gray-700 rounded-xl"
          >
            <span className="text-gray-700 dark:text-gray-200">
              {isDarkMode ? 'Tryb jasny' : 'Tryb ciemny'}
            </span>
            {isDarkMode ? (
              <Sun className="w-5 h-5 text-gray-600 dark:text-gray-300" />
            ) : (
              <Moon className="w-5 h-5 text-gray-600 dark:text-gray-300" />
            )}
          </button>
        </div>

        {/* Premium Status */}
        <div className="mb-6">
          <h3 className="text-lg text-gray-700 dark:text-gray-200 mb-3">
            Status Premium
          </h3>
          <div className="space-y-3">
            <button
              onClick={handlePremiumToggle}
              className={`w-full flex items-center justify-between px-4 py-3 rounded-xl transition-all
                         ${premiumStatus 
                           ? 'bg-gradient-to-r from-amber-100 to-orange-100 dark:from-amber-900/30 dark:to-orange-900/30 border-2 border-amber-300 dark:border-amber-600' 
                           : 'bg-gray-100 dark:bg-gray-700'}`}
            >
              <div className="flex items-center space-x-3">
                <Crown className={`w-5 h-5 ${premiumStatus ? 'text-amber-500' : 'text-gray-400'}`} />
                <div className="text-left">
                  <p className="text-gray-700 dark:text-gray-200 font-medium">
                    {premiumStatus ? 'Premium aktywne' : 'Aktywuj Premium'}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {premiumStatus ? 'Wszystkie funkcje odblokowane' : 'Kliknij aby włączyć tryb premium'}
                  </p>
                </div>
              </div>
              <Star className={`w-4 h-4 ${premiumStatus ? 'text-amber-500' : 'text-gray-400'}`} />
            </button>

            {/* Premium Features List */}
            {premiumStatus && (
              <div className="bg-amber-50 dark:bg-amber-900/20 rounded-xl p-3">
                <p className="text-sm font-medium text-amber-800 dark:text-amber-200 mb-2">
                  Aktywne funkcje Premium:
                </p>
                <ul className="space-y-1">
                  {Object.values(PREMIUM_FEATURES).map((feature, index) => (
                    <li key={index} className="text-xs text-amber-700 dark:text-amber-300 flex items-center space-x-2">
                      <Star className="w-3 h-3" />
                      <span>{feature.name}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>

        {/* Wybór motywu */}
        <div className="mb-8">
          <h3 className="text-lg text-gray-700 dark:text-gray-200 mb-4">
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

        {/* Przycisk zamknięcia */}
        <button
          onClick={onClose}
          className="w-full px-4 py-2 mt-6 bg-gray-800 text-white rounded-lg 
                   hover:bg-gray-700 transition-colors"
        >
          Zamknij
        </button>
      </div>
    </div>
  );
}

export default Settings;