import { useState, useEffect } from 'react';
import { BookOpen, Heart, Save, Home, ChevronLeft, ChevronRight, Download, Settings as SettingsIcon, MoreHorizontal, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import './App.css';
import Settings from './components/Settings';

const chapters = [
  {
    id: 1,
    title: "Korzenie",
    subtitle: "Dzieciństwo i Dom Rodzinny (0-12 lat)",
    color: "from-amber-100 to-orange-100",
    questions: [
      "Gdzie i kiedy się urodziłaś/eś?",
      "Jak wyglądał Twój dom rodzinny?",
      "Kto mieszkał z Tobą w domu?",
      "Jakie masz najstarsze wspomnienie?",
      "Co najbardziej lubiłaś/eś robić jako dziecko?",
      "Kto był Twoim najlepszym przyjacielem?",
      "Jakie zabawy najbardziej Ci się podobały?",
      "Jakie potrawy lubiłaś/eś jeść w dzieciństwie?",
      "Jak wspominasz swoje rodzeństwo?",
      "Czy miałaś/eś ulubioną książkę lub bajkę?",
      "Jak wyglądały Twoje święta i uroczystości rodzinne?",
      "Czy pamiętasz jakieś szczególne wydarzenie z dzieciństwa?",
      "Jakie wartości wyniosłaś/eś z domu rodzinnego?",
      "Kto był Twoim wzorem lub autorytetem?",
      "Jak opisałabyś/byś swoją rodzinę jednym zdaniem?"
    ]
  },
  {
    id: 2,
    title: "Pąki",
    subtitle: "Nastoletnie lata (13-19 lat)",
    color: "from-green-100 to-emerald-100",
    questions: [
      "Jak wyglądała Twoja szkoła i klasa?",
      "Kim były Twoje największe przyjaciółki/przyjaciele?",
      "Co najbardziej lubiłaś/eś robić w wolnym czasie?",
      "Jakie były Twoje największe marzenia jako nastolatka/nastolatek?",
      "Czy pamiętasz pierwszą zakochaną osobę?",
      "Jak radziłaś/eś sobie z trudnościami w tym wieku?",
      "Jakie były Twoje ulubione przedmioty szkolne?",
      "Co najbardziej Cię inspirowało?",
      "Czy miałaś/eś jakiś talent lub hobby?",
      "Jak spędzałaś/eś wakacje nastoletnie?",
      "Czy pamiętasz jakieś ważne wydarzenie z tego okresu?",
      "Co chciałaś/eś osiągnąć, gdy dorośniesz?",
      "Jakie wartości były dla Ciebie ważne wtedy?",
      "Jakie były Twoje relacje z rodzicami w tym czasie?",
      "Co chciałabyś/byś powiedzieć swojej nastoletniej wersji?"
    ]
  },
  {
    id: 3,
    title: "Serce",
    subtitle: "Miłość i Związki (18-30 lat)",
    color: "from-rose-100 to-pink-100",
    questions: [
      "Jak poznałaś/eś pierwszą miłość?",
      "Co dla Ciebie znaczyła miłość w tym czasie?",
      "Jakie były Twoje ulubione sposoby spędzania czasu z partnerem/partnerką?",
      "Jak wspominasz pierwsze rozstanie?",
      "Czy miałaś/eś jakiś wyjątkowy moment związkowy?",
      "Co nauczyłaś/eś się dzięki swoim relacjom?",
      "Jak opisałabyś/byś swoje ideały miłości wtedy?",
      "Czy pamiętasz swoje pierwsze wspólne wakacje?",
      "Jak radziłaś/eś sobie z konfliktami w związku?",
      "Co było dla Ciebie najważniejsze w partnerze/partnerce?",
      "Jak wyglądały Twoje relacje z rodziną partnera/partnerki?",
      "Czy pamiętasz jakieś zabawne lub wzruszające wydarzenie?",
      "Jakie są Twoje ulubione wspomnienia z tamtego okresu?",
      "Jakie rady dałabyś/byś młodszym osobom o miłości?",
      "Jakie wartości chciałaś/eś przekazać w swoich relacjach?"
    ]
  },
  {
    id: 4,
    title: "Marzenia",
    subtitle: "Cele i Aspiracje (20-35 lat)",
    color: "from-purple-100 to-violet-100",
    questions: [
      "Jakie marzenia miałaś/eś jako młoda/y dorosła/y?",
      "Czy pamiętasz swoje pierwsze plany na przyszłość?",
      "Co sprawiało, że czułaś/eś się pełna/en energii i pasji?",
      "Jakie wyzwania napotkałaś/eś na drodze do swoich celów?",
      "Kto Cię wspierał w realizacji marzeń?",
      "Czy była jakaś decyzja, którą szczególnie zapamiętałaś/eś?",
      "Jakie umiejętności chciałaś/eś zdobyć?",
      "Jakie role zawodowe lub społeczne Cię interesowały?",
      "Co zrealizowałaś/eś z tych planów?",
      "Jakie były Twoje największe sukcesy?",
      "Co Cię motywowało, gdy było trudno?",
      "Czy miałaś/eś wzór do naśladowania?",
      "Jakie rady dałabyś/byś osobie marzącej o podobnych celach?",
      "Czy marzenia się zmieniły z biegiem lat?",
      "Co teraz uważasz za najważniejsze?"
    ]
  },
  {
    id: 5,
    title: "Macierzyństwo",
    subtitle: "Zostanie Rodzicem (25-45 lat)",
    color: "from-pink-100 to-fuchsia-100",
    questions: [
      "Jak dowiedziałaś/eś się o ciąży/zostaniu rodzicem?",
      "Jakie były Twoje pierwsze emocje jako rodzic?",
      "Jak wyglądał dzień narodzin dziecka?",
      "Co było dla Ciebie najtrudniejsze w rodzicielstwie?",
      "Jak wspominasz pierwsze chwile z dzieckiem?",
      "Co najbardziej lubiłaś/eś robić z dzieckiem?",
      "Jakie rytuały tworzyłaś/eś z rodziną?",
      "Czy pamiętasz jakieś zabawne lub wzruszające momenty?",
      "Jakie były Twoje największe obawy?",
      "Jak radziłaś/eś sobie z trudnościami?",
      "Co nauczyło Cię rodzicielstwo?",
      "Jak zmieniło się Twoje życie?",
      "Co chciałabyś/byś przekazać swojemu dziecku?",
      "Jak opisałabyś/byś swoje relacje rodzinne?",
      "Co jest dla Ciebie najważniejsze w roli rodzica?"
    ]
  },
  {
    id: 6,
    title: "Codzienność",
    subtitle: "Życie Rodzinne i Praca (30-50 lat)",
    color: "from-yellow-100 to-amber-100",
    questions: [
      "Jak wyglądał Twój typowy dzień?",
      "Co najbardziej lubiłaś/eś robić dla siebie?",
      "Jak spędzałaś/eś czas z rodziną?",
      "Jak radziłaś/eś sobie z obowiązkami?",
      "Czy miałaś/eś swoje rytuały lub hobby?",
      "Jakie wydarzenie szczególnie utkwiło Ci w pamięci?",
      "Co dawało Ci radość w codziennym życiu?",
      "Jak wyglądała Twoja praca?",
      "Jak łączyłaś/eś życie zawodowe z prywatnym?",
      "Czy pamiętasz jakieś ważne decyzje z tego okresu?",
      "Co było dla Ciebie wsparciem?",
      "Jakie relacje pielęgnowałaś/eś?",
      "Co Cię najbardziej zaskoczyło w tym czasie?",
      "Jakie marzenia spełniłaś/eś?",
      "Co chciałabyś/byś zrobić inaczej?"
    ]
  },
  {
    id: 7,
    title: "Cienie",
    subtitle: "Wyzwania i Trudne Chwile",
    color: "from-slate-100 to-gray-100",
    questions: [
      "Jakie trudności najbardziej Cię ukształtowały?",
      "Jak radziłaś/eś sobie z przeciwnościami?",
      "Czy była sytuacja, która zmieniła Twoje życie?",
      "Jakie wsparcie Ci pomogło?",
      "Co nauczyłaś/eś się dzięki trudnościom?",
      "Jak zmieniłaś/eś się po tych doświadczeniach?",
      "Czy pamiętasz moment przełomu?",
      "Co dało Ci siłę, by iść dalej?",
      "Jak patrzysz teraz na te chwile?",
      "Czy masz swoje sposoby na radzenie sobie z trudnościami?",
      "Co chciałabyś/byś powiedzieć osobom w podobnej sytuacji?",
      "Jakie wartości pomogły Ci przetrwać?",
      "Czy potrafisz wskazać, co było najtrudniejsze?",
      "Jakie lekcje z tych doświadczeń przekazujesz innym?",
      "Co teraz uważasz za swój największy sukces mimo trudności?"
    ]
  },
  {
    id: 8,
    title: "Wdzięczność",
    subtitle: "Ludzie i Doświadczenia (50+ lat)",
    color: "from-lime-100 to-green-100",
    questions: [
      "Za co czujesz największą wdzięczność w życiu?",
      "Jakie osoby najbardziej Ci pomogły?",
      "Jakie chwile uważasz za najpiękniejsze?",
      "Co było dla Ciebie darem?",
      "Jak wyrażasz wdzięczność na co dzień?",
      "Kto Cię najbardziej inspiruje?",
      "Za co chciałabyś/byś podziękować rodzinie?",
      "Kto Cię najbardziej inspiruje?",
      "Za co chciałabyś/byś podziękować rodzinie?",
      "Jakie miejsce jest dla Ciebie szczególne?",
      "Co nauczyło Cię bycia wdzięczną/ym?",
      "Jakie wartości są dla Ciebie ważne dzięki wdzięczności?",
      "Jakie wydarzenia przypominają Ci o szczęściu?",
      "Jakie doświadczenia chciałabyś/byś zatrzymać na zawsze?",
      "Co byś powiedziała/powiedział młodszym pokoleniom o wdzięczności?",
      "Jakie drobne rzeczy dają Ci radość?",
      "Co czyni Twoje życie pełnym?"
    ]
  },
  {
    id: 9,
    title: "Korzenie Rodziny",
    subtitle: "Dziedzictwo Przodków",
    color: "from-orange-100 to-amber-100",
    questions: [
      "Kim byli Twoi rodzice?",
      "Jakie wartości przekazali Ci rodzice?",
      "Co pamiętasz o dziadkach?",
      "Jakie rodzinne tradycje pielęgnujesz?",
      "Jakie historie rodzinne chcesz zachować?",
      "Czego nauczyłaś/eś się od przodków?",
      "Jak wyglądały relacje w rodzinie?",
      "Czy znasz rodzinne zwyczaje?",
      "Co chcesz przekazać następnym pokoleniom?",
      "Jakie wydarzenia rodzinne są dla Ciebie ważne?",
      "Jak wspominasz swoje korzenie?",
      "Co cenisz w historii swojej rodziny?",
      "Jakie wartości są dla Ciebie spuścizną rodzinną?",
      "Jak dbasz o pamięć rodziny?",
      "Jak chcesz być zapamiętana/y przez potomków?"
    ]
  },
  {
    id: 10,
    title: "Dziedzictwo",
    subtitle: "Przesłanie dla Przyszłych Pokoleń (60+ lat)",
    color: "from-indigo-100 to-blue-100",
    questions: [
      "Jakie wartości są dla Ciebie najważniejsze?",
      "Co chciałabyś/byś przekazać przyszłym pokoleniom?",
      "Jakie są Twoje życzenia dla rodziny?",
      "Jak chciałabyś/byś być zapamiętana/y?",
      "Co uważasz za swój największy dorobek?",
      "Jakie przesłanie zostawiasz światu?",
      "Co sprawia, że czujesz się spełniona/y?",
      "Jakie momenty życia chcesz zachować w pamięci?",
      "Co uważasz za swoją misję?",
      "Jakie rady dałabyś/byś młodym?",
      "Co chcesz jeszcze zrobić lub powiedzieć?",
      "Jak widzisz swoją rolę w historii rodziny?",
      "Co jest dla Ciebie najważniejsze na tym etapie życia?",
      "Jak wyrażasz miłość do bliskich?",
      "Co daje Ci nadzieję i siłę?"
    ]
  }
];

// Dodaj do timelineIcons
const timelineIcons = {
  "Korzenie": "🌱",
  "Pąki": "🌿",
  "Serce": "❤️",
  "Marzenia": "✨",
  "Macierzyństwo": "👩‍👧",
  "Codzienność": "🌸",
  "Cienie": "🌑",
  "Wdzięczność": "🙏",
  "Korzenie Rodziny": "🌳",
  "Dziedzictwo": "🕊️",
  "Kalendarz": "📅"
};

// Dodaj do chapterQuotes
const chapterQuotes = {
  "Korzenie": "Każde dziecko nosi w sobie świat pełen marzeń.",
  "Pąki": "To, kim jesteś, zaczyna się od tego, w co wierzysz.",
  "Serce": "Miłość to najpiękniejsza podróż, na którą można się wybrać.",
  "Marzenia": "Nigdy nie rezygnuj z marzeń, bo one kształtują przyszłość.",
  "Macierzyństwo": "Macierzyństwo to serce domu i źródło bezwarunkowej miłości.",
  "Codzienność": "W zwykłych chwilach kryje się niezwykłe piękno życia.",
  "Cienie": "Siła człowieka mierzy się przez wyzwania, które pokonuje.",
  "Wdzięczność": "Mądrość to umiejętność słuchania serca i rozumu jednocześnie.",
  "Korzenie Rodziny": "Historia rodziny to opowieść pisana miłością pokoleń.",
  "Dziedzictwo": "Prawdziwe dziedzictwo zostaje w sercach tych, którzy nas kochają.",
  "Kalendarz": "Planowanie to pierwszy krok do tworzenia wspomnień."
};

const themes = {
  classic: {
    name: 'Klasyczny',
    description: 'Elegancki i ponadczasowy',
    welcome: 'from-amber-50 to-amber-100',
    buttons: 'from-amber-500 to-amber-600',
    accent: 'amber',
    cardStyle: 'border-amber-100',
    iconStyle: 'text-amber-600',
    quoteStyle: 'text-amber-800',
    font: 'font-serif'
  },
  modern: {
    name: 'Nowoczesny',
    description: 'Minimalistyczny i świeży',
    welcome: 'from-blue-50 to-indigo-100',
    buttons: 'from-blue-500 to-indigo-600',
    accent: 'blue',
    cardStyle: 'border-blue-100',
    iconStyle: 'text-blue-600',
    quoteStyle: 'text-blue-800',
    font: 'font-sans'
  },
  retro: {
    name: 'Retro',
    description: 'Nostalgiczny i ciepły',
    welcome: 'from-rose-50 to-rose-100',
    buttons: 'from-rose-500 to-rose-600',
    accent: 'rose',
    cardStyle: 'border-rose-100',
    iconStyle: 'text-rose-600',
    quoteStyle: 'text-rose-800',
    font: 'font-serif'
  },
  nature: {
    name: 'Natura',
    description: 'Organiczny i spokojny',
    welcome: 'from-emerald-50 to-emerald-100',
    buttons: 'from-emerald-500 to-emerald-600',
    accent: 'emerald',
    cardStyle: 'border-emerald-100',
    iconStyle: 'text-emerald-600',
    quoteStyle: 'text-emerald-800',
    font: 'font-sans'
  }
};

function WelcomeScreen({ onStart, theme }) {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 p-4 flex flex-col justify-center">
      <div className="max-w-2xl mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <BookOpen className={`w-20 h-20 mx-auto ${theme.iconStyle} mb-4`} />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <h1 className={`text-4xl ${theme.font} text-gray-800 dark:text-white mb-4`}>
            Moja Historia
          </h1>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
        >
          <p className={`text-lg ${theme.font} text-gray-600 dark:text-gray-300 mb-10 leading-relaxed`}>
            Witaj w Twoim osobistym pamiętniku. To miejsce, gdzie Twoje wspomnienia 
            staną się mostem między pokoleniami.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.8 }}
        >
          <div className="bg-white dark:bg-gray-800 backdrop-blur-sm rounded-2xl p-8 mb-8 shadow-lg">
            <p className={`text-gray-700 dark:text-gray-200 italic ${theme.font === 'font-serif' ? '' : 'font-serif'}`}>
              "Każda historia ma w sobie magię. Twoja czeka na to, by została opowiedziana."
            </p>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 1.0 }}
        >
          <button
            onClick={onStart}
            className={`bg-gradient-to-r ${theme.buttons} text-white px-8 py-4 
                     rounded-full text-lg font-medium ${theme.font} hover:shadow-lg transition-all`}
          >
            Rozpocznij Swoją Historię
          </button>
        </motion.div>
      </div>
    </div>
  );
}

