import React from 'react';
import BaseQuizPage from '../../templates/BaseQuizPage';  // Changed
import { FaAtom, FaFlask, FaSquareRootAlt, FaDna } from 'react-icons/fa';

interface QuizMHTCETTopicsPageProps {
  darkMode: boolean;
  setDarkMode: (value: boolean) => void;
}

const QuizMHTCETTopicsPage: React.FC<QuizMHTCETTopicsPageProps> = ({ darkMode, setDarkMode }) => {
  const topics = [
    {
      id: 'mhtcet-physics',
      title: 'MHT CET Physics',
      description: 'Complete Physics for MHT CET covering Mechanics, Thermodynamics, Optics, Electromagnetism, Modern Physics, and Semiconductors.',
      icon: <FaAtom />,
      color: '#3b82f6',
      questionCount: 100,
      timeLimit: 90,
      difficulty: 'Medium' as const,
      attempts: 12000,
      rating: 4.6,
      path: '/quiz/5/topic/mhtcet-physics',
      price: 99 // 👈 Added price
    },
    {
      id: 'mhtcet-chemistry',
      title: 'MHT CET Chemistry',
      description: 'Complete Chemistry for MHT CET covering Physical Chemistry, Inorganic Chemistry, and Organic Chemistry.',
      icon: <FaFlask />,
      color: '#10b981',
      questionCount: 100,
      timeLimit: 90,
      difficulty: 'Medium' as const,
      attempts: 11000,
      rating: 4.5,
      path: '/quiz/5/topic/mhtcet-chemistry',
      price: 99 // 👈 Added price
    },
    {
      id: 'mhtcet-mathematics',
      title: 'MHT CET Mathematics',
      description: 'Complete Mathematics for MHT CET covering Algebra, Calculus, Trigonometry, Coordinate Geometry, and Vectors.',
      icon: <FaSquareRootAlt />,
      color: '#f59e0b',
      questionCount: 100,
      timeLimit: 90,
      difficulty: 'Hard' as const,
      attempts: 15000,
      rating: 4.7,
      path: '/quiz/5/topic/mhtcet-mathematics',
      price: 99 // 👈 Added price
    },
    {
      id: 'mhtcet-biology',
      title: 'MHT CET Biology',
      description: 'Complete Biology for MHT CET (PCB stream) covering Botany, Zoology, Human Physiology, Genetics, and Biotechnology.',
      icon: <FaDna />,
      color: '#8b5cf6',
      questionCount: 100,
      timeLimit: 90,
      difficulty: 'Medium' as const,
      attempts: 8000,
      rating: 4.5,
      path: '/quiz/5/topic/mhtcet-biology',
      price: 99 // 👈 Added price
    }
  ];

const stats = {
  totalTopics: topics.length,
  totalQuestions: topics.reduce((sum, t) => sum + t.questionCount, 0),
  totalAttempts: topics.reduce((sum, t) => sum + t.attempts, 0),
  avgRating: (topics.reduce((sum, t) => sum + t.rating, 0) / topics.length), // Keep as number
  totalValue: topics.length * 99
};

  return (
    <BaseQuizPage
      darkMode={darkMode}
      setDarkMode={setDarkMode}
      quizId={5}
      quizTitle="MHT CET Quiz Series"
      quizDescription="Comprehensive practice for Maharashtra Common Entrance Test with subject-wise quizzes - All at ₹99/-"
      quizIcon="📝"
      topics={topics}
      stats={stats}
    />
  );
};

export default QuizMHTCETTopicsPage;