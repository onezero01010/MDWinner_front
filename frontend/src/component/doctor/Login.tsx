import React from 'react';
import { useNavigate } from 'react-router-dom';

const Login = () => {
    const navigate = useNavigate();
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        navigate('/doctor/initialsetting');
    };
    
  return (
    <div className="min-h-screen flex flex-col justify-start items-center bg-white pt-24">
      {/* 로고 */}
      <img src="/PurpleLogo.svg" alt="Logo" className="w-24 h-28 mb-10" />
      <form className="w-full max-w-xs flex flex-col gap-6" onSubmit={handleSubmit}>
        <div>
          <label htmlFor="name" className="block mb-2 text-sm font-semibold text-gray-900">아이디</label>
          <input
            id="id"
            type="text"
            className="w-full px-4 py-3 border border-gray rounded-lg focus:outline-none focus:ring-2 focus:ring-purple"
            placeholder="아이디를 입력하세요"
          />
        </div>
        <div>
          <label htmlFor="password" className="block mb-2 text-sm font-semibold text-gray-900">비밀번호</label>
          <input
            id="password"
            type="tel"
            className="w-full px-4 py-3 border border-gray rounded-lg focus:outline-none focus:ring-2 focus:ring-purple"
            placeholder="비밀번호를 입력하세요"
          />
        </div>
        <div className="flex justify-end">
          <button type="button" className="text-xs text-gray-400 hover:text-gray">회원가입하기</button>
        </div>
        <button
          type="submit"
          className="fixed bottom-4 left-1/2 -translate-x-1/2 w-full max-w-xs py-3 bg-purple text-white rounded-lg font-semibold text-lg hover:bg-purple/90 transition-colors z-10 mb-2"
        >
          확인
        </button>
      </form>
    </div>
  );
};

export default Login;
