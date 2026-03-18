import React from 'react';
// Line 2 - change this:
import BaseSubjectLessonsPage from '../../templates/BaseSubjectLessonsPage';import { FaBolt } from 'react-icons/fa';

interface MHTCETPhysicalChemistryPageProps {
  darkMode: boolean;
  setDarkMode: (value: boolean) => void;
}

const MHTCETPhysicalChemistryPage: React.FC<MHTCETPhysicalChemistryPageProps> = ({ darkMode, setDarkMode }) => {
  return (
    <BaseSubjectLessonsPage
      darkMode={darkMode}
      setDarkMode={setDarkMode}
      courseId={19}
      subjectTitle="Physical Chemistry"
      subjectIcon={<FaBolt />}
      subjectColor="#3b82f6"
      lessonIdRange={[1901, 1902, 1903, 1904, 1905, 1906, 1907, 1908]}
      price={99}
    />
  );
};

export default MHTCETPhysicalChemistryPage;