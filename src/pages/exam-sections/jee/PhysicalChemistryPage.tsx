import React from 'react';
// Line 2 - change this:
import BaseSubjectLessonsPage from '../../templates/BaseSubjectLessonsPage';import { FaBolt } from 'react-icons/fa';

interface PhysicalChemistryPageProps {
  darkMode: boolean;
  setDarkMode: (value: boolean) => void;
}

const PhysicalChemistryPage: React.FC<PhysicalChemistryPageProps> = ({ darkMode, setDarkMode }) => {
  return (
    <BaseSubjectLessonsPage
      darkMode={darkMode}
      setDarkMode={setDarkMode}
      courseId={9}
      subjectTitle="Physical Chemistry"
      subjectIcon={<FaBolt />}
      subjectColor="#3b82f6"
      lessonIdRange={[96, 97, 98, 99, 100, 101, 102, 103, 104, 105, 106, 107, 108]}
      price={99}
    />
  );
};

export default PhysicalChemistryPage;