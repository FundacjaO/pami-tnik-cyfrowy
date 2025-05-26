function SettingsPanel({ theme, setTheme, isDarkMode, setIsDarkMode, isOpen, onClose }) {
  // ...istniejący kod...

  return (
    <motion.div>
      <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 w-full max-w-md shadow-2xl">
        {/* ...istniejące sekcje... */}

        {/* Dodaj sekcję kalendarza */}
        <div className="mb-6">
          <h3 className="text-lg text-gray-700 dark:text-gray-200 mb-3">Kalendarz</h3>
          <div className="bg-white dark:bg-gray-700 rounded-xl p-4">
            <GoogleCalendar />
          </div>
        </div>

        {/* ...pozostałe sekcje... */}
      </div>
    </motion.div>
  );
}