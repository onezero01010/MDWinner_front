import React from 'react';

const LogoPage = () => {
  return (
    <div className="w-screen h-screen flex items-center justify-center bg-purple">
      <div className="relative flex flex-col items-center">
        {/* 로고 */}
        <img src="/WhiteLogo.svg" alt="Logo" className="w-40 h-48" />
      </div>
    </div>
  );
};

export default LogoPage;