function ChapterOverview({ onSelectChapter, answers, theme }) {
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
            <motion.div
              key={chapter.id}
              className="relative group"
            >
              <motion.div
                onClick={() => onSelectChapter(chapter)}
                className="bg-white dark:bg-gray-800 p-6 rounded-2xl cursor-pointer 
                         shadow-lg hover:shadow-xl transition-all duration-300 relative"
                whileHover={{ scale: 1.02 }}
              >
                {/* Card content */}
                <div className="relative group-hover:opacity-0 transition-opacity duration-200">
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
                      {Object.keys(answers).filter(key => key.startsWith(`${chapter.id}-`)).length}/{chapter.questions.length} odpowiedzi
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

                {/* Quote overlay */}
                <div className="absolute inset-0 rounded-2xl flex items-center justify-center p-6 
                             opacity-0 group-hover:opacity-100 transition-opacity duration-200 
                             bg-white dark:bg-gray-800">
                  <div className="max-w-[80%]">
                    <span className="text-3xl mb-4 block text-center">💭</span>
                    <p className="text-gray-800 dark:text-gray-200 italic text-center 
                                text-lg font-serif leading-relaxed font-medium">
                      "{chapterQuotes[chapter.title]}"
                    </p>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}

function QuestionInterface({ chapter, onBack, answers, setAnswers, theme, exportToPDF }) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [isSaving, setIsSaving] = useState(false);

  const currentQuestion = chapter.questions[currentQuestionIndex];

  const handleSave = (answer) => {
    setIsSaving(true);
    setAnswers(prev => ({
      ...prev,
      [`${chapter.id}-${currentQuestionIndex}`]: answer
    }));
    setTimeout(() => setIsSaving(false), 500);
  };

  // Update the textarea section
  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header with navigation */}
        <div className="flex items-center justify-between mb-8">
          <button
            onClick={onBack}
            className="flex items-center space-x-2 text-gray-600 hover:text-gray-800"
          >
            <Home className="w-5 h-5" />
            <span>Powrót do rozdziałów</span>
          </button>
          
          {isSaving && (
            <div className="flex items-center space-x-2 text-green-600">
              <Save className="w-4 h-4" />
              <span className="text-sm">Zapisuję...</span>
            </div>
          )}
        </div>

        {/* Progress bar */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-2">
            <h2 className="text-2xl font-serif text-gray-800">{chapter.title}</h2>
            <span className="text-sm text-gray-600">
              Pytanie {currentQuestionIndex + 1} z {chapter.questions.length}
            </span>
          </div>
          <div className="w-full h-2 bg-white/50 rounded-full">
            <motion.div 
              className="h-2 bg-gradient-to-r from-indigo-400 to-purple-400 rounded-full"
              initial={{ width: 0 }}
              animate={{ 
                width: `${((currentQuestionIndex + 1) / chapter.questions.length) * 100}%` 
              }}
              transition={{ duration: 0.5 }}
            />
          </div>
        </div>

        {/* Question card */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white dark:bg-gray-800 backdrop-blur-sm rounded-3xl p-8 shadow-2xl"
        >
          <div className="flex items-start space-x-4 mb-6">
            <Heart className="w-6 h-6 text-rose-500 mt-1 flex-shrink-0" />
            <h3 className="text-xl text-gray-800 dark:text-white leading-relaxed">
              {currentQuestion}
            </h3>
          </div>

          <textarea
            value={answers[`${chapter.id}-${currentQuestionIndex}`] || ""}
            onChange={(e) => handleSave(e.target.value)}
            placeholder="Pozwól, by słowa płynęły z serca... Twoja historia jest wyjątkowa."
            className="w-full min-h-[200px] p-4 bg-gray-50 dark:bg-gray-700 rounded-2xl 
                     text-gray-700 dark:text-gray-200 placeholder-gray-400 
                     dark:placeholder-gray-500 focus:outline-none 
                     focus:ring-2 focus:ring-indigo-300 transition-all"
            style={{ resize: 'vertical' }}
          />

          {/* Navigation buttons */}
          <div className="flex justify-between mt-6">
            <button
              onClick={() => setCurrentQuestionIndex(prev => Math.max(0, prev - 1))}
              disabled={currentQuestionIndex === 0}
              className="flex items-center space-x-2 px-6 py-3 text-gray-600 
                       hover:text-gray-800 disabled:opacity-50 transition-colors"
            >
              <ChevronLeft className="w-5 h-5" />
              <span>Poprzednie</span>
            </button>

            <button
              onClick={() => setCurrentQuestionIndex(prev => 
                Math.min(chapter.questions.length - 1, prev + 1)
              )}
              disabled={currentQuestionIndex === chapter.questions.length - 1}
              className={`flex items-center space-x-2 px-6 py-3 bg-gradient-to-r 
                       ${theme.buttons} text-white rounded-full 
                       hover:shadow-lg disabled:opacity-50 transition-all`}
            >
              <span>Następne</span>
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </motion.div>

        {/* Export button */}
        <div className="mt-8 text-center">
          <button
            onClick={exportToPDF} // This will now call the function passed from App
            className="flex items-center space-x-2 px-4 py-2 text-gray-600 hover:text-gray-800"
          >
            <Download className="w-5 h-5" />
            <span>Eksportuj Pamiętnik</span> 
          </button>
        </div>
      </div>
    </div>
  );
}

