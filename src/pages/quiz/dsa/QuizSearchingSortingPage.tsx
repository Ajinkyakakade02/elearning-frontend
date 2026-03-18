import React from 'react';
import BaseTopicQuizPage from '../../templates/BaseTopicQuizPage';
interface QuizSearchingSortingPageProps {
  darkMode: boolean;
  setDarkMode: (value: boolean) => void;
}

const QuizSearchingSortingPage: React.FC<QuizSearchingSortingPageProps> = ({ darkMode, setDarkMode }) => {
  return (
    <BaseTopicQuizPage
      darkMode={darkMode}
      setDarkMode={setDarkMode}
      topicId="searching-sorting"
      topicName="Searching & Sorting"
      topicIcon="🔍"
      topicColor="#ef4444"
      description="Complete searching and sorting algorithms including binary search, merge sort, quick sort, and hybrid algorithms."
      questionCount={40}
      price={99} // 👈 Added price
    />
  );
};

export default QuizSearchingSortingPage;