import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const LogoPage = () => {
  const navigate = useNavigate();
  const [isDoctor] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (isDoctor) {
        navigate('/doctor/login');
      } else {
        navigate('/patient/info');
      }
    }, 3000); // 3초

    return () => clearTimeout(timer);
  }, [navigate]);

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
