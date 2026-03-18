import React from 'react';
// Line 2 - change this:
import BaseSubjectLessonsPage from '../../templates/BaseSubjectLessonsPage';import { FaBolt } from 'react-icons/fa';

interface NEETPhysicalChemistryPageProps {
  darkMode: boolean;
  setDarkMode: (value: boolean) => void;
}

const NEETPhysicalChemistryPage: React.FC<NEETPhysicalChemistryPageProps> = ({ darkMode, setDarkMode }) => {
  return (
    <BaseSubjectLessonsPage
      darkMode={darkMode}
      setDarkMode={setDarkMode}
      courseId={12}
      subjectTitle="Physical Chemistry"
      subjectIcon={<FaBolt />}
      subjectColor="#3b82f6"
      lessonIdRange={[701, 702, 703, 704, 705, 706]}
    />
  );
};

export default NEETPhysicalChemistryPage;