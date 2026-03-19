import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  FaArrowLeft, 
  FaClock, 
  FaCheckCircle,
  FaFlag,
  FaRupeeSign,
  FaLock
} from 'react-icons/fa';
import { useAuth } from '../../hooks/useAuth';
import { showToast } from '../../utils/toast';

interface QuizTakingPageProps {
  darkMode: boolean;
  setDarkMode: (value: boolean) => void;
}

const QuizTakingPage: React.FC<QuizTakingPageProps> = ({ darkMode, setDarkMode }) => {
  const { quizId, subjectId, subtopicId } = useParams<{ quizId: string; subjectId: string; subtopicId: string }>();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  
  const [questions, setQuestions] = useState<any[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<number[]>([]);
  const [markedForReview, setMarkedForReview] = useState<number[]>([]);
  const [showResults, setShowResults] = useState(false);
  const [timeLeft, setTimeLeft] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [isPurchased, setIsPurchased] = useState(false);
  const [showPurchaseModal, setShowPurchaseModal] = useState(false);
  const [topicInfo, setTopicInfo] = useState({
    title: '',
    icon: '',
    color: '',
    totalQuestions: 0,
    price: 99
  });

  const checkPurchaseStatus = useCallback(() => {
    // Mock check - in real app, call API to check if user purchased
    const purchasedQuizzes = JSON.parse(localStorage.getItem('purchasedQuizzes') || '[]');
    setIsPurchased(purchasedQuizzes.includes(subtopicId));
  }, [subtopicId]);

  const fetchQuestions = useCallback(async () => {
    setIsLoading(true);
    try {
      // Mock questions based on subtopic
      let mockQuestions: any[] = [];
      let timeForQuiz = 0;
      let topicTitle = '';
      let topicIcon = '';
      let topicColor = '';

      // Physical Chemistry questions
      if (subtopicId === 'physical-chemistry') {
        mockQuestions = [
          {
            id: 1,
            text: 'What is the molar mass of water (H₂O)?',
            options: ['16 g/mol', '18 g/mol', '20 g/mol', '22 g/mol'],
            correctAnswer: 1,
            explanation: 'Water (H₂O) has molar mass = 2×1 + 16 = 18 g/mol'
          },
          {
            id: 2,
            text: 'Which of the following is an intensive property?',
            options: ['Mass', 'Volume', 'Density', 'Energy'],
            correctAnswer: 2,
            explanation: 'Density is intensive as it does not depend on the amount of substance.'
          },
          {
            id: 3,
            text: 'What is the pH of a 0.001 M HCl solution?',
            options: ['1', '2', '3', '4'],
            correctAnswer: 2,
            explanation: 'pH = -log[H⁺] = -log(10⁻³) = 3'
          },
          {
            id: 4,
            text: 'Which law states that volume of a gas is directly proportional to temperature at constant pressure?',
            options: ['Boyle\'s Law', 'Charles\' Law', 'Avogadro\'s Law', 'Gay-Lussac\'s Law'],
            correctAnswer: 1,
            explanation: 'Charles\' Law states V ∝ T at constant pressure.'
          }
        ];
        timeForQuiz = 15;
        topicTitle = 'Physical Chemistry';
        topicIcon = '⚡';
        topicColor = '#3b82f6';
      }
      // Organic Chemistry questions
      else if (subtopicId === 'organic-chemistry') {
        mockQuestions = [
          {
            id: 1,
            text: 'Which functional group is present in alcohols?',
            options: ['-OH', '-CHO', '-COOH', '-NH₂'],
            correctAnswer: 0,
            explanation: 'Alcohols contain the hydroxyl (-OH) functional group.'
          },
          {
            id: 2,
            text: 'What is the IUPAC name of CH₃-CH₂-OH?',
            options: ['Methanol', 'Ethanol', 'Propanol', 'Butanol'],
            correctAnswer: 1,
            explanation: 'CH₃-CH₂-OH is ethanol (ethyl alcohol).'
          },
          {
            id: 3,
            text: 'Which reaction is used to convert alkene to alkane?',
            options: ['Oxidation', 'Reduction', 'Hydrogenation', 'Halogenation'],
            correctAnswer: 2,
            explanation: 'Hydrogenation adds H₂ across double bond to form alkane.'
          }
        ];
        timeForQuiz = 12;
        topicTitle = 'Organic Chemistry';
        topicIcon = '🌿';
        topicColor = '#8b5cf6';
      }
      // Inorganic Chemistry questions
      else if (subtopicId === 'inorganic-chemistry') {
        mockQuestions = [
          {
            id: 1,
            text: 'Which element has the highest electronegativity?',
            options: ['Oxygen', 'Fluorine', 'Chlorine', 'Nitrogen'],
            correctAnswer: 1,
            explanation: 'Fluorine is the most electronegative element (4.0 on Pauling scale).'
          },
          {
            id: 2,
            text: 'What is the color of copper sulfate solution?',
            options: ['Green', 'Blue', 'Red', 'Yellow'],
            correctAnswer: 1,
            explanation: 'Copper sulfate (CuSO₄) solution is blue in color.'
          }
        ];
        timeForQuiz = 8;
        topicTitle = 'Inorganic Chemistry';
        topicIcon = '🧪';
        topicColor = '#10b981';
      }
      else {
        // Default questions
        mockQuestions = [
          {
            id: 1,
            text: 'Sample question 1?',
            options: ['Option A', 'Option B', 'Option C', 'Option D'],
            correctAnswer: 0,
            explanation: 'This is the explanation.'
          },
          {
            id: 2,
            text: 'Sample question 2?',
            options: ['Option A', 'Option B', 'Option C', 'Option D'],
            correctAnswer: 1,
            explanation: 'This is the explanation.'
          }
        ];
        timeForQuiz = 5;
        topicTitle = 'Quiz';
        topicIcon = '📝';
        topicColor = '#8b5cf6';
      }

      setQuestions(mockQuestions);
      setSelectedAnswers(new Array(mockQuestions.length).fill(-1));
      setTimeLeft(timeForQuiz * 60);
      setTopicInfo({
        title: topicTitle,
        icon: topicIcon,
        color: topicColor,
        totalQuestions: mockQuestions.length,
        price: 99
      });
    } catch (error) {
      console.error('Failed to fetch questions:', error);
    } finally {
      setIsLoading(false);
    }
  }, [subtopicId]);

  useEffect(() => {
    checkPurchaseStatus();
    fetchQuestions();
  }, [checkPurchaseStatus, fetchQuestions, subtopicId]); // Added all dependencies

  useEffect(() => {
    if (timeLeft > 0 && !showResults && isPurchased) {
      const timer = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            clearInterval(timer);
            setShowResults(true);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [timeLeft, showResults, isPurchased]);

  const handleAnswerSelect = (optionIndex: number) => {
    if (!isPurchased) return;
    const newAnswers = [...selectedAnswers];
    newAnswers[currentIndex] = optionIndex;
    setSelectedAnswers(newAnswers);
  };

  const handleMarkForReview = () => {
    if (!isPurchased) return;
    if (markedForReview.includes(currentIndex)) {
      setMarkedForReview(markedForReview.filter(i => i !== currentIndex));
    } else {
      setMarkedForReview([...markedForReview, currentIndex]);
    }
  };

  const handleNext = () => {
    if (!isPurchased) return;
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(prev => prev + 1);
    } else {
      setShowResults(true);
    }
  };

  const handlePrevious = () => {
    if (!isPurchased) return;
    if (currentIndex > 0) {
      setCurrentIndex(prev => prev - 1);
    }
  };

  const calculateScore = () => {
    let correct = 0;
    selectedAnswers.forEach((answer, index) => {
      if (answer === questions[index]?.correctAnswer) {
        correct++;
      }
    });
    return correct;
  };

  // BACK NAVIGATION - to subtopics page
  const handleBack = () => {
    navigate(`/quiz/${quizId}/${subjectId}`, { replace: true });
  };

  // AFTER RESULTS - back to subtopics page
  const handleBackToTopics = () => {
    navigate(`/quiz/${quizId}/${subjectId}`, { replace: true });
  };

  const handlePurchase = () => {
    if (!isAuthenticated) {
      showToast.error('Please login to purchase');
      navigate('/login');
      return;
    }

    // Mock purchase - in real app, integrate payment gateway
    const purchasedQuizzes = JSON.parse(localStorage.getItem('purchasedQuizzes') || '[]');
    if (subtopicId) {
      purchasedQuizzes.push(subtopicId);
      localStorage.setItem('purchasedQuizzes', JSON.stringify(purchasedQuizzes));
      setIsPurchased(true);
      setShowPurchaseModal(false);
      showToast.success('Quiz purchased successfully!');
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-300">Loading quiz...</p>
        </div>
      </div>
    );
  }

  // Show purchase modal if not purchased
  if (!isPurchased) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 relative">
        <div className="absolute inset-0 opacity-5 pointer-events-none">
          <div className="absolute top-0 left-0 w-96 h-96 bg-blue-500 rounded-full filter blur-3xl"></div>
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-purple-500 rounded-full filter blur-3xl"></div>
        </div>

        <div className="max-w-7xl mx-auto px-4 py-8 relative z-10">
          {/* Back Button */}
          <div className="mb-6">
            <button 
              className="inline-flex items-center gap-2 text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors group"
              onClick={handleBack}
            >
              <FaArrowLeft className="group-hover:-translate-x-1 transition-transform" /> Back to Topics
            </button>
          </div>

          {/* Purchase Card */}
          <div className="max-w-md mx-auto bg-white dark:bg-gray-800 rounded-2xl shadow-2xl overflow-hidden">
            <div className="bg-gradient-to-r from-blue-600 to-purple-700 p-8 text-center">
              <div className="bg-white/20 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
                <FaLock className="text-4xl text-white" />
              </div>
              <h1 className="text-2xl font-bold text-white mb-2">{topicInfo.title}</h1>
              <p className="text-white/80">Unlock full access</p>
            </div>

            <div className="p-8">
              <p className="text-gray-600 dark:text-gray-300 mb-6">
                This quiz requires purchase to access. Get full access to all questions and detailed solutions.
              </p>
              
              <div className="space-y-3 mb-6">
                <div className="flex items-center gap-3 text-gray-600 dark:text-gray-300">
                  <FaCheckCircle className="text-green-500" /> {topicInfo.totalQuestions} Practice Questions
                </div>
                <div className="flex items-center gap-3 text-gray-600 dark:text-gray-300">
                  <FaCheckCircle className="text-green-500" /> Detailed Solutions & Explanations
                </div>
                <div className="flex items-center gap-3 text-gray-600 dark:text-gray-300">
                  <FaCheckCircle className="text-green-500" /> Performance Analytics
                </div>
                <div className="flex items-center gap-3 text-gray-600 dark:text-gray-300">
                  <FaCheckCircle className="text-green-500" /> Unlimited Attempts
                </div>
              </div>

              <div className="text-center mb-6">
                <span className="text-sm text-gray-500 dark:text-gray-400 block mb-1">Price</span>
                <span className="text-4xl font-bold text-gray-800 dark:text-white flex items-center justify-center gap-1">
                  <FaRupeeSign className="text-3xl" /> 99/-
                </span>
              </div>

              <button 
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 rounded-lg font-semibold hover:from-blue-700 hover:to-purple-700 transition-all"
                onClick={() => setShowPurchaseModal(true)}
              >
                Purchase Now @ ₹99
              </button>
            </div>
          </div>

          {/* Purchase Modal */}
          {showPurchaseModal && (
            <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
              <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-md w-full p-6">
                <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">Confirm Purchase</h2>
                <p className="text-gray-600 dark:text-gray-300 mb-4">You're about to purchase {topicInfo.title} for</p>
                <div className="text-3xl font-bold text-gray-800 dark:text-white flex items-center justify-center gap-1 mb-6">
                  <FaRupeeSign /> 99/-
                </div>
                <div className="flex gap-3">
                  <button 
                    className="flex-1 px-4 py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-200 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                    onClick={() => setShowPurchaseModal(false)}
                  >
                    Cancel
                  </button>
                  <button 
                    className="flex-1 px-4 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all"
                    onClick={handlePurchase}
                  >
                    Confirm Purchase
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  if (showResults) {
    const score = calculateScore();
    const percentage = (score / questions.length) * 100;

    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 relative">
        <div className="absolute inset-0 opacity-5 pointer-events-none">
          <div className="absolute top-0 left-0 w-96 h-96 bg-blue-500 rounded-full filter blur-3xl"></div>
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-purple-500 rounded-full filter blur-3xl"></div>
        </div>

        <div className="max-w-4xl mx-auto px-4 py-8 relative z-10">
          {/* Back Button */}
          <div className="mb-6">
            <button 
              className="inline-flex items-center gap-2 text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors group"
              onClick={handleBackToTopics}
            >
              <FaArrowLeft className="group-hover:-translate-x-1 transition-transform" /> Back to Topics
            </button>
          </div>

          {/* Results Card */}
          <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-2xl overflow-hidden">
            <div className="bg-gradient-to-r from-blue-600 to-purple-700 p-8 text-center">
              <span className="text-6xl mb-4 block">🎉</span>
              <h1 className="text-3xl font-bold text-white">Quiz Completed!</h1>
            </div>

            <div className="p-8">
              {/* Score Circle */}
              <div className="flex justify-center mb-8">
                <div className="relative w-40 h-40">
                  <svg className="w-full h-full transform -rotate-90">
                    <circle
                      cx="80"
                      cy="80"
                      r="70"
                      stroke="currentColor"
                      strokeWidth="8"
                      fill="transparent"
                      className="text-gray-200 dark:text-gray-700"
                    />
                    <circle
                      cx="80"
                      cy="80"
                      r="70"
                      stroke="currentColor"
                      strokeWidth="8"
                      fill="transparent"
                      strokeDasharray={2 * Math.PI * 70}
                      strokeDashoffset={2 * Math.PI * 70 * (1 - percentage / 100)}
                      className="text-blue-600 dark:text-blue-400 transition-all duration-1000"
                      strokeLinecap="round"
                    />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-3xl font-bold text-gray-800 dark:text-white">
                      {score}/{questions.length}
                    </span>
                    <span className="text-sm text-gray-600 dark:text-gray-300">{Math.round(percentage)}%</span>
                  </div>
                </div>
              </div>

              {/* Performance Stats */}
              <div className="mb-8">
                <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">Your Performance</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="bg-gray-50 dark:bg-gray-700 rounded-xl p-4 text-center">
                    <span className="text-sm text-gray-600 dark:text-gray-300 block mb-1">Correct</span>
                    <span className="text-2xl font-bold text-green-600">{score}</span>
                  </div>
                  <div className="bg-gray-50 dark:bg-gray-700 rounded-xl p-4 text-center">
                    <span className="text-sm text-gray-600 dark:text-gray-300 block mb-1">Incorrect</span>
                    <span className="text-2xl font-bold text-red-600">{questions.length - score}</span>
                  </div>
                  <div className="bg-gray-50 dark:bg-gray-700 rounded-xl p-4 text-center">
                    <span className="text-sm text-gray-600 dark:text-gray-300 block mb-1">Time Taken</span>
                    <span className="text-2xl font-bold text-yellow-600">
                      {Math.floor((topicInfo.totalQuestions * 60 - timeLeft) / 60)}m {(topicInfo.totalQuestions * 60 - timeLeft) % 60}s
                    </span>
                  </div>
                  <div className="bg-gray-50 dark:bg-gray-700 rounded-xl p-4 text-center">
                    <span className="text-sm text-gray-600 dark:text-gray-300 block mb-1">Marked</span>
                    <span className="text-2xl font-bold text-purple-600">{markedForReview.length}</span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 justify-center">
                <button 
                  className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg font-semibold hover:from-blue-700 hover:to-purple-700 transition-all"
                  onClick={fetchQuestions}
                >
                  Retake Quiz
                </button>
                <button 
                  className="px-6 py-3 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white rounded-lg font-semibold hover:bg-gray-300 dark:hover:bg-gray-600 transition-all"
                  onClick={handleBackToTopics}
                >
                  Back to Topics
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const currentQuestion = questions[currentIndex];
  const progress = ((currentIndex + 1) / questions.length) * 100;
  const isMarked = markedForReview.includes(currentIndex);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 relative">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5 pointer-events-none">
        <div className="absolute top-0 left-0 w-96 h-96 bg-blue-500 rounded-full filter blur-3xl"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-purple-500 rounded-full filter blur-3xl"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8 relative z-10">
        {/* Back Button */}
        <div className="mb-6">
          <button 
            className="inline-flex items-center gap-2 text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors group"
            onClick={handleBack}
          >
            <FaArrowLeft className="group-hover:-translate-x-1 transition-transform" /> Back to Topics
          </button>
        </div>

        {/* Quiz Header */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 mb-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <span className="text-4xl" style={{ color: topicInfo.color }}>{topicInfo.icon}</span>
              <div>
                <h1 className="text-2xl font-bold text-gray-800 dark:text-white">{topicInfo.title}</h1>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  {topicInfo.totalQuestions} questions • {Math.floor(timeLeft / 60)}:{String(timeLeft % 60).padStart(2, '0')} remaining
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 bg-gray-100 dark:bg-gray-700 rounded-lg">
              <FaClock className="text-blue-600 dark:text-blue-400" />
              <span className="font-mono text-xl font-bold text-gray-800 dark:text-white">
                {Math.floor(timeLeft / 60)}:{String(timeLeft % 60).padStart(2, '0')}
              </span>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="mt-4 h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-blue-500 to-purple-500 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        </div>

        {/* Question Card */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 mb-6">
          {/* Question Header */}
          <div className="flex items-center justify-between mb-4">
            <span className="text-sm font-medium text-gray-600 dark:text-gray-300">
              Question {currentIndex + 1} of {questions.length}
            </span>
            <button 
              className={`flex items-center gap-2 px-3 py-1 rounded-lg transition-colors ${
                isMarked 
                  ? 'bg-yellow-100 dark:bg-yellow-900 text-yellow-600 dark:text-yellow-400' 
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
              }`}
              onClick={handleMarkForReview}
            >
              <FaFlag /> {isMarked ? 'Marked' : 'Mark for Review'}
            </button>
          </div>

          {/* Question Text */}
          <h2 className="text-xl font-medium text-gray-800 dark:text-white mb-6">
            {currentQuestion.text}
          </h2>

          {/* Options */}
          <div className="space-y-3 mb-6">
            {currentQuestion.options.map((option: string, index: number) => (
              <div
                key={index}
                className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                  selectedAnswers[currentIndex] === index
                    ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                    : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                }`}
                onClick={() => handleAnswerSelect(index)}
              >
                <div className="flex items-center gap-3">
                  <span className={`w-8 h-8 rounded-full flex items-center justify-center font-semibold ${
                    selectedAnswers[currentIndex] === index
                      ? 'bg-blue-500 text-white'
                      : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
                  }`}>
                    {String.fromCharCode(65 + index)}
                  </span>
                  <span className="text-gray-700 dark:text-gray-200">{option}</span>
                </div>
              </div>
            ))}
          </div>

          {/* Navigation Buttons */}
          <div className="flex gap-3">
            <button
              className={`flex-1 px-6 py-3 rounded-lg font-semibold transition-all ${
                currentIndex === 0
                  ? 'bg-gray-200 dark:bg-gray-700 text-gray-400 dark:text-gray-500 cursor-not-allowed'
                  : 'bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white hover:bg-gray-300 dark:hover:bg-gray-600'
              }`}
              onClick={handlePrevious}
              disabled={currentIndex === 0}
            >
              Previous
            </button>
            <button
              className={`flex-1 px-6 py-3 rounded-lg font-semibold transition-all ${
                selectedAnswers[currentIndex] === -1
                  ? 'bg-gray-200 dark:bg-gray-700 text-gray-400 dark:text-gray-500 cursor-not-allowed'
                  : 'bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700'
              }`}
              onClick={handleNext}
              disabled={selectedAnswers[currentIndex] === -1}
            >
              {currentIndex === questions.length - 1 ? 'Finish' : 'Next'}
            </button>
          </div>
        </div>

        {/* Question Palette */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">Question Palette</h3>
          <div className="grid grid-cols-5 sm:grid-cols-8 md:grid-cols-10 gap-2">
            {questions.map((_, index) => {
              let bgColor = '';
              
              if (selectedAnswers[index] !== -1) {
                bgColor = 'bg-green-100 dark:bg-green-900 text-green-600 dark:text-green-400';
              } else if (markedForReview.includes(index)) {
                bgColor = 'bg-yellow-100 dark:bg-yellow-900 text-yellow-600 dark:text-yellow-400';
              } else {
                bgColor = 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300';
              }

              return (
                <div
                  key={index}
                  className={`aspect-square rounded-lg flex items-center justify-center font-semibold cursor-pointer transition-all ${bgColor} ${
                    currentIndex === index ? 'ring-2 ring-blue-500 ring-offset-2 dark:ring-offset-gray-800' : ''
                  }`}
                  onClick={() => setCurrentIndex(index)}
                >
                  {index + 1}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuizTakingPage;