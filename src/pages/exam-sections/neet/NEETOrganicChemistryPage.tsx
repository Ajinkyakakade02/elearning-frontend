import React from 'react';
// Line 2 - change this:
import BaseSubjectLessonsPage from '../../templates/BaseSubjectLessonsPage';import { FaLeaf } from 'react-icons/fa';

interface NEETOrganicChemistryPageProps {
  darkMode: boolean;
  setDarkMode: (value: boolean) => void;
}

const NEETOrganicChemistryPage: React.FC<NEETOrganicChemistryPageProps> = ({ darkMode, setDarkMode }) => {
  return (
    <BaseSubjectLessonsPage
      darkMode={darkMode}
      setDarkMode={setDarkMode}
      courseId={12}
      subjectTitle="Organic Chemistry"
      subjectIcon={<FaLeaf />}
      subjectColor="#8b5cf6"
      lessonIdRange={[716, 717, 718, 719, 720, 721, 722, 723, 724]}
    />
  );
};

export default NEETOrganicChemistryPage;