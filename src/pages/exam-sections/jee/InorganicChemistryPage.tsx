import React from 'react';
// Line 2 - change this:
import BaseSubjectLessonsPage from '../../templates/BaseSubjectLessonsPage';import { FaFlask } from 'react-icons/fa';

interface InorganicChemistryPageProps {
  darkMode: boolean;
  setDarkMode: (value: boolean) => void;
}

const InorganicChemistryPage: React.FC<InorganicChemistryPageProps> = ({ darkMode, setDarkMode }) => {
  return (
    <BaseSubjectLessonsPage
      darkMode={darkMode}
      setDarkMode={setDarkMode}
      courseId={9}
      subjectTitle="Inorganic Chemistry"
      subjectIcon={<FaFlask />}
      subjectColor="#10b981"
      lessonIdRange={[109, 110, 111, 112, 113, 114, 115, 116, 117, 118, 119]}
      price={99}
    />
  );
};

export default InorganicChemistryPage;