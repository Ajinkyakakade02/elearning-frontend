import React from 'react';
import BaseTopicQuizPage from '../../templates/BaseTopicQuizPage';
interface QuizStackQueuePageProps {
  darkMode: boolean;
  setDarkMode: (value: boolean) => void;
}

const QuizStackQueuePage: React.FC<QuizStackQueuePageProps> = ({ darkMode, setDarkMode }) => {
  return (
    <BaseTopicQuizPage
      darkMode={darkMode}
      setDarkMode={setDarkMode}
      topicId="stack-queue"
      topicName="Stacks & Queues"
      topicIcon="📚"
      topicColor="#f59e0b"
      description="Master stack and queue data structures, implementation, and problem-solving techniques."
      questionCount={50}
      price={99} // 👈 Added price
    />
  );
};

export default QuizStackQueuePage;