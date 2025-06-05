import { motion } from 'framer-motion';
import { Crown, Lock } from 'lucide-react';

export function PremiumFeatureCard({ 
  title, 
  description, 
  isLocked = true, 
  onClick,
  className = "" 
}) {
  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      className={`relative p-4 rounded-xl border-2 border-dashed border-amber-300 
                  bg-gradient-to-br from-amber-50 to-orange-50 
                  dark:from-amber-900/20 dark:to-orange-900/20
                  dark:border-amber-600 cursor-pointer ${className}`}
      onClick={onClick}
    >
      {/* Premium icon */}
      <div className="absolute top-2 right-2">
        <Crown className="w-5 h-5 text-amber-500" />
      </div>

      {/* Lock overlay */}
      {isLocked && (
        <div className="absolute inset-0 bg-white/80 dark:bg-gray-900/80 
                       rounded-xl flex items-center justify-center">
          <div className="text-center">
            <Lock className="w-8 h-8 text-gray-400 mx-auto mb-2" />
            <p className="text-sm text-gray-600 dark:text-gray-400 font-medium">
              Funkcja Premium
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
              Kliknij aby aktywować
            </p>
          </div>
        </div>
      )}

      {/* Content */}
      <div className="space-y-2">
        <h4 className="font-semibold text-gray-800 dark:text-gray-200">
          {title}
        </h4>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          {description}
        </p>
      </div>
    </motion.div>
  );
}
