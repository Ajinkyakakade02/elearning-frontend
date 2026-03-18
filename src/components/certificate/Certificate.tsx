import React from 'react';

interface CertificateProps {
  type: 'gold' | 'premium' | 'default';
  userName: string;
  courseTitle: string;
  issueDate: string;
  certificateId: string;
  onPreview?: () => void;
}

const Certificate: React.FC<CertificateProps> = ({
  type,
  userName,
  courseTitle,
  issueDate,
  certificateId,
  onPreview
}) => {
  // Certificate styles based on type
  const certificateStyles = {
    gold: {
      container: 'bg-gradient-to-br from-amber-700 to-amber-900',
      border: 'border-4 border-amber-500',
      text: 'text-white',
      accent: 'text-amber-300',
      shadow: 'shadow-2xl shadow-amber-900/30',
      badge: 'bg-amber-500'
    },
    premium: {
      container: 'bg-gradient-to-br from-blue-600 to-purple-700',
      border: 'border-4 border-blue-500',
      text: 'text-white',
      accent: 'text-blue-300',
      shadow: 'shadow-2xl shadow-purple-900/30',
      badge: 'bg-purple-500'
    },
    default: {
      container: 'bg-white dark:bg-gray-800',
      border: 'border-2 border-gray-200 dark:border-gray-700',
      text: 'text-gray-800 dark:text-white',
      accent: 'text-gray-600 dark:text-gray-300',
      shadow: 'shadow-xl',
      badge: 'bg-gray-200 dark:bg-gray-700'
    }
  };

  const style = certificateStyles[type];

  return (
    <div className={`relative max-w-md mx-auto rounded-2xl overflow-hidden ${style.container} ${style.border} ${style.shadow} transition-all duration-300 hover:scale-105 hover:shadow-2xl group`}>
      
      {/* Decorative Elements */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 left-0 w-32 h-32 bg-white rounded-full filter blur-3xl"></div>
        <div className="absolute bottom-0 right-0 w-32 h-32 bg-white rounded-full filter blur-3xl"></div>
      </div>

      {/* Header */}
      <div className={`relative p-6 text-center border-b ${type === 'default' ? 'border-gray-200 dark:border-gray-700' : 'border-white/20'}`}>
        <h3 className={`text-xl font-bold tracking-wider ${style.text}`}>
          CERTIFICATE OF COMPLETION
        </h3>
        {type !== 'default' && (
          <div className={`absolute top-4 right-4 ${style.badge} text-white text-xs px-2 py-1 rounded-full uppercase font-semibold`}>
            {type}
          </div>
        )}
      </div>

      {/* Body */}
      <div className={`relative p-8 text-center space-y-4 ${style.text}`}>
        <p className={`text-sm uppercase tracking-wide ${style.accent}`}>
          This is to certify that
        </p>
        
        <h2 className="text-3xl font-bold font-serif">
          {userName}
        </h2>
        
        <p className={`text-sm uppercase tracking-wide ${style.accent}`}>
          has successfully completed
        </p>
        
        <h4 className="text-xl font-semibold px-4 py-2 bg-black/10 rounded-lg inline-block mx-auto">
          {courseTitle}
        </h4>
        
        <div className="pt-4 space-y-2">
          <p className={`text-sm ${style.accent}`}>
            Issued on: {issueDate}
          </p>
          <p className={`text-xs font-mono ${style.accent} opacity-75`}>
            ID: {certificateId}
          </p>
        </div>

        {/* Seal/Stamp Effect */}
        {type !== 'default' && (
          <div className="absolute bottom-8 right-8 w-20 h-20 rounded-full border-4 border-white/20 flex items-center justify-center transform rotate-12">
            <span className="text-white/30 text-xs font-bold uppercase tracking-widest">Seal</span>
          </div>
        )}
      </div>

      {/* Preview Button */}
      {onPreview && (
        <div className={`relative p-4 text-center border-t ${type === 'default' ? 'border-gray-200 dark:border-gray-700' : 'border-white/20'}`}>
          <button
            onClick={onPreview}
            className={`
              px-6 py-2 rounded-lg font-semibold transition-all duration-300
              ${type === 'default' 
                ? 'bg-blue-600 text-white hover:bg-blue-700 hover:shadow-lg' 
                : 'bg-white/20 text-white hover:bg-white/30 backdrop-blur-sm'
              }
              hover:scale-105 active:scale-95
              focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500
            `}
          >
            Preview Certificate
          </button>
        </div>
      )}

      {/* Decorative Corner Accents */}
      <div className="absolute top-0 left-0 w-8 h-8 border-t-4 border-l-4 border-white/30 rounded-tl-2xl"></div>
      <div className="absolute top-0 right-0 w-8 h-8 border-t-4 border-r-4 border-white/30 rounded-tr-2xl"></div>
      <div className="absolute bottom-0 left-0 w-8 h-8 border-b-4 border-l-4 border-white/30 rounded-bl-2xl"></div>
      <div className="absolute bottom-0 right-0 w-8 h-8 border-b-4 border-r-4 border-white/30 rounded-br-2xl"></div>
    </div>
  );
};

export default Certificate;