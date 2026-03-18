import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';
import { NotificationProvider } from './context/NotificationContext';
import { useAuth } from './hooks/useAuth'; 

// Import Header and Footer
import Navbar from './components/core/Navbar';
import Footer from './components/core/Footer';

import ProtectedRoute from './components/core/ProtectedRoute';

// ===== PUBLIC PAGES =====
import LoginPage from './pages/auth/LoginPage';
import ForgotPasswordPage from './pages/auth/ForgotPasswordPage';
import OAuthCallbackPage from './pages/auth/OAuthCallbackPage';

// ===== USER PAGES =====
import DashboardPage from './pages/dashboard/DashboardPage';
import CoursesPage from './pages/courses/CoursesPage';
import CourseDetailsPage from './pages/courses/CourseDetailsPage';
import LessonDetailsPage from './pages/courses/LessonDetailsPage';
import ProfilePage from './pages/user/ProfilePage';
import MyCoursesPage from './pages/user/MyCoursesPage';
import CertificatesPage from './pages/user/CertificatesPage';
import WishlistPage from './pages/user/WishlistPage';
import ProgressPage from './pages/user/ProgressPage';

// ===== DSA PAGES =====
import DSAPage from './pages/dsa/DSAPage';
import DSASheetPage from './pages/dsa/DSASheetPage';
import DSATopicQuizPage from './pages/dsa/DSATopicQuizPage';

// ===== QUIZ PAGES =====
import QuizPage from './pages/quiz/QuizPage';
import QuizTakingPage from './pages/quiz/QuizTakingPage';
import QuizResultsPage from './pages/quiz/QuizResultsPage';
import QuizSubtopicsPage from './pages/quiz/QuizSubtopicsPage';

// ===== QUIZ TOPICS PAGES =====
import QuizArraysPage from './pages/quiz/dsa/QuizArraysPage';
import QuizLinkedListPage from './pages/quiz/dsa/QuizLinkedListPage';
import QuizStackQueuePage from './pages/quiz/dsa/QuizStackQueuePage';
import QuizTreesGraphsPage from './pages/quiz/dsa/QuizTreesGraphsPage';
import QuizDPPage from './pages/quiz/dsa/QuizDPPage';
import QuizSearchingSortingPage from './pages/quiz/dsa/QuizSearchingSortingPage';

// ===== JEE QUIZ PAGES =====
import QuizJEEPhysicsPage from './pages/quiz/jee/QuizJEEPhysicsPage';
import QuizJEEChemistryPage from './pages/quiz/jee/QuizJEEChemistryPage';
import QuizJEEMathematicsPage from './pages/quiz/jee/QuizJEEMathematicsPage';

// ===== NEET QUIZ PAGES =====
import QuizNEETBiologyPage from './pages/quiz/neet/QuizNEETBiologyPage';
import QuizNEETPhysicsPage from './pages/quiz/neet/QuizNEETPhysicsPage';
import QuizNEETChemistryPage from './pages/quiz/neet/QuizNEETChemistryPage';

// ===== MHT CET QUIZ PAGES =====
import QuizMHTCETPhysicsPage from './pages/quiz/mhtcet/QuizMHTCETPhysicsPage';
import QuizMHTCETChemistryPage from './pages/quiz/mhtcet/QuizMHTCETChemistryPage';
import QuizMHTCETMathematicsPage from './pages/quiz/mhtcet/QuizMHTCETMathematicsPage';
import QuizMHTCETBiologyPage from './pages/quiz/mhtcet/QuizMHTCETBiologyPage';

// ===== QUIZ TOPICS LIST PAGES =====
import QuizJEETopicsPage from './pages/quiz/jee/QuizJEETopicsPage';
import QuizNEETTopicsPage from './pages/quiz/neet/QuizNEETTopicsPage';
import QuizMHTCETTopicsPage from './pages/quiz/mhtcet/QuizMHTCETTopicsPage';
import QuizDSATopicsPage from './pages/quiz/dsa/QuizDSATopicsPage';

// ===== EXAM MAIN PAGES =====
import JEEPage from './pages/exams/JEEPage';
import NEETPage from './pages/exams/NEETPage';
import UPSCPage from './pages/exams/UPSCPage';
import MHTCETPage from './pages/exams/MHTCETPage';

// ===== EXAM SECTION PAGES =====
// JEE
import ChemistrySectionsPage from './pages/exam-sections/jee/ChemistrySectionsPage';
import ChemistrySectionLessonsPage from './pages/exam-sections/jee/ChemistrySectionLessonsPage';

