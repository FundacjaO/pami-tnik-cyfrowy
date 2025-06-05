import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  TreeDeciduous, 
  Plus, 
  Edit2, 
  Save, 
  X, 
  Home, 
  Heart,
  Baby,
  Crown,
  ArrowDown,
  User,
  Leaf,
  Calendar,
  UserCircle,
  FileText,
  ChevronRight,
  ChevronLeft,
  ChevronUp,
  ChevronDown,
  Check,
  Users,
  MapPin,
  Image,
  Info
} from 'lucide-react';

export function FamilyTreeView({ onBack, theme }) {
  const [treeData, setTreeData] = useState(() => {
    const saved = localStorage.getItem('familyTreeData');
    return saved ? JSON.parse(saved) : {
      center: null, // ID osoby w centrum drzewa (zwykle "ja")
      members: {},
      relationships: {}, // Relacje małżeńskie/partnerskie
      generations: {} // Przypisanie do pokoleń
    };
  });
  
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingMember, setEditingMember] = useState(null);
  const [selectedParent, setSelectedParent] = useState(null);
  const [selectedPerson, setSelectedPerson] = useState(null); // Dla dodawania partnera
  const [addType, setAddType] = useState('child'); // 'child', 'parent', 'partner', 'sibling'
  const [expandedBranches, setExpandedBranches] = useState(new Set()); // Rozwinięte gałęzie
  const [viewMode, setViewMode] = useState('hierarchy'); // 'hierarchy', 'traditional', 'timeline'
  const [centerPerson, setCenterPerson] = useState(null); // Dla zmiany centrum drzewa

  // Zapisz do localStorage przy każdej zmianie
  useEffect(() => {
    localStorage.setItem('familyTreeData', JSON.stringify(treeData));
  }, [treeData]);
  // Dodaj nowego członka rodziny
  const addFamilyMember = (memberData) => {
    const id = Date.now().toString();
    const newMember = {
      id,
      ...memberData,
      children: [],
      parents: [],
      spouses: [],
      siblings: []
    };

    const newTreeData = { ...treeData };
    newTreeData.members[id] = newMember;

    // Logika dodawania według typu
    if (!treeData.center) {
      // Pierwszy członek - będzie centrum drzewa
      newTreeData.center = id;
      newTreeData.generations[id] = 0; // Pokolenie 0 (centrum)
    } else {
      switch (addType) {
        case 'child':
          if (selectedParent) {
            newTreeData.members[selectedParent].children.push(id);
            newMember.parents.push(selectedParent);
            const parentGeneration = newTreeData.generations[selectedParent] || 0;
            newTreeData.generations[id] = parentGeneration - 1; // Dzieci o generację niżej
          }
          break;
        case 'parent':
          if (selectedPerson) {
            newTreeData.members[selectedPerson].parents.push(id);
            newMember.children.push(selectedPerson);
            const childGeneration = newTreeData.generations[selectedPerson] || 0;
            newTreeData.generations[id] = childGeneration + 1; // Rodzice o generację wyżej
          }
          break;
        case 'spouse':
          if (selectedPerson) {
            newTreeData.members[selectedPerson].spouses.push(id);
            newMember.spouses.push(selectedPerson);
            newTreeData.relationships[`${selectedPerson}-${id}`] = 'married';
            const spouseGeneration = newTreeData.generations[selectedPerson] || 0;
            newTreeData.generations[id] = spouseGeneration; // To samo pokolenie
          }
          break;
        case 'sibling':
          if (selectedPerson) {
            newTreeData.members[selectedPerson].siblings.push(id);
            newMember.siblings.push(selectedPerson);
            const siblingGeneration = newTreeData.generations[selectedPerson] || 0;
            newTreeData.generations[id] = siblingGeneration; // To samo pokolenie
            
            // Dodaj wspólnych rodziców
            const parentIds = newTreeData.members[selectedPerson].parents;
            parentIds.forEach(parentId => {
              newTreeData.members[parentId].children.push(id);
              newMember.parents.push(parentId);
            });
          }
          break;
      }
    }

    setTreeData(newTreeData);
    setShowAddModal(false);
    setSelectedParent(null);
    setSelectedPerson(null);
    setAddType('child');
  };

  // Edytuj członka rodziny
  const editFamilyMember = (id, memberData) => {
    const newTreeData = { ...treeData };
    newTreeData.members[id] = {
      ...newTreeData.members[id],
      ...memberData
    };
    setTreeData(newTreeData);
    setEditingMember(null);
  };
  // Usuń członka rodziny (funkcja przygotowana na przyszłość)
  // const removeFamilyMember = (id) => {
  //   if (window.confirm('Czy na pewno chcesz usunąć tego członka rodziny?')) {
  //     const newTreeData = { ...treeData };
  //     const member = newTreeData.members[id];
      
  //     // Usuń z dzieci rodzica
  //     if (member.parent) {
  //       newTreeData.members[member.parent].children = 
  //         newTreeData.members[member.parent].children.filter(childId => childId !== id);
  //     }
      
  //     // Usuń dzieci (przepisz je do rodzica lub usuń całkowicie)
  //     member.children.forEach(childId => {
  //       if (member.parent) {
  //         newTreeData.members[childId].parent = member.parent;
  //         newTreeData.members[member.parent].children.push(childId);
  //       } else {
  //         removeFamilyMember(childId);
  //       }
  //     });
      
  //     delete newTreeData.members[id];
      
  //     if (newTreeData.root === id) {
  //       newTreeData.root = member.children[0] || null;
  //     }
      
  //     setTreeData(newTreeData);
  //   }
  // };
  // Funkcje pomocnicze dla hierarchicznego drzewa
  const getGenerationMembers = (generation) => {
    return Object.entries(treeData.generations)
      .filter(([_, gen]) => gen === generation)
      .map(([id, _]) => treeData.members[id])
      .filter(Boolean);
  };

  const getMaxGeneration = () => {
    if (!treeData.generations || Object.keys(treeData.generations).length === 0) return 0;
    return Math.max(...Object.values(treeData.generations));
  };

  const getMinGeneration = () => {
    if (!treeData.generations || Object.keys(treeData.generations).length === 0) return 0;
    return Math.min(...Object.values(treeData.generations));
  };

  const toggleBranch = (personId) => {
    const newExpanded = new Set(expandedBranches);
    if (newExpanded.has(personId)) {
      newExpanded.delete(personId);
    } else {
      newExpanded.add(personId);
    }
    setExpandedBranches(newExpanded);
  };

  // Komponent hierarchicznego drzewa
  const HierarchicalTree = () => {
    if (!treeData.center) return null;

    const maxGen = getMaxGeneration();
    const minGen = getMinGeneration();
    const generations = [];

    // Buduj generacje od najstarszej do najmłodszej
    for (let gen = maxGen; gen >= minGen; gen--) {
      generations.push(gen);
    }

    return (
      <div className="hierarchical-tree space-y-16">
        {generations.map(generation => {
          const members = getGenerationMembers(generation);
          if (members.length === 0) return null;

          const getGenerationTitle = (gen) => {
            if (gen === 0) return "Ty";
            if (gen === 1) return "Rodzice";
            if (gen === 2) return "Dziadkowie";
            if (gen === 3) return "Pradziadkowie";
            if (gen > 3) return `Pokolenie +${gen}`;
            if (gen === -1) return "Dzieci";
            if (gen === -2) return "Wnuki";
            if (gen === -3) return "Prawnuki";
            if (gen < -3) return `Pokolenie ${gen}`;
            return `Pokolenie ${gen}`;
          };

          return (
            <motion.div
              key={generation}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="generation-row"
            >
              {/* Tytuł generacji */}
              <div className="text-center mb-8">
                <h3 className={`text-lg font-semibold mb-2 ${
                  generation === 0 
                    ? 'text-blue-600 dark:text-blue-400 text-2xl' 
                    : 'text-gray-600 dark:text-gray-400'
                }`}>
                  {getGenerationTitle(generation)}
                </h3>
                <div className="w-24 h-1 bg-gradient-to-r from-transparent via-gray-300 to-transparent mx-auto"></div>
              </div>

              {/* Członkowie generacji */}
              <div className="flex flex-wrap justify-center gap-8">
                {members.map(member => (
                  <HierarchicalMemberCard 
                    key={member.id} 
                    member={member} 
                    generation={generation}
                    isCenter={member.id === treeData.center}
                  />
                ))}
              </div>

              {/* Linie łączące z następną generacją */}
              {generation > minGen && (
                <div className="flex justify-center mt-8">
                  <div className="w-px h-8 bg-gray-300 dark:bg-gray-600"></div>
                </div>
              )}
            </motion.div>
          );        })}
      </div>
    );
  };

  // Komponent karty członka w hierarchicznym widoku
  const HierarchicalMemberCard = ({ member, generation, isCenter }) => {
    const relationshipColor = getRelationshipColor(member.relationship);
    const isExpanded = expandedBranches.has(member.id);
    
    // Sprawdź czy ma dzieci/rodziców do pokazania
    const hasConnections = member.children?.length > 0 || member.parents?.length > 0 || member.spouses?.length > 0;
    
    return (
      <div className="relative">
        {/* Karta główna */}
        <motion.div
          className={`relative bg-white dark:bg-gray-800 rounded-xl shadow-lg p-4 min-w-[200px] max-w-[250px]
                   border-2 transition-all group cursor-pointer ${
                     isCenter 
                       ? 'border-blue-500 shadow-xl shadow-blue-200 dark:shadow-blue-900/50' 
                       : 'border-gray-200 dark:border-gray-700 hover:shadow-xl'
                   }`}
          whileHover={{ scale: 1.02 }}
          layout
        >
          {/* Badge centrum */}
          {isCenter && (
            <div className="absolute -top-2 -right-2 bg-blue-500 text-white text-xs px-2 py-1 rounded-full font-medium">
              Centrum
            </div>
          )}

          {/* Pasek górny z relacją */}
          <div className={`${relationshipColor} text-white rounded-lg px-3 py-2 mb-3 flex items-center justify-between`}>
            <div className="flex items-center space-x-2">
              {getRelationshipIcon(member.relationship)}
              <span className="text-sm font-medium capitalize">
                {member.relationship || (isCenter ? 'Ja' : 'Członek rodziny')}
              </span>
            </div>
            
            <div className="opacity-0 group-hover:opacity-100 transition-opacity flex space-x-1">
              <button
                onClick={() => setEditingMember(member)}
                className="p-1 hover:bg-white/20 rounded"
                aria-label="Edytuj"
              >
                <Edit2 className="w-3 h-3 text-white" />
              </button>
              {hasConnections && (
                <button
                  onClick={() => toggleBranch(member.id)}
                  className="p-1 hover:bg-white/20 rounded"
                  aria-label={isExpanded ? "Zwiń" : "Rozwiń"}
                >
                  {isExpanded ? (
                    <ChevronUp className="w-3 h-3 text-white" />
                  ) : (
                    <ChevronDown className="w-3 h-3 text-white" />
                  )}
                </button>
              )}
            </div>
          </div>

          {/* Zawartość karty */}
          <div className="flex items-start space-x-3">
            {/* Zdjęcie */}
            <div className="w-12 h-12 bg-gray-100 dark:bg-gray-700 rounded-lg flex-shrink-0 overflow-hidden flex items-center justify-center">
              {member.photoUrl ? (
                <img src={member.photoUrl} alt={member.name} className="w-full h-full object-cover" />
              ) : (
                <UserCircle className="w-8 h-8 text-gray-400" />
              )}
            </div>
            
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-gray-800 dark:text-white text-sm truncate">
                {member.name}
              </h3>

              {(member.birthYear || member.deathYear) && (
                <div className="text-xs text-gray-600 dark:text-gray-400 flex items-center space-x-1 mt-1">
                  <Calendar className="w-3 h-3 text-gray-400" />
                  <span>
                    {member.birthYear} {member.deathYear ? `- ${member.deathYear}` : member.isLiving !== false ? '- obecnie' : ''}
                  </span>
                </div>
              )}
              
              {member.additionalInfo?.occupation && (
                <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  {member.additionalInfo.occupation}
                </div>
              )}
            </div>
          </div>

          {/* Przyciski szybkich akcji */}
          <div className="mt-3 flex flex-wrap gap-1">
            <button
              onClick={() => {
                setSelectedPerson(member.id);
                setAddType('child');
                setShowAddModal(true);
              }}
              className="text-xs px-2 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 
                       rounded hover:bg-green-200 dark:hover:bg-green-900/50 transition-colors flex items-center space-x-1"
            >
              <Plus className="w-3 h-3" />
              <span>Dziecko</span>
            </button>
            
            <button
              onClick={() => {
                setSelectedPerson(member.id);
                setAddType('parent');
                setShowAddModal(true);
              }}
              className="text-xs px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 
                       rounded hover:bg-blue-200 dark:hover:bg-blue-900/50 transition-colors flex items-center space-x-1"
            >
              <Plus className="w-3 h-3" />
              <span>Rodzic</span>
            </button>
            
            <button
              onClick={() => {
                setSelectedPerson(member.id);
                setAddType('spouse');
                setShowAddModal(true);
              }}
              className="text-xs px-2 py-1 bg-pink-100 dark:bg-pink-900/30 text-pink-700 dark:text-pink-400 
                       rounded hover:bg-pink-200 dark:hover:bg-pink-900/50 transition-colors flex items-center space-x-1"
            >
              <Heart className="w-3 h-3" />
              <span>Partner</span>
            </button>
          </div>
        </motion.div>

        {/* Rozszerzone informacje */}
        <AnimatePresence>
          {isExpanded && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mt-2 bg-gray-50 dark:bg-gray-700/50 rounded-lg p-3 text-xs text-gray-600 dark:text-gray-400"
            >
              {member.spouses?.length > 0 && (
                <div className="mb-2">
                  <span className="font-medium">Partnerzy: </span>
                  {member.spouses.map(spouseId => treeData.members[spouseId]?.name).join(', ')}
                </div>
              )}
              
              {member.children?.length > 0 && (
                <div className="mb-2">
                  <span className="font-medium">Dzieci: </span>
                  {member.children.map(childId => treeData.members[childId]?.name).join(', ')}
                </div>
              )}
              
              {member.siblings?.length > 0 && (
                <div className="mb-2">
                  <span className="font-medium">Rodzeństwo: </span>
                  {member.siblings.map(siblingId => treeData.members[siblingId]?.name).join(', ')}
                </div>
              )}
              
              {member.description && (
                <div>
                  <span className="font-medium">Notatki: </span>
                  <p className="mt-1">{member.description}</p>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  };
  const relationshipColors = {
    'rodzic': 'bg-blue-500',
    'dziecko': 'bg-green-500',
    'rodzeństwo': 'bg-purple-500',
    'dziadek': 'bg-amber-500',
    'babcia': 'bg-amber-500',
    'wnuk': 'bg-emerald-500',
    'wnuczka': 'bg-emerald-500',
    'ciocia': 'bg-rose-500',
    'wujek': 'bg-rose-500',
    'kuzyn': 'bg-indigo-500',
    'małżonek': 'bg-pink-500',
    'małżonka': 'bg-pink-500',
    'teść': 'bg-cyan-500',
    'teściowa': 'bg-cyan-500',
    'zięć': 'bg-teal-500',
    'synowa': 'bg-teal-500',
    'default': 'bg-gray-500'
  };
    const getRelationshipColor = (relationship) => {
    if (!relationship) return relationshipColors.default;
    
    const lowerRelationship = relationship.toLowerCase();
    for (const [key, value] of Object.entries(relationshipColors)) {
      if (lowerRelationship.includes(key)) {
        return value;
      }
    }
    return relationshipColors.default;
  };

  // Funkcja do określania ikony na podstawie relacji
  const getRelationshipIcon = (relationship) => {
    if (!relationship) return <User className="w-5 h-5 text-gray-500" />;
    
    const lowerRelationship = relationship.toLowerCase();
    
    if (lowerRelationship.includes('dziadek') || lowerRelationship.includes('babcia')) {
      return <Crown className="w-5 h-5 text-amber-500" />;
    } else if (lowerRelationship.includes('rodzic') || lowerRelationship.includes('matka') || lowerRelationship.includes('ojciec')) {
      return <Users className="w-5 h-5 text-blue-500" />;
    } else if (lowerRelationship.includes('dziecko') || lowerRelationship.includes('syn') || lowerRelationship.includes('córka')) {
      return <Baby className="w-5 h-5 text-green-500" />;
    } else if (lowerRelationship.includes('małżon')) {
      return <Heart className="w-5 h-5 text-pink-500" />;
    } else if (lowerRelationship.includes('rodzeństwo') || lowerRelationship.includes('brat') || lowerRelationship.includes('siostra')) {
      return <Users className="w-5 h-5 text-purple-500" />;
    } else if (lowerRelationship.includes('kuzyn')) {
      return <User className="w-5 h-5 text-indigo-500" />;
    } else if (lowerRelationship.includes('ciocia') || lowerRelationship.includes('wujek')) {
      return <User className="w-5 h-5 text-rose-500" />;
    }
    
    return <User className="w-5 h-5 text-gray-500" />;
  };
    // Komponent formularza dodawania/edycji członka
  const MemberForm = ({ member, onSubmit, onCancel }) => {
    // Auto-ustaw relację na podstawie typu dodawania
    const getDefaultRelationship = () => {
      if (member) return member.relationship || '';
      
      switch (addType) {
        case 'parent':
          return 'rodzic';
        case 'child':
          return 'dziecko';
        case 'spouse':
          return 'małżonek';
        case 'sibling':
          return 'rodzeństwo';
        default:
          return '';
      }
    };

    const [formData, setFormData] = useState(member || {
      name: '',
      birthYear: '',
      deathYear: '',
      relationship: getDefaultRelationship(),
      description: '',
      isLiving: true,
      photoUrl: '',
      birthPlace: '',
      additionalInfo: {
        occupation: '',
        education: '',
        interests: '',
      }
    });
    
    // Krok formularza (strona)
    const [step, setStep] = useState(1);
    const totalSteps = 3;
    
    // Tytuły etapów
    const stepTitles = [
      "Dane podstawowe",
      "Informacje życiowe",
      "Dodatkowe szczegóły"
    ];
    
    // Ikony etapów
    const stepIcons = [
      <User className="w-5 h-5" />,
      <Calendar className="w-5 h-5" />,
      <FileText className="w-5 h-5" />
    ];
    
    const nextStep = () => {
      if (step === 1 && !formData.name.trim()) {
        // Wymagane pole imię i nazwisko
        return;
      }
      setStep(step + 1);
    };
    
    const prevStep = () => {
      setStep(step - 1);
    };
    
    const handleSubmit = (e) => {
      e.preventDefault();
      if (formData.name.trim()) {
        onSubmit(formData);
      }
    };
    
    const getStepColor = (stepNumber) => {
      if (stepNumber < step) return "text-blue-500 border-blue-500 bg-blue-50 dark:bg-blue-900/20";
      if (stepNumber === step) return "text-white border-blue-500 bg-blue-500";
      return "text-gray-500 border-gray-300 dark:border-gray-600 dark:text-gray-400";
    };

    return (
      <motion.div
        className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <motion.div
          className="bg-white dark:bg-gray-800 rounded-xl shadow-xl p-6 w-full max-w-2xl"
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
        >          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-semibold text-gray-800 dark:text-white">
              {member ? 'Edytuj członka rodziny' : 
               addType === 'child' ? 'Dodaj dziecko' :
               addType === 'parent' ? 'Dodaj rodzica' :
               addType === 'spouse' ? 'Dodaj partnera/małżonka' :
               addType === 'sibling' ? 'Dodaj rodzeństwo' :
               'Dodaj członka rodziny'}
            </h3>
            <button
              onClick={onCancel}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full"
              aria-label="Zamknij"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Informacja o typie dodawania */}
          {!member && addType !== 'child' && selectedPerson && treeData.members[selectedPerson] && (
            <div className="mb-4 p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
              <div className="flex items-center space-x-2 text-blue-800 dark:text-blue-300">
                <Info className="w-4 h-4" />
                <span className="text-sm">
                  {addType === 'parent' && `Dodajesz rodzica dla: ${treeData.members[selectedPerson].name}`}
                  {addType === 'spouse' && `Dodajesz partnera dla: ${treeData.members[selectedPerson].name}`}
                  {addType === 'sibling' && `Dodajesz rodzeństwo dla: ${treeData.members[selectedPerson].name}`}
                </span>
              </div>
            </div>
          )}
          
          {/* Etapy formularza */}
          <div className="flex items-center justify-center mb-8">
            {[1, 2, 3].map((number) => (
              <div key={number} className="flex items-center">
                <div 
                  className={`w-10 h-10 rounded-full border-2 flex items-center justify-center font-medium transition-all ${getStepColor(number)}`}
                >
                  {step > number ? <Check className="w-5 h-5" /> : stepIcons[number-1]}
                </div>
                
                {/* Linie łączące etapy */}
                {number < 3 && (
                  <div className={`w-12 h-1 ${step > number ? "bg-blue-500" : "bg-gray-300 dark:bg-gray-600"}`} />
                )}
              </div>
            ))}
          </div>
          
          <h4 className="text-center text-lg font-medium text-gray-700 dark:text-gray-300 mb-6">
            {stepTitles[step-1]}
          </h4>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Krok 1: Dane podstawowe */}
            {step === 1 && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-4"
              >
                <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-5 border-l-4 border-blue-500">
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Imię i nazwisko <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 
                               rounded-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Relacja/Stopień pokrewieństwa
                    </label>
                    <select
                      value={formData.relationship}
                      onChange={(e) => setFormData({...formData, relationship: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 
                               rounded-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200"
                    >
                      <option value="">Wybierz relację...</option>
                      <option value="rodzic">Rodzic</option>
                      <option value="dziecko">Dziecko</option>
                      <option value="rodzeństwo">Rodzeństwo</option>
                      <option value="dziadek">Dziadek</option>
                      <option value="babcia">Babcia</option>
                      <option value="wnuk">Wnuk</option>
                      <option value="wnuczka">Wnuczka</option>
                      <option value="ciocia">Ciocia</option>
                      <option value="wujek">Wujek</option>
                      <option value="kuzyn">Kuzyn/Kuzynka</option>
                      <option value="małżonek">Małżonek</option>
                      <option value="małżonka">Małżonka</option>
                      <option value="teść">Teść</option>
                      <option value="teściowa">Teściowa</option>
                      <option value="zięć">Zięć</option>
                      <option value="synowa">Synowa</option>
                      <option value="inny">Inny</option>
                    </select>
                    
                    {formData.relationship === 'inny' && (
                      <input
                        type="text"
                        value={formData.customRelationship || ''}
                        onChange={(e) => setFormData({...formData, customRelationship: e.target.value})}
                        placeholder="Określ relację..."
                        className="w-full mt-2 px-3 py-2 border border-gray-300 dark:border-gray-600 
                                 rounded-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200"
                      />
                    )}
                  </div>
                </div>
                
                <div className="bg-purple-50 dark:bg-purple-900/20 rounded-lg p-5 border-l-4 border-purple-500">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Adres URL zdjęcia (opcjonalnie)
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
              </motion.div>
            )}
            
            {/* Krok 2: Informacje życiowe */}
            {step === 2 && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-4"
              >
                <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-5 border-l-4 border-green-500">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Rok urodzenia
                      </label>
                      <input
                        type="number"
                        value={formData.birthYear}
                        onChange={(e) => setFormData({...formData, birthYear: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 
                                 rounded-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Rok śmierci
                      </label>
                      <input
                        type="number"
                        value={formData.deathYear}
                        onChange={(e) => setFormData({...formData, deathYear: e.target.value, isLiving: !e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 
                                 rounded-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200"
                      />
                    </div>
                  </div>
                </div>
                
                <div className="bg-amber-50 dark:bg-amber-900/20 rounded-lg p-5 border-l-4 border-amber-500">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Miejsce urodzenia
                    </label>
                    <div className="flex items-center space-x-2">
                      <MapPin className="w-5 h-5 text-gray-400" />
                      <input
                        type="text"
                        value={formData.birthPlace || ''}
                        onChange={(e) => setFormData({...formData, birthPlace: e.target.value})}
                        placeholder="np. Warszawa, Polska"
                        className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 
                                 rounded-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200"
                      />
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
            
            {/* Krok 3: Dodatkowe informacje */}
            {step === 3 && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-4"
              >
                <div className="bg-indigo-50 dark:bg-indigo-900/20 rounded-lg p-5 border-l-4 border-indigo-500">
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Zawód
                      </label>
                      <input
                        type="text"
                        value={formData.additionalInfo?.occupation || ''}
                        onChange={(e) => setFormData({
                          ...formData, 
                          additionalInfo: {...formData.additionalInfo, occupation: e.target.value}
                        })}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 
                                 rounded-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Wykształcenie
                      </label>
                      <input
                        type="text"
                        value={formData.additionalInfo?.education || ''}
                        onChange={(e) => setFormData({
                          ...formData, 
                          additionalInfo: {...formData.additionalInfo, education: e.target.value}
                        })}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 
                                 rounded-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Zainteresowania
                      </label>
                      <input
                        type="text"
                        value={formData.additionalInfo?.interests || ''}
                        onChange={(e) => setFormData({
                          ...formData, 
                          additionalInfo: {...formData.additionalInfo, interests: e.target.value}
                        })}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 
                                 rounded-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200"
                      />
                    </div>
                  </div>
                </div>
                
                <div className="bg-rose-50 dark:bg-rose-900/20 rounded-lg p-5 border-l-4 border-rose-500">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Opis/Notatki
                    </label>
                    <div className="flex items-center space-x-2 mb-1">
                      <Info className="w-4 h-4 text-gray-400" />
                      <span className="text-xs text-gray-500">Tutaj możesz dodać dodatkowe informacje, wspomnienia, anegdoty...</span>
                    </div>
                    <textarea
                      value={formData.description}
                      onChange={(e) => setFormData({...formData, description: e.target.value})}
                      placeholder="Krótki opis, wspomnienia, ważne informacje..."
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 
                               rounded-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 
                               min-h-[100px] resize-none"
                    />
                  </div>
                </div>
              </motion.div>
            )}

            {/* Przyciski nawigacyjne */}
            <div className="flex justify-between items-center pt-4">
              <button
                type="button"
                onClick={step === 1 ? onCancel : prevStep}
                className="flex items-center space-x-1 py-2 px-4 border border-gray-300 
                         dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg 
                         hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              >
                <ChevronLeft className="w-4 h-4" />
                <span>{step === 1 ? 'Anuluj' : 'Wstecz'}</span>
              </button>
              
              {step < totalSteps ? (
                <button
                  type="button"
                  onClick={nextStep}
                  className="flex items-center space-x-1 py-2 px-4 bg-blue-500 
                           text-white rounded-lg hover:bg-blue-600 transition-colors"
                >
                  <span>Dalej</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              ) : (
                <button
                  type="submit"
                  className="flex items-center space-x-1 py-2 px-4 bg-green-500 
                           text-white rounded-lg hover:bg-green-600 transition-colors"
                >
                  <Save className="w-4 h-4" />
                  <span>{member ? 'Zapisz zmiany' : 'Dodaj członka'}</span>
                </button>
              )}
            </div>
          </form>
        </motion.div>
      </motion.div>
    );
  };
  // Komponent karty członka rodziny
  const MemberCard = ({ member, level = 0 }) => {
    const hasChildren = member.children && member.children.length > 0;
    const relationshipColor = getRelationshipColor(member.relationship);
    const colorClass = relationshipColor.replace('bg-', 'border-');
    
    // Funkcja do określania ikony na podstawie relacji
    const getRelationshipIcon = (relationship) => {
      if (!relationship) return <User className="w-5 h-5 text-gray-500" />;
      
      const lowerRelationship = relationship.toLowerCase();
      
      if (lowerRelationship.includes('dziadek') || lowerRelationship.includes('babcia')) {
        return <Crown className="w-5 h-5 text-amber-500" />;
      } else if (lowerRelationship.includes('rodzic') || lowerRelationship.includes('matka') || lowerRelationship.includes('ojciec')) {
        return <Users className="w-5 h-5 text-blue-500" />;
      } else if (lowerRelationship.includes('dziecko') || lowerRelationship.includes('syn') || lowerRelationship.includes('córka')) {
        return <Baby className="w-5 h-5 text-green-500" />;
      } else if (lowerRelationship.includes('małżon')) {
        return <Heart className="w-5 h-5 text-pink-500" />;
      } else if (lowerRelationship.includes('rodzeństwo') || lowerRelationship.includes('brat') || lowerRelationship.includes('siostra')) {
        return <Users className="w-5 h-5 text-purple-500" />;
      } else if (lowerRelationship.includes('kuzyn')) {
        return <User className="w-5 h-5 text-indigo-500" />;
      } else if (lowerRelationship.includes('ciocia') || lowerRelationship.includes('wujek')) {
        return <User className="w-5 h-5 text-rose-500" />;
      }
      
      return <User className="w-5 h-5 text-gray-500" />;
    };
    
    return (
      <div className="flex flex-col items-center">
        {/* Karta członka */}
        <motion.div
          className={`bg-white dark:bg-gray-800 rounded-xl shadow-lg p-4 min-w-[220px]
                   border-l-4 ${colorClass} hover:shadow-xl
                   transition-all group cursor-pointer`}
          whileHover={{ scale: 1.02 }}
          layout
        >
          {/* Pasek górny z relacją */}
          <div className={`${relationshipColor} text-white rounded-t-lg px-3 py-1 -mx-4 -mt-4 mb-3 flex items-center justify-between`}>
            <div className="flex items-center space-x-2">
              {getRelationshipIcon(member.relationship)}
              <span className="text-xs font-medium capitalize">
                {member.relationship || 'Członek rodziny'}
              </span>
            </div>
            
            <div className="opacity-0 group-hover:opacity-100 transition-opacity">
              <button
                onClick={() => setEditingMember(member)}
                className="p-1 hover:bg-white/20 rounded"
                aria-label="Edytuj"
              >
                <Edit2 className="w-4 h-4 text-white" />
              </button>
            </div>
          </div>

          {/* Zawartość karty */}
          <div className="flex items-start space-x-3">
            {/* Zdjęcie członka rodziny */}
            <div className="w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-lg flex-shrink-0 overflow-hidden flex items-center justify-center">
              {member.photoUrl ? (
                <img src={member.photoUrl} alt={member.name} className="w-full h-full object-cover" />
              ) : (
                <UserCircle className="w-12 h-12 text-gray-400" />
              )}
            </div>
            
            <div className="flex-1">
              <h3 className="font-semibold text-gray-800 dark:text-white mb-1">
                {member.name}
              </h3>

              {(member.birthYear || member.deathYear) && (
                <div className="text-sm text-gray-600 dark:text-gray-400 flex items-center space-x-1 mb-1">
                  <Calendar className="w-3.5 h-3.5 text-gray-400" />
                  <span>
                    {member.birthYear} {member.deathYear ? `- ${member.deathYear}` : member.isLiving !== false ? '- obecnie' : ''}
                  </span>
                </div>
              )}
              
              {member.birthPlace && (
                <div className="text-sm text-gray-600 dark:text-gray-400 flex items-center space-x-1 mb-1">
                  <MapPin className="w-3.5 h-3.5 text-gray-400" />
                  <span>{member.birthPlace}</span>
                </div>
              )}
            </div>
          </div>
          
          {/* Dodatkowe informacje */}
          <div className="mt-3">
            {member.additionalInfo?.occupation && (
              <div className="text-xs text-gray-600 dark:text-gray-400 mb-1">
                <span className="font-medium">Zawód:</span> {member.additionalInfo.occupation}
              </div>
            )}
            
            {member.description && (
              <div className="mt-2 text-xs text-gray-500 dark:text-gray-400 line-clamp-2 bg-gray-50 dark:bg-gray-700/50 p-2 rounded border border-gray-100 dark:border-gray-700">
                {member.description}
              </div>
            )}
          </div>

          {/* Przycisk dodania dziecka */}
          <motion.button
            onClick={() => {
              setSelectedParent(member.id);
              setShowAddModal(true);
            }}
            className="w-full mt-3 py-2 border border-dashed border-gray-300 dark:border-gray-600 
                     rounded-lg text-gray-600 dark:text-gray-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 
                     hover:border-blue-400 hover:text-blue-500 transition-colors 
                     flex items-center justify-center space-x-2"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Plus className="w-4 h-4" />
            <span className="text-xs">Dodaj dziecko</span>
          </motion.button>
        </motion.div>

        {/* Linia łącząca z dziećmi */}
        {hasChildren && (
          <div className="flex flex-col items-center mt-4">
            <div className="w-px h-8 bg-gray-300 dark:bg-gray-600"></div>
            <ArrowDown className="w-4 h-4 text-gray-400" />
            
            {/* Dzieci */}
            <div className="flex flex-wrap justify-center gap-8 mt-8">
              {member.children.map(childId => {
                const child = treeData.members[childId];
                return child ? (
                  <MemberCard key={childId} member={child} level={level + 1} />
                ) : null;
              })}
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-4 md:p-8 pb-24">
      <div className="max-w-7xl mx-auto">        {/* Header */}
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
            onClick={() => {
              setAddType('child');
              setSelectedPerson(null);
              setSelectedParent(null);
              setShowAddModal(true);
            }}
            className="flex items-center space-x-2 px-5 py-2.5 bg-gradient-to-r from-green-500 to-teal-500 text-white 
                     rounded-lg hover:from-green-600 hover:to-teal-600 transition-colors shadow-md hover:shadow-lg"
          >
            <Plus className="w-5 h-5" />
            <span>Dodaj członka rodziny</span>
          </button>
        </div>

        {/* Title */}          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <TreeDeciduous className="w-16 h-16 mx-auto text-green-600 dark:text-green-400 mb-4" />
            <h1 className="text-4xl font-serif text-gray-800 dark:text-white mb-4">
              Drzewo Genealogiczne
            </h1>
            <p className="text-gray-600 dark:text-gray-300 text-lg">
              Tworzenie i zarządzanie historią rodziny
            </p>
          </motion.div>        {/* View Mode Selector */}
        {Object.keys(treeData.members).length > 0 && (
          <div className="flex justify-center mb-8">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-1 flex">
              <button
                onClick={() => setViewMode('hierarchy')}
                className={`px-4 py-2 rounded-lg transition-colors ${
                  viewMode === 'hierarchy' 
                    ? 'bg-blue-500 text-white' 
                    : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
                }`}
              >
                Hierarchiczny
              </button>
              <button
                onClick={() => setViewMode('traditional')}
                className={`px-4 py-2 rounded-lg transition-colors ${
                  viewMode === 'traditional' 
                    ? 'bg-blue-500 text-white' 
                    : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
                }`}
              >
                Tradycyjny
              </button>
            </div>
          </div>
        )}

        {/* Tree Visualization */}
        {treeData.center ? (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="flex justify-center"
          >
            <div className="overflow-x-auto pb-8 w-full">
              {viewMode === 'hierarchy' ? (
                <HierarchicalTree />
              ) : (
                <div className="flex justify-center">
                  <MemberCard member={treeData.members[treeData.center]} />
                </div>
              )}
            </div>
          </motion.div>
        ) : (<motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-center py-16"
          >
            <TreeDeciduous className="w-24 h-24 mx-auto text-gray-300 dark:text-gray-600 mb-6" />
            <h2 className="text-2xl font-semibold text-gray-600 dark:text-gray-400 mb-4">
              Twoje drzewo genealogiczne jest puste
            </h2>
            <p className="text-gray-500 dark:text-gray-500 mb-4 max-w-md mx-auto">
              Rozpocznij od dodania pierwszego członka rodziny - siebie lub kogoś bliskiego
            </p>
            
            <div className="max-w-md mx-auto bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg mb-8 text-left">
              <h3 className="font-medium text-blue-800 dark:text-blue-300 mb-2 flex items-center">
                <Info className="w-5 h-5 mr-2" />
                Wskazówki
              </h3>
              <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-2">
                <li className="flex items-start">
                  <Check className="w-4 h-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                  <span>Zacznij od dodania siebie lub najstarszego członka rodziny jako głównej osoby</span>
                </li>
                <li className="flex items-start">
                  <Check className="w-4 h-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                  <span>Następnie możesz dodawać dzieci dla każdej osoby, budując swoje drzewo w dół</span>
                </li>
                <li className="flex items-start">
                  <Check className="w-4 h-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                  <span>Możesz dodać zdjęcia, daty urodzenia i inne szczegóły, aby wzbogacić historię rodziny</span>
                </li>
              </ul>
            </div>
              <button
              onClick={() => {
                setAddType('child');
                setSelectedPerson(null);
                setSelectedParent(null);
                setShowAddModal(true);
              }}
              className="inline-flex items-center space-x-2 px-6 py-3 bg-green-500 text-white 
                       rounded-lg hover:bg-green-600 transition-colors text-lg shadow-lg hover:shadow-xl"
            >
              <Plus className="w-5 h-5" />
              <span>Dodaj pierwszego członka</span>
            </button>
          </motion.div>
        )}        {/* Statistics */}
        {Object.keys(treeData.members).length > 0 && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6"
          >
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 text-center shadow-lg border-t-4 border-blue-500">
              <Users className="w-8 h-8 mx-auto text-blue-500 mb-2" />
              <div className="text-3xl font-bold text-blue-600 dark:text-blue-400">
                {Object.keys(treeData.members).length}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                Członków rodziny
              </div>
            </div>
            
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 text-center shadow-lg border-t-4 border-green-500">
              <Heart className="w-8 h-8 mx-auto text-green-500 mb-2" />
              <div className="text-3xl font-bold text-green-600 dark:text-green-400">
                {Object.values(treeData.members).filter(m => m.isLiving !== false).length}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                Żyjących obecnie
              </div>
            </div>
            
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 text-center shadow-lg border-t-4 border-purple-500">
              <Crown className="w-8 h-8 mx-auto text-purple-500 mb-2" />
              <div className="text-3xl font-bold text-purple-600 dark:text-purple-400">
                {Math.max(...Object.values(treeData.members).map(m => 
                  m.children ? m.children.length : 0
                ), 0)}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                Największa rodzina
              </div>
            </div>
          </motion.div>
        )}
      </div>

      {/* Modals */}
      <AnimatePresence>        {showAddModal && (
          <MemberForm
            onSubmit={addFamilyMember}
            onCancel={() => {
              setShowAddModal(false);
              setSelectedParent(null);
              setSelectedPerson(null);
              setAddType('child');
            }}
          />
        )}
        
        {editingMember && (
          <MemberForm
            member={editingMember}
            onSubmit={(data) => editFamilyMember(editingMember.id, data)}
            onCancel={() => setEditingMember(null)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

export default FamilyTreeView;
