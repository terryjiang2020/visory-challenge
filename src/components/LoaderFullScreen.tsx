
import React from 'react';
import './LoaderFullScreen.css';

const LoaderFullScreen: React.FC = () => {
  return (
    <div className="loader-full-screen">
        <div className='absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2'>
            <span className="animate-spin border-[3px] border-transparent border-l-white rounded-full w-20 h-20 inline-block align-middle m-auto mb-10"></span>
        </div>
    </div>
  );
};

export default LoaderFullScreen;
