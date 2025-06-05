// System flag funkcji premium
export const FEATURE_FLAGS = {
  AI_PARAPHRASE_WIDGET: 'ai_paraphrase_widget',
  PREMIUM_THEMES: 'premium_themes',
  ADVANCED_EXPORT: 'advanced_export',
  CALENDAR_INTEGRATION: 'calendar_integration'
};

export const PREMIUM_FEATURES = {
  [FEATURE_FLAGS.AI_PARAPHRASE_WIDGET]: {
    name: 'AI Parafrazowanie',
    description: 'Widget do parafrazowania odpowiedzi za pomocą AI',
    enabled: true
  },
  [FEATURE_FLAGS.PREMIUM_THEMES]: {
    name: 'Tematy Premium',
    description: 'Dostęp do ekskluzywnych motywów kolorystycznych',
    enabled: true
  },
  [FEATURE_FLAGS.ADVANCED_EXPORT]: {
    name: 'Zaawansowany eksport',
    description: 'Eksport do różnych formatów z customizacją',
    enabled: true
  },
  [FEATURE_FLAGS.CALENDAR_INTEGRATION]: {
    name: 'Integracja z kalendarzem',
    description: 'Pełna integracja z Google Calendar',
    enabled: true
  }
};

// Hook do sprawdzania czy użytkownik ma dostęp premium
export const useFeatureFlag = (flagName) => {
  const isPremiumUser = () => {
    try {
      const premiumStatus = localStorage.getItem('user-premium-status');
      return premiumStatus === 'true';
    } catch {
      return false;
    }
  };

  const isFeatureEnabled = (feature) => {
    const premiumUser = isPremiumUser();
    if (!premiumUser) return false;
    
    return PREMIUM_FEATURES[feature]?.enabled || false;
  };

  return {
    isEnabled: isFeatureEnabled(flagName),
    isPremium: isPremiumUser()
  };
};

// Funkcja do przełączania statusu premium
export const togglePremiumStatus = () => {
  try {
    const currentStatus = localStorage.getItem('user-premium-status') === 'true';
    localStorage.setItem('user-premium-status', (!currentStatus).toString());
    return !currentStatus;
  } catch {
    return false;
  }
};

// Funkcja do sprawdzania statusu premium
export const isPremiumUser = () => {
  try {
    return localStorage.getItem('user-premium-status') === 'true';
  } catch {
    return false;
  }
};
