import React from 'react';
// Line 2 - change this:
import BaseSubjectLessonsPage from '../../templates/BaseSubjectLessonsPage';import { FaDna } from 'react-icons/fa';

interface BiotechPageProps {
  darkMode: boolean;
  setDarkMode: (value: boolean) => void;
}

const BiotechPage: React.FC<BiotechPageProps> = ({ darkMode, setDarkMode }) => {
  return (
    <BaseSubjectLessonsPage
      darkMode={darkMode}
      setDarkMode={setDarkMode}
      courseId={10}
      subjectTitle="Biotechnology & Genetics"
      subjectIcon={<FaDna />}
      subjectColor="#8b5cf6"
      lessonIdRange={[525, 526, 527, 528, 529, 530, 531, 532, 533, 534, 535, 536, 537]}
    />
  );
};

export default BiotechPage;