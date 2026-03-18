import React from 'react';
// Line 2 - change this:
import BaseSubjectLessonsPage from '../../templates/BaseSubjectLessonsPage';import { FaLeaf } from 'react-icons/fa';

interface MHTCETBotanyPageProps {
  darkMode: boolean;
  setDarkMode: (value: boolean) => void;
}

const MHTCETBotanyPage: React.FC<MHTCETBotanyPageProps> = ({ darkMode, setDarkMode }) => {
  return (
    <BaseSubjectLessonsPage
      darkMode={darkMode}
      setDarkMode={setDarkMode}
      courseId={21}
      subjectTitle="Botany"
      subjectIcon={<FaLeaf />}
      subjectColor="#10b981"
      lessonIdRange={[2101, 2102, 2103, 2104, 2105, 2106, 2107, 2108]}
      price={99}
    />
  );
};

export default MHTCETBotanyPage;