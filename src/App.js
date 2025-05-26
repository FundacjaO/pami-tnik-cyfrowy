import { Moon, Sun } from 'lucide-react';
import { useState, useEffect } from 'react';
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
  retro: {
    name: "Retro",
    welcome: "from-amber-100 via-yellow-50 to-orange-50",
    chapters: "from-amber-50 to-yellow-50",
    buttons: "from-amber-600 to-orange-600",
    accent: "amber",
    font: "font-serif",
    cardStyle: "border-2 border-amber-200 bg-opacity-90",
    iconStyle: "sepia",
    quoteStyle: "italic font-serif text-amber-800",
    description: "Klasyczny styl z nutą nostalgii"
  },
  minimal: {
    name: "Minimalistyczny",
    welcome: "from-slate-100 via-gray-50 to-zinc-50",
    chapters: "from-gray-50 to-slate-50",
    buttons: "from-gray-600 to-slate-600",
    accent: "gray",
    font: "font-sans",
    cardStyle: "border border-gray-100 bg-opacity-95",
    iconStyle: "grayscale",
    quoteStyle: "font-light text-gray-700",
    description: "Prosty i elegancki design"
  },
  artistic: {
    name: "Artystyczny",
    welcome: "from-violet-100 via-purple-50 to-fuchsia-50",
    chapters: "from-purple-50 to-violet-50",
    buttons: "from-purple-500 to-fuchsia-500",
    accent: "purple",
    font: "font-display",
    cardStyle: "border-none shadow-lg bg-opacity-85",
    iconStyle: "hue-rotate-30",
    quoteStyle: "font-display italic text-purple-800",
    description: "Kreatywny i ekspresyjny styl"
  },
  nature: {
    name: "Naturalny",
    welcome: "from-emerald-100 via-green-50 to-lime-50",
    chapters: "from-green-50 to-emerald-50",
    buttons: "from-emerald-600 to-green-600",
    accent: "emerald",
    font: "font-nature",
    cardStyle: "border-2 border-emerald-100 bg-opacity-90",
    iconStyle: "saturate-150",
    quoteStyle: "font-nature text-emerald-800",
    description: "Inspirowany naturą i spokojem"
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

function WelcomeScreen({ onStart, theme }) {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 p-4">
      <div className="max-w-2xl mx-auto text-center">
        <BookOpen className="w-20 h-20 mx-auto text-amber-600 dark:text-amber-400 mb-4" />
        <h1 className="text-4xl font-serif text-gray-800 dark:text-white mb-4">
          Moja Historia
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-300 mb-8 leading-relaxed">
          Witaj w Twoim osobistym pamiętniku. To miejsce, gdzie Twoje wspomnienia 
          staną się mostem między pokoleniami.
        </p>
        <div className="bg-white dark:bg-gray-800 backdrop-blur-sm rounded-2xl p-8 mb-8 shadow-lg">
          <p className="text-gray-700 dark:text-gray-200 italic">
            "Każda historia ma w sobie magię. Twoja czeka na to, by została opowiedziana."
          </p>
        </div>
        <button
          onClick={onStart}
          className={`bg-gradient-to-r ${theme.buttons} text-white px-8 py-4 
                   rounded-full text-lg font-medium hover:shadow-lg transition-all`}
        >
          Rozpocznij Swoją Historię
        </button>
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

function QuestionInterface({ chapter, onBack, answers, setAnswers, theme }) {
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
function SettingsPanel({ theme, setTheme, isDarkMode, setIsDarkMode, isOpen, onClose }) {
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
      <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 w-full max-w-md shadow-2xl">
        <h2 className="text-2xl font-serif text-gray-800 dark:text-white mb-4">Ustawienia</h2>
        
        {/* Theme Style Section */}
        <div className="mb-6">
          <h3 className="text-lg text-gray-700 dark:text-gray-200 mb-3">Styl pamiętnika</h3>
          <div className="grid grid-cols-2 gap-4">
            {Object.entries(themes).map(([name, style]) => (
              <button
                key={name}
                onClick={() => setTheme(name)}
                className={`p-4 rounded-xl border-2 transition-all
                          ${theme === name ? 'border-' + style.accent + '-500' : 'border-gray-200'}
                          hover:shadow-lg`}
              >
                <div className={`h-24 rounded-lg bg-gradient-to-br ${style.welcome} 
                              ${style.cardStyle} p-3 mb-2`}>
                  <div className={`text-2xl ${style.iconStyle}`}>📖</div>
                  <div className={`text-sm ${style.font} mt-2 ${style.quoteStyle}`}>
                    "Wspomnienia..."
                  </div>
                </div>
                <span className={`text-base text-gray-800 block font-medium ${style.font}`}>
                  {style.name}
                </span>
                <span className="text-xs text-gray-500 mt-1 block">
                  {style.description}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Dark Mode Toggle Section */}
        <div className="mb-6">
          <h3 className="text-lg text-gray-700 dark:text-gray-200 mb-3">Tryb wyświetlania</h3>
          <button
            onClick={() => setIsDarkMode(!isDarkMode)}
            className="w-full flex items-center justify-between px-4 py-3 
                     bg-gray-100 dark:bg-gray-700 rounded-xl 
                     hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
          >
            <div className="flex items-center space-x-3">
              {isDarkMode ? (
                <Moon className="w-5 h-5 text-gray-600 dark:text-gray-300" />
              ) : (
                <Sun className="w-5 h-5 text-amber-500" />
              )}
              <span className="text-gray-700 dark:text-gray-200">
                {isDarkMode ? 'Tryb nocny' : 'Tryb dzienny'}
              </span>
            </div>
            <div className={`w-11 h-6 rounded-full p-1 transition-colors 
                         ${isDarkMode ? 'bg-indigo-600' : 'bg-gray-300'}`}>
              <motion.div
                animate={{ x: isDarkMode ? 20 : 0 }}
                className="w-4 h-4 bg-white rounded-full"
              />
            </div>
          </button>
        </div>

        {/* Share Section */}
        <div className="mb-6">
          <h3 className="text-lg text-gray-700 dark:text-gray-200 mb-3">Udostępnij historię</h3>
          <button
            onClick={copyShareLink}
            className="w-full px-4 py-2 bg-gray-100 dark:bg-gray-700 
                     hover:bg-gray-200 dark:hover:bg-gray-600 
                     rounded-lg text-gray-700 dark:text-gray-200 transition-colors"
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

function Timeline({ chapters, activeChapter, onSelectChapter, theme }) {
  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white/80 dark:bg-gray-800/80 
                    backdrop-blur-sm shadow-lg">
      <div className="max-w-6xl mx-auto px-2 py-2">
        <div className="overflow-x-auto scrollbar-hide">
          <div className="flex space-x-4 md:space-x-8 items-center min-w-max px-2 mx-auto justify-center">
            {chapters.map((chapter) => (
              <motion.button
                key={chapter.id}
                onClick={() => onSelectChapter(chapter)}
                className="flex flex-col items-center group"
              >
                <div className="w-10 h-10 md:w-12 md:h-12 flex items-center justify-center 
                              rounded-full text-xl md:text-2xl bg-white dark:bg-gray-700 
                              shadow-md group-hover:shadow-lg transition-all">
                  {timelineIcons[chapter.title]}
                </div>
                <span className="text-[10px] md:text-xs text-gray-600 dark:text-gray-300 
                              mt-1 whitespace-nowrap font-medium">
                  {chapter.title}
                </span>
              </motion.button>
            ))}
          </div>
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
  
  // Update theme initialization to use a valid theme key
  const [currentTheme, setCurrentTheme] = useState(() => {
    const saved = localStorage.getItem('diary-theme');
    // Make sure we return a valid theme key that exists in our themes object
    return themes[saved] ? saved : 'retro';
  });
  
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  // Add after currentTheme state in App component
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
              theme={themes[currentTheme]} // Add theme prop
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Globalny przycisk ustawień */}
      <button
        onClick={() => setIsSettingsOpen(true)}
        className="fixed top-4 right-4 p-2 bg-white/80 rounded-full shadow-lg
                 hover:shadow-xl transition-all z-50"
      >
        <SettingsIcon className="w-6 h-6 text-gray-600" />
      </button>

      <SettingsPanel 
        theme={currentTheme}
        setTheme={setCurrentTheme}
        isDarkMode={isDarkMode}
        setIsDarkMode={setIsDarkMode}
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
      />

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
    </>
  );
}

export default App;
