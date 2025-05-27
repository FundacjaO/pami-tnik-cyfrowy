import React from 'react';
import { QuestionCard } from './components/Question/QuestionCard';

function App() {
  return (
    <div className="p-4">
      <QuestionCard
        questionId="default"
        questionText="Gdzie i kiedy się urodziłaś/eś?"
      />
    </div>
  );
}

export default App;