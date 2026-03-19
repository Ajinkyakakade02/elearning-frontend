// src/components/core/YouTubePlayer.tsx
import React, { useState, useEffect, useRef, useCallback } from 'react';
import YouTube from 'react-youtube';

interface YouTubePlayerProps {
  videoUrl: string;
  title: string;
  onVideoEnd?: () => void;
  onVideoPlay?: () => void;
  onVideoPause?: () => void;
  onProgress?: (currentTime: number, duration: number) => void;
  autoPlay?: boolean;
  startTime?: number;
}

const YouTubePlayer: React.FC<YouTubePlayerProps> = ({
  videoUrl,
  onVideoEnd,
  onVideoPlay,
  onVideoPause,
  onProgress,
  autoPlay = false,
  startTime = 0
}) => {
  const [player, setPlayer] = useState<any>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isReady, setIsReady] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isExtracting, setIsExtracting] = useState(true);
  const progressInterval = useRef<any>(null);
  const videoIdRef = useRef<string | null>(null);

  // Extract video ID from various YouTube URL formats
  const extractVideoId = (url: string): string | null => {
    if (!url) return null;
    
    console.log('🎯 Extracting video ID from:', url);
    
    // Clean the URL - remove any whitespace and query parameters
    const cleanUrl = url.trim();
    
    // Handle different YouTube URL formats - MORE ROBUST REGEX
    
    // Format 1: https://www.youtube.com/watch?v=VIDEO_ID
    const watchMatch = cleanUrl.match(/[?&]v=([a-zA-Z0-9_-]{11})/);
    if (watchMatch) {
      console.log('✅ Extracted from watch URL:', watchMatch[1]);
      return watchMatch[1];
    }
    
    // Format 2: https://youtu.be/VIDEO_ID
    const youtuBeMatch = cleanUrl.match(/youtu\.be\/([a-zA-Z0-9_-]{11})/);
    if (youtuBeMatch) {
      console.log('✅ Extracted from youtu.be:', youtuBeMatch[1]);
      return youtuBeMatch[1];
    }
    
    // Format 3: https://www.youtube.com/embed/VIDEO_ID
    const embedMatch = cleanUrl.match(/youtube\.com\/embed\/([a-zA-Z0-9_-]{11})/);
    if (embedMatch) {
      console.log('✅ Extracted from embed URL:', embedMatch[1]);
      return embedMatch[1];
    }
    
    // Format 4: https://www.youtube.com/live/VIDEO_ID
    const liveMatch = cleanUrl.match(/youtube\.com\/live\/([a-zA-Z0-9_-]{11})/);
    if (liveMatch) {
      console.log('✅ Extracted from live URL:', liveMatch[1]);
      return liveMatch[1];
    }
    
    // Format 5: https://www.youtube.com/shorts/VIDEO_ID
    const shortsMatch = cleanUrl.match(/youtube\.com\/shorts\/([a-zA-Z0-9_-]{11})/);
    if (shortsMatch) {
      console.log('✅ Extracted from shorts URL:', shortsMatch[1]);
      return shortsMatch[1];
    }
    
    // Format 6: Just the VIDEO_ID itself (11 characters)
    const directMatch = cleanUrl.match(/^([a-zA-Z0-9_-]{11})$/);
    if (directMatch) {
      console.log('✅ Direct video ID:', directMatch[1]);
      return directMatch[1];
    }
    
    // Format 7: Try to find any 11-character string in the URL
    const anyMatch = cleanUrl.match(/([a-zA-Z0-9_-]{11})/);
    if (anyMatch) {
      console.log('⚠️ Extracted potential ID from URL:', anyMatch[1]);
      return anyMatch[1];
    }
    
    console.log('❌ No video ID found in URL');
    return null;
  };

  // Extract video ID when component mounts or videoUrl changes
  useEffect(() => {
    console.log('🔍 YouTubePlayer Debug:');
    console.log('  - videoUrl prop:', videoUrl);
    console.log('  - videoUrl type:', typeof videoUrl);
    console.log('  - videoUrl length:', videoUrl?.length);
    
    setIsExtracting(true);
    
    if (!videoUrl) {
      setError('No video URL provided');
      setIsExtracting(false);
      return;
    }
    
    // Small timeout to ensure UI updates
    setTimeout(() => {
      const id = extractVideoId(videoUrl);
      videoIdRef.current = id;
      
      if (!id) {
        setError(`Could not extract video ID from: ${videoUrl}`);
      } else {
        setError(null);
        console.log('✅ Video ID set to:', id);
      }
      
      setIsExtracting(false);
    }, 100);

    return () => {
      if (progressInterval.current) {
        clearInterval(progressInterval.current);
      }
    };
  }, [videoUrl]);

  const startProgressTracking = useCallback(() => {
    if (progressInterval.current) {
      clearInterval(progressInterval.current);
    }
    
    progressInterval.current = setInterval(() => {
      if (player && onProgress) {
        try {
          const currentTime = player.getCurrentTime();
          const duration = player.getDuration();
          onProgress(currentTime, duration);
        } catch (err) {
          console.error('Error tracking progress:', err);
        }
      }
    }, 1000);
  }, [player, onProgress]);

  const stopProgressTracking = useCallback(() => {
    if (progressInterval.current) {
      clearInterval(progressInterval.current);
    }
  }, []);

  const onReady = useCallback((event: any) => {
    setPlayer(event.target);
    setIsReady(true);
    setError(null);
    console.log('✅ YouTube player ready');
    
    if (startTime > 0) {
      event.target.seekTo(startTime);
    }
    
    if (autoPlay) {
      event.target.playVideo();
    }
  }, [startTime, autoPlay]);

  const onStateChange = useCallback((event: any) => {
    switch(event.data) {
      case 0: // ended
        onVideoEnd?.();
        setIsPlaying(false);
        stopProgressTracking();
        break;
      case 1: // playing
        onVideoPlay?.();
        setIsPlaying(true);
        startProgressTracking();
        break;
      case 2: // paused
        onVideoPause?.();
        setIsPlaying(false);
        stopProgressTracking();
        break;
    }
  }, [onVideoEnd, onVideoPlay, onVideoPause, startProgressTracking, stopProgressTracking]);

  const onError = useCallback((event: any) => {
    console.error('❌ YouTube Player Error:', event);
    
    let errorMessage = 'Failed to load video. ';
    
    switch(event.data) {
      case 2:
        errorMessage += 'Invalid video ID.';
        break;
      case 5:
        errorMessage += 'HTML5 player error.';
        break;
      case 100:
        errorMessage += 'Video not found or removed.';
        break;
      case 101:
      case 150:
        errorMessage += 'Video cannot be embedded.';
        break;
      default:
        errorMessage += 'Please check the URL and try again.';
    }
    
    setError(errorMessage);
  }, []);

  const handlePlayPause = useCallback(() => {
    if (!player) return;
    
    if (isPlaying) {
      player.pauseVideo();
    } else {
      player.playVideo();
    }
  }, [player, isPlaying]);

  const handleRestart = useCallback(() => {
    if (!player) return;
    player.seekTo(0);
    player.playVideo();
  }, [player]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (progressInterval.current) {
        clearInterval(progressInterval.current);
      }
    };
  }, []);

  const videoId = videoIdRef.current;

  // Show loading state while extracting
  if (isExtracting) {
    return (
      <div className="w-full h-full min-h-[300px] flex flex-col items-center justify-center bg-gray-100 dark:bg-gray-800 rounded-xl">
        <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mb-4"></div>
        <p className="text-gray-600 dark:text-gray-300">Loading video...</p>
      </div>
    );
  }

  if (!videoId) {
    return (
      <div className="w-full h-full min-h-[400px] flex flex-col items-center justify-center bg-red-50 dark:bg-red-900/20 rounded-xl p-8 text-center">
        <div className="text-6xl mb-4">⚠️</div>
        <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-2">Invalid Video URL</h3>
        <p className="text-gray-600 dark:text-gray-300 mb-4">The video URL provided is not valid.</p>
        <div className="bg-white dark:bg-gray-800 rounded-lg p-4 mb-4 text-left text-sm w-full max-w-md">
          <strong className="text-gray-700 dark:text-gray-200 block mb-2">Debug Info:</strong>
          <p className="text-gray-600 dark:text-gray-400 mb-2">Video URL: {videoUrl}</p>
          <p className="text-gray-600 dark:text-gray-400 mb-2">Expected formats:</p>
          <ul className="list-disc list-inside text-gray-600 dark:text-gray-400 space-y-1">
            <li>https://www.youtube.com/watch?v=VIDEO_ID</li>
            <li>https://youtu.be/VIDEO_ID</li>
            <li>https://www.youtube.com/live/VIDEO_ID</li>
          </ul>
        </div>
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
          Example: https://www.youtube.com/watch?v=dQw4w9WgXcQ
        </p>
        <button 
          className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          onClick={() => window.location.reload()}
        >
          Refresh Page
        </button>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full h-full min-h-[400px] flex flex-col items-center justify-center bg-red-50 dark:bg-red-900/20 rounded-xl p-8 text-center">
        <div className="text-6xl mb-4">❌</div>
        <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-2">Video Error</h3>
        <p className="text-gray-600 dark:text-gray-300 mb-4">{error}</p>
        <div className="bg-white dark:bg-gray-800 rounded-lg p-4 mb-4 text-left text-sm w-full max-w-md">
          <strong className="text-gray-700 dark:text-gray-200 block mb-2">Debug Info:</strong>
          <p className="text-gray-600 dark:text-gray-400">Video ID: {videoId}</p>
          <p className="text-gray-600 dark:text-gray-400">URL: {videoUrl}</p>
        </div>
        <button 
          className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          onClick={() => setError(null)}
        >
          Try Again
        </button>
      </div>
    );
  }

  const opts = {
    height: '100%',
    width: '100%',
    playerVars: {
      autoplay: autoPlay ? 1 : 0,
      modestbranding: 1,
      rel: 0,
      showinfo: 0,
      controls: 1,
      fs: 1,
      iv_load_policy: 3,
      start: startTime,
      origin: window.location.origin,
    },
  };

  return (
    <div className="relative w-full h-full min-h-[400px] bg-black rounded-xl overflow-hidden group">
      <div className="absolute inset-0">
        <YouTube
          videoId={videoId}
          opts={opts}
          onReady={onReady}
          onStateChange={onStateChange}
          onError={onError}
          className="w-full h-full"
        />
      </div>
      
      {!isPlaying && isReady && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm transition-opacity">
          <button 
            className="flex items-center gap-3 px-8 py-4 bg-white/20 hover:bg-white/30 backdrop-blur-lg rounded-full text-white text-xl font-semibold transition-all transform hover:scale-105"
            onClick={handlePlayPause}
          >
            <span className="text-3xl">▶️</span>
            Play Video
          </button>
        </div>
      )}
      
      {isReady && (
        <div className="absolute bottom-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <button 
            className="w-10 h-10 bg-black/50 hover:bg-black/70 backdrop-blur-sm rounded-full flex items-center justify-center text-white text-xl transition-all transform hover:scale-110"
            onClick={handlePlayPause}
            title={isPlaying ? 'Pause' : 'Play'}
          >
            {isPlaying ? '⏸️' : '▶️'}
          </button>
          <button 
            className="w-10 h-10 bg-black/50 hover:bg-black/70 backdrop-blur-sm rounded-full flex items-center justify-center text-white text-xl transition-all transform hover:scale-110"
            onClick={handleRestart}
            title="Restart"
          >
            🔄
          </button>
        </div>
      )}
    </div>
  );
};

export default YouTubePlayer;