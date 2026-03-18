import React from 'react';
import BaseTopicQuizPage from '../../templates/BaseTopicQuizPage';
interface QuizDPPageProps {
  darkMode: boolean;
  setDarkMode: (value: boolean) => void;
}

const QuizDPPage: React.FC<QuizDPPageProps> = ({ darkMode, setDarkMode }) => {
  return (
    <BaseTopicQuizPage
      darkMode={darkMode}
      setDarkMode={setDarkMode}
      topicId="dp"
      topicName="Dynamic Programming"
      topicIcon="📈"
      topicColor="#ec4899"
      description="Master DP from basics to advanced including knapsack, LCS, matrix chain, and optimization problems."
      questionCount={70}
      price={99} // 👈 Added price
    />
  );
};

export default QuizDPPage;