import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { quizService } from '../../services/quiz.service';
import certificateService from '../../services/certificate.service';
import { 
  FaTrophy, 
  FaStar, 
  FaClock, 
  FaCheckCircle, 
  FaTimesCircle,
  FaDownload,
  FaShare,
  FaRedo,
  FaHome,
  FaChartBar,
  FaFilter
} from 'react-icons/fa';
import { showToast } from '../../utils/toast';

interface QuizResultsPageProps {
  darkMode: boolean;
  setDarkMode: (value: boolean) => void;
}

const QuizResultsPage: React.FC<QuizResultsPageProps> = ({ darkMode, setDarkMode }) => {
  const { quizId } = useParams<{ quizId: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [result, setResult] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showCertificate, setShowCertificate] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);

  useEffect(() => {
    fetchResults();
  }, [quizId]);

  const fetchResults = async () => {
    setIsLoading(true);
    try {
      // Get the latest attempt from localStorage or API
      const storedResult = localStorage.getItem(`quiz_result_${quizId}`);
      if (storedResult) {
        setResult(JSON.parse(storedResult));
      } else {
        // Mock result for development
        setResult({
          quizId: Number(quizId),
          quizTitle: quizId === '1' ? 'DSA Quiz' : 
                     quizId === '2' ? 'JEE Quiz' : 
                     quizId === '3' ? 'NEET Quiz' : 
                     quizId === '4' ? 'MHT CET Quiz' : 'MHT CET Quiz',
          score: 8,
          totalQuestions: 10,
          percentage: 80,
          correctAnswers: 8,
          incorrectAnswers: 2,
          timeTaken: 450, // seconds
          passed: true,
          grade: 'A',
          attemptedAt: new Date().toISOString()
        });
      }
    } catch (error) {
      console.error('Failed to fetch results:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGenerateCertificate = async () => {
    if (!user) {
      showToast.error('Please login to generate certificate');
      return;
    }

    setIsGenerating(true);
    try {
      // Generate certificate
      const certificateBlob = await certificateService.generateCertificate(
        user.fullName || 'Student',
        result.quizTitle,
        result.score,
        result.percentage
      );

      // Download certificate
      certificateService.downloadCertificate(
        certificateBlob, 
        `${result.quizTitle}_Certificate.pdf`
      );

      showToast.success('Certificate generated successfully!');
    } catch (error) {
      console.error('Failed to generate certificate:', error);
      showToast.error('Failed to generate certificate');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleShareResult = () => {
    const text = `I scored ${result.score}/${result.totalQuestions} (${result.percentage}%) on ${result.quizTitle}! 🎓`;
    
    if (navigator.share) {
      navigator.share({
        title: 'My Quiz Result',
        text: text,
        url: window.location.href
      }).catch(() => {
        navigator.clipboard.writeText(text);
        showToast.success('Result copied to clipboard!');
      });
    } else {
      navigator.clipboard.writeText(text);
      showToast.success('Result copied to clipboard!');
    }
  };

  const handleRetake = () => {
    navigate(`/quiz/${quizId}`);
  };

  const handleBackToQuizzes = () => {
    navigate('/quiz');
  };

  const handleViewDetails = () => {
    setShowCertificate(!showCertificate);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-300">Loading your results...</p>
        </div>
      </div>
    );
  }

  if (!result) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 max-w-md text-center">
          <span className="text-6xl block mb-4">📊</span>
          <h3 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">No results found</h3>
          <p className="text-gray-600 dark:text-gray-300 mb-6">Take a quiz to see your results here</p>
          <button 
            className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            onClick={handleBackToQuizzes}
          >
            Browse Quizzes
          </button>
        </div>
      </div>
    );
  }

  // Calculate grade if not provided
  const grade = result.grade || 
    (result.percentage >= 90 ? 'A+' :
     result.percentage >= 80 ? 'A' :
     result.percentage >= 70 ? 'B' :
     result.percentage >= 60 ? 'C' : 'D');

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 relative">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5 pointer-events-none">
        <div className="absolute top-0 left-0 w-96 h-96 bg-blue-500 rounded-full filter blur-3xl"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-purple-500 rounded-full filter blur-3xl"></div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8 relative z-10">
        {/* Results Card */}
        <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-2xl overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 to-purple-700 text-white p-8 text-center">
            <span className="text-6xl mb-4 block">🎉</span>
            <h1 className="text-3xl font-bold mb-2">Quiz Completed!</h1>
            <p className="text-xl text-white/90">{result.quizTitle}</p>
          </div>

          <div className="p-8">
            {/* Score Circle */}
            <div className="flex justify-center mb-8">
              <div className="relative w-40 h-40">
                {/* Circular Progress */}
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
                    strokeDashoffset={2 * Math.PI * 70 * (1 - result.percentage / 100)}
                    className="text-blue-600 dark:text-blue-400 transition-all duration-1000"
                    strokeLinecap="round"
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-3xl font-bold text-gray-800 dark:text-white">
                    {result.score}/{result.totalQuestions}
                  </span>
                  <span className="text-sm text-gray-600 dark:text-gray-300">{result.percentage}%</span>
                  {result.passed && (
                    <span className="flex items-center gap-1 text-xs text-green-600 dark:text-green-400 mt-1">
                      <FaCheckCircle /> Passed
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Grade */}
            <div className="text-center mb-8">
              <span className="text-sm text-gray-600 dark:text-gray-300 block mb-1">Your Grade</span>
              <span className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
                {grade}
              </span>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              <div className="bg-gray-50 dark:bg-gray-700 rounded-xl p-4 text-center">
                <FaCheckCircle className="text-2xl text-green-500 mx-auto mb-2" />
                <span className="text-xl font-bold text-gray-800 dark:text-white block">
                  {result.correctAnswers}
                </span>
                <span className="text-xs text-gray-600 dark:text-gray-300">Correct</span>
              </div>
              
              <div className="bg-gray-50 dark:bg-gray-700 rounded-xl p-4 text-center">
                <FaTimesCircle className="text-2xl text-red-500 mx-auto mb-2" />
                <span className="text-xl font-bold text-gray-800 dark:text-white block">
                  {result.incorrectAnswers || result.totalQuestions - result.correctAnswers}
                </span>
                <span className="text-xs text-gray-600 dark:text-gray-300">Incorrect</span>
              </div>
              
              <div className="bg-gray-50 dark:bg-gray-700 rounded-xl p-4 text-center">
                <FaClock className="text-2xl text-yellow-500 mx-auto mb-2" />
                <span className="text-xl font-bold text-gray-800 dark:text-white block">
                  {Math.floor(result.timeTaken / 60)}:{String(result.timeTaken % 60).padStart(2, '0')}
                </span>
                <span className="text-xs text-gray-600 dark:text-gray-300">Time</span>
              </div>
              
              <div className="bg-gray-50 dark:bg-gray-700 rounded-xl p-4 text-center">
                <FaChartBar className="text-2xl text-purple-500 mx-auto mb-2" />
                <span className="text-xl font-bold text-gray-800 dark:text-white block">
                  {result.percentage}%
                </span>
                <span className="text-xs text-gray-600 dark:text-gray-300">Accuracy</span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
              {result.passed && (
                <button 
                  className="flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-yellow-500 to-orange-500 text-white rounded-lg font-semibold hover:from-yellow-600 hover:to-orange-600 transition-all disabled:opacity-50"
                  onClick={handleGenerateCertificate}
                  disabled={isGenerating}
                >
                  <FaTrophy /> 
                  {isGenerating ? 'Generating...' : 'Get Certificate'}
                </button>
              )}
              
              <button 
                className="flex items-center justify-center gap-2 px-4 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-all"
                onClick={handleShareResult}
              >
                <FaShare /> Share
              </button>
              
              <button 
                className="flex items-center justify-center gap-2 px-4 py-3 bg-purple-600 text-white rounded-lg font-semibold hover:bg-purple-700 transition-all"
                onClick={handleRetake}
              >
                <FaRedo /> Retake
              </button>
              
              <button 
                className="flex items-center justify-center gap-2 px-4 py-3 bg-gray-600 text-white rounded-lg font-semibold hover:bg-gray-700 transition-all"
                onClick={handleBackToQuizzes}
              >
                <FaHome /> Quizzes
              </button>
            </div>

            {/* View Details Toggle */}
            <button 
              className="w-full text-center text-blue-600 dark:text-blue-400 hover:underline py-2"
              onClick={handleViewDetails}
            >
              {showCertificate ? 'Hide Details' : 'View Detailed Answers'}
            </button>

            {/* Detailed Answers Section */}
            {showCertificate && (
              <div className="mt-6 p-6 bg-gray-50 dark:bg-gray-700 rounded-xl">
                <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">
                  Question-wise Analysis
                </h3>
                <p className="text-center text-gray-600 dark:text-gray-300 py-8">
                  Detailed answers coming soon!
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuizResultsPage;