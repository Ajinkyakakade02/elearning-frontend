/**
 * Get initials from full name
 */
export const getInitials = (name: string): string => {
  if (!name) return 'U';
  
  const parts = name.trim().split(' ');
  if (parts.length === 1) return parts[0].charAt(0).toUpperCase();
  
  return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase();
};

/**
 * Generate consistent color based on name (for avatar background)
 */
export const getAvatarColor = (name: string): string => {
  if (!name) return '#6366f1'; // Default indigo
  
  // List of professional, pleasing colors
  const colors = [
    '#6366f1', // Indigo
    '#8b5cf6', // Purple
    '#3b82f6', // Blue
    '#10b981', // Green
    '#f59e0b', // Amber
    '#ef4444', // Red
    '#ec4899', // Pink
    '#14b8a6', // Teal
    '#f97316', // Orange
    '#6b7280', // Gray
  ];
  
  // Simple hash to get consistent color for same name
  const hash = name.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  return colors[hash % colors.length];
};

/**
 * Get avatar URL (if custom) or null
 */
export const getAvatarUrl = (user: any): string | null => {
  return user?.avatarUrl || null;
};