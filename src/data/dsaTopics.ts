// src/data/dsaTopics.ts

export const dsaTopics = {
  'arrays': {
    id: 4,
    lessonId: 401,
    title: 'Arrays Masterclass - One Shot Lecture',
    description: 'Complete one-shot lecture covering all array concepts including searching, sorting, two pointers, sliding window, and advanced array manipulations. By GeeksforGeeks.',
    videoUrl: 'https://youtu.be/_MwptrixhCs?si=pAuCdrLN6GvfbLV3',
    duration: 180,
    icon: '📊',
    color: '#3b82f6',
    stats: { students: 15000, rating: 4.8 },
    problems: [
      { id: 1, name: 'Two Sum', difficulty: 'Easy', leetcodeUrl: 'https://leetcode.com/problems/two-sum/' },
      { id: 2, name: 'Best Time to Buy and Sell Stock', difficulty: 'Easy', leetcodeUrl: 'https://leetcode.com/problems/best-time-to-buy-and-sell-stock/' },
      { id: 3, name: 'Contains Duplicate', difficulty: 'Easy', leetcodeUrl: 'https://leetcode.com/problems/contains-duplicate/' },
      { id: 4, name: 'Product of Array Except Self', difficulty: 'Medium', leetcodeUrl: 'https://leetcode.com/problems/product-of-array-except-self/' },
      { id: 5, name: 'Maximum Subarray', difficulty: 'Medium', leetcodeUrl: 'https://leetcode.com/problems/maximum-subarray/' },
      { id: 6, name: 'Merge Intervals', difficulty: 'Medium', leetcodeUrl: 'https://leetcode.com/problems/merge-intervals/' },
      { id: 7, name: '3Sum', difficulty: 'Medium', leetcodeUrl: 'https://leetcode.com/problems/3sum/' },
      { id: 8, name: 'Container With Most Water', difficulty: 'Medium', leetcodeUrl: 'https://leetcode.com/problems/container-with-most-water/' },
      { id: 9, name: 'Find Minimum in Rotated Sorted Array', difficulty: 'Medium', leetcodeUrl: 'https://leetcode.com/problems/find-minimum-in-rotated-sorted-array/' },
      { id: 10, name: 'Search in Rotated Sorted Array', difficulty: 'Medium', leetcodeUrl: 'https://leetcode.com/problems/search-in-rotated-sorted-array/' }
    ],
    topics: [
      'Array basics and operations',
      'Searching algorithms (Linear & Binary)',
      'Sorting algorithms (Bubble, Selection, Insertion, Merge, Quick)',
      'Two pointers technique',
      'Sliding window problems',
      'Advanced array manipulations',
      'Common interview problems and solutions'
    ]
  },
  'two-pointers': {
    id: 5,
    lessonId: 501,
    title: 'Two Pointers Technique - One Shot Lecture',
    description: 'Complete one-shot lecture mastering the two pointers technique for solving array and string problems efficiently. By College Wallah.',
    videoUrl: 'https://youtu.be/FmXF2df9OVo?si=OqmJ8GykjKA4rlZZ',
    duration: 120,
    icon: '🎯',
    color: '#48bb78',
    stats: { students: 12000, rating: 4.7 },
    problems: [
      { id: 1, name: 'Valid Palindrome', difficulty: 'Easy', leetcodeUrl: 'https://leetcode.com/problems/valid-palindrome/' },
      { id: 2, name: 'Two Sum II - Input Array Is Sorted', difficulty: 'Easy', leetcodeUrl: 'https://leetcode.com/problems/two-sum-ii-input-array-is-sorted/' },
      { id: 3, name: 'Container With Most Water', difficulty: 'Medium', leetcodeUrl: 'https://leetcode.com/problems/container-with-most-water/' },
      { id: 4, name: '3Sum', difficulty: 'Medium', leetcodeUrl: 'https://leetcode.com/problems/3sum/' },
      { id: 5, name: 'Remove Duplicates from Sorted Array', difficulty: 'Easy', leetcodeUrl: 'https://leetcode.com/problems/remove-duplicates-from-sorted-array/' },
      { id: 6, name: 'Trapping Rain Water', difficulty: 'Hard', leetcodeUrl: 'https://leetcode.com/problems/trapping-rain-water/' },
      { id: 7, name: 'Move Zeroes', difficulty: 'Easy', leetcodeUrl: 'https://leetcode.com/problems/move-zeroes/' },
      { id: 8, name: 'Sort Colors', difficulty: 'Medium', leetcodeUrl: 'https://leetcode.com/problems/sort-colors/' }
    ],
    topics: [
      'Introduction to Two Pointers',
      'Opposite direction pointers',
      'Same direction pointers (Fast & Slow)',
      'Common patterns and applications',
      'Problem-solving strategies',
      'Interview questions walkthrough'
    ]
  },
  'sliding-window': {
    id: 6,
    lessonId: 601,
    title: 'Sliding Window Algorithm - One Shot Lecture',
    description: 'Complete one-shot lecture mastering the sliding window pattern for solving substring and subarray problems. Live lecture.',
    videoUrl: 'https://www.youtube.com/live/WalA-JT8bzw?si=OzbuOwgBSgse7I8S',
    duration: 150,
    icon: '🪟',
    color: '#ed8936',
    stats: { students: 14000, rating: 4.9 },
    problems: [
      { id: 1, name: 'Maximum Average Subarray I', difficulty: 'Easy', leetcodeUrl: 'https://leetcode.com/problems/maximum-average-subarray-i/' },
      { id: 2, name: 'Longest Substring Without Repeating Characters', difficulty: 'Medium', leetcodeUrl: 'https://leetcode.com/problems/longest-substring-without-repeating-characters/' },
      { id: 3, name: 'Minimum Window Substring', difficulty: 'Hard', leetcodeUrl: 'https://leetcode.com/problems/minimum-window-substring/' },
      { id: 4, name: 'Fruit Into Baskets', difficulty: 'Medium', leetcodeUrl: 'https://leetcode.com/problems/fruit-into-baskets/' },
      { id: 5, name: 'Permutation in String', difficulty: 'Medium', leetcodeUrl: 'https://leetcode.com/problems/permutation-in-string/' },
      { id: 6, name: 'Sliding Window Maximum', difficulty: 'Hard', leetcodeUrl: 'https://leetcode.com/problems/sliding-window-maximum/' },
      { id: 7, name: 'Longest Repeating Character Replacement', difficulty: 'Medium', leetcodeUrl: 'https://leetcode.com/problems/longest-repeating-character-replacement/' },
      { id: 8, name: 'Subarrays with K Different Integers', difficulty: 'Hard', leetcodeUrl: 'https://leetcode.com/problems/subarrays-with-k-different-integers/' }
    ],
    topics: [
      'Fixed-size sliding window',
      'Variable-size sliding window',
      'Window expansion and contraction',
      'Common patterns and use cases',
      'Optimization techniques',
      'Interview problem walkthroughs'
    ]
  }
};

export type DSATopicKey = keyof typeof dsaTopics;