// NEET
import NEETSectionsPage from './pages/exam-sections/neet/NEETSectionsPage';
import NEETSectionLessonsPage from './pages/exam-sections/neet/NEETSectionLessonsPage';
import NEETChemistrySectionsPage from './pages/exam-sections/neet/NEETChemistrySectionsPage';
import NEETChemistrySectionLessonsPage from './pages/exam-sections/neet/NEETChemistrySectionLessonsPage';

// UPSC
import UPSCTopicsPage from './pages/exam-sections/upsc/UPSCTopicsPage';
import UPSCTopicLessonsPage from './pages/exam-sections/upsc/UPSCTopicLessonsPage';
import PrelimsGSSectionsPage from './pages/exam-sections/upsc/PrelimsGSSectionsPage';
import CSATSectionsPage from './pages/exam-sections/upsc/CSATSectionsPage';
import CSATTopicLessonsPage from './pages/exam-sections/upsc/CSATTopicLessonsPage';
import MainsGSSectionsPage from './pages/exam-sections/upsc/MainsGSSectionsPage';
import MainsGSPaperLessonsPage from './pages/exam-sections/upsc/MainsGSPaperLessonsPage';
import EthicsSectionsPage from './pages/exam-sections/upsc/EthicsSectionsPage';
import EthicsTopicLessonsPage from './pages/exam-sections/upsc/EthicsTopicLessonsPage';
import EssayOptionalSectionsPage from './pages/exam-sections/upsc/EssayOptionalSectionsPage';
import EssayTopicLessonsPage from './pages/exam-sections/upsc/EssayTopicLessonsPage';
import IndianHistoryPage from './pages/exam-sections/upsc/IndianHistoryPage';
import IndianGeographyPage from './pages/exam-sections/upsc/IndianGeographyPage';
import IndianPolityPage from './pages/exam-sections/upsc/IndianPolityPage';
import IndianEconomyPage from './pages/exam-sections/upsc/IndianEconomyPage';
import EnvironmentPage from './pages/exam-sections/upsc/EnvironmentPage';
import GeneralSciencePage from './pages/exam-sections/upsc/GeneralSciencePage';

// MHT CET
import MHTCETChemistryPage from './pages/exam-sections/mhtcet/MHTCETChemistryPage';
import MHTCETBiologyPage from './pages/exam-sections/mhtcet/MHTCETBiologyPage';
import MHTCETPhysicalChemistryPage from './pages/exam-sections/mhtcet/MHTCETPhysicalChemistryPage';
import MHTCETInorganicChemistryPage from './pages/exam-sections/mhtcet/MHTCETInorganicChemistryPage';
import MHTCETOrganicChemistryPage from './pages/exam-sections/mhtcet/MHTCETOrganicChemistryPage';
import MHTCETBotanyPage from './pages/exam-sections/mhtcet/MHTCETBotanyPage';
import MHTCETZoologyPage from './pages/exam-sections/mhtcet/MHTCETZoologyPage';
import MHTCETBiotechPage from './pages/exam-sections/mhtcet/MHTCETBiotechPage';

// ===== CSS STYLES =====
import './App.css';
import './index.css';

// Layout component that wraps all pages with Header and Footer
const PageLayout: React.FC<{ children: React.ReactNode; darkMode: boolean; setDarkMode: (value: boolean) => void }> = ({ 
  children, 
  darkMode, 
  setDarkMode 
}) => {
  return (
    <>
      <Navbar darkMode={darkMode} setDarkMode={setDarkMode} />
      <main className="main-content">
        {children}
      </main>
      <Footer darkMode={darkMode} />
    </>
  );
};

// 👇 DEBUG COMPONENT - Remove this in production
const AuthDebugger = () => {
  const { user, isAuthenticated } = useAuth();
  
  useEffect(() => {
    if (process.env.NODE_ENV === 'development') {
      console.log('🔍 Auth Debugger:', { isAuthenticated, user, role: user?.role });
    }
  }, [user, isAuthenticated]);
  
  return null;
};

