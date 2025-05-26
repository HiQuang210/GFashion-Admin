import React, { useEffect, useState } from 'react';
import { RxEnterFullScreen, RxExitFullScreen } from 'react-icons/rx';

const FullscreenToggle: React.FC = () => {
  const [isFullScreen, setIsFullScreen] = useState(false);

  const toggleFullScreen = () => {
    setIsFullScreen(prev => !prev);
  };

  useEffect(() => {
    const element = document.getElementById('root');

    if (!element) return;

    const handleChange = () => {
      setIsFullScreen(!!document.fullscreenElement);
    };

    document.addEventListener('fullscreenchange', handleChange);

    if (isFullScreen) {
      element.requestFullscreen({ navigationUI: 'auto' }).catch(err => {
        console.warn('Request fullscreen failed:', err);
      });
    } else if (document.fullscreenElement) {
      document.exitFullscreen().catch(err => {
        console.warn('Exit fullscreen failed:', err);
      });
    }

    return () => {
      document.removeEventListener('fullscreenchange', handleChange);
    };
  }, [isFullScreen]);

  return (
    <button
      onClick={toggleFullScreen}
      className="hidden xl:inline-flex btn btn-circle btn-ghost"
    >
      {isFullScreen ? (
        <RxExitFullScreen className="xl:text-xl 2xl:text-2xl 3xl:text-3xl" />
      ) : (
        <RxEnterFullScreen className="xl:text-xl 2xl:text-2xl 3xl:text-3xl" />
      )}
    </button>
  );
};

export default FullscreenToggle;
