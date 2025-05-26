import { useState, useEffect } from "react";
import { BookOpen, Heart, Save, Home, ChevronLeft, ChevronRight, Download, Settings as SettingsIcon } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import './App.css';
import html2pdf from 'html2pdf.js';

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

const themes = {
  classic: {
    welcome: "from-amber-50 via-rose-50 to-indigo-50",
    chapters: "from-slate-50 to-indigo-50",
    buttons: "from-amber-500 to-orange-500",
    accent: "amber"
  },
  ocean: {
    welcome: "from-cyan-50 via-blue-50 to-indigo-50",
    chapters: "from-blue-50 to-cyan-50",
    buttons: "from-blue-500 to-cyan-500",
    accent: "blue"
  },
  forest: {
    welcome: "from-emerald-50 via-green-50 to-lime-50",
    chapters: "from-green-50 to-emerald-50",
    buttons: "from-green-500 to-emerald-500",
    accent: "emerald"
  }
};

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
  "Dziedzictwo": "🕊️"
};

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
  "Dziedzictwo": "Prawdziwe dziedzictwo zostaje w sercach tych, którzy nas kochają."
};

function WelcomeScreen({ onStart }) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-rose-50 to-indigo-50 flex items-center justify-center p-4">
      <div className="max-w-2xl text-center">
        <BookOpen className="w-20 h-20 mx-auto text-amber-600 mb-4" />
        <h1 className="text-4xl font-serif text-gray-800 mb-4">
          Moja Historia
        </h1>
        <p className="text-lg text-gray-600 mb-8 leading-relaxed">
          Witaj w Twoim osobistym pamiętniku. To miejsce, gdzie Twoje wspomnienia 
          staną się mostem między pokoleniami.
        </p>
        <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-8 mb-8 shadow-lg">
          <p className="text-gray-700 italic">
            "Każda historia ma w sobie magię. Twoja czeka na to, by została opowiedziana."
          </p>
        </div>
        <button
          onClick={onStart}
          className="bg-gradient-to-r from-amber-500 to-orange-500 text-white px-8 py-4 
                   rounded-full text-lg font-medium hover:shadow-lg transition-all 
                   duration-300 transform hover:scale-105"
        >
          Rozpocznij Swoją Historię
        </button>
      </div>
    </div>
  );
}

