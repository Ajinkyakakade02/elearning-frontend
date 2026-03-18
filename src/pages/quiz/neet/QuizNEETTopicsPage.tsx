import React from 'react';
import BaseQuizPage from '../../templates/BaseQuizPage';  // Changed
import { FaDna, FaAtom, FaFlask, FaHeartbeat } from 'react-icons/fa';

interface QuizNEETTopicsPageProps {
  darkMode: boolean;
  setDarkMode: (value: boolean) => void;
}

const QuizNEETTopicsPage: React.FC<QuizNEETTopicsPageProps> = ({ darkMode, setDarkMode }) => {
  const topics = [
    {
      id: 'neet-biology',
      title: 'NEET Biology',
      description: 'Complete Biology for NEET covering Botany, Zoology, Human Physiology, Genetics, and Ecology.',
      icon: <FaDna />,
      color: '#10b981',
      questionCount: 200,
      timeLimit: 180,
      difficulty: 'Medium' as const,
      attempts: 35000,
      rating: 4.8,
      path: '/quiz/3/topic/neet-biology',
      price: 99
    },
    {
      id: 'neet-physics',
      title: 'NEET Physics',
      description: 'Complete Physics for NEET covering Mechanics, Thermodynamics, Optics, Electromagnetism, and Modern Physics.',
      icon: <FaAtom />,
      color: '#4299e1',
      questionCount: 150,
      timeLimit: 180,
      difficulty: 'Medium' as const,
      attempts: 28000,
      rating: 4.7,
      path: '/quiz/3/topic/neet-physics',
      price: 99
    },
    {
      id: 'neet-chemistry',
      title: 'NEET Chemistry',
      description: 'Complete Chemistry for NEET covering Physical, Inorganic, and Organic Chemistry.',
      icon: <FaFlask />,
      color: '#48bb78',
      questionCount: 150,
      timeLimit: 180,
      difficulty: 'Medium' as const,
      attempts: 30000,
      rating: 4.7,
      path: '/quiz/3/topic/neet-chemistry',
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
      quizId={3}
      quizTitle="NEET Quiz Series"
      quizDescription="Comprehensive practice for NEET UG with topic-wise quizzes - All at ₹99/-"
      quizIcon={<FaHeartbeat />}
      topics={topics}
      stats={stats}
    />
  );
};

export default QuizNEETTopicsPage;