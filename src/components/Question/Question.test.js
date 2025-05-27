import { render, fireEvent, screen } from '@testing-library/react';
import { Question } from './Question';

describe('Question Component', () => {
  const mockProps = {
    chapterId: 1,
    questionIndex: 0,
    question: "Test question?",
    answer: "",
    onAnswerChange: jest.fn(),
    onEmotionToggle: jest.fn(),
    onHide: jest.fn(),
    theme: { font: 'font-sans' },
    emotions: {}
  };

  test('renders question with tooltip', () => {
    render(<Question {...mockProps} />);
    expect(screen.getByText("Test question?")).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /info/i })).toBeInTheDocument();
  });

  test('emotion buttons work', () => {
    render(<Question {...mockProps} />);
    fireEvent.click(screen.getByText("Wzruszyło mnie"));
    expect(mockProps.onEmotionToggle).toHaveBeenCalledWith('touched');
  });
});