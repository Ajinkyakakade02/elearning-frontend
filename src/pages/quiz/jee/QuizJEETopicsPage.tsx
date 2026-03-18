import React from 'react';
import BaseQuizPage from '../../templates/BaseQuizPage';  // Changed
import { FaAtom, FaFlask, FaSquareRootAlt, FaBolt } from 'react-icons/fa';

interface QuizJEETopicsPageProps {
  darkMode: boolean;
  setDarkMode: (value: boolean) => void;
}

const QuizJEETopicsPage: React.FC<QuizJEETopicsPageProps> = ({ darkMode, setDarkMode }) => {
  const topics = [
    {
      id: 'jee-physics',
      title: 'JEE Physics',
      description: 'Complete Physics for JEE Main & Advanced covering Mechanics, Thermodynamics, Optics, Electromagnetism, and Modern Physics.',
      icon: <FaAtom />,
      color: '#4299e1',
      questionCount: 120,
      timeLimit: 180,
      difficulty: 'Hard' as const,
      attempts: 25000,
      rating: 4.8,
      path: '/quiz/2/topic/jee-physics',
      price: 99
    },
    {
      id: 'jee-chemistry',
      title: 'JEE Chemistry',
      description: 'Complete Chemistry for JEE covering Physical, Inorganic, and Organic Chemistry with detailed solutions.',
      icon: <FaFlask />,
      color: '#48bb78',
      questionCount: 150,
      timeLimit: 180,
      difficulty: 'Hard' as const,
      attempts: 22000,
      rating: 4.7,
      path: '/quiz/2/topic/jee-chemistry',
      price: 99
    },
    {
      id: 'jee-mathematics',
      title: 'JEE Mathematics',
      description: 'Complete Mathematics for JEE covering Algebra, Calculus, Coordinate Geometry, Trigonometry, and Probability.',
      icon: <FaSquareRootAlt />,
      color: '#ed8936',
      questionCount: 130,
      timeLimit: 180,
      difficulty: 'Hard' as const,
      attempts: 28000,
      rating: 4.9,
      path: '/quiz/2/topic/jee-mathematics',
      price: 99
    }
  ];

  const stats = {
    totalTopics: topics.length,
    totalQuestions: topics.reduce((sum, t) => sum + t.questionCount, 0),
    totalAttempts: topics.reduce((sum, t) => sum + t.attempts, 0),
    avgRating: (topics.reduce((sum, t) => sum + t.rating, 0) / topics.length),
    totalValue: topics.length * 99
  };

  return (
    <BaseQuizPage
      darkMode={darkMode}
      setDarkMode={setDarkMode}
      quizId={2}
      quizTitle="JEE Quiz Series"
      quizDescription="Comprehensive practice for JEE Main & Advanced with topic-wise quizzes - All at ₹99/-"
      quizIcon={<FaBolt />}
      topics={topics}
      stats={stats}
    />
  );
};

export default QuizJEETopicsPage;