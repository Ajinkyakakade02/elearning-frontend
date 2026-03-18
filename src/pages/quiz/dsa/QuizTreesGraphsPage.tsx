import React from 'react';
import BaseTopicQuizPage from '../../templates/BaseTopicQuizPage';
interface QuizTreesGraphsPageProps {
  darkMode: boolean;
  setDarkMode: (value: boolean) => void;
}

const QuizTreesGraphsPage: React.FC<QuizTreesGraphsPageProps> = ({ darkMode, setDarkMode }) => {
  return (
    <BaseTopicQuizPage
      darkMode={darkMode}
      setDarkMode={setDarkMode}
      topicId="trees-graphs"
      topicName="Trees & Graphs"
      topicIcon="🌲"
      topicColor="#8b5cf6"
      description="Complete tree and graph algorithms including BST, AVL, BFS, DFS, Dijkstra, and advanced graph problems."
      questionCount={100}
      price={99} // 👈 Added price
    />
  );
};

export default QuizTreesGraphsPage;