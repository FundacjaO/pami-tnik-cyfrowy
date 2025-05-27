import { useState } from 'react';
import { Question } from '../Question/Question';

export function Chapter({ questions }) {
  const [answers, setAnswers] = useState({});
  const [emotions, setEmotions] = useState({});

  const handleAnswerChange = (questionId, value) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: value
    }));
  };

  const handleEmotionChange = (questionId, newEmotions) => {
    setEmotions(prev => ({
      ...prev,
      [questionId]: newEmotions
    }));
    
    // Tutaj możesz dodać zapisywanie do bazy danych
    saveToDatabase(questionId, newEmotions);
  };

  return (
    <div className="space-y-6">
      {questions.map((question) => (
        <Question
          key={question.id}
          question={question.text}
          answer={answers[question.id]}
          emotions={emotions[question.id] || { touched: false, favorite: false }}
          onAnswerChange={(value) => handleAnswerChange(question.id, value)}
          onEmotionChange={(newEmotions) => handleEmotionChange(question.id, newEmotions)}
        />
      ))}
    </div>
  );
}

// Funkcja do zapisywania w bazie danych
async function saveToDatabase(questionId, emotions) {
  try {
    // Tutaj dodaj logikę zapisu do bazy
    console.log('Saving emotions for question:', questionId, emotions);
  } catch (error) {
    console.error('Error saving emotions:', error);
  }
}