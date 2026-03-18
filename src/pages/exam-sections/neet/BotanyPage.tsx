import React from 'react';
// Line 2 - change this:
import BaseSubjectLessonsPage from '../../templates/BaseSubjectLessonsPage';import { FaLeaf } from 'react-icons/fa';

interface BotanyPageProps {
  darkMode: boolean;
  setDarkMode: (value: boolean) => void;
}

const BotanyPage: React.FC<BotanyPageProps> = ({ darkMode, setDarkMode }) => {
  return (
    <BaseSubjectLessonsPage
      darkMode={darkMode}
      setDarkMode={setDarkMode}
      courseId={10}
      subjectTitle="Botany"
      subjectIcon={<FaLeaf />}
      subjectColor="#10b981"
      lessonIdRange={[501, 502, 503, 504, 505, 506, 507, 508, 509, 510]}
    />
  );
};

export default BotanyPage;