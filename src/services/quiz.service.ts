// ============================================
// QUIZ SERVICE - WITH ALL METHODS
// ============================================

import axiosInstance from './axios.config';
import { API_ENDPOINTS } from './api.config';
import { Quiz, Question, QuizAttempt, QuizResult, TopicQuiz, UserProgress } from '../types/quiz.types';
import { tokenManager } from '../utils/tokenManager';
import { showToast } from '../utils/toast';

export const quizService = {
  // ===== LESSON QUIZZES (for course integration) =====
  
  /**
   * Get quizzes for a specific lesson
   */
  async getLessonQuizzes(lessonId: number): Promise<Quiz[]> {
    try {
      console.log(`📡 Fetching quizzes for lesson ${lessonId}...`);
      const response = await axiosInstance.get(
        API_ENDPOINTS.QUIZZES.BY_LESSON(lessonId)
      );
      return response.data;
    } catch (error: any) {
      console.error(`❌ Failed to fetch quizzes for lesson ${lessonId}:`, error);
      
      // Return mock data for development
      const mockQuizzes: Quiz[] = [
        {
          id: 1,
          lessonId: lessonId,
          title: 'Lesson Quiz',
          description: 'Test your understanding of this lesson',
          timeLimitMinutes: 15,
          passingScore: 70,
          questions: [],
          createdAt: new Date().toISOString()
        }
      ];
      
      return mockQuizzes;
    }
  },

  /**
   * Get quizzes for a specific course
   */
  async getCourseQuizzes(courseId: number): Promise<Quiz[]> {
    try {
      console.log(`📡 Fetching quizzes for course ${courseId}...`);
      const response = await axiosInstance.get(
        API_ENDPOINTS.QUIZZES.BY_COURSE(courseId)
      );
      return response.data;
    } catch (error: any) {
      console.error(`❌ Failed to fetch quizzes for course ${courseId}:`, error);
      return [];
    }
  },

  // ===== QUIZ CATEGORY METHODS =====
  
  /**
   * Get all quiz categories (DSA, JEE, NEET, etc.)
   */
  async getQuizCategories(): Promise<any[]> {
    try {
      console.log('📡 Fetching quiz categories...');
      const response = await axiosInstance.get('/api/quizzes/categories');
      console.log('✅ Quiz categories fetched:', response.data);
      return response.data;
    } catch (error: any) {
      console.error('❌ Failed to fetch quiz categories:', error);
      
      // Return mock data if API fails (for development)
      return [
        { id: 1, name: 'DSA Quiz', icon: '💻', description: 'Data Structures & Algorithms', questionCount: 118, timeLimit: 45, passingScore: 70 },
        { id: 2, name: 'JEE Quiz', icon: '⚡', description: 'Engineering Entrance', questionCount: 90, timeLimit: 60, passingScore: 65 },
        { id: 3, name: 'NEET Quiz', icon: '🩺', description: 'Medical Entrance', questionCount: 90, timeLimit: 60, passingScore: 65 },
        { id: 4, name: 'UPSC Quiz', icon: '🏛️', description: 'Civil Services', questionCount: 100, timeLimit: 50, passingScore: 60 },
        { id: 5, name: 'MHT CET Quiz', icon: '📝', description: 'Maharashtra CET', questionCount: 75, timeLimit: 50, passingScore: 65 }
      ];
    }
  },

  /**
   * Get topics for a specific quiz category
   */
  async getQuizTopics(quizId: number): Promise<TopicQuiz[]> {
    try {
      console.log(`📡 Fetching topics for quiz ${quizId}...`);
      const response = await axiosInstance.get(`/api/quizzes/${quizId}/topics`);
      console.log('✅ Topics fetched:', response.data);
      return response.data;
    } catch (error: any) {
      console.error(`❌ Failed to fetch topics for quiz ${quizId}:`, error);
      
      // Return mock data based on quizId
      if (quizId === 1) { // DSA topics
        return [
          { id: 'sliding-window', title: 'Sliding Window / Two Pointers', description: 'Master sliding window techniques', questionCount: 25, timeLimit: 35, difficulty: 'Medium', icon: '🪟', attempts: 1250 },
          { id: 'array-string', title: 'Array / String', description: 'Array and string manipulation', questionCount: 30, timeLimit: 40, difficulty: 'Easy', icon: '📊', attempts: 2100 },
          { id: 'stack-queue', title: 'Stack / Queue / Linked List', description: 'Linear data structures', questionCount: 28, timeLimit: 38, difficulty: 'Medium', icon: '🔗', attempts: 1850 },
          { id: 'dp-graph', title: 'DP / Graph', description: 'Dynamic programming and graphs', questionCount: 35, timeLimit: 50, difficulty: 'Hard', icon: '📈', attempts: 980 }
        ];
      } else if (quizId === 2) { // JEE topics
        return [
          { id: 'jee-physics', title: 'Physics', description: 'Mechanics, Thermodynamics, Optics, Electromagnetism, Modern Physics', questionCount: 45, timeLimit: 60, difficulty: 'Hard', icon: '⚡', attempts: 3200 },
          { id: 'jee-chemistry', title: 'Chemistry', description: 'Physical Chemistry, Organic Chemistry, Inorganic Chemistry', questionCount: 45, timeLimit: 55, difficulty: 'Medium', icon: '🧪', attempts: 3500 },
          { id: 'jee-mathematics', title: 'Mathematics', description: 'Calculus, Algebra, Trigonometry, Coordinate Geometry, Vectors', questionCount: 50, timeLimit: 65, difficulty: 'Hard', icon: '📐', attempts: 2800 }
        ];
      } else if (quizId === 3) { // NEET topics
        return [
          { id: 'neet-biology', title: 'Biology', description: 'Botany & Zoology: Human Physiology, Genetics, Ecology, Biotechnology, Cell Biology', questionCount: 60, timeLimit: 60, difficulty: 'Medium', icon: '🧬', attempts: 4500 },
          { id: 'neet-physics', title: 'Physics', description: 'Mechanics, Thermodynamics, Optics, Electromagnetism, Modern Physics', questionCount: 45, timeLimit: 55, difficulty: 'Medium', icon: '⚡', attempts: 3800 },
          { id: 'neet-chemistry', title: 'Chemistry', description: 'Physical Chemistry, Organic Chemistry, Inorganic Chemistry', questionCount: 45, timeLimit: 55, difficulty: 'Medium', icon: '🧪', attempts: 4000 }
        ];
      } else if (quizId === 4) { // UPSC topics
        return [
          { id: 'upsc-history', title: 'History', description: 'Ancient, Medieval, Modern India. Art & Culture, World History', questionCount: 50, timeLimit: 45, difficulty: 'Medium', icon: '📜', attempts: 2800 },
          { id: 'upsc-geography', title: 'Geography', description: 'Physical, Human, Economic Geography. Maps, Climate, Environment', questionCount: 45, timeLimit: 40, difficulty: 'Medium', icon: '🌍', attempts: 2600 },
          { id: 'upsc-polity', title: 'Polity', description: 'Indian Constitution, Parliament, Judiciary, Federal System, Governance', questionCount: 40, timeLimit: 35, difficulty: 'Medium', icon: '⚖️', attempts: 3000 },
          { id: 'upsc-economics', title: 'Economics', description: 'Indian Economy, Budget, Economic Survey, Micro & Macro Economics', questionCount: 35, timeLimit: 35, difficulty: 'Hard', icon: '📊', attempts: 2200 },
          { id: 'upsc-environment', title: 'Environment', description: 'Ecology, Biodiversity, Climate Change, Environmental Issues', questionCount: 30, timeLimit: 30, difficulty: 'Easy', icon: '🌳', attempts: 1800 }
        ];
      } else if (quizId === 5) { // MHT CET topics
        return [
          { id: 'mhtcet-physics', title: 'Physics', description: 'Mechanics, Thermodynamics, Optics, Electromagnetism, Modern Physics for MHT CET', questionCount: 40, timeLimit: 45, difficulty: 'Medium', icon: '⚡', attempts: 1800 },
          { id: 'mhtcet-chemistry', title: 'Chemistry', description: 'Physical Chemistry, Organic Chemistry, Inorganic Chemistry for MHT CET', questionCount: 40, timeLimit: 45, difficulty: 'Medium', icon: '🧪', attempts: 1900 },
          { id: 'mhtcet-mathematics', title: 'Mathematics', description: 'Calculus, Algebra, Trigonometry, Coordinate Geometry, Vectors for MHT CET', questionCount: 45, timeLimit: 50, difficulty: 'Hard', icon: '📐', attempts: 1500 },
          { id: 'mhtcet-biology', title: 'Biology', description: 'Botany & Zoology for PCB stream students', questionCount: 40, timeLimit: 45, difficulty: 'Medium', icon: '🧬', attempts: 1200 }
        ];
      }
      return [];
    }
  },

  // ===== QUESTION METHODS =====

  /**
   * Get questions for a specific topic
   */
  async getTopicQuestions(topicId: string): Promise<Question[]> {
    try {
      console.log(`📡 Fetching questions for topic ${topicId}...`);
      const response = await axiosInstance.get(`/api/quizzes/topics/${topicId}/questions`);
      return response.data;
    } catch (error: any) {
      console.error(`❌ Failed to fetch questions for topic ${topicId}:`, error);
      
      // Return mock questions based on topicId
      const mockQuestions: Record<string, Question[]> = {
        // ===== DSA TOPICS - COMPLETE SET OF 5 QUESTIONS EACH =====

// 1. SLIDING WINDOW / TWO POINTERS - 5 Questions
'sliding-window': [
  {
    id: 1,
    quizId: 1,
    questionText: 'Which of the following problems is best solved using the sliding window technique?',
    optionA: 'Finding the maximum sum subarray of size K',
    optionB: 'Binary search in a sorted array',
    optionC: 'Reversing a linked list',
    optionD: 'Finding the shortest path in a graph',
    correctAnswer: 'A',
    points: 10,
    explanation: 'Sliding window is ideal for problems involving contiguous subarrays/substrings of fixed/variable size.',
    difficulty: 'Easy',
    topicId: 'sliding-window'
  },
  {
    id: 2,
    quizId: 1,
    questionText: 'What is the time complexity of the sliding window approach for finding maximum sum subarray of size K?',
    optionA: 'O(n log n)',
    optionB: 'O(n²)',
    optionC: 'O(n)',
    optionD: 'O(1)',
    correctAnswer: 'C',
    points: 10,
    explanation: 'Sliding window achieves O(n) by maintaining a window and sliding it across the array in linear time.',
    difficulty: 'Easy',
    topicId: 'sliding-window'
  },
  {
    id: 6,
    quizId: 1,
    questionText: 'In the two-pointer technique for a sorted array, when do you move the left pointer?',
    optionA: 'When current sum is less than target',
    optionB: 'When current sum is greater than target',
    optionC: 'When left pointer reaches the end',
    optionD: 'When right pointer reaches the start',
    correctAnswer: 'B',
    points: 10,
    explanation: 'In problems like "two sum" or "subarray sum", you move left pointer to decrease the sum when it exceeds target.',
    difficulty: 'Medium',
    topicId: 'sliding-window'
  },
  {
    id: 7,
    quizId: 1,
    questionText: 'Which of the following is NOT a typical application of sliding window?',
    optionA: 'Longest substring without repeating characters',
    optionB: 'Maximum sum subarray of size K',
    optionC: 'Binary tree traversal',
    optionD: 'Minimum window substring',
    correctAnswer: 'C',
    points: 10,
    explanation: 'Binary tree traversal uses recursion or stack/queue, not sliding window which works on linear data structures.',
    difficulty: 'Medium',
    topicId: 'sliding-window'
  },
  {
    id: 8,
    quizId: 1,
    questionText: 'What is the space complexity of the sliding window technique?',
    optionA: 'O(1)',
    optionB: 'O(n)',
    optionC: 'O(log n)',
    optionD: 'O(n²)',
    correctAnswer: 'A',
    points: 10,
    explanation: 'Sliding window typically uses O(1) extra space as it only maintains pointers and a few variables.',
    difficulty: 'Easy',
    topicId: 'sliding-window'
  }
],

// 2. ARRAY / STRING - 5 Questions
'array-string': [
  {
    id: 3,
    quizId: 1,
    questionText: 'Which sorting algorithm has the best average-case time complexity?',
    optionA: 'Bubble Sort',
    optionB: 'Quick Sort',
    optionC: 'Insertion Sort',
    optionD: 'Selection Sort',
    correctAnswer: 'B',
    points: 10,
    explanation: 'Quick Sort has O(n log n) average-case time complexity, while Bubble, Insertion, and Selection have O(n²).',
    difficulty: 'Easy',
    topicId: 'array-string'
  },
  {
    id: 9,
    quizId: 1,
    questionText: 'What is the output of "Hello".concat(" World") in JavaScript?',
    optionA: 'Hello World',
    optionB: 'HelloWorld',
    optionC: 'Hello World',
    optionD: 'Error',
    correctAnswer: 'A',
    points: 10,
    explanation: 'The concat() method joins two strings and returns a new string: "Hello" + " World" = "Hello World".',
    difficulty: 'Easy',
    topicId: 'array-string'
  },
  {
    id: 10,
    quizId: 1,
    questionText: 'Which method is used to add an element to the end of an array?',
    optionA: 'push()',
    optionB: 'pop()',
    optionC: 'shift()',
    optionD: 'unshift()',
    correctAnswer: 'A',
    points: 10,
    explanation: 'push() adds one or more elements to the end of an array and returns the new length.',
    difficulty: 'Easy',
    topicId: 'array-string'
  },
  {
    id: 11,
    quizId: 1,
    questionText: 'What does the filter() method return?',
    optionA: 'A new array with elements that pass a test',
    optionB: 'The first element that passes a test',
    optionC: 'A boolean value',
    optionD: 'The original array modified',
    correctAnswer: 'A',
    points: 10,
    explanation: 'filter() creates a new array with all elements that pass the test implemented by the provided function.',
    difficulty: 'Medium',
    topicId: 'array-string'
  },
  {
    id: 12,
    quizId: 1,
    questionText: 'Which of the following is a valid way to create an array in JavaScript?',
    optionA: 'let arr = [1, 2, 3];',
    optionB: 'let arr = new Array(1, 2, 3);',
    optionC: 'let arr = Array.of(1, 2, 3);',
    optionD: 'All of the above',
    correctAnswer: 'D',
    points: 10,
    explanation: 'JavaScript provides multiple ways to create arrays: array literals, Array constructor, and Array.of().',
    difficulty: 'Easy',
    topicId: 'array-string'
  }
],

// 3. STACK / QUEUE / LINKED LIST - 5 Questions
'stack-queue': [
  {
    id: 4,
    quizId: 1,
    questionText: 'Which data structure follows LIFO principle?',
    optionA: 'Queue',
    optionB: 'Stack',
    optionC: 'Linked List',
    optionD: 'Array',
    correctAnswer: 'B',
    points: 10,
    explanation: 'Stack follows Last-In-First-Out principle. The last element added is the first one removed.',
    difficulty: 'Easy',
    topicId: 'stack-queue'
  },
  {
    id: 13,
    quizId: 1,
    questionText: 'Which data structure is best suited for implementing a breadth-first search (BFS)?',
    optionA: 'Stack',
    optionB: 'Queue',
    optionC: 'Array',
    optionD: 'Linked List',
    correctAnswer: 'B',
    points: 10,
    explanation: 'BFS uses a queue to process nodes level by level, ensuring nodes are visited in the order they are discovered.',
    difficulty: 'Medium',
    topicId: 'stack-queue'
  },
  {
    id: 14,
    quizId: 1,
    questionText: 'What is the time complexity of inserting a node at the beginning of a singly linked list?',
    optionA: 'O(1)',
    optionB: 'O(n)',
    optionC: 'O(log n)',
    optionD: 'O(n²)',
    correctAnswer: 'A',
    points: 10,
    explanation: 'Inserting at the beginning only requires updating the head pointer and new node\'s next reference - O(1) operation.',
    difficulty: 'Easy',
    topicId: 'stack-queue'
  },
  {
    id: 15,
    quizId: 1,
    questionText: 'Which operation is NOT typically supported by a stack?',
    optionA: 'push()',
    optionB: 'pop()',
    optionC: 'peek()',
    optionD: 'dequeue()',
    correctAnswer: 'D',
    points: 10,
    explanation: 'dequeue() is a queue operation for removing from the front. Stack operations are push, pop, and peek.',
    difficulty: 'Easy',
    topicId: 'stack-queue'
  },
  {
    id: 16,
    quizId: 1,
    questionText: 'In a doubly linked list, each node contains:',
    optionA: 'Data and next pointer',
    optionB: 'Data and previous pointer',
    optionC: 'Data, next pointer, and previous pointer',
    optionD: 'Only data',
    correctAnswer: 'C',
    points: 10,
    explanation: 'Doubly linked list nodes contain data, a pointer to the next node, and a pointer to the previous node.',
    difficulty: 'Easy',
    topicId: 'stack-queue'
  }
],

// 4. DP / GRAPH - 5 Questions
'dp-graph': [
  {
    id: 5,
    quizId: 1,
    questionText: 'Which algorithm is used to find the shortest path in a weighted graph?',
    optionA: 'BFS',
    optionB: 'DFS',
    optionC: 'Dijkstra\'s Algorithm',
    optionD: 'Binary Search',
    correctAnswer: 'C',
    points: 10,
    explanation: 'Dijkstra\'s algorithm finds the shortest paths from a source node to all other nodes in a weighted graph.',
    difficulty: 'Hard',
    topicId: 'dp-graph'
  },
  {
    id: 17,
    quizId: 1,
    questionText: 'What is the key characteristic of Dynamic Programming problems?',
    optionA: 'They can only be solved recursively',
    optionB: 'They have overlapping subproblems and optimal substructure',
    optionC: 'They require sorting',
    optionD: 'They work only on trees',
    correctAnswer: 'B',
    points: 10,
    explanation: 'DP problems have overlapping subproblems (same subproblems recur) and optimal substructure (optimal solution from optimal solutions of subproblems).',
    difficulty: 'Medium',
    topicId: 'dp-graph'
  },
  {
    id: 18,
    quizId: 1,
    questionText: 'Which of the following is a classic example of Dynamic Programming?',
    optionA: 'Binary Search',
    optionB: 'Fibonacci Sequence',
    optionC: 'Bubble Sort',
    optionD: 'Linear Search',
    correctAnswer: 'B',
    points: 10,
    explanation: 'Fibonacci sequence is often used to demonstrate DP because it has overlapping subproblems and can be optimized with memoization.',
    difficulty: 'Easy',
    topicId: 'dp-graph'
  },
  {
    id: 19,
    quizId: 1,
    questionText: 'What does DFS stand for in graph traversal?',
    optionA: 'Depth-First Search',
    optionB: 'Data-First Search',
    optionC: 'Double-Fast Search',
    optionD: 'Directed-Flow Search',
    correctAnswer: 'A',
    points: 10,
    explanation: 'DFS (Depth-First Search) explores as far as possible along each branch before backtracking.',
    difficulty: 'Easy',
    topicId: 'dp-graph'
  },
  {
    id: 20,
    quizId: 1,
    questionText: 'Which approach is used in Dynamic Programming to avoid redundant calculations?',
    optionA: 'Recursion',
    optionB: 'Memoization',
    optionC: 'Iteration',
    optionD: 'Randomization',
    correctAnswer: 'B',
    points: 10,
    explanation: 'Memoization stores results of expensive function calls and returns the cached result when same inputs occur again.',
    difficulty: 'Medium',
    topicId: 'dp-graph'
  }
],
        
        // ===== JEE PHYSICS TOPIC =====
        'jee-physics': [
          {
            id: 101,
            quizId: 2,
            questionText: 'Which of the following is a vector quantity?',
            optionA: 'Speed',
            optionB: 'Distance',
            optionC: 'Velocity',
            optionD: 'Time',
            correctAnswer: 'C',
            points: 10,
            explanation: 'Velocity has both magnitude and direction, making it a vector quantity.',
            difficulty: 'Easy',
            topicId: 'jee-physics'
          },
          {
            id: 102,
            quizId: 2,
            questionText: 'What is the SI unit of electric current?',
            optionA: 'Volt',
            optionB: 'Ampere',
            optionC: 'Ohm',
            optionD: 'Watt',
            correctAnswer: 'B',
            points: 10,
            explanation: 'Ampere (A) is the SI unit of electric current.',
            difficulty: 'Easy',
            topicId: 'jee-physics'
          },
          {
            id: 103,
            quizId: 2,
            questionText: 'Newton\'s first law of motion is also known as:',
            optionA: 'Law of inertia',
            optionB: 'Law of acceleration',
            optionC: 'Law of action-reaction',
            optionD: 'Law of gravitation',
            correctAnswer: 'A',
            points: 10,
            explanation: 'Newton\'s first law states that an object remains in its state of rest or uniform motion unless acted upon by an external force.',
            difficulty: 'Easy',
            topicId: 'jee-physics'
          },
          {
            id: 104,
            quizId: 2,
            questionText: 'The resistance of a conductor depends on:',
            optionA: 'Length only',
            optionB: 'Area only',
            optionC: 'Material only',
            optionD: 'Length, area, and material',
            correctAnswer: 'D',
            points: 10,
            explanation: 'Resistance R = ρL/A, where ρ is resistivity (material property), L is length, A is cross-sectional area.',
            difficulty: 'Medium',
            topicId: 'jee-physics'
          },
          {
            id: 105,
            quizId: 2,
            questionText: 'What is the value of gravitational constant G?',
            optionA: '6.67 × 10⁻¹¹ Nm²/kg²',
            optionB: '9.8 m/s²',
            optionC: '3 × 10⁸ m/s',
            optionD: '1.6 × 10⁻¹⁹ C',
            correctAnswer: 'A',
            points: 10,
            explanation: 'The universal gravitational constant G = 6.67 × 10⁻¹¹ Nm²/kg².',
            difficulty: 'Medium',
            topicId: 'jee-physics'
          }
        ],
        
        // ===== JEE CHEMISTRY TOPIC =====
        'jee-chemistry': [
          {
            id: 201,
            quizId: 2,
            questionText: 'What is the atomic number of Carbon?',
            optionA: '4',
            optionB: '6',
            optionC: '8',
            optionD: '12',
            correctAnswer: 'B',
            points: 10,
            explanation: 'Carbon has atomic number 6, meaning it has 6 protons.',
            difficulty: 'Easy',
            topicId: 'jee-chemistry'
          },
          {
            id: 202,
            quizId: 2,
            questionText: 'Which gas is known as "Laughing Gas"?',
            optionA: 'CO₂',
            optionB: 'NO₂',
            optionC: 'N₂O',
            optionD: 'SO₂',
            correctAnswer: 'C',
            points: 10,
            explanation: 'Nitrous oxide (N₂O) is known as laughing gas due to its anesthetic effects.',
            difficulty: 'Easy',
            topicId: 'jee-chemistry'
          },
          {
            id: 203,
            quizId: 2,
            questionText: 'The pH of pure water is:',
            optionA: '5',
            optionB: '7',
            optionC: '9',
            optionD: '14',
            correctAnswer: 'B',
            points: 10,
            explanation: 'Pure water has pH 7, which is neutral.',
            difficulty: 'Easy',
            topicId: 'jee-chemistry'
          },
          {
            id: 204,
            quizId: 2,
            questionText: 'Which of the following is an example of an alkali metal?',
            optionA: 'Calcium',
            optionB: 'Magnesium',
            optionC: 'Sodium',
            optionD: 'Aluminium',
            correctAnswer: 'C',
            points: 10,
            explanation: 'Sodium (Na) is an alkali metal from Group 1 of the periodic table.',
            difficulty: 'Medium',
            topicId: 'jee-chemistry'
          },
          {
            id: 205,
            quizId: 2,
            questionText: 'The chemical formula of bleaching powder is:',
            optionA: 'CaOCl₂',
            optionB: 'CaCl₂',
            optionC: 'Ca(OCl)₂',
            optionD: 'NaOCl',
            correctAnswer: 'A',
            points: 10,
            explanation: 'Bleaching powder is calcium hypochlorite, CaOCl₂.',
            difficulty: 'Medium',
            topicId: 'jee-chemistry'
          }
        ],
        
        // ===== JEE MATHEMATICS TOPIC =====
        'jee-mathematics': [
          {
            id: 301,
            quizId: 2,
            questionText: 'What is the derivative of x²?',
            optionA: 'x',
            optionB: '2x',
            optionC: '2',
            optionD: 'x²',
            correctAnswer: 'B',
            points: 10,
            explanation: 'The derivative of x² is 2x (power rule: d/dx(xⁿ) = nxⁿ⁻¹).',
            difficulty: 'Easy',
            topicId: 'jee-mathematics'
          },
          {
            id: 302,
            quizId: 2,
            questionText: 'What is the value of sin 90°?',
            optionA: '0',
            optionB: '1',
            optionC: '-1',
            optionD: '∞',
            correctAnswer: 'B',
            points: 10,
            explanation: 'sin 90° = 1',
            difficulty: 'Easy',
            topicId: 'jee-mathematics'
          },
          {
            id: 303,
            quizId: 2,
            questionText: 'If log₂ 8 = x, then x = ?',
            optionA: '2',
            optionB: '3',
            optionC: '4',
            optionD: '8',
            correctAnswer: 'B',
            points: 10,
            explanation: 'log₂ 8 = 3 because 2³ = 8',
            difficulty: 'Easy',
            topicId: 'jee-mathematics'
          },
          {
            id: 304,
            quizId: 2,
            questionText: 'The solution of x² - 5x + 6 = 0 is:',
            optionA: '2, 3',
            optionB: '-2, -3',
            optionC: '2, -3',
            optionD: '-2, 3',
            correctAnswer: 'A',
            points: 10,
            explanation: 'x² - 5x + 6 = (x-2)(x-3) = 0, so x = 2 or x = 3',
            difficulty: 'Medium',
            topicId: 'jee-mathematics'
          },
          {
            id: 305,
            quizId: 2,
            questionText: 'What is the value of ∫ 2x dx?',
            optionA: 'x²',
            optionB: 'x² + C',
            optionC: '2x²',
            optionD: '2x² + C',
            correctAnswer: 'B',
            points: 10,
            explanation: '∫ 2x dx = x² + C',
            difficulty: 'Medium',
            topicId: 'jee-mathematics'
          }
        ],

        // ===== NEET BIOLOGY TOPIC =====
        'neet-biology': [
          {
            id: 401,
            quizId: 3,
            questionText: 'Which organelle is known as the "powerhouse of the cell"?',
            optionA: 'Nucleus',
            optionB: 'Mitochondria',
            optionC: 'Ribosome',
            optionD: 'Golgi apparatus',
            correctAnswer: 'B',
            points: 10,
            explanation: 'Mitochondria generate ATP through cellular respiration, providing energy for cellular activities.',
            difficulty: 'Easy',
            topicId: 'neet-biology'
          },
          {
            id: 402,
            quizId: 3,
            questionText: 'How many chambers does the human heart have?',
            optionA: '2',
            optionB: '3',
            optionC: '4',
            optionD: '5',
            correctAnswer: 'C',
            points: 10,
            explanation: 'The human heart has 4 chambers: 2 atria and 2 ventricles.',
            difficulty: 'Easy',
            topicId: 'neet-biology'
          },
          {
            id: 403,
            quizId: 3,
            questionText: 'Which vitamin is produced by the skin when exposed to sunlight?',
            optionA: 'Vitamin A',
            optionB: 'Vitamin C',
            optionC: 'Vitamin D',
            optionD: 'Vitamin K',
            correctAnswer: 'C',
            points: 10,
            explanation: 'Vitamin D is synthesized in the skin upon exposure to UVB radiation.',
            difficulty: 'Easy',
            topicId: 'neet-biology'
          },
          {
            id: 404,
            quizId: 3,
            questionText: 'What is the function of hemoglobin?',
            optionA: 'Digest proteins',
            optionB: 'Carry oxygen',
            optionC: 'Fight infections',
            optionD: 'Clot blood',
            correctAnswer: 'B',
            points: 10,
            explanation: 'Hemoglobin in red blood cells binds to oxygen and transports it throughout the body.',
            difficulty: 'Easy',
            topicId: 'neet-biology'
          },
          {
            id: 405,
            quizId: 3,
            questionText: 'Which of the following is NOT a greenhouse gas?',
            optionA: 'CO₂',
            optionB: 'CH₄',
            optionC: 'N₂O',
            optionD: 'O₂',
            correctAnswer: 'D',
            points: 10,
            explanation: 'Oxygen (O₂) is not a greenhouse gas. Greenhouse gases include CO₂, CH₄, N₂O, and water vapor.',
            difficulty: 'Medium',
            topicId: 'neet-biology'
          }
        ],

        // ===== NEET PHYSICS TOPIC =====
        'neet-physics': [
          {
            id: 406,
            quizId: 3,
            questionText: 'What is the SI unit of force?',
            optionA: 'Joule',
            optionB: 'Newton',
            optionC: 'Watt',
            optionD: 'Pascal',
            correctAnswer: 'B',
            points: 10,
            explanation: 'The SI unit of force is Newton (N). 1 N = 1 kg·m/s².',
            difficulty: 'Easy',
            topicId: 'neet-physics'
          },
          {
            id: 407,
            quizId: 3,
            questionText: 'Which law states that energy cannot be created or destroyed?',
            optionA: 'Newton\'s First Law',
            optionB: 'Law of Conservation of Energy',
            optionC: 'Ohm\'s Law',
            optionD: 'Boyle\'s Law',
            correctAnswer: 'B',
            points: 10,
            explanation: 'The Law of Conservation of Energy states that energy can only be converted from one form to another.',
            difficulty: 'Easy',
            topicId: 'neet-physics'
          },
          {
            id: 408,
            quizId: 3,
            questionText: 'What is the speed of light in vacuum?',
            optionA: '3 × 10⁶ m/s',
            optionB: '3 × 10⁷ m/s',
            optionC: '3 × 10⁸ m/s',
            optionD: '3 × 10⁹ m/s',
            correctAnswer: 'C',
            points: 10,
            explanation: 'The speed of light in vacuum is approximately 3 × 10⁸ m/s.',
            difficulty: 'Easy',
            topicId: 'neet-physics'
          },
          {
            id: 409,
            quizId: 3,
            questionText: 'Which of the following has the highest frequency?',
            optionA: 'Radio waves',
            optionB: 'Microwaves',
            optionC: 'X-rays',
            optionD: 'Gamma rays',
            correctAnswer: 'D',
            points: 10,
            explanation: 'Gamma rays have the highest frequency in the electromagnetic spectrum.',
            difficulty: 'Medium',
            topicId: 'neet-physics'
          },
          {
            id: 410,
            quizId: 3,
            questionText: 'What is the acceleration due to gravity on Earth?',
            optionA: '9.8 m/s²',
            optionB: '10 m/s²',
            optionC: '8.9 m/s²',
            optionD: '11 m/s²',
            correctAnswer: 'A',
            points: 10,
            explanation: 'The standard acceleration due to gravity on Earth is approximately 9.8 m/s².',
            difficulty: 'Easy',
            topicId: 'neet-physics'
          }
        ],

        // ===== NEET CHEMISTRY TOPIC =====
        'neet-chemistry': [
          {
            id: 411,
            quizId: 3,
            questionText: 'What is the chemical symbol for Gold?',
            optionA: 'Go',
            optionB: 'Gd',
            optionC: 'Au',
            optionD: 'Ag',
            correctAnswer: 'C',
            points: 10,
            explanation: 'Gold has the symbol Au from the Latin word "aurum".',
            difficulty: 'Easy',
            topicId: 'neet-chemistry'
          },
          {
            id: 412,
            quizId: 3,
            questionText: 'Which gas is released during photosynthesis?',
            optionA: 'CO₂',
            optionB: 'O₂',
            optionC: 'N₂',
            optionD: 'H₂',
            correctAnswer: 'B',
            points: 10,
            explanation: 'Plants release oxygen (O₂) during photosynthesis.',
            difficulty: 'Easy',
            topicId: 'neet-chemistry'
          },
          {
            id: 413,
            quizId: 3,
            questionText: 'What is the pH of a neutral solution?',
            optionA: '0',
            optionB: '7',
            optionC: '14',
            optionD: '1',
            correctAnswer: 'B',
            points: 10,
            explanation: 'A neutral solution has pH 7 (pure water).',
            difficulty: 'Easy',
            topicId: 'neet-chemistry'
          },
          {
            id: 414,
            quizId: 3,
            questionText: 'Which element is present in all organic compounds?',
            optionA: 'Oxygen',
            optionB: 'Nitrogen',
            optionC: 'Carbon',
            optionD: 'Hydrogen',
            correctAnswer: 'C',
            points: 10,
            explanation: 'Carbon is the essential element in all organic compounds.',
            difficulty: 'Easy',
            topicId: 'neet-chemistry'
          },
          {
            id: 415,
            quizId: 3,
            questionText: 'What is the chemical formula of water?',
            optionA: 'H₂O₂',
            optionB: 'H₂O',
            optionC: 'OH',
            optionD: 'HO₂',
            correctAnswer: 'B',
            points: 10,
            explanation: 'Water has the chemical formula H₂O, consisting of two hydrogen atoms and one oxygen atom.',
            difficulty: 'Easy',
            topicId: 'neet-chemistry'
          }
        ],

        // ===== UPSC HISTORY TOPIC =====
        'upsc-history': [
          {
            id: 501,
            quizId: 4,
            questionText: 'Who was the founder of the Mauryan Empire?',
            optionA: 'Ashoka',
            optionB: 'Chandragupta Maurya',
            optionC: 'Bindusara',
            optionD: 'Harsha',
            correctAnswer: 'B',
            points: 10,
            explanation: 'Chandragupta Maurya founded the Mauryan Empire in 322 BCE with the help of Chanakya.',
            difficulty: 'Easy',
            topicId: 'upsc-history'
          },
          {
            id: 502,
            quizId: 4,
            questionText: 'Which is the oldest Veda?',
            optionA: 'Yajurveda',
            optionB: 'Samaveda',
            optionC: 'Rigveda',
            optionD: 'Atharvaveda',
            correctAnswer: 'C',
            points: 10,
            explanation: 'Rigveda is the oldest Veda, composed around 1500-1200 BCE.',
            difficulty: 'Easy',
            topicId: 'upsc-history'
          },
          {
            id: 503,
            quizId: 4,
            questionText: 'The Indus Valley Civilization was famous for:',
            optionA: 'Planned cities',
            optionB: 'Temples',
            optionC: 'Palaces',
            optionD: 'Pyramids',
            correctAnswer: 'A',
            points: 10,
            explanation: 'Indus Valley Civilization was known for its advanced urban planning and drainage systems.',
            difficulty: 'Easy',
            topicId: 'upsc-history'
          },
          {
            id: 504,
            quizId: 4,
            questionText: 'Who built the Qutub Minar?',
            optionA: 'Akbar',
            optionB: 'Qutub-ud-din Aibak',
            optionC: 'Shah Jahan',
            optionD: 'Aurangzeb',
            correctAnswer: 'B',
            points: 10,
            explanation: 'Qutub-ud-din Aibak started construction of Qutub Minar in 1193.',
            difficulty: 'Medium',
            topicId: 'upsc-history'
          },
          {
            id: 505,
            quizId: 4,
            questionText: 'The Battle of Plassey was fought in which year?',
            optionA: '1757',
            optionB: '1764',
            optionC: '1857',
            optionD: '1750',
            correctAnswer: 'A',
            points: 10,
            explanation: 'The Battle of Plassey was fought in 1757 between Robert Clive and Siraj-ud-Daulah.',
            difficulty: 'Medium',
            topicId: 'upsc-history'
          }
        ],

        // ===== UPSC GEOGRAPHY TOPIC =====
        'upsc-geography': [
          {
            id: 506,
            quizId: 4,
            questionText: 'Which is the longest river in India?',
            optionA: 'Ganga',
            optionB: 'Yamuna',
            optionC: 'Godavari',
            optionD: 'Brahmaputra',
            correctAnswer: 'A',
            points: 10,
            explanation: 'Ganga is the longest river in India, flowing over 2,500 km.',
            difficulty: 'Easy',
            topicId: 'upsc-geography'
          },
          {
            id: 507,
            quizId: 4,
            questionText: 'The Himalayas are an example of:',
            optionA: 'Fold mountains',
            optionB: 'Block mountains',
            optionC: 'Volcanic mountains',
            optionD: 'Residual mountains',
            correctAnswer: 'A',
            points: 10,
            explanation: 'Himalayas are fold mountains formed by the collision of Indian and Eurasian plates.',
            difficulty: 'Easy',
            topicId: 'upsc-geography'
          },
          {
            id: 508,
            quizId: 4,
            questionText: 'Which state is known as the "Spice Garden of India"?',
            optionA: 'Kerala',
            optionB: 'Karnataka',
            optionC: 'Tamil Nadu',
            optionD: 'Andhra Pradesh',
            correctAnswer: 'A',
            points: 10,
            explanation: 'Kerala is known as the Spice Garden of India due to its extensive spice cultivation.',
            difficulty: 'Easy',
            topicId: 'upsc-geography'
          },
          {
            id: 509,
            quizId: 4,
            questionText: 'The Tropic of Cancer passes through how many Indian states?',
            optionA: '6',
            optionB: '7',
            optionC: '8',
            optionD: '9',
            correctAnswer: 'C',
            points: 10,
            explanation: 'Tropic of Cancer passes through 8 Indian states: Gujarat, Rajasthan, MP, Chhattisgarh, Jharkhand, West Bengal, Tripura, Mizoram.',
            difficulty: 'Medium',
            topicId: 'upsc-geography'
          },
          {
            id: 510,
            quizId: 4,
            questionText: 'Which is the largest plateau in India?',
            optionA: 'Deccan Plateau',
            optionB: 'Malwa Plateau',
            optionC: 'Chota Nagpur Plateau',
            optionD: 'Tibetan Plateau',
            correctAnswer: 'A',
            points: 10,
            explanation: 'Deccan Plateau is the largest plateau in India, covering most of South India.',
            difficulty: 'Easy',
            topicId: 'upsc-geography'
          }
        ],

        // ===== UPSC POLITY TOPIC =====
        'upsc-polity': [
          {
            id: 511,
            quizId: 4,
            questionText: 'Who is the head of the Indian state?',
            optionA: 'Prime Minister',
            optionB: 'President',
            optionC: 'Chief Justice',
            optionD: 'Vice President',
            correctAnswer: 'B',
            points: 10,
            explanation: 'The President is the constitutional head of the Indian state.',
            difficulty: 'Easy',
            topicId: 'upsc-polity'
          },
          {
            id: 512,
            quizId: 4,
            questionText: 'How many schedules are there in the Indian Constitution?',
            optionA: '10',
            optionB: '12',
            optionC: '14',
            optionD: '8',
            correctAnswer: 'B',
            points: 10,
            explanation: 'Indian Constitution originally had 8 schedules, now it has 12 schedules.',
            difficulty: 'Medium',
            topicId: 'upsc-polity'
          },
          {
            id: 513,
            quizId: 4,
            questionText: 'What is the maximum strength of the Lok Sabha?',
            optionA: '545',
            optionB: '550',
            optionC: '552',
            optionD: '560',
            correctAnswer: 'C',
            points: 10,
            explanation: 'The maximum strength of Lok Sabha is 552 members (530 from states, 20 from UTs, 2 nominated).',
            difficulty: 'Medium',
            topicId: 'upsc-polity'
          },
          {
            id: 514,
            quizId: 4,
            questionText: 'Which article abolishes untouchability?',
            optionA: 'Article 14',
            optionB: 'Article 15',
            optionC: 'Article 17',
            optionD: 'Article 21',
            correctAnswer: 'C',
            points: 10,
            explanation: 'Article 17 abolishes untouchability and its practice in any form.',
            difficulty: 'Medium',
            topicId: 'upsc-polity'
          },
          {
            id: 515,
            quizId: 4,
            questionText: 'The concept of Fundamental Rights is borrowed from:',
            optionA: 'UK Constitution',
            optionB: 'US Constitution',
            optionC: 'French Constitution',
            optionD: 'Irish Constitution',
            correctAnswer: 'B',
            points: 10,
            explanation: 'Fundamental Rights are borrowed from the US Constitution.',
            difficulty: 'Medium',
            topicId: 'upsc-polity'
          }
        ],

        // ===== UPSC ECONOMICS TOPIC =====
        'upsc-economics': [
          {
            id: 516,
            quizId: 4,
            questionText: 'Who is known as the Father of Economics?',
            optionA: 'Adam Smith',
            optionB: 'Karl Marx',
            optionC: 'John Keynes',
            optionD: 'Amartya Sen',
            correctAnswer: 'A',
            points: 10,
            explanation: 'Adam Smith is known as the Father of Economics for his book "The Wealth of Nations".',
            difficulty: 'Easy',
            topicId: 'upsc-economics'
          },
          {
            id: 517,
            quizId: 4,
            questionText: 'What is GDP?',
            optionA: 'Gross Domestic Product',
            optionB: 'Gross Development Product',
            optionC: 'General Domestic Product',
            optionD: 'Gross Domestic Performance',
            correctAnswer: 'A',
            points: 10,
            explanation: 'GDP is the total value of all goods and services produced within a country.',
            difficulty: 'Easy',
            topicId: 'upsc-economics'
          },
          {
            id: 518,
            quizId: 4,
            questionText: 'Which sector contributes the most to India\'s GDP?',
            optionA: 'Agriculture',
            optionB: 'Industry',
            optionC: 'Services',
            optionD: 'Manufacturing',
            correctAnswer: 'C',
            points: 10,
            explanation: 'Services sector is the largest contributor to India\'s GDP (around 55%).',
            difficulty: 'Medium',
            topicId: 'upsc-economics'
          },
          {
            id: 519,
            quizId: 4,
            questionText: 'What is the full form of GST?',
            optionA: 'Goods and Services Tax',
            optionB: 'General Sales Tax',
            optionC: 'Government Sales Tax',
            optionD: 'Goods Sales Tax',
            correctAnswer: 'A',
            points: 10,
            explanation: 'GST stands for Goods and Services Tax, implemented in India in 2017.',
            difficulty: 'Easy',
            topicId: 'upsc-economics'
          },
          {
            id: 520,
            quizId: 4,
            questionText: 'Who presents the Union Budget in India?',
            optionA: 'Prime Minister',
            optionB: 'President',
            optionC: 'Finance Minister',
            optionD: 'RBI Governor',
            correctAnswer: 'C',
            points: 10,
            explanation: 'The Finance Minister presents the Union Budget in Parliament.',
            difficulty: 'Easy',
            topicId: 'upsc-economics'
          }
        ],

        // ===== UPSC ENVIRONMENT TOPIC =====
        'upsc-environment': [
          {
            id: 521,
            quizId: 4,
            questionText: 'Which is the largest ecosystem on Earth?',
            optionA: 'Forests',
            optionB: 'Oceans',
            optionC: 'Deserts',
            optionD: 'Grasslands',
            correctAnswer: 'B',
            points: 10,
            explanation: 'Oceans cover about 71% of Earth\'s surface and are the largest ecosystem.',
            difficulty: 'Easy',
            topicId: 'upsc-environment'
          },
          {
            id: 522,
            quizId: 4,
            questionText: 'What is the main cause of global warming?',
            optionA: 'Ozone depletion',
            optionB: 'Greenhouse gases',
            optionC: 'Deforestation',
            optionD: 'Acid rain',
            correctAnswer: 'B',
            points: 10,
            explanation: 'Greenhouse gases like CO₂ trap heat in the atmosphere, causing global warming.',
            difficulty: 'Easy',
            topicId: 'upsc-environment'
          },
          {
            id: 523,
            quizId: 4,
            questionText: 'Which is a renewable source of energy?',
            optionA: 'Coal',
            optionB: 'Petroleum',
            optionC: 'Solar',
            optionD: 'Natural gas',
            correctAnswer: 'C',
            points: 10,
            explanation: 'Solar energy is renewable as it comes from the sun and is inexhaustible.',
            difficulty: 'Easy',
            topicId: 'upsc-environment'
          },
          {
            id: 524,
            quizId: 4,
            questionText: 'What is the name of India\'s first national park?',
            optionA: 'Jim Corbett',
            optionB: 'Kanha',
            optionC: 'Bandhavgarh',
            optionD: 'Sunderbans',
            correctAnswer: 'A',
            points: 10,
            explanation: 'Jim Corbett National Park (1936) is India\'s first national park.',
            difficulty: 'Medium',
            topicId: 'upsc-environment'
          },
          {
            id: 525,
            quizId: 4,
            questionText: 'Which day is celebrated as World Environment Day?',
            optionA: 'June 5',
            optionB: 'April 22',
            optionC: 'March 20',
            optionD: 'July 11',
            correctAnswer: 'A',
            points: 10,
            explanation: 'World Environment Day is celebrated on June 5 every year.',
            difficulty: 'Easy',
            topicId: 'upsc-environment'
          }
        ],

        // ===== MHT CET PHYSICS TOPIC =====
        'mhtcet-physics': [
          {
            id: 601,
            quizId: 5,
            questionText: 'What is the SI unit of electric charge?',
            optionA: 'Volt',
            optionB: 'Ampere',
            optionC: 'Coulomb',
            optionD: 'Ohm',
            correctAnswer: 'C',
            points: 10,
            explanation: 'Coulomb (C) is the SI unit of electric charge.',
            difficulty: 'Easy',
            topicId: 'mhtcet-physics'
          },
          {
            id: 602,
            quizId: 5,
            questionText: 'Which of the following is a scalar quantity?',
            optionA: 'Velocity',
            optionB: 'Acceleration',
            optionC: 'Force',
            optionD: 'Speed',
            correctAnswer: 'D',
            points: 10,
            explanation: 'Speed has only magnitude, no direction, making it a scalar quantity.',
            difficulty: 'Easy',
            topicId: 'mhtcet-physics'
          },
          {
            id: 603,
            quizId: 5,
            questionText: 'Ohm\'s law relates which two quantities?',
            optionA: 'Current and resistance',
            optionB: 'Voltage and current',
            optionC: 'Voltage and resistance',
            optionD: 'Power and current',
            correctAnswer: 'B',
            points: 10,
            explanation: 'Ohm\'s law states that V = IR, relating voltage and current.',
            difficulty: 'Easy',
            topicId: 'mhtcet-physics'
          },
          {
            id: 604,
            quizId: 5,
            questionText: 'What is the frequency of AC in India?',
            optionA: '50 Hz',
            optionB: '60 Hz',
            optionC: '100 Hz',
            optionD: '220 Hz',
            correctAnswer: 'A',
            points: 10,
            explanation: 'India uses 50 Hz AC power supply.',
            difficulty: 'Easy',
            topicId: 'mhtcet-physics'
          },
          {
            id: 605,
            quizId: 5,
            questionText: 'The unit of power is:',
            optionA: 'Joule',
            optionB: 'Watt',
            optionC: 'Newton',
            optionD: 'Pascal',
            correctAnswer: 'B',
            points: 10,
            explanation: 'Watt (W) is the SI unit of power. 1 W = 1 J/s.',
            difficulty: 'Easy',
            topicId: 'mhtcet-physics'
          }
        ],

        // ===== MHT CET CHEMISTRY TOPIC =====
        'mhtcet-chemistry': [
          {
            id: 606,
            quizId: 5,
            questionText: 'What is the chemical symbol for Sodium?',
            optionA: 'So',
            optionB: 'Sd',
            optionC: 'Na',
            optionD: 'N',
            correctAnswer: 'C',
            points: 10,
            explanation: 'Sodium has the symbol Na from the Latin word "natrium".',
            difficulty: 'Easy',
            topicId: 'mhtcet-chemistry'
          },
          {
            id: 607,
            quizId: 5,
            questionText: 'Which gas is essential for respiration?',
            optionA: 'CO₂',
            optionB: 'O₂',
            optionC: 'N₂',
            optionD: 'H₂',
            correctAnswer: 'B',
            points: 10,
            explanation: 'Oxygen (O₂) is essential for respiration.',
            difficulty: 'Easy',
            topicId: 'mhtcet-chemistry'
          },
          {
            id: 608,
            quizId: 5,
            questionText: 'What is the chemical formula of common salt?',
            optionA: 'NaCl',
            optionB: 'KCl',
            optionC: 'NaClO',
            optionD: 'Na₂CO₃',
            correctAnswer: 'A',
            points: 10,
            explanation: 'Common salt is sodium chloride, NaCl.',
            difficulty: 'Easy',
            topicId: 'mhtcet-chemistry'
          },
          {
            id: 609,
            quizId: 5,
            questionText: 'Which element is represented by the symbol "Fe"?',
            optionA: 'Gold',
            optionB: 'Silver',
            optionC: 'Iron',
            optionD: 'Copper',
            correctAnswer: 'C',
            points: 10,
            explanation: 'Fe is the chemical symbol for Iron (from Latin "ferrum").',
            difficulty: 'Easy',
            topicId: 'mhtcet-chemistry'
          },
          {
            id: 610,
            quizId: 5,
            questionText: 'What is the pH of an acidic solution?',
            optionA: 'Less than 7',
            optionB: 'Equal to 7',
            optionC: 'Greater than 7',
            optionD: 'Exactly 0',
            correctAnswer: 'A',
            points: 10,
            explanation: 'Acidic solutions have pH less than 7.',
            difficulty: 'Easy',
            topicId: 'mhtcet-chemistry'
          }
        ],

        // ===== MHT CET MATHEMATICS TOPIC =====
        'mhtcet-mathematics': [
          {
            id: 611,
            quizId: 5,
            questionText: 'What is the value of sin 0°?',
            optionA: '0',
            optionB: '1',
            optionC: '-1',
            optionD: '∞',
            correctAnswer: 'A',
            points: 10,
            explanation: 'sin 0° = 0',
            difficulty: 'Easy',
            topicId: 'mhtcet-mathematics'
          },
          {
            id: 612,
            quizId: 5,
            questionText: 'What is the derivative of a constant?',
            optionA: '1',
            optionB: '0',
            optionC: 'Constant',
            optionD: 'Infinite',
            correctAnswer: 'B',
            points: 10,
            explanation: 'The derivative of a constant is always 0.',
            difficulty: 'Easy',
            topicId: 'mhtcet-mathematics'
          },
          {
            id: 613,
            quizId: 5,
            questionText: 'If x + 2 = 5, then x = ?',
            optionA: '2',
            optionB: '3',
            optionC: '4',
            optionD: '5',
            correctAnswer: 'B',
            points: 10,
            explanation: 'x + 2 = 5, so x = 5 - 2 = 3',
            difficulty: 'Easy',
            topicId: 'mhtcet-mathematics'
          },
          {
            id: 614,
            quizId: 5,
            questionText: 'What is the area of a square with side 4 cm?',
            optionA: '8 cm²',
            optionB: '12 cm²',
            optionC: '16 cm²',
            optionD: '20 cm²',
            correctAnswer: 'C',
            points: 10,
            explanation: 'Area of square = side² = 4² = 16 cm²',
            difficulty: 'Easy',
            topicId: 'mhtcet-mathematics'
          },
          {
            id: 615,
            quizId: 5,
            questionText: 'What is the value of log₁₀ 100?',
            optionA: '1',
            optionB: '2',
            optionC: '10',
            optionD: '100',
            correctAnswer: 'B',
            points: 10,
            explanation: 'log₁₀ 100 = 2 because 10² = 100',
            difficulty: 'Easy',
            topicId: 'mhtcet-mathematics'
          }
        ],

        // ===== MHT CET BIOLOGY TOPIC =====
        'mhtcet-biology': [
          {
            id: 616,
            quizId: 5,
            questionText: 'What is the basic unit of life?',
            optionA: 'Cell',
            optionB: 'Tissue',
            optionC: 'Organ',
            optionD: 'Organism',
            correctAnswer: 'A',
            points: 10,
            explanation: 'The cell is the basic structural and functional unit of life.',
            difficulty: 'Easy',
            topicId: 'mhtcet-biology'
          },
          {
            id: 617,
            quizId: 5,
            questionText: 'Which vitamin is known as ascorbic acid?',
            optionA: 'Vitamin A',
            optionB: 'Vitamin B',
            optionC: 'Vitamin C',
            optionD: 'Vitamin D',
            correctAnswer: 'C',
            points: 10,
            explanation: 'Vitamin C is also known as ascorbic acid.',
            difficulty: 'Easy',
            topicId: 'mhtcet-biology'
          },
          {
            id: 618,
            quizId: 5,
            questionText: 'What is the largest organ in the human body?',
            optionA: 'Heart',
            optionB: 'Liver',
            optionC: 'Skin',
            optionD: 'Brain',
            correctAnswer: 'C',
            points: 10,
            explanation: 'Skin is the largest organ in the human body.',
            difficulty: 'Easy',
            topicId: 'mhtcet-biology'
          },
          {
            id: 619,
            quizId: 5,
            questionText: 'Which plant pigment is essential for photosynthesis?',
            optionA: 'Chlorophyll',
            optionB: 'Xanthophyll',
            optionC: 'Carotene',
            optionD: 'Anthocyanin',
            correctAnswer: 'A',
            points: 10,
            explanation: 'Chlorophyll is the green pigment essential for photosynthesis.',
            difficulty: 'Easy',
            topicId: 'mhtcet-biology'
          },
          {
            id: 620,
            quizId: 5,
            questionText: 'How many bones are there in an adult human body?',
            optionA: '206',
            optionB: '208',
            optionC: '210',
            optionD: '212',
            correctAnswer: 'A',
            points: 10,
            explanation: 'An adult human body has 206 bones.',
            difficulty: 'Medium',
            topicId: 'mhtcet-biology'
          }
        ]
      };
      
      return mockQuestions[topicId] || [];
    }
  },

  /**
   * Get quiz by ID
   */
  async getQuizById(quizId: number): Promise<Quiz> {
    try {
      const response = await axiosInstance.get(
        API_ENDPOINTS.QUIZZES.GET_BY_ID(quizId)
      );
      return response.data;
    } catch (error: any) {
      console.error(`❌ Failed to fetch quiz ${quizId}:`, error);
      throw new Error(error.response?.data?.message || 'Quiz not found');
    }
  },

  // ===== ATTEMPT METHODS =====

  /**
   * Start a quiz attempt
   */
  async startQuizAttempt(quizId: number, topicId?: string): Promise<QuizAttempt> {
    try {
      const token = tokenManager.getToken();
      if (!token) {
        showToast.error('Please login to take quiz');
        throw new Error('Authentication required');
      }

      const payload = topicId ? { topicId } : {};
      const response = await axiosInstance.post(
        API_ENDPOINTS.QUIZZES.START(quizId),
        payload
      );
      
      console.log(`✅ Quiz attempt started:`, response.data);
      return response.data;
    } catch (error: any) {
      console.error('❌ Failed to start quiz:', error);
      showToast.error('Failed to start quiz');
      throw error;
    }
  },

  /**
   * Submit quiz answers
   */
  async submitQuizAttempt(attemptId: number, answers: Record<number, string>): Promise<QuizResult> {
    try {
      const response = await axiosInstance.post(
        API_ENDPOINTS.QUIZZES.SUBMIT(attemptId),
        { answers }
      );
      
      console.log(`✅ Quiz submitted:`, response.data);
      showToast.success('Quiz submitted successfully!');
      return response.data;
    } catch (error: any) {
      console.error('❌ Failed to submit quiz:', error);
      showToast.error('Failed to submit quiz');
      throw error;
    }
  },

  /**
   * Get user's attempts for a quiz
   */
  async getUserAttempts(quizId: number): Promise<QuizAttempt[]> {
    try {
      const response = await axiosInstance.get(
        API_ENDPOINTS.QUIZZES.ATTEMPTS(quizId)
      );
      return response.data;
    } catch (error: any) {
      console.error('❌ Failed to fetch attempts:', error);
      return [];
    }
  },

  /**
   * Get a specific attempt with results
   */
  async getAttemptResult(attemptId: number): Promise<QuizResult> {
    try {
      const response = await axiosInstance.get(
        `/api/quizzes/attempt/${attemptId}/result`
      );
      return response.data;
    } catch (error: any) {
      console.error('❌ Failed to fetch results:', error);
      throw new Error(error.response?.data?.message || 'Failed to fetch results');
    }
  },

  // ===== LEADERBOARD METHODS =====

  /**
   * Get leaderboard for a quiz
   */
  async getQuizLeaderboard(quizId: number, timeFrame: 'weekly' | 'monthly' | 'all' = 'weekly'): Promise<any[]> {
    try {
      console.log(`📡 Fetching leaderboard for quiz ${quizId}...`);
      const response = await axiosInstance.get(
        `/api/quizzes/${quizId}/leaderboard?timeFrame=${timeFrame}`
      );
      return response.data;
    } catch (error: any) {
      console.error('❌ Failed to fetch leaderboard:', error);
      
      // Return mock leaderboard
      return [
        { rank: 1, name: 'Alex Johnson', score: 9850, quizzes: 24, avatar: '👨‍🎓' },
        { rank: 2, name: 'Sarah Williams', score: 9720, quizzes: 22, avatar: '👩‍🎓' },
        { rank: 3, name: 'Michael Chen', score: 9540, quizzes: 21, avatar: '👨‍🎓' },
        { rank: 4, name: 'Emily Davis', score: 9310, quizzes: 20, avatar: '👩‍🎓' }
      ];
    }
  },

  // ===== PROGRESS TRACKING =====

  /**
   * Get user's quiz progress
   */
  async getUserQuizProgress(): Promise<UserProgress[]> {
    try {
      const token = tokenManager.getToken();
      if (!token) return [];

      const response = await axiosInstance.get('/api/users/progress/quizzes');
      return response.data;
    } catch (error: any) {
      console.error('❌ Failed to fetch user progress:', error);
      return [];
    }
  },

  /**
   * Update user progress for a quiz
   */
  async updateQuizProgress(quizId: number, score: number, completed: boolean): Promise<void> {
    try {
      await axiosInstance.post('/api/users/progress/quizzes', {
        quizId,
        score,
        completed,
        completedAt: new Date().toISOString()
      });
    } catch (error: any) {
      console.error('❌ Failed to update progress:', error);
    }
  }
};