function ChapterOverview({ onSelectChapter, answers, onOpenSettings }) {
  const [activeChapter, setActiveChapter] = useState(null);
  const [showQuestions, setShowQuestions] = useState(false);

  const handleChapterSelect = (chapter) => {
    setActiveChapter(chapter);
    setShowQuestions(true);
  };

  const exportAllToPDF = () => {
    const content = document.createElement('div');
    content.innerHTML = `
      <h1 style="text-align: center; margin-bottom: 40px">Moja Historia</h1>
      ${chapters.map(chapter => `
        <div style="margin-bottom: 40px">
          <h2 style="color: #4B5563">${chapter.title}</h2>
          <h3 style="color: #6B7280; margin-bottom: 20px">${chapter.subtitle}</h3>
          ${chapter.questions.map((q, i) => `
            <div style="margin-bottom: 20px">
              <p style="font-weight: bold; color: #374151">${q}</p>
              <p style="margin-left: 20px">${answers[`${chapter.id}-${i}`] || 'Brak odpowiedzi'}</p>
            </div>
          `).join('')}
        </div>
      `).join('')}
    `;
    
    const opt = {
      margin: 1,
      filename: 'moja_historia.pdf',
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' }
    };

    html2pdf().set(opt).from(content).save();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-indigo-50 p-4 md:p-8 pb-24">
      <div className="max-w-6xl mx-auto">
        <button
          onClick={onOpenSettings}
          className="fixed top-4 right-4 p-2 bg-white/80 rounded-full shadow-lg
                   hover:shadow-xl transition-all"
        >
          <SettingsIcon className="w-6 h-6 text-gray-600" />
        </button>
        
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <BookOpen className="w-16 h-16 mx-auto text-indigo-600 mb-4" />
          <h1 className="text-3xl font-serif text-gray-800 mb-2">Twoja Historia</h1>
          <p className="text-gray-600">Wybierz rozdział, który chcesz pisać</p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {chapters.map((chapter, index) => (
            <motion.div
              key={chapter.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="relative group"
            >
              <motion.div
                whileHover={{ scale: 1.02 }}
                onClick={() => onSelectChapter(chapter)}
                className={`bg-gradient-to-br ${chapter.color} p-6 rounded-2xl cursor-pointer
                          shadow-lg hover:shadow-xl transition-all duration-300 relative`}
              >
                <div className="flex items-center space-x-3 mb-4">
                  <span className="text-2xl">{timelineIcons[chapter.title]}</span>
                  <h3 className="text-xl font-semibold text-gray-800">{chapter.title}</h3>
                </div>
                <p className="text-gray-600 text-sm mb-4">{chapter.subtitle}</p>
                <div className="flex justify-between items-center">
                  <span className="text-xs text-gray-500">
                    {Object.keys(answers).filter(key => key.startsWith(`${chapter.id}-`)).length}/{chapter.questions.length} odpowiedzi
                  </span>
                  <div className="w-16 h-1 bg-gray-200 rounded-full overflow-hidden">
                    <div 
                      className="h-1 bg-gradient-to-r from-green-400 to-green-500 rounded-full"
                      style={{ 
                        width: `${(Object.keys(answers).filter(key => 
                          key.startsWith(`${chapter.id}-`)).length / chapter.questions.length) * 100}%` 
                      }}
                    />
                  </div>
                </div>

                {/* Hover quote overlay */}
                <motion.div
                  initial={{ opacity: 0 }}
                  whileHover={{ opacity: 1 }}
                  className="absolute inset-0 bg-white/95 backdrop-blur-sm rounded-2xl 
                           opacity-0 group-hover:opacity-100 transition-opacity duration-200
                           flex items-center justify-center p-6"
                >
                  <p className="text-gray-700 italic text-center text-lg font-serif">
                    "{chapterQuotes[chapter.title]}"
                  </p>
                </motion.div>
              </motion.div>
            </motion.div>
          ))}
        </div>

        <div className="mt-8 text-center">
          <button
            onClick={exportAllToPDF}
            className="flex items-center space-x-2 px-6 py-3 bg-white rounded-full 
                     shadow-lg hover:shadow-xl transition-all duration-300 mx-auto"
          >
            <Download className="w-5 h-5 text-indigo-600" />
            <span className="text-gray-800">Eksportuj całą historię</span>
          </button>
        </div>
      </div>
    </div>
  );
}

function QuestionInterface({ chapter, onBack, answers, setAnswers }) {
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

  const exportToPDF = () => {
    const content = document.createElement('div');
    content.innerHTML = `
      <h1>${chapter.title}</h1>
      ${chapter.questions.map((q, i) => `
        <div style="margin-bottom: 20px">
          <h3>${q}</h3>
          <p>${answers[i] || 'Brak odpowiedzi'}</p>
        </div>
      `).join('')}
    `;
    
    const opt = {
      margin: 1,
      filename: `${chapter.title}_historia.pdf`,
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' }
    };

    html2pdf().set(opt).from(content).save();
  };

  return (
    <div className={`min-h-screen bg-gradient-to-br ${chapter.color} p-4 md:p-8`}>
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
          className="bg-white/90 backdrop-blur-sm rounded-3xl p-8 shadow-2xl"
        >
          <div className="flex items-start space-x-4 mb-6">
            <Heart className="w-6 h-6 text-rose-500 mt-1 flex-shrink-0" />
            <h3 className="text-xl text-gray-800 leading-relaxed">
              {currentQuestion}
            </h3>
          </div>

          <textarea
            value={answers[currentQuestionIndex] || ""}
            onChange={(e) => handleSave(e.target.value)}
            placeholder="Pozwól, by słowa płynęły z serca... Twoja historia jest wyjątkowa."
            className="w-full h-64 p-4 bg-gray-50 rounded-2xl text-gray-700 
                     placeholder-gray-400 resize-none focus:outline-none 
                     focus:ring-2 focus:ring-indigo-300 transition-all"
            style={{ fontFamily: 'Georgia, serif' }}
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
              className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r 
                       from-indigo-500 to-purple-500 text-white rounded-full 
                       hover:shadow-lg disabled:opacity-50 transition-all"
            >
              <span>Następne</span>
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </motion.div>

        {/* Export button */}
        <div className="mt-8 text-center">
          <button
            onClick={exportToPDF}
            className="flex items-center space-x-2 px-4 py-2 text-gray-600 hover:text-gray-800"
          >
            <Download className="w-5 h-5" />
            <span>Eksportuj rozdział</span>
          </button>
        </div>
      </div>
    </div>
  );
}

// Rename the Settings component to SettingsPanel
function SettingsPanel({ theme, setTheme, isOpen, onClose }) {
  const copyShareLink = () => {
    const shareId = Math.random().toString(36).substring(2);
    const shareLink = `${window.location.origin}/share/${shareId}`;
    navigator.clipboard.writeText(shareLink);
    alert('Link skopiowany do schowka!');
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: isOpen ? 1 : 0, scale: isOpen ? 1 : 0.95 }}
      className={`fixed inset-0 z-50 flex items-center justify-center 
                 bg-black/50 backdrop-blur-sm ${isOpen ? '' : 'pointer-events-none'}`}
    >
      <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-2xl">
        <h2 className="text-2xl font-serif text-gray-800 mb-4">Ustawienia</h2>
        
        {/* Theme selection */}
        <div className="mb-6">
          <h3 className="text-lg text-gray-700 mb-3">Motyw kolorystyczny</h3>
          <div className="grid grid-cols-3 gap-3">
            {Object.entries(themes).map(([name, colors]) => (
              <button
                key={name}
                onClick={() => setTheme(name)}
                className={`p-3 rounded-xl border-2 transition-all
                          ${theme === name ? 'border-' + colors.accent + '-500' : 'border-gray-200'}`}
              >
                <div className={`h-8 rounded-lg bg-gradient-to-r ${colors.buttons}`} />
                <span className="text-sm text-gray-600 mt-2 block capitalize">{name}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Sharing options */}
        <div className="mb-6">
          <h3 className="text-lg text-gray-700 mb-3">Udostępnij historię</h3>
          <button
            onClick={copyShareLink}
            className="w-full px-4 py-2 bg-gray-100 hover:bg-gray-200 
                     rounded-lg text-gray-700 transition-colors"
          >
            Generuj link do udostępnienia
          </button>
        </div>

        <button
          onClick={onClose}
          className="w-full px-4 py-2 bg-gray-800 text-white rounded-lg 
                   hover:bg-gray-700 transition-colors"
        >
          Zamknij
        </button>
      </div>
    </motion.div>
  );
}

function Timeline({ chapters, activeChapter, onSelectChapter }) {
  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white/80 backdrop-blur-sm shadow-lg">
      <div className="max-w-6xl mx-auto px-4 py-2 overflow-x-auto">
        <div className="flex space-x-8 items-center min-w-max">
          {chapters.map((chapter) => (
            <motion.button
              key={chapter.id}
              onClick={() => onSelectChapter(chapter)}
              className={`flex flex-col items-center group ${
                activeChapter?.id === chapter.id ? 'scale-110' : ''
              }`}
              whileHover={{ scale: 1.1 }}
              transition={{ duration: 0.2 }}
            >
              <div className={`w-12 h-12 flex items-center justify-center rounded-full 
                            text-2xl bg-gradient-to-br ${chapter.color} shadow-md 
                            group-hover:shadow-lg transition-all`}>
                {timelineIcons[chapter.title]}
              </div>
              <span className="text-xs text-gray-600 mt-1 whitespace-nowrap">
                {chapter.title}
              </span>
              {activeChapter?.id === chapter.id && (
                <motion.div
                  layoutId="activeIndicator"
                  className="w-full h-0.5 bg-gradient-to-r from-indigo-500 
                           to-purple-500 mt-1"
                />
              )}
            </motion.button>
          ))}
        </div>
      </div>
    </div>
  );
}

