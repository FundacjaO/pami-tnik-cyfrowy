import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Calendar, 
  Plus, 
  Edit2, 
  Trash2, 
  ChevronLeft, 
  ChevronRight,
  Home,
  Flag,
  Star,
  Award,
  Cake,
  Heart,
  Briefcase,
  GraduationCap,
  Baby,
  MapPin,
  X,
  Save,
  Clock,
  Image
} from 'lucide-react';

export function FamilyTimeline({ onBack, theme }) {
  // Stan przechowujący wydarzenia
  const [events, setEvents] = useState(() => {
    const saved = localStorage.getItem('familyTimelineEvents');
    return saved ? JSON.parse(saved) : [];
  });

  // Stan dla widoku dodawania/edycji wydarzenia
  const [showEventModal, setShowEventModal] = useState(false);
  const [editingEvent, setEditingEvent] = useState(null);

  // Zapisz do localStorage przy każdej zmianie
  useEffect(() => {
    localStorage.setItem('familyTimelineEvents', JSON.stringify(events));
  }, [events]);

  // Dodaj nowe wydarzenie
  const addEvent = (eventData) => {
    const newEvent = {
      id: Date.now().toString(),
      ...eventData,
    };
    
    setEvents(prev => [...prev, newEvent].sort((a, b) => new Date(a.date) - new Date(b.date)));
    setShowEventModal(false);
  };

  // Edytuj wydarzenie
  const editEvent = (id, eventData) => {
    setEvents(prev => prev.map(event => 
      event.id === id ? { ...event, ...eventData } : event
    ).sort((a, b) => new Date(a.date) - new Date(b.date)));
    
    setEditingEvent(null);
  };

  // Usuń wydarzenie
  const deleteEvent = (id) => {
    if (window.confirm('Czy na pewno chcesz usunąć to wydarzenie?')) {
      setEvents(prev => prev.filter(event => event.id !== id));
    }
  };

  // Grupuj wydarzenia po latach
  const eventsByYear = events.reduce((acc, event) => {
    const year = new Date(event.date).getFullYear();
    if (!acc[year]) acc[year] = [];
    acc[year].push(event);
    return acc;
  }, {});

  // Posortowane lata, od najnowszych do najstarszych
  const sortedYears = Object.keys(eventsByYear).sort((a, b) => b - a);

  // Ikony typów wydarzeń
  const eventIcons = {
    'birth': <Baby className="w-5 h-5" />,
    'marriage': <Heart className="w-5 h-5" />, 
    'education': <GraduationCap className="w-5 h-5" />,
    'career': <Briefcase className="w-5 h-5" />,
    'milestone': <Flag className="w-5 h-5" />,
    'celebration': <Cake className="w-5 h-5" />,
    'achievement': <Award className="w-5 h-5" />,
    'other': <Star className="w-5 h-5" />
  };

  // Kolory dla typów wydarzeń
  const eventColors = {
    'birth': 'bg-blue-500',
    'marriage': 'bg-pink-500',
    'education': 'bg-purple-500',
    'career': 'bg-amber-500',
    'milestone': 'bg-green-500',
    'celebration': 'bg-rose-500',
    'achievement': 'bg-indigo-500',
    'other': 'bg-gray-500'
  };

  // Komponenty
  const EventModal = ({ event, onSubmit, onCancel }) => {
    const [formData, setFormData] = useState(event || {
      title: '',
      description: '',
      date: new Date().toISOString().split('T')[0], // Today's date as default
      type: 'milestone',
      location: '',
      people: [],
      photoUrl: '',
      importance: 'medium' // 'low', 'medium', 'high'
    });

    const handleSubmit = (e) => {
      e.preventDefault();
      if (formData.title.trim() && formData.date) {
        onSubmit(formData);
      }
    };

    const addPerson = () => {
      if (formData.newPerson?.trim()) {
        setFormData({
          ...formData,
          people: [...(formData.people || []), formData.newPerson.trim()],
          newPerson: ''
        });
      }
    };

    const removePerson = (index) => {
      const newPeople = [...formData.people];
      newPeople.splice(index, 1);
      setFormData({ ...formData, people: newPeople });
    };

    return (
      <motion.div
        className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <motion.div
          className="bg-white dark:bg-gray-800 rounded-xl shadow-xl p-6 w-full max-w-xl"
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
        >
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-semibold text-gray-800 dark:text-white">
              {event ? 'Edytuj wydarzenie' : 'Dodaj nowe wydarzenie'}
            </h3>
            <button
              onClick={onCancel}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full"
              aria-label="Zamknij"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Główne informacje */}
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Tytuł wydarzenia <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({...formData, title: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 
                           rounded-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200"
                  placeholder="np. Narodziny Anny"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Data <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="date"
                    value={formData.date}
                    onChange={(e) => setFormData({...formData, date: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 
                             rounded-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Typ wydarzenia
                  </label>
                  <select
                    value={formData.type}
                    onChange={(e) => setFormData({...formData, type: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 
                             rounded-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200"
                  >
                    <option value="birth">Narodziny</option>
                    <option value="marriage">Ślub/Związek</option>
                    <option value="education">Edukacja</option>
                    <option value="career">Kariera</option>
                    <option value="milestone">Kamień milowy</option>
                    <option value="celebration">Uroczystość</option>
                    <option value="achievement">Osiągnięcie</option>
                    <option value="other">Inne</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Opis
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 
                           rounded-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 
                           min-h-[80px] resize-none"
                  placeholder="Opisz to wydarzenie..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Miejsce
                </label>
                <div className="flex items-center space-x-2">
                  <MapPin className="w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    value={formData.location || ''}
                    onChange={(e) => setFormData({...formData, location: e.target.value})}
                    placeholder="np. Warszawa, Polska"
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 
                             rounded-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200"
                  />
                </div>
              </div>
            </div>

            {/* Dodatkowe informacje */}
            <div className="border-t border-gray-200 dark:border-gray-700 pt-4 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Ważność wydarzenia
                </label>
                <div className="flex space-x-4">
                  <label className="flex items-center space-x-2">
                    <input 
                      type="radio" 
                      name="importance" 
                      value="low" 
                      checked={formData.importance === 'low'} 
                      onChange={() => setFormData({...formData, importance: 'low'})}
                      className="text-blue-500"
                    />
                    <span className="text-sm text-gray-600 dark:text-gray-400">Niska</span>
                  </label>
                  <label className="flex items-center space-x-2">
                    <input 
                      type="radio" 
                      name="importance" 
                      value="medium" 
                      checked={formData.importance === 'medium'} 
                      onChange={() => setFormData({...formData, importance: 'medium'})}
                      className="text-blue-500"
                    />
                    <span className="text-sm text-gray-600 dark:text-gray-400">Średnia</span>
                  </label>
                  <label className="flex items-center space-x-2">
                    <input 
                      type="radio" 
                      name="importance" 
                      value="high" 
                      checked={formData.importance === 'high'} 
                      onChange={() => setFormData({...formData, importance: 'high'})}
                      className="text-blue-500"
                    />
                    <span className="text-sm text-gray-600 dark:text-gray-400">Wysoka</span>
                  </label>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Powiązane osoby
                </label>
                <div className="flex items-center space-x-2 mb-2">
                  <input
                    type="text"
                    value={formData.newPerson || ''}
                    onChange={(e) => setFormData({...formData, newPerson: e.target.value})}
                    placeholder="Dodaj osobę..."
                    className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 
                             rounded-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200"
                  />
                  <button
                    type="button"
                    onClick={addPerson}
                    className="p-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                  >
                    <Plus className="w-5 h-5" />
                  </button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {formData.people?.map((person, index) => (
                    <div 
                      key={index}
                      className="px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 
                               rounded-full text-sm flex items-center space-x-1"
                    >
                      <span>{person}</span>
                      <button 
                        type="button" 
                        onClick={() => removePerson(index)}
                        className="w-4 h-4 rounded-full hover:bg-blue-200 dark:hover:bg-blue-800 
                                 flex items-center justify-center text-xs"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  URL zdjęcia (opcjonalnie)
                </label>
                <div className="flex items-center space-x-2">
                  <input
                    type="text"
                    value={formData.photoUrl || ''}
                    onChange={(e) => setFormData({...formData, photoUrl: e.target.value})}
                    placeholder="np. https://example.com/photo.jpg"
                    className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 
                             rounded-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200"
                  />
                  <div className="flex-shrink-0 w-12 h-12 bg-gray-200 dark:bg-gray-700 rounded-lg flex items-center justify-center overflow-hidden">
                    {formData.photoUrl ? (
                      <img 
                        src={formData.photoUrl} 
                        alt="Podgląd" 
                        className="w-full h-full object-cover"
                        onError={(e) => e.target.src = ''}
                      />
                    ) : (
                      <Image className="w-6 h-6 text-gray-400" />
                    )}
                  </div>
                </div>
              </div>
            </div>

            <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200 dark:border-gray-700">
              <button
                type="button"
                onClick={onCancel}
                className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg
                         text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                Anuluj
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600
                         flex items-center space-x-2"
              >
                <Save className="w-4 h-4" />
                <span>{event ? 'Zapisz zmiany' : 'Dodaj wydarzenie'}</span>
              </button>
            </div>
          </form>
        </motion.div>
      </motion.div>
    );
  };

  // Pojedyncze wydarzenie
  const EventCard = ({ event }) => {
    const date = new Date(event.date);
    const formattedDate = date.toLocaleDateString('pl-PL', { 
      day: 'numeric', 
      month: 'long', 
      year: 'numeric' 
    });
    
    const importanceBadge = {
      'high': 'bg-red-500',
      'medium': 'bg-yellow-500',
      'low': 'bg-green-500',
    }[event.importance || 'medium'];

    return (
      <motion.div
        className="group bg-white dark:bg-gray-800 rounded-xl shadow-md hover:shadow-lg 
                 transition-all border border-gray-100 dark:border-gray-700"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        whileHover={{ scale: 1.02 }}
      >
        <div className={`h-2 ${eventColors[event.type] || 'bg-gray-500'} rounded-t-xl`}></div>
        <div className="p-4">
          <div className="flex items-start justify-between">
            <div className="flex items-start space-x-3">
              <div className={`w-10 h-10 rounded-full ${eventColors[event.type] || 'bg-gray-500'} 
                            flex items-center justify-center text-white`}>
                {eventIcons[event.type] || <Flag className="w-5 h-5" />}
              </div>
              
              <div>
                <h4 className="font-semibold text-gray-800 dark:text-white mb-1">
                  {event.title}
                </h4>
                <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
                  <Calendar className="w-4 h-4" />
                  <span>{formattedDate}</span>
                </div>
                
                {event.location && (
                  <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400 mt-1">
                    <MapPin className="w-4 h-4" />
                    <span>{event.location}</span>
                  </div>
                )}
              </div>
            </div>
            
            <div className="flex items-center space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
              <button 
                onClick={() => setEditingEvent(event)}
                className="p-1 text-gray-500 hover:text-gray-700 dark:text-gray-400 
                         dark:hover:text-gray-200 rounded hover:bg-gray-100 dark:hover:bg-gray-700"
                aria-label="Edytuj"
              >
                <Edit2 className="w-4 h-4" />
              </button>
              <button 
                onClick={() => deleteEvent(event.id)}
                className="p-1 text-gray-500 hover:text-red-600 dark:text-gray-400 
                         dark:hover:text-red-400 rounded hover:bg-gray-100 dark:hover:bg-gray-700"
                aria-label="Usuń"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
          
          {event.description && (
            <div className="mt-3 text-sm text-gray-600 dark:text-gray-300">
              {event.description}
            </div>
          )}
          
          {event.photoUrl && (
            <div className="mt-3">
              <img 
                src={event.photoUrl} 
                alt={event.title} 
                className="w-full h-32 object-cover rounded-lg"
                onError={(e) => e.target.src = ''}
              />
            </div>
          )}
          
          {event.people && event.people.length > 0 && (
            <div className="mt-3 flex flex-wrap gap-1">
              {event.people.map((person, index) => (
                <span 
                  key={index}
                  className="px-2 py-0.5 bg-gray-100 dark:bg-gray-700 text-gray-700 
                           dark:text-gray-300 rounded-full text-xs"
                >
                  {person}
                </span>
              ))}
            </div>
          )}

          {event.importance && (
            <div className="mt-3 flex justify-end">
              <span 
                className={`w-2 h-2 rounded-full ${importanceBadge}`}
                title={`Ważność: ${
                  event.importance === 'high' ? 'Wysoka' : 
                  event.importance === 'medium' ? 'Średnia' : 'Niska'
                }`}
              ></span>
            </div>
          )}
        </div>
      </motion.div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <button
            onClick={onBack}
            className="flex items-center space-x-2 text-gray-600 dark:text-gray-400 
                     hover:text-gray-800 dark:hover:text-gray-200 transition-colors
                     px-3 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"
          >
            <Home className="w-5 h-5" />
            <span>Powrót</span>
          </button>
          
          <button
            onClick={() => setShowEventModal(true)}
            className="flex items-center space-x-2 px-5 py-2.5 bg-gradient-to-r from-blue-500 to-indigo-500 text-white 
                     rounded-lg hover:from-blue-600 hover:to-indigo-600 transition-colors shadow-md hover:shadow-lg"
          >
            <Plus className="w-5 h-5" />
            <span>Dodaj wydarzenie</span>
          </button>
        </div>

        {/* Title */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <Calendar className="w-16 h-16 mx-auto text-indigo-600 dark:text-indigo-400 mb-4" />
          <h1 className="text-4xl font-serif text-gray-800 dark:text-white mb-4">
            Kamienie Milowe Rodziny
          </h1>
          <p className="text-gray-600 dark:text-gray-300 text-lg">
            Odkryj historię ważnych wydarzeń Twojej rodziny
          </p>
        </motion.div>

        {/* Timeline */}
        {events.length > 0 ? (
          <div className="mb-12">
            {sortedYears.map(year => (
              <div key={year} className="mb-12">
                <div className="flex items-center mb-6">
                  <h2 className="text-3xl font-semibold text-gray-800 dark:text-white">{year}</h2>
                  <div className="ml-4 h-0.5 flex-1 bg-gray-200 dark:bg-gray-700"></div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {eventsByYear[year].map(event => (
                    <EventCard key={event.id} event={event} />
                  ))}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-center py-16"
          >
            <Clock className="w-24 h-24 mx-auto text-gray-300 dark:text-gray-600 mb-6" />
            <h2 className="text-2xl font-semibold text-gray-600 dark:text-gray-400 mb-4">
              Twoja oś czasu jest pusta
            </h2>
            <p className="text-gray-500 dark:text-gray-500 mb-4 max-w-md mx-auto">
              Dodaj ważne wydarzenia rodzinne, aby śledzić historię swojej rodziny
            </p>
            
            <div className="max-w-md mx-auto bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg mb-8 text-left">
              <h3 className="font-medium text-blue-800 dark:text-blue-300 mb-2">
                Pomysły na wydarzenia do dodania:
              </h3>
              <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-2">
                <li>• Narodziny członków rodziny</li>
                <li>• Ważne rocznice i uroczystości</li>
                <li>• Osiągnięcia edukacyjne i zawodowe</li>
                <li>• Ważne zmiany życiowe i przeprowadzki</li>
                <li>• Specjalne wspomnienia warte zachowania</li>
              </ul>
            </div>
            
            <button
              onClick={() => setShowEventModal(true)}
              className="inline-flex items-center space-x-2 px-6 py-3 bg-blue-500 text-white 
                       rounded-lg hover:bg-blue-600 transition-colors text-lg shadow-lg hover:shadow-xl"
            >
              <Plus className="w-5 h-5" />
              <span>Dodaj pierwsze wydarzenie</span>
            </button>
          </motion.div>
        )}
      </div>

      {/* Modals */}
      <AnimatePresence>
        {showEventModal && (
          <EventModal
            onSubmit={addEvent}
            onCancel={() => setShowEventModal(false)}
          />
        )}
        
        {editingEvent && (
          <EventModal
            event={editingEvent}
            onSubmit={(data) => editEvent(editingEvent.id, data)}
            onCancel={() => setEditingEvent(null)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

export default FamilyTimeline;
