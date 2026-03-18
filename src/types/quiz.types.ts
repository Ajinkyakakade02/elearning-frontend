// ============================================
// QUIZ TYPES - UPDATED WITH NEW INTERFACES
// ============================================

// In your types/quiz.types.ts, update the Question interface:
export interface Question {
  id: number;
  quizId: number;
  questionText: string;
  optionA: string;
  optionB: string;
  optionC: string;
  optionD: string;
  correctAnswer: string; // 'A', 'B', 'C', or 'D'
  points: number;
  explanation?: string;
  difficulty?: 'Easy' | 'Medium' | 'Hard';
  topicId?: string;
  platform?: string;
  title?: string;
  url?: string;
}

export interface Quiz {
  id: number;
  lessonId: number;
  title: string;
  description: string;
  timeLimitMinutes: number;
  passingScore: number;
  questions: Question[];
  createdAt: string;
  totalAttempts?: number;
  averageScore?: number;
}

export interface TopicQuiz {
  id: string;
  title: string;
  description: string;
  questionCount: number;
  timeLimit: number;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  icon: string;
  attempts: number;
  color?: string;
}

export interface QuizAttempt {
  id: number;
  userId: number;
  quizId: number;
  topicId?: string;
  score: number;
  totalPoints: number;
  percentage: number;
  isPassed: boolean;
  answers: Record<number, string>; // questionId: selectedAnswer
  startedAt: string;
  completedAt?: string;
  timeSpentSeconds?: number;
}

export interface QuizResult {
  attempt: QuizAttempt;
  quiz: Quiz;
  correctAnswers: number;
  totalQuestions: number;
  correctAnswersDetails: {
    questionId: number;
    isCorrect: boolean;
    yourAnswer: string;
    correctAnswer: string;
    explanation?: string;
  }[];
}

export interface UserProgress {
  quizId: number;
  quizTitle: string;
  bestScore: number;
  attempts: number;
  lastAttemptDate: string;
  completed: boolean;
  averageTime: number;
}