function App() {
  const [view, setView] = useState("welcome");
  const [currentChapter, setCurrentChapter] = useState(null);
  const [answers, setAnswers] = useState(() => {
    const savedAnswers = localStorage.getItem('diary-answers');
    return savedAnswers ? JSON.parse(savedAnswers) : {};
  });
  const [currentTheme, setCurrentTheme] = useState(() => {
    const saved = localStorage.getItem('diary-theme');
    return saved || 'classic';
  });
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  // Save answers when they change
  useEffect(() => {
    localStorage.setItem('diary-answers', JSON.stringify(answers));
  }, [answers]);

  useEffect(() => {
    localStorage.setItem('diary-theme', currentTheme);
  }, [currentTheme]);
  
  return (
    <>
      <AnimatePresence mode="wait">
        {view === "welcome" && (
          <motion.div
            key="welcome"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <WelcomeScreen onStart={() => setView("chapters")} />
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
            />
          </motion.div>
        )}
      </AnimatePresence>

      <SettingsPanel 
        theme={currentTheme}
        setTheme={setCurrentTheme}
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
      />

      <Timeline 
        chapters={chapters} 
        activeChapter={currentChapter} 
        onSelectChapter={(chapter) => {
          setCurrentChapter(chapter);
          setView("question");
        }}
      />
    </>
  );
}

export default App;
