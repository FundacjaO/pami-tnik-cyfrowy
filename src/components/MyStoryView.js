import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { 
  BookOpen, 
  Edit2, 
  Save, 
  Download, 
  Home, 
  Eye, 
  FileText
} from 'lucide-react';
import { jsPDF } from 'jspdf';

export function MyStoryView({ chapters, answers, setAnswers, theme, onBack }) {
  const [mode, setMode] = useState('view'); // 'view' lub 'edit'
  const [editedStory, setEditedStory] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [fullStory, setFullStory] = useState('');
  // Generowanie pełnej opowieści z odpowiedzi
  const generateFullStory = useCallback(() => {
    let story = '';
    
    chapters.forEach((chapter, chapterIndex) => {
      if (chapter.isStory) return; // Pomijamy sam rozdział "Moja opowieść"
      
      const hasAnswers = chapter.questions?.some((_question, questionIndex) => 
        answers[`${chapter.id}-${questionIndex}`]?.trim()
      );
      
      if (hasAnswers) {
        story += `\n\n## ${chapter.title}\n`;
        story += `${chapter.subtitle}\n\n`;
        
        chapter.questions.forEach((question, questionIndex) => {
          const answer = answers[`${chapter.id}-${questionIndex}`];
          if (answer?.trim()) {
            story += `**${question}**\n\n`;
            story += `${answer}\n\n`;
          }
        });
      }
    });
    
    return story.trim();
  }, [answers, chapters]);
  useEffect(() => {
    const story = generateFullStory();
    setFullStory(story);
    setEditedStory(story);
  }, [answers, chapters, generateFullStory]);

  // Zapis edytowanej opowieści
  const saveEditedStory = () => {
    setFullStory(editedStory);
    // Tutaj można dodać dodatkową logikę zapisu
    setMode('view');
  };

  // Eksport do PDF z lepszym formatowaniem
  const exportToPDF = async () => {
    setIsGenerating(true);
    
    try {
      const doc = new jsPDF();
      const pageWidth = doc.internal.pageSize.width;
      const pageHeight = doc.internal.pageSize.height;
      const margin = 20;
      const lineHeight = 7;
      let yPos = margin;
      
      // Nagłówek
      doc.setFontSize(18);
      doc.setFont(undefined, 'bold');
      doc.text('Moja Opowieść', pageWidth / 2, yPos, { align: 'center' });
      yPos += 20;
      
      // Data generacji
      doc.setFontSize(10);
      doc.setFont(undefined, 'normal');
      doc.text(`Wygenerowano: ${new Date().toLocaleDateString('pl-PL')}`, 
        pageWidth / 2, yPos, { align: 'center' });
      yPos += 20;
      
      // Zawartość
      const content = mode === 'edit' ? editedStory : fullStory;
      const lines = content.split('\n');
      
      for (let line of lines) {
        if (yPos > pageHeight - margin) {
          doc.addPage();
          yPos = margin;
        }
        
        if (line.startsWith('## ')) {
          // Nagłówek rozdziału
          doc.setFontSize(14);
          doc.setFont(undefined, 'bold');
          doc.text(line.replace('## ', ''), margin, yPos);
          yPos += lineHeight + 3;
        } else if (line.startsWith('**') && line.endsWith('**')) {
          // Pytanie
          doc.setFontSize(11);
          doc.setFont(undefined, 'bold');
          const question = line.replace(/\*\*/g, '');
          const splitQuestion = doc.splitTextToSize(question, pageWidth - 2 * margin);
          doc.text(splitQuestion, margin, yPos);
          yPos += splitQuestion.length * lineHeight + 2;
        } else if (line.trim()) {
          // Odpowiedź
          doc.setFontSize(10);
          doc.setFont(undefined, 'normal');
          const splitText = doc.splitTextToSize(line, pageWidth - 2 * margin);
          doc.text(splitText, margin, yPos);
          yPos += splitText.length * lineHeight + 3;
        } else {
          // Pusta linia
          yPos += lineHeight / 2;
        }
      }
      
      doc.save('moja-opowiesc.pdf');
    } catch (error) {
      console.error('Błąd podczas eksportu PDF:', error);
      alert('Wystąpił błąd podczas eksportu PDF. Spróbuj ponownie.');
    } finally {
      setIsGenerating(false);
    }
  };

  const formatStoryForDisplay = (story) => {
    return story.split('\n').map((line, index) => {
      if (line.startsWith('## ')) {
        return (
          <h2 key={index} className="text-2xl font-bold text-gray-800 dark:text-white mt-8 mb-4 first:mt-0">
            {line.replace('## ', '')}
          </h2>
        );
      } else if (line.startsWith('**') && line.endsWith('**')) {
        return (
          <h3 key={index} className="text-lg font-semibold text-gray-700 dark:text-gray-200 mt-6 mb-3">
            {line.replace(/\*\*/g, '')}
          </h3>
        );
      } else if (line.trim()) {
        return (
          <p key={index} className="text-gray-600 dark:text-gray-300 mb-4 leading-relaxed">
            {line}
          </p>
        );
      } else {
        return <div key={index} className="mb-2"></div>;
      }
    });
  };

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 p-4 md:p-8 pb-24">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <button
            onClick={onBack}
            className="flex items-center space-x-2 text-gray-600 dark:text-gray-400 
                     hover:text-gray-800 dark:hover:text-gray-200 transition-colors"
          >
            <Home className="w-5 h-5" />
            <span>Powrót do rozdziałów</span>
          </button>
          
          <div className="flex items-center space-x-4">
            <button
              onClick={() => setMode(mode === 'view' ? 'edit' : 'view')}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
                mode === 'edit' 
                  ? 'bg-blue-500 text-white hover:bg-blue-600' 
                  : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-600'
              }`}
            >
              {mode === 'edit' ? <Eye className="w-4 h-4" /> : <Edit2 className="w-4 h-4" />}
              <span>{mode === 'edit' ? 'Podgląd' : 'Edytuj'}</span>
            </button>
            
            <button
              onClick={exportToPDF}
              disabled={isGenerating}
              className="flex items-center space-x-2 px-4 py-2 bg-green-500 text-white 
                       rounded-lg hover:bg-green-600 transition-colors disabled:opacity-50"
            >
              {isGenerating ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Generuję...</span>
                </>
              ) : (
                <>
                  <Download className="w-4 h-4" />
                  <span>Eksportuj PDF</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Title */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <BookOpen className="w-16 h-16 mx-auto text-purple-600 dark:text-purple-400 mb-4" />
          <h1 className="text-4xl font-serif text-gray-800 dark:text-white mb-4">
            Moja Opowieść
          </h1>
          <p className="text-gray-600 dark:text-gray-300 text-lg">
            Kompletna historia wszystkich Twoich odpowiedzi
          </p>
        </motion.div>

        {/* Content */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8"
        >
          {mode === 'view' ? (
            <div className="prose dark:prose-invert max-w-none">
              {fullStory ? formatStoryForDisplay(fullStory) : (
                <div className="text-center py-12">
                  <FileText className="w-16 h-16 mx-auto text-gray-400 mb-4" />
                  <p className="text-gray-500 dark:text-gray-400 text-lg">
                    Zacznij odpowiadać na pytania w rozdziałach, aby utworzyć swoją opowieść
                  </p>
                </div>
              )}
            </div>
          ) : (
            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
                  Edytuj swoją opowieść
                </h3>
                <button
                  onClick={saveEditedStory}
                  className="flex items-center space-x-2 px-4 py-2 bg-blue-500 text-white 
                           rounded-lg hover:bg-blue-600 transition-colors"
                >
                  <Save className="w-4 h-4" />
                  <span>Zapisz zmiany</span>
                </button>
              </div>
              
              <textarea
                value={editedStory}
                onChange={(e) => setEditedStory(e.target.value)}
                className="w-full min-h-[600px] p-4 border border-gray-300 dark:border-gray-600 
                         rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-800 dark:text-gray-200 
                         focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                placeholder="Tutaj możesz edytować swoją kompletną opowieść..."
              />
              
              <div className="mt-4 text-sm text-gray-500 dark:text-gray-400">
                <p>💡 Tip: Używaj formatowania Markdown:</p>
                <ul className="list-disc list-inside mt-2 space-y-1">
                  <li>## Nagłówek rozdziału</li>
                  <li>**Pogrubiony tekst (pytania)**</li>
                  <li>Zwykły tekst dla odpowiedzi</li>
                </ul>
              </div>
            </div>
          )}
        </motion.div>

        {/* Statistics */}
        {fullStory && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4"
          >
            <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                {fullStory.split(' ').length}
              </div>
              <div className="text-sm text-blue-500 dark:text-blue-300">
                Słów w opowieści
              </div>
            </div>
            
            <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                {Object.keys(answers).length}
              </div>
              <div className="text-sm text-green-500 dark:text-green-300">
                Odpowiedzi udzielone
              </div>
            </div>
            
            <div className="bg-purple-50 dark:bg-purple-900/20 rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                {chapters.filter(ch => !ch.isStory).length}
              </div>
              <div className="text-sm text-purple-500 dark:text-purple-300">
                Rozdziałów dostępnych
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}

export default MyStoryView;
