import React from 'react';
// Line 2 - change this:
import BaseSubjectLessonsPage from '../../templates/BaseSubjectLessonsPage';import { FaFlask } from 'react-icons/fa';

interface NEETInorganicChemistryPageProps {
  darkMode: boolean;
  setDarkMode: (value: boolean) => void;
}

const NEETInorganicChemistryPage: React.FC<NEETInorganicChemistryPageProps> = ({ darkMode, setDarkMode }) => {
  return (
    <BaseSubjectLessonsPage
      darkMode={darkMode}
      setDarkMode={setDarkMode}
      courseId={12}
      subjectTitle="Inorganic Chemistry"
      subjectIcon={<FaFlask />}
      subjectColor="#10b981"
      lessonIdRange={[707, 708, 709, 710, 711, 712, 713, 714, 715]}
    />
  );
};

export default NEETInorganicChemistryPage;