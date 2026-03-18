import React from 'react';
// Line 2 - change this:
import BaseSubjectLessonsPage from '../../templates/BaseSubjectLessonsPage';import { FaFlask } from 'react-icons/fa';

interface MHTCETInorganicChemistryPageProps {
  darkMode: boolean;
  setDarkMode: (value: boolean) => void;
}

const MHTCETInorganicChemistryPage: React.FC<MHTCETInorganicChemistryPageProps> = ({ darkMode, setDarkMode }) => {
  return (
    <BaseSubjectLessonsPage
      darkMode={darkMode}
      setDarkMode={setDarkMode}
      courseId={19}
      subjectTitle="Inorganic Chemistry"
      subjectIcon={<FaFlask />}
      subjectColor="#10b981"
      lessonIdRange={[1909, 1910, 1911, 1912, 1913, 1914, 1915]}
      price={99}
    />
  );
};

export default MHTCETInorganicChemistryPage;