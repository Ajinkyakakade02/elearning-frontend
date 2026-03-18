import React from 'react';
import BaseTopicQuizPage from '../../templates/BaseTopicQuizPage';
interface QuizLinkedListPageProps {
  darkMode: boolean;
  setDarkMode: (value: boolean) => void;
}

const QuizLinkedListPage: React.FC<QuizLinkedListPageProps> = ({ darkMode, setDarkMode }) => {
  return (
    <BaseTopicQuizPage
      darkMode={darkMode}
      setDarkMode={setDarkMode}
      topicId="linkedlist"
      topicName="Linked Lists"
      topicIcon="🔗"
      topicColor="#10b981"
      description="Complete linked list problems including singly linked lists, doubly linked lists, circular lists, and advanced operations."
      questionCount={60}
      price={99} // 👈 Added price
    />
  );
};

export default QuizLinkedListPage;