import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { 
  FaArrowLeft, 
  FaEnvelope, 
  FaCalendarAlt,
  FaGraduationCap,
  FaBook,
  FaTrophy,
  FaEdit,
  FaSave,
  FaTimes,
  FaCamera,
  FaCheckCircle,
  FaClock,
  FaHeart
} from 'react-icons/fa';
import { showToast } from '../../utils/toast';
import courseService from '../../services/course.service';
import { tokenManager } from '../../utils/tokenManager';

interface ProfilePageProps {
  darkMode?: boolean;
  setDarkMode?: (value: boolean) => void;
}

const ProfilePage: React.FC<ProfilePageProps> = ({ darkMode, setDarkMode }) => {
  const navigate = useNavigate();
  const { user, updateUser } = useAuth();
  
  // State for profile data
  const [profileData, setProfileData] = useState({
    fullName: '',
    email: '',
    bio: '',
    avatarUrl: '',
    joinedDate: '',
    role: ''
  });
  
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({
    fullName: '',
    bio: '',
    avatarUrl: ''
  });
  const [isSaving, setIsSaving] = useState(false);
  const [previewAvatar, setPreviewAvatar] = useState<string | null>(null);
  const [stats, setStats] = useState({
    enrolledCourses: 0,
    completedCourses: 0,
    certificates: 0,
    wishlistItems: 0,
    totalHours: 0,
    joinDate: ''
  });

  // Helper function to update localStorage
  const updateLocalStorage = (updatedUserData: any) => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        const userObj = JSON.parse(storedUser);
        const updatedUser = {
          ...userObj,
          ...updatedUserData
        };
        localStorage.setItem('user', JSON.stringify(updatedUser));
        
        // Also update token manager if it has user data
        if (tokenManager.updateUser) {
          tokenManager.updateUser(updatedUser);
        }
        
        console.log('Local storage updated:', updatedUser);
      } catch (e) {
        console.error('Error updating local storage:', e);
      }
    }
  };

  // Load user data whenever user changes
  useEffect(() => {
    if (user) {
      console.log('Loading user data:', user);
      const userData = {
        fullName: user.fullName || 'User',
        email: user.email || '',
        bio: user.bio || 'No bio added yet. Click edit to add a bio.',
        avatarUrl: user.avatarUrl || '',
        joinedDate: user.createdAt || new Date().toISOString(),
        role: user.role || 'student'
      };
      setProfileData(userData);
      setEditForm({
        fullName: userData.fullName,
        bio: userData.bio,
        avatarUrl: userData.avatarUrl
      });
      setPreviewAvatar(userData.avatarUrl);
    }
  }, [user]);

  // Load user stats
  useEffect(() => {
    const loadStats = async () => {
      try {
        // Get enrollments
        const enrollments = await courseService.getUserEnrollments();
        
        // Get wishlist from localStorage
        const wishlist = JSON.parse(localStorage.getItem('wishlist') || '[]');
        
        // Calculate stats
        const completed = enrollments.filter(e => e.progress >= 100).length;
        const totalHours = enrollments.reduce((acc, e) => acc + (e.progress || 0), 0);
        
        setStats({
          enrolledCourses: enrollments.length,
          completedCourses: completed,
          certificates: completed,
          wishlistItems: wishlist.length,
          totalHours: Math.round(totalHours / 60),
          joinDate: profileData.joinedDate
        });
      } catch (error) {
        console.error('Failed to load stats:', error);
      }
    };
    
    loadStats();
  }, [profileData.joinedDate]);

  const handleEditClick = () => {
    setIsEditing(true);
  };

  const handleCancelEdit = () => {
    setEditForm({
      fullName: profileData.fullName,
      bio: profileData.bio,
      avatarUrl: profileData.avatarUrl
    });
    setPreviewAvatar(profileData.avatarUrl);
    setIsEditing(false);
  };

  // FIXED: Separate handlers for input and textarea
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setEditForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleTextareaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setEditForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Create a preview URL
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        setPreviewAvatar(result);
        setEditForm(prev => ({
          ...prev,
          avatarUrl: result
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveProfile = async () => {
    setIsSaving(true);
    
    try {
      // Create updated user object
      const updatedUserData = {
        fullName: editForm.fullName,
        bio: editForm.bio,
        avatarUrl: editForm.avatarUrl
      };

      console.log('Saving profile with data:', updatedUserData);

      // Try to update via API if updateUser function exists
      if (updateUser) {
        try {
          await updateUser(updatedUserData);
          console.log('Profile updated via API');
        } catch (apiError) {
          console.error('API update failed, updating locally:', apiError);
          // If API fails, update local storage manually
          updateLocalStorage(updatedUserData);
        }
      } else {
        // If no updateUser function, update local storage manually
        updateLocalStorage(updatedUserData);
      }

      // Update local state immediately for UI feedback
      setProfileData(prev => ({
        ...prev,
        fullName: editForm.fullName,
        bio: editForm.bio,
        avatarUrl: editForm.avatarUrl
      }));

      showToast.success('✅ Profile updated successfully!');
      setIsEditing(false);
      
      // Force a re-render by triggering a small delay
      setTimeout(() => {
        window.dispatchEvent(new Event('storage'));
      }, 100);
      
    } catch (error) {
      console.error('Failed to update profile:', error);
      showToast.error('❌ Failed to update profile');
    } finally {
      setIsSaving(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const getRoleBadge = (role: string) => {
    switch(role.toLowerCase()) {
      default:
        return { text: 'Student', color: '#3b82f6', icon: '🧑‍🎓' };
    }
  };

  const roleInfo = getRoleBadge(profileData.role);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 relative">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5 pointer-events-none">
        <div className="absolute top-0 left-0 w-96 h-96 bg-blue-500 rounded-full filter blur-3xl"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-purple-500 rounded-full filter blur-3xl"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8 relative z-10">
        {/* Header */}
        <div className="mb-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <button 
              className="inline-flex items-center gap-2 text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors group"
              onClick={() => navigate('/dashboard')}
            >
              <FaArrowLeft className="group-hover:-translate-x-1 transition-transform" /> Back to Dashboard
            </button>
            
            {!isEditing && (
              <button 
                className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                onClick={handleEditClick}
              >
                <FaEdit /> Edit Profile
              </button>
            )}
          </div>
        </div>

        {/* Profile Card */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl overflow-hidden mb-8">
          {/* Cover Photo */}
          <div className="h-32 bg-gradient-to-r from-blue-600 to-purple-700"></div>
          
          {/* Profile Content */}
          <div className="px-6 pb-6">
            {/* Avatar Section */}
            <div className="flex flex-col items-center -mt-16 mb-4">
              <div className="relative">
                <div className="w-32 h-32 rounded-full border-4 border-white dark:border-gray-800 overflow-hidden bg-gray-200 dark:bg-gray-700">
                  {(previewAvatar || profileData.avatarUrl) ? (
                    <img 
                      src={previewAvatar || profileData.avatarUrl}
                      alt={profileData.fullName}
                      className="w-full h-full object-cover"
                      key={previewAvatar || profileData.avatarUrl} // Force re-render on change
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-3xl font-bold text-gray-600 dark:text-gray-300">
                      {getInitials(profileData.fullName)}
                    </div>
                  )}
                </div>
                
                {isEditing && (
                  <label className="absolute bottom-0 right-0 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center cursor-pointer hover:bg-blue-700 transition-colors">
                    <FaCamera />
                    <input 
                      type="file" 
                      accept="image/*"
                      onChange={handleAvatarChange}
                      className="hidden"
                    />
                  </label>
                )}
              </div>
              
              {/* Role Badge */}
              <div 
                className="mt-2 px-4 py-1 rounded-full text-white text-sm font-semibold flex items-center gap-2"
                style={{ backgroundColor: roleInfo.color }}
              >
                <span>{roleInfo.icon}</span>
                <span>{roleInfo.text}</span>
              </div>
            </div>

            {/* Profile Info */}
            <div className="text-center">
              {isEditing ? (
                <div className="max-w-md mx-auto space-y-4">
                  <div className="text-left">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
                      Full Name
                    </label>
                    <input
                      type="text"
                      name="fullName"
                      value={editForm.fullName}
                      onChange={handleInputChange}
                      placeholder="Enter your full name"
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  
                  <div className="text-left">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
                      Bio
                    </label>
                    <textarea
                      name="bio"
                      value={editForm.bio}
                      onChange={handleTextareaChange}
                      placeholder="Tell us about yourself"
                      rows={4}
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div className="text-left">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
                      Profile Picture URL (optional)
                    </label>
                    <input
                      type="text"
                      name="avatarUrl"
                      value={editForm.avatarUrl}
                      onChange={handleInputChange}
                      placeholder="Enter image URL"
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                      Or use the camera icon above to upload a file
                    </p>
                  </div>

                  <div className="flex gap-3 pt-4">
                    <button 
                      className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                      onClick={handleSaveProfile}
                      disabled={isSaving}
                    >
                      {isSaving ? 'Saving...' : <><FaSave /> Save Changes</>}
                    </button>
                    <button 
                      className="flex-1 px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                      onClick={handleCancelEdit}
                      disabled={isSaving}
                    >
                      <FaTimes /> Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-2">{profileData.fullName}</h1>
                  <div className="flex items-center justify-center gap-2 text-gray-600 dark:text-gray-300 mb-4">
                    <FaEnvelope /> {profileData.email}
                  </div>
                  
                  <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto mb-6">
                    {profileData.bio}
                  </p>
                  
                  <div className="flex flex-wrap justify-center gap-6">
                    <div className="flex items-center gap-2 text-gray-600 dark:text-gray-300">
                      <FaCalendarAlt /> Joined {formatDate(profileData.joinedDate)}
                    </div>
                    <div className="flex items-center gap-2 text-gray-600 dark:text-gray-300">
                      <FaGraduationCap /> {roleInfo.text}
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center text-white text-xl">
                <FaBook />
              </div>
              <div>
                <span className="text-2xl font-bold text-gray-800 dark:text-white">{stats.enrolledCourses}</span>
                <p className="text-gray-600 dark:text-gray-300">Enrolled Courses</p>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center text-white text-xl">
                <FaCheckCircle />
              </div>
              <div>
                <span className="text-2xl font-bold text-gray-800 dark:text-white">{stats.completedCourses}</span>
                <p className="text-gray-600 dark:text-gray-300">Completed</p>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gradient-to-br from-yellow-500 to-orange-600 rounded-xl flex items-center justify-center text-white text-xl">
                <FaTrophy />
              </div>
              <div>
                <span className="text-2xl font-bold text-gray-800 dark:text-white">{stats.certificates}</span>
                <p className="text-gray-600 dark:text-gray-300">Certificates</p>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl flex items-center justify-center text-white text-xl">
                <FaHeart />
              </div>
              <div>
                <span className="text-2xl font-bold text-gray-800 dark:text-white">{stats.wishlistItems}</span>
                <p className="text-gray-600 dark:text-gray-300">Wishlist</p>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gradient-to-br from-red-500 to-pink-600 rounded-xl flex items-center justify-center text-white text-xl">
                <FaClock />
              </div>
              <div>
                <span className="text-2xl font-bold text-gray-800 dark:text-white">{stats.totalHours}h</span>
                <p className="text-gray-600 dark:text-gray-300">Learning Time</p>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gradient-to-br from-teal-500 to-cyan-600 rounded-xl flex items-center justify-center text-white text-xl">
                <FaGraduationCap />
              </div>
              <div>
                <span className="text-2xl font-bold text-gray-800 dark:text-white">
                  {stats.enrolledCourses > 0 
                    ? Math.round((stats.completedCourses / stats.enrolledCourses) * 100) 
                    : 0}%
                </span>
                <p className="text-gray-600 dark:text-gray-300">Completion Rate</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;