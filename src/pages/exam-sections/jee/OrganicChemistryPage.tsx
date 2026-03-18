import React from 'react';
// Line 2 - change this:
import BaseSubjectLessonsPage from '../../templates/BaseSubjectLessonsPage';import { FaLeaf } from 'react-icons/fa';

interface OrganicChemistryPageProps {
  darkMode: boolean;
  setDarkMode: (value: boolean) => void;
}

const OrganicChemistryPage: React.FC<OrganicChemistryPageProps> = ({ darkMode, setDarkMode }) => {
  return (
    <BaseSubjectLessonsPage
      darkMode={darkMode}
      setDarkMode={setDarkMode}
      courseId={9}
      subjectTitle="Organic Chemistry"
      subjectIcon={<FaLeaf />}
      subjectColor="#8b5cf6"
      lessonIdRange={[120, 121, 122, 123]}
      price={99}
    />
  );
};

export default OrganicChemistryPage;