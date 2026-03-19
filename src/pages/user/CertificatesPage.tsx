import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import certificateService from '../../services/certificate.service';
import { Certificate } from '../../types/certificate.types';
import { 
  FaArrowLeft,
  FaTrophy,
  FaDownload,
  FaShareAlt,
  FaCertificate
} from 'react-icons/fa';  // Removed FaGraduationCap and FaRupeeSign

interface CertificatesPageProps {
  darkMode: boolean;
  setDarkMode: (value: boolean) => void;
}

const CertificatesPage: React.FC<CertificatesPageProps> = ({ darkMode, setDarkMode }) => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [certificates, setCertificates] = useState<Certificate[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedCertificate, setSelectedCertificate] = useState<Certificate | null>(null);
  const [totalSpent, setTotalSpent] = useState(0);

  // Wrap fetchCertificates in useCallback to fix the ESLint warning
  const fetchCertificates = useCallback(async () => {
    setIsLoading(true);
    try {
      if (user?.id) {
        const data = await certificateService.getUserCertificates(user.id);
        console.log('📊 Certificates fetched:', data);
        setCertificates(data);
        setTotalSpent(data.length * 99); // Each certificate represents a completed ₹99 course
      }
    } catch (error) {
      console.error('Failed to fetch certificates:', error);
      
      // Mock data with all required Certificate fields
      const mockCertificates: Certificate[] = [
        {
          id: '1',
          userId: user?.id || 1,
          userName: user?.fullName || 'Ajinkya Kakade',
          courseId: 101,
          courseTitle: 'JavaScript Fundamentals',
          instructorName: 'Dr. Sarah Wilson',
          issueDate: new Date().toISOString(),
          completionPercentage: 100,
          grade: 'A'
        },
        {
          id: '2',
          userId: user?.id || 1,
          userName: user?.fullName || 'Ajinkya Kakade',
          courseId: 102,
          courseTitle: 'React Development',
          instructorName: 'Prof. Michael Chen',
          issueDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
          completionPercentage: 100,
          grade: 'A+'
        },
        {
          id: '3',
          userId: user?.id || 1,
          userName: user?.fullName || 'Ajinkya Kakade',
          courseId: 103,
          courseTitle: 'Data Structures',
          instructorName: 'Dr. Emily Brown',
          issueDate: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(),
          completionPercentage: 100,
          grade: 'A'
        }
      ];
      
      setCertificates(mockCertificates);
      setTotalSpent(mockCertificates.length * 99);
    } finally {
      setIsLoading(false);
    }
  }, [user?.id, user?.fullName]);

  // Fixed useEffect with proper dependency
  useEffect(() => {
    fetchCertificates();
  }, [fetchCertificates]);

  const handleDownload = async (certificate: Certificate) => {
    try {
      // Generate and download certificate
      const blob = await certificateService.generateCertificate(
        certificate.userName,
        certificate.courseTitle,
        100, // score
        100, // percentage
        certificate.courseTitle
      );
      
      const fileName = `${certificate.courseTitle.replace(/\s+/g, '_')}_Certificate.pdf`;
      certificateService.downloadCertificate(blob, fileName);
    } catch (error) {
      console.error('Failed to download certificate:', error);
    }
  };

  const handleShare = async (certificate: Certificate) => {
    try {
      certificateService.shareCertificate(100, certificate.courseTitle);
    } catch (error) {
      console.error('Failed to share certificate:', error);
    }
  };

  const getCertificateIcon = (courseTitle: string) => {
    if (courseTitle.toLowerCase().includes('dsa') || courseTitle.toLowerCase().includes('data structure')) return '🏆';
    if (courseTitle.toLowerCase().includes('javascript')) return '🟨';
    if (courseTitle.toLowerCase().includes('react')) return '⚛️';
    if (courseTitle.toLowerCase().includes('python')) return '🐍';
    if (courseTitle.toLowerCase().includes('java')) return '☕';
    return '📜';
  };

  const getMedalColor = (index: number) => {
    switch(index) {
      case 0: return '#ffd700'; // Gold
      case 1: return '#c0c0c0'; // Silver
      case 2: return '#cd7f32'; // Bronze
      default: return 'var(--primary-color)';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-300">Loading your certificates...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 relative">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5 pointer-events-none">
        <div className="absolute top-0 left-0 w-96 h-96 bg-blue-500 rounded-full filter blur-3xl"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-purple-500 rounded-full filter blur-3xl"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8 relative z-10">
        {/* Header Section */}
        <div className="mb-6">
          <button 
            className="inline-flex items-center gap-2 text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors group"
            onClick={() => navigate('/dashboard')}
          >
            <FaArrowLeft className="group-hover:-translate-x-1 transition-transform" /> Back to Dashboard
          </button>
        </div>

        <div className="text-center mb-8">
          <span className="text-5xl block mb-4">🏆</span>
          <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-2">My Certificates</h1>
          <p className="text-gray-600 dark:text-gray-300">Your achievements and completed courses</p>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 flex items-center gap-4">
            <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center text-white text-2xl">
              <FaCertificate />
            </div>
            <div>
              <h3 className="text-2xl font-bold text-gray-800 dark:text-white">{certificates.length}</h3>
              <p className="text-gray-600 dark:text-gray-300">Total Certificates</p>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 flex items-center gap-4">
            <div className="w-14 h-14 bg-gradient-to-br from-orange-500 to-red-600 rounded-xl flex items-center justify-center text-white text-2xl">
              <FaTrophy />
            </div>
            <div>
              <h3 className="text-2xl font-bold text-gray-800 dark:text-white">
                {certificates.filter(c => c.grade === 'A' || c.grade === 'A+').length}
              </h3>
              <p className="text-gray-600 dark:text-gray-300">With Distinction</p>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 flex items-center gap-4">
            <div className="w-14 h-14 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center text-white text-2xl">
              <span>💰</span>
            </div>
            <div>
              <h3 className="text-2xl font-bold text-gray-800 dark:text-white">₹ {totalSpent}/-</h3>
              <p className="text-gray-600 dark:text-gray-300">Total Value</p>
            </div>
          </div>
        </div>

        {/* Rest of the component remains exactly the same... */}
        {/* (I'm keeping the rest of the code as is since it's correct) */}
        
        {/* Certificates Grid */}
        {certificates.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {certificates.map((cert, index) => (
              <div 
                key={cert.id} 
                className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden cursor-pointer transition-all duration-300 hover:shadow-2xl hover:-translate-y-1"
                onClick={() => setSelectedCertificate(cert)}
              >
                {/* Card Header */}
                <div 
                  className="p-6 text-center"
                  style={{ background: `linear-gradient(135deg, ${getMedalColor(index)}20, ${getMedalColor(index)}40)` }}
                >
                  <span className="text-5xl mb-3 block">
                    {getCertificateIcon(cert.courseTitle)}
                  </span>
                  <div 
                    className="inline-block px-3 py-1 rounded-full text-white text-xs font-semibold"
                    style={{ backgroundColor: getMedalColor(index) }}
                  >
                    {index === 0 && '🥇 Gold'}
                    {index === 1 && '🥈 Silver'}
                    {index === 2 && '🥉 Bronze'}
                    {index > 2 && `#${index + 1}`}
                  </div>
                </div>

                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-2">{cert.courseTitle}</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-300 mb-3">
                    <span className="mr-2">👨‍🏫</span> {cert.instructorName || 'Expert Instructor'}
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">
                    <span className="mr-2">📅</span> Issued: {formatDate(cert.issueDate)}
                  </p>
                  
                  {/* Progress Bar */}
                  <div className="mb-4">
                    <div className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"
                        style={{ width: `${cert.completionPercentage}%` }}
                      ></div>
                    </div>
                    <span className="text-xs text-gray-600 dark:text-gray-300 mt-1 block">
                      {cert.completionPercentage}% Complete
                    </span>
                  </div>

                  {/* Grade */}
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-sm text-gray-600 dark:text-gray-300">Grade:</span>
                    <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                      cert.grade === 'A+' 
                        ? 'bg-purple-100 dark:bg-purple-900 text-purple-600 dark:text-purple-400' 
                        : 'bg-green-100 dark:bg-green-900 text-green-600 dark:text-green-400'
                    }`}>
                      {cert.grade || 'A'}
                    </span>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-2">
                    <button 
                      className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDownload(cert);
                      }}
                    >
                      <FaDownload /> Download
                    </button>
                    <button 
                      className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors text-sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleShare(cert);
                      }}
                    >
                      <FaShareAlt /> Share
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-16 bg-white dark:bg-gray-800 rounded-xl shadow-lg">
            <span className="text-6xl block mb-4">🏆</span>
            <h3 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">No Certificates Yet</h3>
            <p className="text-gray-600 dark:text-gray-300 mb-6">
              Complete courses to earn certificates and showcase your achievements!
            </p>
            <button 
              className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg font-semibold hover:from-blue-700 hover:to-purple-700 transition-all"
              onClick={() => navigate('/courses')}
            >
              Browse Courses (₹99/- each)
            </button>
          </div>
        )}

        {/* Certificate Modal */}
        {selectedCertificate && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50" onClick={() => setSelectedCertificate(null)}>
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
              {/* Modal Header */}
              <div className="p-6 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
                <h2 className="text-2xl font-bold text-gray-800 dark:text-white">Certificate of Completion</h2>
                <button 
                  className="text-3xl text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors"
                  onClick={() => setSelectedCertificate(null)}
                >
                  ×
                </button>
              </div>

              {/* Modal Body - Certificate Preview */}
              <div className="p-6">
                <div className="bg-gradient-to-br from-blue-600 to-purple-700 text-white rounded-2xl p-8 shadow-xl">
                  <div className="text-center">
                    <h3 className="text-2xl font-bold mb-4">{selectedCertificate.courseTitle}</h3>
                    <p className="text-lg mb-2">Presented to</p>
                    <h2 className="text-3xl font-bold mb-6">{selectedCertificate.userName || user?.fullName || 'Student'}</h2>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 mb-6">
                    <div>
                      <p className="text-sm opacity-80">Grade:</p>
                      <p className="text-xl font-bold">{selectedCertificate.grade || 'A'}</p>
                    </div>
                    <div>
                      <p className="text-sm opacity-80">Completion:</p>
                      <p className="text-xl font-bold">{selectedCertificate.completionPercentage}%</p>
                    </div>
                    <div>
                      <p className="text-sm opacity-80">Issue Date:</p>
                      <p className="text-xl font-bold">{formatDate(selectedCertificate.issueDate)}</p>
                    </div>
                    <div>
                      <p className="text-sm opacity-80">Instructor:</p>
                      <p className="text-xl font-bold">{selectedCertificate.instructorName || 'Expert Instructor'}</p>
                    </div>
                  </div>

                  <div className="text-center border-t border-white/20 pt-4">
                    <p className="font-semibold">E-Learn Platform</p>
                    <p className="text-sm opacity-80">Authorized Signature</p>
                  </div>
                </div>
              </div>

              {/* Modal Footer */}
              <div className="p-6 border-t border-gray-200 dark:border-gray-700 flex gap-3">
                <button 
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  onClick={() => handleDownload(selectedCertificate)}
                >
                  <FaDownload /> Download Certificate
                </button>
                <button 
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
                  onClick={() => handleShare(selectedCertificate)}
                >
                  <FaShareAlt /> Share
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CertificatesPage;