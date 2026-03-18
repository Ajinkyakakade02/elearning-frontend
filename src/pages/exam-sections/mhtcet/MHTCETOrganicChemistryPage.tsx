import React from 'react';
// Line 2 - change this:
import BaseSubjectLessonsPage from '../../templates/BaseSubjectLessonsPage';import { FaLeaf } from 'react-icons/fa';

interface MHTCETOrganicChemistryPageProps {
  darkMode: boolean;
  setDarkMode: (value: boolean) => void;
}

const MHTCETOrganicChemistryPage: React.FC<MHTCETOrganicChemistryPageProps> = ({ darkMode, setDarkMode }) => {
  return (
    <BaseSubjectLessonsPage
      darkMode={darkMode}
      setDarkMode={setDarkMode}
      courseId={19}
      subjectTitle="Organic Chemistry"
      subjectIcon={<FaLeaf />}
      subjectColor="#8b5cf6"
      lessonIdRange={[1916, 1917, 1918, 1919, 1920, 1921, 1922, 1923, 1924]}
      price={99}
    />
  );
};

export default MHTCETOrganicChemistryPage;