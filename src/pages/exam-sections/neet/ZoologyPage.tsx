import React from 'react';
// Line 2 - change this:
import BaseSubjectLessonsPage from '../../templates/BaseSubjectLessonsPage';import { FaPaw } from 'react-icons/fa';

interface ZoologyPageProps {
  darkMode: boolean;
  setDarkMode: (value: boolean) => void;
}

const ZoologyPage: React.FC<ZoologyPageProps> = ({ darkMode, setDarkMode }) => {
  return (
    <BaseSubjectLessonsPage
      darkMode={darkMode}
      setDarkMode={setDarkMode}
      courseId={10}
      subjectTitle="Zoology"
      subjectIcon={<FaPaw />}
      subjectColor="#f59e0b"
      lessonIdRange={[511, 512, 513, 514, 515, 516, 517, 518, 519, 520, 521, 522, 523, 524]}
    />
  );
};

export default ZoologyPage;