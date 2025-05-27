import { QuestionTooltip } from './QuestionTooltip';

export const QuestionCard = ({ questionId, questionText }: { questionId: string; questionText: string; }) => {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-md mb-4">
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-100 max-w-[85%]">
          {questionText}
        </h2>
        <QuestionTooltip questionId={questionId} />
      </div>
      {/* Tutaj możesz dodać pole do wpisania odpowiedzi */}
    </div>
  );
};