function App() {
  const [darkMode, setDarkMode] = useState(() => {
    const saved = localStorage.getItem('darkMode');
    return saved ? JSON.parse(saved) : false;
  });

  useEffect(() => {
    localStorage.setItem('darkMode', JSON.stringify(darkMode));
    document.body.classList.toggle('dark', darkMode);
  }, [darkMode]);

  return (
    <AuthProvider>
      <NotificationProvider>
        <Router>
          {process.env.NODE_ENV === 'development' && <AuthDebugger />}
          <Toaster 
            position="top-right"
            toastOptions={{
              duration: 3000,
              style: {
                background: darkMode ? '#1f2937' : '#ffffff',
                color: darkMode ? '#f3f4f6' : '#1f2937',
              },
            }}
          />
          
          <div className={`app ${darkMode ? 'dark' : 'light'}`}>
            <Routes>
              {/* ===== PUBLIC ROUTES ===== */}
              <Route path="/login" element={
                <PageLayout darkMode={darkMode} setDarkMode={setDarkMode}>
                  <LoginPage darkMode={darkMode} setDarkMode={setDarkMode} />
                </PageLayout>
              } />
              
              <Route path="/forgot-password" element={
                <PageLayout darkMode={darkMode} setDarkMode={setDarkMode}>
                  <ForgotPasswordPage darkMode={darkMode} setDarkMode={setDarkMode} />
                </PageLayout>
              } />
              
              <Route path="/" element={<Navigate to="/dashboard" replace />} />
              <Route path="/auth/google/callback" element={<OAuthCallbackPage />} />
              <Route path="/auth/github/callback" element={<OAuthCallbackPage />} />

              {/* ===== PROTECTED USER ROUTES ===== */}
              <Route path="/dashboard" element={
                <ProtectedRoute>
                  <PageLayout darkMode={darkMode} setDarkMode={setDarkMode}>
                    <DashboardPage darkMode={darkMode} setDarkMode={setDarkMode} />
                  </PageLayout>
                </ProtectedRoute>
              } />
              
              <Route path="/courses" element={
                <ProtectedRoute>
                  <PageLayout darkMode={darkMode} setDarkMode={setDarkMode}>
                    <CoursesPage darkMode={darkMode} setDarkMode={setDarkMode} />
                  </PageLayout>
                </ProtectedRoute>
              } />
              
              <Route path="/courses/:courseId/learn/:lessonId" element={
                <ProtectedRoute>
                  <PageLayout darkMode={darkMode} setDarkMode={setDarkMode}>
                    <LessonDetailsPage darkMode={darkMode} setDarkMode={setDarkMode} />
                  </PageLayout>
                </ProtectedRoute>
              } />
              
              <Route path="/courses/:courseId" element={
                <ProtectedRoute>
                  <PageLayout darkMode={darkMode} setDarkMode={setDarkMode}>
                    <CourseDetailsPage darkMode={darkMode} setDarkMode={setDarkMode} />
                  </PageLayout>
                </ProtectedRoute>
              } />

              {/* ===== DSA ROUTES ===== */}
              <Route path="/dsa" element={
                <ProtectedRoute>
                  <PageLayout darkMode={darkMode} setDarkMode={setDarkMode}>
                    <DSAPage darkMode={darkMode} setDarkMode={setDarkMode} />
                  </PageLayout>
                </ProtectedRoute>
              } />
              
              <Route path="/dsa/sheet" element={
                <ProtectedRoute>
                  <PageLayout darkMode={darkMode} setDarkMode={setDarkMode}>
                    <DSASheetPage darkMode={darkMode} setDarkMode={setDarkMode} />
                  </PageLayout>
                </ProtectedRoute>
              } />
              
              <Route path="/dsa/topic/:topicId" element={
                <ProtectedRoute>
                  <PageLayout darkMode={darkMode} setDarkMode={setDarkMode}>
                    <DSATopicQuizPage darkMode={darkMode} setDarkMode={setDarkMode} />
                  </PageLayout>
                </ProtectedRoute>
              } />
              
              {/* Backward compatibility */}
              <Route path="/courses/4" element={<Navigate to="/dsa/topic/arrays" replace />} />
              <Route path="/courses/5" element={<Navigate to="/dsa/topic/two-pointers" replace />} />
              <Route path="/courses/6" element={<Navigate to="/dsa/topic/sliding-window" replace />} />

              {/* ===== QUIZ ROUTES ===== */}
              <Route path="/quiz" element={
                <ProtectedRoute>
                  <PageLayout darkMode={darkMode} setDarkMode={setDarkMode}>
                    <QuizPage darkMode={darkMode} setDarkMode={setDarkMode} />
                  </PageLayout>
                </ProtectedRoute>
              } />
              
              {/* Quiz Topics Pages */}
              <Route path="/quiz/1" element={
                <ProtectedRoute>
                  <PageLayout darkMode={darkMode} setDarkMode={setDarkMode}>
                    <QuizDSATopicsPage darkMode={darkMode} setDarkMode={setDarkMode} />
                  </PageLayout>
                </ProtectedRoute>
              } />
              
              <Route path="/quiz/2" element={
                <ProtectedRoute>
                  <PageLayout darkMode={darkMode} setDarkMode={setDarkMode}>
                    <QuizJEETopicsPage darkMode={darkMode} setDarkMode={setDarkMode} />
                  </PageLayout>
                </ProtectedRoute>
              } />
              
              <Route path="/quiz/3" element={
                <ProtectedRoute>
                  <PageLayout darkMode={darkMode} setDarkMode={setDarkMode}>
                    <QuizNEETTopicsPage darkMode={darkMode} setDarkMode={setDarkMode} />
                  </PageLayout>
                </ProtectedRoute>
              } />
              
              <Route path="/quiz/5" element={
                <ProtectedRoute>
                  <PageLayout darkMode={darkMode} setDarkMode={setDarkMode}>
                    <QuizMHTCETTopicsPage darkMode={darkMode} setDarkMode={setDarkMode} />
                  </PageLayout>
                </ProtectedRoute>
              } />
              
              {/* Quiz Subtopic Pages */}
              <Route path="/quiz/:quizId/:subjectId" element={
                <ProtectedRoute>
                  <PageLayout darkMode={darkMode} setDarkMode={setDarkMode}>
                    <QuizSubtopicsPage darkMode={darkMode} setDarkMode={setDarkMode} />
                  </PageLayout>
                </ProtectedRoute>
              } />
              
              <Route path="/quiz/:quizId/:subjectId/:subtopicId" element={
                <ProtectedRoute>
                  <PageLayout darkMode={darkMode} setDarkMode={setDarkMode}>
                    <QuizTakingPage darkMode={darkMode} setDarkMode={setDarkMode} />
                  </PageLayout>
                </ProtectedRoute>
              } />
              
              <Route path="/quiz/:quizId/results" element={
                <ProtectedRoute>
                  <PageLayout darkMode={darkMode} setDarkMode={setDarkMode}>
                    <QuizResultsPage darkMode={darkMode} setDarkMode={setDarkMode} />
                  </PageLayout>
                </ProtectedRoute>
              } />

              {/* DSA Quiz Topic Pages */}
              <Route path="/quiz/1/topic/arrays" element={
                <ProtectedRoute>
                  <PageLayout darkMode={darkMode} setDarkMode={setDarkMode}>
                    <QuizArraysPage darkMode={darkMode} setDarkMode={setDarkMode} />
                  </PageLayout>
                </ProtectedRoute>
              } />
              
              <Route path="/quiz/1/topic/linkedlist" element={
                <ProtectedRoute>
                  <PageLayout darkMode={darkMode} setDarkMode={setDarkMode}>
                    <QuizLinkedListPage darkMode={darkMode} setDarkMode={setDarkMode} />
                  </PageLayout>
                </ProtectedRoute>
              } />
              
              <Route path="/quiz/1/topic/stack-queue" element={
                <ProtectedRoute>
                  <PageLayout darkMode={darkMode} setDarkMode={setDarkMode}>
                    <QuizStackQueuePage darkMode={darkMode} setDarkMode={setDarkMode} />
                  </PageLayout>
                </ProtectedRoute>
              } />
              
              <Route path="/quiz/1/topic/trees-graphs" element={
                <ProtectedRoute>
                  <PageLayout darkMode={darkMode} setDarkMode={setDarkMode}>
                    <QuizTreesGraphsPage darkMode={darkMode} setDarkMode={setDarkMode} />
                  </PageLayout>
                </ProtectedRoute>
              } />
              
              <Route path="/quiz/1/topic/dp" element={
                <ProtectedRoute>
                  <PageLayout darkMode={darkMode} setDarkMode={setDarkMode}>
                    <QuizDPPage darkMode={darkMode} setDarkMode={setDarkMode} />
                  </PageLayout>
                </ProtectedRoute>
              } />
              
              <Route path="/quiz/1/topic/searching-sorting" element={
                <ProtectedRoute>
                  <PageLayout darkMode={darkMode} setDarkMode={setDarkMode}>
                    <QuizSearchingSortingPage darkMode={darkMode} setDarkMode={setDarkMode} />
                  </PageLayout>
                </ProtectedRoute>
              } />

              {/* JEE Quiz Pages */}
              <Route path="/quiz/2/topic/jee-physics" element={
                <ProtectedRoute>
                  <PageLayout darkMode={darkMode} setDarkMode={setDarkMode}>
                    <QuizJEEPhysicsPage darkMode={darkMode} setDarkMode={setDarkMode} />
                  </PageLayout>
                </ProtectedRoute>
              } />
              
              <Route path="/quiz/2/topic/jee-chemistry" element={
                <ProtectedRoute>
                  <PageLayout darkMode={darkMode} setDarkMode={setDarkMode}>
                    <QuizJEEChemistryPage darkMode={darkMode} setDarkMode={setDarkMode} />
                  </PageLayout>
                </ProtectedRoute>
              } />
              
              <Route path="/quiz/2/topic/jee-mathematics" element={
                <ProtectedRoute>
                  <PageLayout darkMode={darkMode} setDarkMode={setDarkMode}>
                    <QuizJEEMathematicsPage darkMode={darkMode} setDarkMode={setDarkMode} />
                  </PageLayout>
                </ProtectedRoute>
              } />

              {/* NEET Quiz Pages */}
              <Route path="/quiz/3/topic/neet-biology" element={
                <ProtectedRoute>
                  <PageLayout darkMode={darkMode} setDarkMode={setDarkMode}>
                    <QuizNEETBiologyPage darkMode={darkMode} setDarkMode={setDarkMode} />
                  </PageLayout>
                </ProtectedRoute>
              } />
              
              <Route path="/quiz/3/topic/neet-physics" element={
                <ProtectedRoute>
                  <PageLayout darkMode={darkMode} setDarkMode={setDarkMode}>
                    <QuizNEETPhysicsPage darkMode={darkMode} setDarkMode={setDarkMode} />
                  </PageLayout>
                </ProtectedRoute>
              } />
              
              <Route path="/quiz/3/topic/neet-chemistry" element={
                <ProtectedRoute>
                  <PageLayout darkMode={darkMode} setDarkMode={setDarkMode}>
                    <QuizNEETChemistryPage darkMode={darkMode} setDarkMode={setDarkMode} />
                  </PageLayout>
                </ProtectedRoute>
              } />

              {/* MHT CET Quiz Pages */}
              <Route path="/quiz/5/topic/mhtcet-physics" element={
                <ProtectedRoute>
                  <PageLayout darkMode={darkMode} setDarkMode={setDarkMode}>
                    <QuizMHTCETPhysicsPage darkMode={darkMode} setDarkMode={setDarkMode} />
                  </PageLayout>
                </ProtectedRoute>
              } />
              
              <Route path="/quiz/5/topic/mhtcet-chemistry" element={
                <ProtectedRoute>
                  <PageLayout darkMode={darkMode} setDarkMode={setDarkMode}>
                    <QuizMHTCETChemistryPage darkMode={darkMode} setDarkMode={setDarkMode} />
                  </PageLayout>
                </ProtectedRoute>
              } />
              
              <Route path="/quiz/5/topic/mhtcet-mathematics" element={
                <ProtectedRoute>
                  <PageLayout darkMode={darkMode} setDarkMode={setDarkMode}>
                    <QuizMHTCETMathematicsPage darkMode={darkMode} setDarkMode={setDarkMode} />
                  </PageLayout>
                </ProtectedRoute>
              } />
              
              <Route path="/quiz/5/topic/mhtcet-biology" element={
                <ProtectedRoute>
                  <PageLayout darkMode={darkMode} setDarkMode={setDarkMode}>
                    <QuizMHTCETBiologyPage darkMode={darkMode} setDarkMode={setDarkMode} />
                  </PageLayout>
                </ProtectedRoute>
              } />

              {/* Legacy quiz routes */}
              <Route path="/courses/:courseId/quiz/:quizId" element={
                <ProtectedRoute>
                  <PageLayout darkMode={darkMode} setDarkMode={setDarkMode}>
                    <QuizTakingPage darkMode={darkMode} setDarkMode={setDarkMode} />
                  </PageLayout>
                </ProtectedRoute>
              } />
              
              <Route path="/courses/:courseId/quiz/:quizId/results" element={
                <ProtectedRoute>
                  <PageLayout darkMode={darkMode} setDarkMode={setDarkMode}>
                    <QuizTakingPage darkMode={darkMode} setDarkMode={setDarkMode} />
                  </PageLayout>
                </ProtectedRoute>
              } />

              {/* ===== EXAM MAIN PAGES ===== */}
              <Route path="/jee" element={
                <ProtectedRoute>
                  <PageLayout darkMode={darkMode} setDarkMode={setDarkMode}>
                    <JEEPage darkMode={darkMode} setDarkMode={setDarkMode} />
                  </PageLayout>
                </ProtectedRoute>
              } />
              
              <Route path="/neet" element={
                <ProtectedRoute>
                  <PageLayout darkMode={darkMode} setDarkMode={setDarkMode}>
                    <NEETPage darkMode={darkMode} setDarkMode={setDarkMode} />
                  </PageLayout>
                </ProtectedRoute>
              } />
              
              <Route path="/upsc" element={
                <ProtectedRoute>
                  <PageLayout darkMode={darkMode} setDarkMode={setDarkMode}>
                    <UPSCPage darkMode={darkMode} setDarkMode={setDarkMode} />
                  </PageLayout>
                </ProtectedRoute>
              } />
              
              <Route path="/mhtcet" element={
                <ProtectedRoute>
                  <PageLayout darkMode={darkMode} setDarkMode={setDarkMode}>
                    <MHTCETPage darkMode={darkMode} setDarkMode={setDarkMode} />
                  </PageLayout>
                </ProtectedRoute>
              } />

              {/* ===== EXAM SECTION PAGES ===== */}
              {/* JEE */}
              <Route path="/courses/9/sections" element={
                <ProtectedRoute>
                  <PageLayout darkMode={darkMode} setDarkMode={setDarkMode}>
                    <ChemistrySectionsPage darkMode={darkMode} setDarkMode={setDarkMode} />
                  </PageLayout>
                </ProtectedRoute>
              } />
              
              <Route path="/courses/9/section/:sectionId" element={
                <ProtectedRoute>
                  <PageLayout darkMode={darkMode} setDarkMode={setDarkMode}>
                    <ChemistrySectionLessonsPage darkMode={darkMode} setDarkMode={setDarkMode} />
                  </PageLayout>
                </ProtectedRoute>
              } />
              
              <Route path="/courses/9" element={<Navigate to="/courses/9/sections" replace />} />

              {/* NEET */}
              <Route path="/courses/10/sections" element={
                <ProtectedRoute>
                  <PageLayout darkMode={darkMode} setDarkMode={setDarkMode}>
                    <NEETSectionsPage darkMode={darkMode} setDarkMode={setDarkMode} />
                  </PageLayout>
                </ProtectedRoute>
              } />
              
              <Route path="/courses/10/section/:sectionId" element={
                <ProtectedRoute>
                  <PageLayout darkMode={darkMode} setDarkMode={setDarkMode}>
                    <NEETSectionLessonsPage darkMode={darkMode} setDarkMode={setDarkMode} />
                  </PageLayout>
                </ProtectedRoute>
              } />
              
              <Route path="/courses/10" element={<Navigate to="/courses/10/sections" replace />} />
              
              <Route path="/courses/12/sections" element={
                <ProtectedRoute>
                  <PageLayout darkMode={darkMode} setDarkMode={setDarkMode}>
                    <NEETChemistrySectionsPage darkMode={darkMode} setDarkMode={setDarkMode} />
                  </PageLayout>
                </ProtectedRoute>
              } />
              
              <Route path="/courses/12/section/:sectionId" element={
                <ProtectedRoute>
                  <PageLayout darkMode={darkMode} setDarkMode={setDarkMode}>
                    <NEETChemistrySectionLessonsPage darkMode={darkMode} setDarkMode={setDarkMode} />
                  </PageLayout>
                </ProtectedRoute>
              } />
              
              <Route path="/courses/12" element={<Navigate to="/courses/12/sections" replace />} />

              {/* UPSC */}
              <Route path="/courses/13/sections" element={
                <ProtectedRoute>
                  <PageLayout darkMode={darkMode} setDarkMode={setDarkMode}>
                    <UPSCTopicsPage darkMode={darkMode} setDarkMode={setDarkMode} />
                  </PageLayout>
                </ProtectedRoute>
              } />
              
              <Route path="/courses/13/section/:sectionId" element={
                <ProtectedRoute>
                  <PageLayout darkMode={darkMode} setDarkMode={setDarkMode}>
                    <UPSCTopicLessonsPage darkMode={darkMode} setDarkMode={setDarkMode} />
                  </PageLayout>
                </ProtectedRoute>
              } />
              
              <Route path="/courses/13" element={<Navigate to="/courses/13/sections" replace />} />
              
              {/* UPSC Prelims */}
              <Route path="/courses/13/section/prelims-gs" element={
                <ProtectedRoute>
                  <PageLayout darkMode={darkMode} setDarkMode={setDarkMode}>
                    <PrelimsGSSectionsPage darkMode={darkMode} setDarkMode={setDarkMode} />
                  </PageLayout>
                </ProtectedRoute>
              } />
              
              <Route path="/courses/13/subject/indian-history" element={
                <ProtectedRoute>
                  <PageLayout darkMode={darkMode} setDarkMode={setDarkMode}>
                    <IndianHistoryPage darkMode={darkMode} setDarkMode={setDarkMode} />
                  </PageLayout>
                </ProtectedRoute>
              } />
              
              <Route path="/courses/13/subject/indian-geography" element={
                <ProtectedRoute>
                  <PageLayout darkMode={darkMode} setDarkMode={setDarkMode}>
                    <IndianGeographyPage darkMode={darkMode} setDarkMode={setDarkMode} />
                  </PageLayout>
                </ProtectedRoute>
              } />
              
              <Route path="/courses/13/subject/indian-polity" element={
                <ProtectedRoute>
                  <PageLayout darkMode={darkMode} setDarkMode={setDarkMode}>
                    <IndianPolityPage darkMode={darkMode} setDarkMode={setDarkMode} />
                  </PageLayout>
                </ProtectedRoute>
              } />
              
              <Route path="/courses/13/subject/indian-economy" element={
                <ProtectedRoute>
                  <PageLayout darkMode={darkMode} setDarkMode={setDarkMode}>
                    <IndianEconomyPage darkMode={darkMode} setDarkMode={setDarkMode} />
                  </PageLayout>
                </ProtectedRoute>
              } />
              
              <Route path="/courses/13/subject/environment" element={
                <ProtectedRoute>
                  <PageLayout darkMode={darkMode} setDarkMode={setDarkMode}>
                    <EnvironmentPage darkMode={darkMode} setDarkMode={setDarkMode} />
                  </PageLayout>
                </ProtectedRoute>
              } />
              
              <Route path="/courses/13/subject/general-science" element={
                <ProtectedRoute>
                  <PageLayout darkMode={darkMode} setDarkMode={setDarkMode}>
                    <GeneralSciencePage darkMode={darkMode} setDarkMode={setDarkMode} />
                  </PageLayout>
                </ProtectedRoute>
              } />

              {/* UPSC CSAT */}
              <Route path="/courses/13/section/csat" element={
                <ProtectedRoute>
                  <PageLayout darkMode={darkMode} setDarkMode={setDarkMode}>
                    <CSATSectionsPage darkMode={darkMode} setDarkMode={setDarkMode} />
                  </PageLayout>
                </ProtectedRoute>
              } />
              
              <Route path="/courses/13/csat/:topicId" element={
                <ProtectedRoute>
                  <PageLayout darkMode={darkMode} setDarkMode={setDarkMode}>
                    <CSATTopicLessonsPage darkMode={darkMode} setDarkMode={setDarkMode} />
                  </PageLayout>
                </ProtectedRoute>
              } />

              {/* UPSC Mains */}
              <Route path="/courses/13/section/mains-gs" element={
                <ProtectedRoute>
                  <PageLayout darkMode={darkMode} setDarkMode={setDarkMode}>
                    <MainsGSSectionsPage darkMode={darkMode} setDarkMode={setDarkMode} />
                  </PageLayout>
                </ProtectedRoute>
              } />
              
              <Route path="/courses/13/mains/:paperId" element={
                <ProtectedRoute>
                  <PageLayout darkMode={darkMode} setDarkMode={setDarkMode}>
                    <MainsGSPaperLessonsPage darkMode={darkMode} setDarkMode={setDarkMode} />
                  </PageLayout>
                </ProtectedRoute>
              } />

              {/* UPSC Ethics */}
              <Route path="/courses/13/section/ethics" element={
                <ProtectedRoute>
                  <PageLayout darkMode={darkMode} setDarkMode={setDarkMode}>
                    <EthicsSectionsPage darkMode={darkMode} setDarkMode={setDarkMode} />
                  </PageLayout>
                </ProtectedRoute>
              } />
              
              <Route path="/courses/13/ethics/:topicId" element={
                <ProtectedRoute>
                  <PageLayout darkMode={darkMode} setDarkMode={setDarkMode}>
                    <EthicsTopicLessonsPage darkMode={darkMode} setDarkMode={setDarkMode} />
                  </PageLayout>
                </ProtectedRoute>
              } />

              {/* UPSC Essay */}
              <Route path="/courses/13/section/essay-optional" element={
                <ProtectedRoute>
                  <PageLayout darkMode={darkMode} setDarkMode={setDarkMode}>
                    <EssayOptionalSectionsPage darkMode={darkMode} setDarkMode={setDarkMode} />
                  </PageLayout>
                </ProtectedRoute>
              } />
              
              <Route path="/courses/13/essay-optional/:topicId" element={
                <ProtectedRoute>
                  <PageLayout darkMode={darkMode} setDarkMode={setDarkMode}>
                    <EssayTopicLessonsPage darkMode={darkMode} setDarkMode={setDarkMode} />
                  </PageLayout>
                </ProtectedRoute>
              } />

              {/* MHT CET */}
              <Route path="/courses/19" element={
                <ProtectedRoute>
                  <PageLayout darkMode={darkMode} setDarkMode={setDarkMode}>
                    <MHTCETChemistryPage darkMode={darkMode} setDarkMode={setDarkMode} />
                  </PageLayout>
                </ProtectedRoute>
              } />
              
              <Route path="/courses/21" element={
                <ProtectedRoute>
                  <PageLayout darkMode={darkMode} setDarkMode={setDarkMode}>
                    <MHTCETBiologyPage darkMode={darkMode} setDarkMode={setDarkMode} />
                  </PageLayout>
                </ProtectedRoute>
              } />
              
              <Route path="/courses/19/section/physical-chemistry" element={
                <ProtectedRoute>
                  <PageLayout darkMode={darkMode} setDarkMode={setDarkMode}>
                    <MHTCETPhysicalChemistryPage darkMode={darkMode} setDarkMode={setDarkMode} />
                  </PageLayout>
                </ProtectedRoute>
              } />
              
              <Route path="/courses/19/section/inorganic-chemistry" element={
                <ProtectedRoute>
                  <PageLayout darkMode={darkMode} setDarkMode={setDarkMode}>
                    <MHTCETInorganicChemistryPage darkMode={darkMode} setDarkMode={setDarkMode} />
                  </PageLayout>
                </ProtectedRoute>
              } />
              
              <Route path="/courses/19/section/organic-chemistry" element={
                <ProtectedRoute>
                  <PageLayout darkMode={darkMode} setDarkMode={setDarkMode}>
                    <MHTCETOrganicChemistryPage darkMode={darkMode} setDarkMode={setDarkMode} />
                  </PageLayout>
                </ProtectedRoute>
              } />
              
              <Route path="/courses/21/section/botany" element={
                <ProtectedRoute>
                  <PageLayout darkMode={darkMode} setDarkMode={setDarkMode}>
                    <MHTCETBotanyPage darkMode={darkMode} setDarkMode={setDarkMode} />
                  </PageLayout>
                </ProtectedRoute>
              } />
              
              <Route path="/courses/21/section/zoology" element={
                <ProtectedRoute>
                  <PageLayout darkMode={darkMode} setDarkMode={setDarkMode}>
                    <MHTCETZoologyPage darkMode={darkMode} setDarkMode={setDarkMode} />
                  </PageLayout>
                </ProtectedRoute>
              } />
              
              <Route path="/courses/21/section/biotech-genetics" element={
                <ProtectedRoute>
                  <PageLayout darkMode={darkMode} setDarkMode={setDarkMode}>
                    <MHTCETBiotechPage darkMode={darkMode} setDarkMode={setDarkMode} />
                  </PageLayout>
                </ProtectedRoute>
              } />

              {/* ===== USER PAGES ===== */}
              <Route path="/profile" element={
                <ProtectedRoute>
                  <PageLayout darkMode={darkMode} setDarkMode={setDarkMode}>
                    <ProfilePage darkMode={darkMode} setDarkMode={setDarkMode} />
                  </PageLayout>
                </ProtectedRoute>
              } />
              
              <Route path="/my-courses" element={
                <ProtectedRoute>
                  <PageLayout darkMode={darkMode} setDarkMode={setDarkMode}>
                    <MyCoursesPage darkMode={darkMode} setDarkMode={setDarkMode} />
                  </PageLayout>
                </ProtectedRoute>
              } />
              
              <Route path="/certificates" element={
                <ProtectedRoute>
                  <PageLayout darkMode={darkMode} setDarkMode={setDarkMode}>
                    <CertificatesPage darkMode={darkMode} setDarkMode={setDarkMode} />
                  </PageLayout>
                </ProtectedRoute>
              } />
              
              <Route path="/wishlist" element={
                <ProtectedRoute>
                  <PageLayout darkMode={darkMode} setDarkMode={setDarkMode}>
                    <WishlistPage darkMode={darkMode} setDarkMode={setDarkMode} />
                  </PageLayout>
                </ProtectedRoute>
              } />
              
              <Route path="/progress" element={
                <ProtectedRoute>
                  <PageLayout darkMode={darkMode} setDarkMode={setDarkMode}>
                    <ProgressPage darkMode={darkMode} setDarkMode={setDarkMode} />
                  </PageLayout>
                </ProtectedRoute>
              } />

              {/* ===== 404 PAGE ===== */}
              <Route path="*" element={
                <PageLayout darkMode={darkMode} setDarkMode={setDarkMode}>
                  <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-8">
                    <h1 className="text-6xl font-bold text-gray-800 dark:text-white mb-4">404</h1>
                    <h2 className="text-2xl font-semibold text-gray-700 dark:text-gray-200 mb-4">Page Not Found</h2>
                    <p className="text-gray-600 dark:text-gray-400 mb-8 max-w-md">
                      The page you're looking for doesn't exist or has been moved.
                    </p>
                    <button 
                      onClick={() => window.location.href = '/dashboard'}
                      className="px-8 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg font-semibold hover:from-blue-700 hover:to-purple-700 transition-all"
                    >
                      Go to Dashboard
                    </button>
                  </div>
                </PageLayout>
              } />
            </Routes>
          </div>
        </Router>
      </NotificationProvider>
    </AuthProvider>
  );
}

export default App;