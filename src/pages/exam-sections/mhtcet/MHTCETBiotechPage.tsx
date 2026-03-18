import React from 'react';
// Line 2 - change this:
import BaseSubjectLessonsPage from '../../templates/BaseSubjectLessonsPage';import { FaDna } from 'react-icons/fa';

interface MHTCETBiotechPageProps {
  darkMode: boolean;
  setDarkMode: (value: boolean) => void;
}

const MHTCETBiotechPage: React.FC<MHTCETBiotechPageProps> = ({ darkMode, setDarkMode }) => {
  return (
    <BaseSubjectLessonsPage
      darkMode={darkMode}
      setDarkMode={setDarkMode}
      courseId={21}
      subjectTitle="Biotechnology & Genetics"
      subjectIcon={<FaDna />}
      subjectColor="#8b5cf6"
      lessonIdRange={[2118, 2119, 2120, 2121, 2122, 2123, 2124, 2125, 2126, 2127]}
      price={99}
    />
  );
};

export default MHTCETBiotechPage;