import React from 'react';
import BaseTopicQuizPage from '../../templates/BaseTopicQuizPage';
interface QuizArraysPageProps {
  darkMode: boolean;
  setDarkMode: (value: boolean) => void;
}

const QuizArraysPage: React.FC<QuizArraysPageProps> = ({ darkMode, setDarkMode }) => {
  return (
    <BaseTopicQuizPage
      darkMode={darkMode}
      setDarkMode={setDarkMode}
      topicId="arrays"
      topicName="Arrays & Strings"
      topicIcon="📊"
      topicColor="#3b82f6"
      description="Master array manipulation, searching, sorting, two-pointer technique, sliding window, and string algorithms."
      questionCount={80}
      price={99} // 👈 Added price
    />
  );
};

export default QuizArraysPage;