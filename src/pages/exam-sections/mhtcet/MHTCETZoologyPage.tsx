import React from 'react';
// Line 2 - change this:
import BaseSubjectLessonsPage from '../../templates/BaseSubjectLessonsPage';import { FaPaw } from 'react-icons/fa';

interface MHTCETZoologyPageProps {
  darkMode: boolean;
  setDarkMode: (value: boolean) => void;
}

const MHTCETZoologyPage: React.FC<MHTCETZoologyPageProps> = ({ darkMode, setDarkMode }) => {
  return (
    <BaseSubjectLessonsPage
      darkMode={darkMode}
      setDarkMode={setDarkMode}
      courseId={21}
      subjectTitle="Zoology"
      subjectIcon={<FaPaw />}
      subjectColor="#f59e0b"
      lessonIdRange={[2109, 2110, 2111, 2112, 2113, 2114, 2115, 2116, 2117]}
      price={99}
    />
  );
};

export default MHTCETZoologyPage;