function Timeline({ chapters, activeChapter, onSelectChapter, theme }) {
  const [isTimelineModalOpen, setIsTimelineModalOpen] = useState(false);
  const [showMoreButton, setShowMoreButton] = useState(false);
  const [visibleChapters, setVisibleChapters] = useState(chapters);

  const MAX_VISIBLE_CHAPTERS_MOBILE = 4; // Number of chapters to show before "More"
  const CHAPTER_THRESHOLD_FOR_MORE_BUTTON = 5; // Min chapters to trigger "More" button

  useEffect(() => {
    const handleResize = () => {
      const isMobile = window.matchMedia("(max-width: 768px)").matches;
      if (isMobile && chapters.length > CHAPTER_THRESHOLD_FOR_MORE_BUTTON) {
        setShowMoreButton(true);
        setVisibleChapters(chapters.slice(0, MAX_VISIBLE_CHAPTERS_MOBILE));
      } else {
        setShowMoreButton(false);
        setVisibleChapters(chapters);
      }
    };

    handleResize(); // Initial check
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [chapters]);

  return (
    <>
      <div className="fixed bottom-0 left-0 right-0 bg-white/80 dark:bg-gray-800/80 
                      backdrop-blur-sm shadow-lg z-30"> {/* Ensure timeline is above content but below modal */}
        <div className="max-w-6xl mx-auto px-2 py-2">
          <div className="overflow-x-auto scrollbar-hide">
            <div className="flex space-x-4 md:space-x-6 items-center min-w-max px-2 mx-auto justify-center">
              {visibleChapters.map((chapter) => (
                <motion.button
                  key={chapter.id}
                  onClick={() => onSelectChapter(chapter)}
                  className={`flex flex-col items-center group p-1 rounded-lg transition-colors duration-200 ease-in-out
                              ${activeChapter && activeChapter.id === chapter.id ? 'bg-indigo-100 dark:bg-indigo-700' : 'hover:bg-gray-100 dark:hover:bg-gray-700'}`}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <div className={`w-10 h-10 md:w-12 md:h-12 flex items-center justify-center 
                                rounded-full text-xl md:text-2xl bg-white dark:bg-gray-600 
                                shadow-md group-hover:shadow-lg transition-all
                                ${activeChapter && activeChapter.id === chapter.id ? `ring-2 ring-offset-1 ${theme.iconStyle.replace('text-', 'ring-')}` : ''}`}>
                    {timelineIcons[chapter.title]}
                  </div>
                  <span className={`text-[10px] md:text-xs text-gray-600 dark:text-gray-300 
                                mt-1 whitespace-nowrap font-medium
                                ${activeChapter && activeChapter.id === chapter.id ? `${theme.iconStyle}` : ''}`}>
                    {chapter.title}
                  </span>
                </motion.button>
              ))}
              {showMoreButton && (
                <motion.button
                  onClick={() => setIsTimelineModalOpen(true)}
                  className="flex flex-col items-center group p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <div className="w-10 h-10 md:w-12 md:h-12 flex items-center justify-center 
                                rounded-full text-xl md:text-2xl bg-white dark:bg-gray-600 
                                shadow-md group-hover:shadow-lg transition-all">
                    <MoreHorizontal className="w-6 h-6 text-gray-500 dark:text-gray-400" />
                  </div>
                  <span className="text-[10px] md:text-xs text-gray-600 dark:text-gray-300 
                                mt-1 whitespace-nowrap font-medium">
                    Więcej
                  </span>
                </motion.button>
              )}
            </div>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {isTimelineModalOpen && (
          <motion.div
            className="fixed inset-0 bg-black/60 z-40 flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsTimelineModalOpen(false)} // Close on backdrop click
          >
            <motion.div
              className="bg-white dark:bg-gray-800 rounded-xl shadow-xl p-5 w-full max-w-md max-h-[80vh] flex flex-col"
              initial={{ scale: 0.9, opacity: 0.8 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside modal
            >
              <div className="flex justify-between items-center mb-4">
                <h3 className={`text-xl font-semibold ${theme.font} text-gray-900 dark:text-white`}>
                  Wybierz rozdział
                </h3>
                <button 
                  onClick={() => setIsTimelineModalOpen(false)} 
                  className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                  aria-label="Zamknij modal"
                >
                  <X className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                </button>
              </div>
              <ul className="overflow-y-auto space-y-1 scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-600">
                {chapters.map(chapter => (
                  <li key={chapter.id} >
                    <button
                      onClick={() => {
                        onSelectChapter(chapter);
                        setIsTimelineModalOpen(false);
                      }}
                      className={`w-full flex items-center p-3 rounded-lg transition-colors duration-150 ease-in-out
                                  ${activeChapter && activeChapter.id === chapter.id ? 'bg-indigo-100 dark:bg-indigo-700' : 'hover:bg-gray-100 dark:hover:bg-gray-700'}`}
                    >
                      <span className={`text-2xl mr-4 ${activeChapter && activeChapter.id === chapter.id ? theme.iconStyle : 'text-gray-500 dark:text-gray-400'}`}>
                        {timelineIcons[chapter.title]}
                      </span>
                      <span className={`text-gray-800 dark:text-gray-100 ${theme.font} ${activeChapter && activeChapter.id === chapter.id ? 'font-semibold' : ''}`}>
                        {chapter.title}
                      </span>
                    </button>
                  </li>
                ))}
              </ul>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

function App() {
  const [view, setView] = useState("welcome");
  const [currentChapter, setCurrentChapter] = useState(null);
  const [answers, setAnswers] = useState(() => {
    const savedAnswers = localStorage.getItem('diary-answers');
    return savedAnswers ? JSON.parse(savedAnswers) : {};
  });
  
  // Update theme initialization to use a valid theme key
  const [currentTheme, setCurrentTheme] = useState(() => {
    const saved = localStorage.getItem('diary-theme');
    return saved || 'classic';
  });

  // Zapisz wybrany motyw
  useEffect(() => {
    localStorage.setItem('diary-theme', currentTheme);
  }, [currentTheme]);

  const exportFullPDF = () => {
    const content = document.createElement('div');
    let html = '';

    chapters.forEach(chapter => {
      html += `<div class="pdf-chapter-container" style="page-break-after: always;">`; // Hint for page break
      html += `<h1 style="color: #1f2937; font-size: 28px; margin-bottom: 25px; text-align: center; border-bottom: 2px solid #e5e7eb; padding-bottom: 10px;">${chapter.title}</h1>`;
      html += `<h2 style="color: #4b5563; font-size: 20px; margin-bottom: 20px; text-align: center;">${chapter.subtitle}</h2>`;
      
      chapter.questions.forEach((q, i) => {
        const answer = answers[`${chapter.id}-${i}`] || 'Brak odpowiedzi';
        html += `
          <div style="margin-bottom: 25px; padding: 15px; border-left: 3px solid #d1d5db; background-color: #f9fafb;">
            <h3 style="color: #374151; font-size: 18px; margin-bottom: 8px; font-weight: 600;">${q}</h3>
            <p style="color: #1f2937; line-height: 1.7; font-size: 16px; white-space: pre-wrap; word-wrap: break-word;">
              ${answer.replace(/\n/g, '<br>')}
            </p>
          </div>
        `;
      });
      html += `</div>`;
    });

    content.innerHTML = html;
    
    const opt = {
      margin: [1, 0.8, 1, 0.8], // top, right, bottom, left
      filename: 'Moj_Pamietnik.pdf',
      image: { type: 'jpeg', quality: 0.95 },
      html2canvas: { scale: 2, useCORS: true, logging: true, letterRendering: true },
      jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' },
      pagebreak: { mode: ['avoid-all', 'css', 'legacy'], before: '.pdf-chapter-container' }
    };

    html2pdf().set(opt).from(content).save();
  };

  // Dodaj stan dla ustawień jeśli nie istnieje
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(() => {
    const saved = localStorage.getItem('diary-dark-mode');
    return saved ? JSON.parse(saved) : false;
  });

  // Save answers when they change
  useEffect(() => {
    localStorage.setItem('diary-answers', JSON.stringify(answers));
  }, [answers]);

  // Save theme when it changes
  useEffect(() => {
    localStorage.setItem('diary-theme', currentTheme);
  }, [currentTheme]);

  // Add effect for dark mode
  useEffect(() => {
    localStorage.setItem('diary-dark-mode', JSON.stringify(isDarkMode));
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  return (
    <div>
      {/* Dodaj przycisk ustawień, który będzie zawsze widoczny */}
      <button
        onClick={() => setIsSettingsOpen(true)}
        className="fixed top-4 right-4 p-3 bg-white dark:bg-gray-800 
                   rounded-full shadow-lg hover:shadow-xl transition-all z-50"
        aria-label="Otwórz ustawienia"
      >
        <SettingsIcon className="w-6 h-6 text-gray-600 dark:text-gray-400" />
      </button>

      {/* Komponent ustawień */}
      <Settings 
        theme={isDarkMode ? 'dark' : 'light'}
        toggleTheme={() => setIsDarkMode(!isDarkMode)}
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        currentTheme={currentTheme}
        setCurrentTheme={setCurrentTheme}
      />

      <AnimatePresence mode="wait">
        {view === "welcome" && (
          <motion.div
            key="welcome"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <WelcomeScreen 
              onStart={() => setView("chapters")}
              theme={themes[currentTheme]}
            />
          </motion.div>
        )}
        
        {view === "chapters" && (
          <motion.div
            key="chapters"
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -100 }}
            transition={{ duration: 0.3 }}
          >
            <ChapterOverview 
              onSelectChapter={(chapter) => {
                setCurrentChapter(chapter);
                setView("question");
              }}
              answers={answers} 
              onOpenSettings={() => setIsSettingsOpen(true)}
              theme={themes[currentTheme]} // Add theme prop
            />
          </motion.div>
        )}
        
        {view === "question" && currentChapter && (
          <motion.div
            key="question"
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -100 }}
            transition={{ duration: 0.3 }}
          >
            <QuestionInterface
              chapter={currentChapter}
              onBack={() => setView("chapters")}
              answers={answers}
              setAnswers={setAnswers}
              theme={themes[currentTheme]}
              exportToPDF={exportFullPDF} // Pass the new export function
            />
          </motion.div>
        )}
      </AnimatePresence>

      {view !== "welcome" && (
        <Timeline 
          chapters={chapters} 
          activeChapter={currentChapter} 
          onSelectChapter={(chapter) => {
            setCurrentChapter(chapter);
            setView("question");
          }}
          theme={themes[currentTheme]} // Add theme prop
        />
      )}
    </div>
  );
}

export default App;
